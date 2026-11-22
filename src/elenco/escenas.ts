import type { Clave, Expresion, PoseNombre } from "../aldrin/poses";
import vozJson from "../data/voz_ejemplo.json";
import { ESPERA, junto, type Celular } from "./layout";

// Guion del video de BoliviaSabe, escena por escena, para el elenco de avatares.
// Cada escena dice QUIÉN habla (con el texto del guion) y A DÓNDE camina cada avatar y qué pose toma.
// Tiempos en segundos desde el inicio de la escena. Las posiciones son píxeles del lienzo 1920 × 1080
// (ver layout.ts: `junto` se para al costado del celular, a la altura del botón que se señala).
//
// Para cambiar un recorrido, edita las llamadas `va(...)` de la escena: `va(quien, cuándoLlega, dónde, pose)`.
// El avatar sale a caminar solo, con el tiempo justo para llegar a esa hora (si es lejos, corre).

export type Quien = "diego" | "yaeko" | "aldrin";
export const QUIENES: Quien[] = ["diego", "yaeko", "aldrin"];
export const NOMBRE: Record<Quien, string> = { diego: "Diego", yaeko: "Yaeko", aldrin: "Aldrin" };

export type Punto = [number, number];

// Duración y volumen de cada frase leída (voces de ejemplo; scripts/voces_ejemplo.py). Clave: "<escena>-<n>"
export type DatosVoz = { quien: string; dur: number; env: number[] };
export const VOZ = vozJson as Record<string, DatosVoz>;

export type Linea = {
  clave: string;
  quien: Quien | "todos";
  t: number;
  dur: number;
  texto: string;
  // Habla en cámara (escena 1): sale en los subtítulos pero el avatar todavía no existe
  camara?: boolean;
  // Volumen real de la voz por cuadro desde `t` (la boca lo sigue)
  env?: number[];
};

export type Tramo = { t0: number; t1: number; desde: Punto; hasta: Punto; correr: boolean };

export type Recorrido = {
  inicio: Punto;
  // Hasta esta hora no se ve (aparece con un destello)
  apareceEn: number | null;
  // Cae desde arriba a las `t` y se cae hacia `lado` (-1 izquierda, 1 derecha) antes de levantarse
  caida?: { t: number; lado: -1 | 1 };
  // Entra (salto desde abajo o «puf») y sale (salto hacia abajo o «puf»): no se ve antes de entrar ni después de salir
  // Ratos en que sostiene un celular (con el gesto «escribir»)
  celular?: [number, number][];
  // Entradas y salidas en orden (puede salir y volver a entrar)
  eventos?: { t: number; tipo: "salto" | "puf"; entra: boolean }[];
  tramos: Tramo[];
  claves: Clave[];
};

export type Escena = {
  id: string;
  numero: string;
  titulo: string;
  dur: number;
  // Qué marcos de celular dibuja la vista previa
  celulares: Celular[];
  lineas: Linea[];
  personajes: Record<Quien, Recorrido>;
};

// ---------- Armado de una escena ----------

const VELOCIDAD = 240; // px por segundo al caminar
const VELOCIDAD_CORRER = 330; // si necesita ir más rápido para llegar a tiempo, corre
const palabras = (s: string) => s.replace(/\*\*/g, "").split(/\s+/).filter(Boolean).length;
const PALABRAS_POR_SEG = 2.6;

type Parada = { t: number; pos: Punto | null; pose: PoseNombre; expr?: Partial<Expresion>; salto?: boolean };

export class Guion {
  lineas: Linea[] = [];
  private paradas: Record<Quien, Parada[]> = { diego: [], yaeko: [], aldrin: [] };
  private inicio: Record<Quien, Punto> = { ...ESPERA };
  private poseInicial: Record<Quien, PoseNombre> = { diego: "esperar", yaeko: "esperar", aldrin: "esperar" };
  private aparece: Partial<Record<Quien, number>> = {};
  private caidas: Partial<Record<Quien, { t: number; lado: -1 | 1 }>> = {};
  private ratosCelular: Record<Quien, [number, number][]> = { diego: [], yaeko: [], aldrin: [] };
  private eventos: Record<Quien, { t: number; tipo: "salto" | "puf"; entra: boolean }[]> = { diego: [], yaeko: [], aldrin: [] };
  private n = 0;

  constructor(
    readonly id: string,
    readonly numero: string,
    readonly titulo: string,
    readonly presupuesto: number,
    readonly celulares: Celular[],
  ) {}

  // Hora en que termina una frase
  finDe(l: Linea): number {
    return l.t + l.dur;
  }

  // Una o varias frases seguidas desde t0. Devuelve cada línea con su hora de inicio y su duración.
  dice(grupo: [Quien | "todos", string][], t0: number, pausa = 0.3, camara = false): Linea[] {
    let t = t0;
    return grupo.map(([quien, texto]) => {
      const clave = `${this.id}-${this.n++}`;
      // Con la voz de ejemplo, dura lo que dura el audio; si no hay, se calcula por palabras
      const dur = VOZ[clave] ? VOZ[clave].dur + 0.1 : Math.max(1.2, palabras(texto) / PALABRAS_POR_SEG);
      const l: Linea = { clave, quien, t, dur, texto, camara: camara || undefined };
      this.lineas.push(l);
      t += dur + pausa;
      return l;
    });
  }

  // Dónde empieza (sin llegar caminando)
  empieza(quien: Quien, pos: Punto, pose: PoseNombre = "esperar") {
    this.inicio[quien] = pos;
    this.poseInicial[quien] = pose;
  }

  // Aparece con un destello en esa posición (se convierte de persona en avatar)
  apareceCon(quien: Quien, t: number, pos: Punto, pose: PoseNombre) {
    this.aparece[quien] = t;
    this.inicio[quien] = pos;
    this.poseInicial[quien] = pose;
  }

  // Cae desde arriba en `pos` a las `t`, se cae hacia `lado` y se levanta (escena 1 del video final)
  cae(quien: Quien, t: number, pos: Punto, lado: -1 | 1) {
    this.caidas[quien] = { t, lado };
    this.inicio[quien] = pos;
    this.poseInicial[quien] = "sorpresa";
  }

  // Entra a las `t` en `pos`: de un salto desde abajo del cuadro o con un «puf» (sin caminar desde afuera)
  entra(quien: Quien, t: number, pos: Punto, tipo: "salto" | "puf" = "salto", pose: PoseNombre = "esperar", expr?: Partial<Expresion>) {
    const primera = !this.eventos[quien].some((e) => e.entra);
    this.eventos[quien].push({ t, tipo, entra: true });
    if (primera) {
      this.inicio[quien] = pos;
      this.poseInicial[quien] = pose;
      this.paradas[quien].push({ t, pos: null, pose, expr });
    } else {
      // Vuelve a entrar en otro lugar: aparece ahí sin caminar
      this.paradas[quien].push({ t, pos, pose, expr, salto: true });
    }
  }

  // Saca el celular a las `t0` y lo guarda a las `t1` (mientras, mira la pantalla con la cara `expr`)
  usaCelular(quien: Quien, t0: number, t1: number, expr?: Partial<Expresion>, despues: PoseNombre = "esperar") {
    // Ya no se muestra el celular: el gesto «escribir» saca la laptop
    this.va(quien, t0, null, "escribir", expr);
    this.va(quien, t1, null, despues, expr);
  }

  // Sale a las `t`: salta hacia abajo del cuadro o se va con un «puf»
  sale(quien: Quien, t: number, tipo: "salto" | "puf" = "salto") {
    this.eventos[quien].push({ t, tipo, entra: false });
  }

  // Llega a `pos` a las `t` y toma la pose. Si pos es null, solo cambia de pose donde está.
  va(quien: Quien, t: number, pos: Punto | null, pose: PoseNombre, expr?: Partial<Expresion>) {
    this.paradas[quien].push({ t, pos, pose, expr });
  }

  // Una frase con su hora y su volumen real (video final)
  voz(quien: Quien | "todos", texto: string, t: number, dur: number, env?: number[], camara = false): Linea {
    const l: Linea = { clave: `${this.id}-${this.n++}`, quien, t, dur, texto, env, camara: camara || undefined };
    this.lineas.push(l);
    return l;
  }

  // Vuelve a su esquina a esperar
  espera(quien: Quien, t: number) {
    this.va(quien, t, ESPERA[quien], "esperar");
  }

  construir(): Escena {
    const personajes = {} as Record<Quien, Recorrido>;
    for (const q of QUIENES) {
      const paradas = [...this.paradas[q]].sort((a, b) => a.t - b.t);
      const tramos: Tramo[] = [];
      const claves: Clave[] = [{ t: 0, pose: this.poseInicial[q] }];
      let pos = this.inicio[q];
      const primeraEntrada = this.eventos[q].find((e) => e.entra);
      let libreDesde = this.aparece[q] ?? this.caidas[q]?.t ?? (primeraEntrada ? primeraEntrada.t + 0.6 : 0);
      for (const p of paradas) {
        const dist = p.pos ? Math.hypot(p.pos[0] - pos[0], p.pos[1] - pos[1]) : 0;
        if (p.salto && p.pos) {
          // Cambio de lugar instantáneo (mientras está fuera de cuadro)
          tramos.push({ t0: p.t - 0.001, t1: p.t, desde: pos, hasta: p.pos, correr: false });
          claves.push({ t: p.t, pose: p.pose, expr: p.expr });
          pos = p.pos;
          libreDesde = p.t + 0.6;
          continue;
        }
        if (!p.pos || dist < 8) {
          claves.push({ t: p.t, pose: p.pose, expr: p.expr });
          continue;
        }
        const duracionIdeal = dist / VELOCIDAD;
        const salida = Math.max(libreDesde, p.t - Math.max(duracionIdeal, 0.35));
        const dur = Math.max(0.35, p.t - salida);
        // Nunca corren (se ve apurado): caminan, aunque sea un poco más rápido
        const correr = false && dist / dur > VELOCIDAD_CORRER;
        tramos.push({ t0: salida, t1: salida + dur, desde: pos, hasta: p.pos, correr });
        claves.push({ t: salida, pose: correr ? "correr" : "caminar", expr: p.expr });
        claves.push({ t: salida + dur, pose: p.pose, expr: p.expr });
        pos = p.pos;
        libreDesde = salida + dur;
      }
      // Ordenado y sin dos claves en el mismo fotograma (la última gana)
      claves.sort((a, b) => a.t - b.t);
      const limpias: Clave[] = [];
      for (const c of claves) {
        const ult = limpias[limpias.length - 1];
        if (ult && c.t - ult.t < 1 / 30) limpias[limpias.length - 1] = { ...c, t: ult.t };
        else limpias.push(c);
      }
      personajes[q] = {
        inicio: this.inicio[q],
        apareceEn: this.aparece[q] ?? null,
        caida: this.caidas[q],
        eventos: [...this.eventos[q]].sort((a, b) => a.t - b.t),
        celular: this.ratosCelular[q],
        tramos,
        claves: limpias,
      };
    }
    const fin = Math.max(0, ...this.lineas.map((l) => l.t + l.dur));
    return {
      id: this.id,
      numero: this.numero,
      titulo: this.titulo,
      dur: Math.max(this.presupuesto, Math.ceil((fin + 0.6) * 2) / 2),
      celulares: this.celulares,
      lineas: this.lineas,
      personajes,
    };
  }
}

// ---------- 1 · Nosotros en cámara · 0:00 a 0:20 ----------
const escena1 = () => {
  const g = new Guion("1", "1", "Nosotros en cámara", 10, []);
  const [d, y, a] = g.dice(
    [
      ["diego", "¡Hola! Soy Diego, líder técnico: base de datos y Stellar. ¡Me convierto en avatar!"],
      ["yaeko", "¡Hola! Soy Yaeko: la idea, el producto y la marca. ¡Yo también me vuelvo avatar!"],
      ["aldrin", "Y yo soy Aldrin, la interfaz. ¡Ahora nos ven así!"],
    ],
    0.1,
    0.25,
    true,
  );
  const fin = (l: Linea) => l.t + l.dur;
  const [todos] = g.dice([["todos", "Somos CodeBambinos. ¡**Esto es BoliviaSabe!**"]], fin(a) + 0.4);
  // Cada uno se convierte en avatar cuando termina su frase y queda en fila abajo
  g.apareceCon("diego", fin(d) + 0.2, [700, 1040], "saludar");
  g.apareceCon("yaeko", fin(y) + 0.2, [960, 1040], "saludar");
  g.apareceCon("aldrin", fin(a) + 0.2, [1220, 1040], "saludar");
  for (const q of ["diego", "yaeko", "aldrin"] as Quien[]) {
    g.va(q, todos.t, null, "saludar");
    g.va(q, todos.t + 1.6, null, "triunfo");
  }
  return g.construir();
};

// ---------- 2 · El problema · 0:20 a 0:38 ----------
const escena2 = () => {
  const g = new Guion("2", "2", "El problema", 10, ["U"]);
  const [y, d, a] = g.dice(
    [
      ["yaeko", "Es domingo, se rompe una tubería y preguntas en cinco grupos de WhatsApp."],
      ["diego", "La respuesta llega tarde, **se hunde entre cientos de mensajes** y nadie sabe si sigue vigente."],
      ["aldrin", "Y quien ayuda no gana nada. **Por eso muchos ni responden.**"],
    ],
    0.4,
  );
  g.va("yaeko", y.t, junto("U", "izq", 0.38), "senalar");
  g.va("yaeko", y.t + y.dur + 0.1, junto("U", "izq", 0.38), "pensar");
  g.espera("yaeko", d.t + 1);
  g.va("diego", d.t, junto("U", "der", 0.12), "senalarIzq");
  g.va("diego", d.t + 3.6, null, "desesperar");
  g.espera("diego", a.t + 0.3);
  g.va("aldrin", a.t, junto("U", "izq", 0.65), "senalar");
  g.va("aldrin", a.t + 2.4, null, "encoger");
  return g.construir();
};

// ---------- 3 · Entras directo a Hoy · 0:38 a 0:54 ----------
const escena3 = () => {
  const g = new Guion("3", "3", "Entras directo a Hoy", 10, ["U"]);
  const [a, y, d] = g.dice(
    [
      ["aldrin", "Abres el enlace y **entras directo a Hoy**: sin descargar nada, sin registro."],
      ["yaeko", "Los letreros de tu barrio, al día. **Mirar es gratis.**"],
      ["diego", "Para participar, la página te pide tu cuenta: Google o correo. Un toque."],
    ],
    0.3,
  );
  g.va("aldrin", a.t, junto("U", "izq", 0.03), "senalarArriba");
  g.va("aldrin", a.t + 3, junto("U", "izq", 0.2), "senalar");
  g.espera("aldrin", y.t + 0.5);
  g.va("yaeko", y.t, junto("U", "izq", 0.4), "senalar");
  g.va("yaeko", y.t + 3.2, junto("U", "izq", 0.7), "senalarAbajo");
  g.espera("yaeko", d.t + 0.3);
  g.va("diego", d.t, junto("U", "der", 0.62), "senalarIzq");
  g.va("diego", d.t + 2.2, null, "tocar");
  return g.construir();
};

// ---------- 4 · Subir un letrero · 0:54 a 1:14 ----------
const escena4 = () => {
  const g = new Guion("4", "4", "Subir un letrero", 10, ["A", "B"]);
  const [a, d, y] = g.dice(
    [
      ["aldrin", "¿Viste un almuerzo a quince bolivianos? Tocas Subir letrero, sacas la foto y publicas."],
      ["diego", "**La foto es la prueba**: cada letrero es un dato real, con su hora."],
      ["yaeko", "Ganas una yapita al publicar y otra cada vez que le sirve a un vecino. **Ayudar paga.**"],
    ],
    0.3,
  );
  g.va("aldrin", a.t, junto("A", "izq", 0.9), "senalar");
  g.va("aldrin", a.t + 2.4, null, "tocar");
  g.va("aldrin", a.t + 5.0, junto("A", "izq", 0.53), "senalar");
  g.espera("aldrin", d.t + 0.4);
  g.va("diego", d.t, [1000, 445], "senalar");
  g.espera("diego", y.t + 0.3);
  g.va("yaeko", y.t + 0.2, junto("A", "der", 0.05), "senalarIzq");
  g.va("yaeko", y.t + 3.4, null, "celebrar");
  return g.construir();
};

// ---------- 5 · ¿Alguien sabe? · 1:14 a 1:54 ----------
const escena5 = () => {
  const g = new Guion("5", "5", "¿Alguien sabe?", 10, ["A", "B"]);
  // 5a · Ana pregunta (celular A)
  const [a1, y1] = g.dice(
    [
      ["aldrin", "Ana pregunta: ¿quién arregla una tubería hoy en Queru Queru? La marca **Urgente**: cinco yapitas y sube 24 horas."],
      ["yaeko", "Y con un toque, **la comparte a sus grupos** de WhatsApp."],
    ],
    0.3,
  );
  g.va("aldrin", a1.t, junto("A", "izq", 0.95), "senalar");
  g.va("aldrin", a1.t + 2.5, junto("A", "izq", 0.88), "senalar");
  g.va("aldrin", a1.t + 6.0, junto("A", "izq", 0.55), "tocar");
  g.espera("aldrin", y1.t + 0.5);
  g.va("yaeko", y1.t - 1, junto("A", "der", 0.7), "senalarIzq");
  g.espera("yaeko", g.finDe(y1) + 1);
  // 5b · Luis responde (celular B) y la respuesta llega sola al celular A
  const [d2, a2] = g.dice(
    [
      ["diego", "Lucía la ve arriba y responde. Ana la ve llegar **sola, en un par de segundos, sin recargar**."],
      ["aldrin", "¿Necesita el contacto? Lo pide, y **solo se comparte si Lucía acepta**. Tú decides."],
    ],
    g.finDe(y1) + 0.6,
  );
  g.va("diego", d2.t - 0.4, junto("B", "izq", 0.2), "deslizar");
  g.va("diego", d2.t + 4.4, junto("A", "der", 0.4), "senalarIzq");
  g.espera("diego", a2.t + 2.5);
  g.va("aldrin", a2.t, junto("A", "izq", 0.59), "senalar");
  g.va("aldrin", a2.t + 3.6, junto("B", "der", 0.66), "senalarIzq");
  g.espera("aldrin", g.finDe(a2) + 1);
  // 5c · Me sirvió
  const [y3] = g.dice(
    [["yaeko", "Si le sirve, Ana toca Me sirvió: Solucionada, y Lucía gana cinco yapitas. **Preguntar sale rápido. Ayudar se premia.**"]],
    g.finDe(a2) + 0.6,
  );
  g.va("yaeko", y3.t, junto("A", "der", 0.57), "senalarIzq");
  g.va("yaeko", y3.t + 1.6, null, "tocar");
  g.va("yaeko", y3.t + 5, junto("B", "der", 0.1), "senalarIzq");
  g.va("yaeko", y3.t + 7, null, "triunfo");
  g.va("diego", y3.t + 5.5, null, "aplaudir");
  g.va("aldrin", y3.t + 5.5, null, "aplaudir");
  return g.construir();
};

// ---------- 6 · Registrado en Stellar · 1:54 a 2:14 ----------
const escena6 = () => {
  const g = new Guion("6", "6", "Registrado en Stellar", 10, ["U"]);
  const [d, a, y] = g.dice(
    [
      ["diego", "Cada yapita queda registrada en Stellar. En Movimientos, **cada premio tiene su confirmación y un registro público**."],
      ["aldrin", "Cualquiera puede verificar quién ayudó a quién. **Nada se pierde.**"],
      ["yaeko", "Hoy es red de pruebas, sin dinero real; el canje con negocios llega después."],
    ],
    0.3,
  );
  g.va("diego", d.t, junto("U", "der", 0.4), "senalarIzq");
  g.va("diego", d.t + 6.5, null, "escribir");
  g.espera("diego", a.t + 1);
  g.va("aldrin", a.t, junto("U", "izq", 0.7), "senalar");
  g.espera("aldrin", y.t + 0.5);
  g.va("yaeko", y.t, junto("U", "der", 0.6), "senalarIzq");
  return g.construir();
};

// ---------- 7 · Para todo público · 2:14 a 2:28 ----------
const escena7 = () => {
  const g = new Guion("7", "7", "Para todo público", 10, ["U"]);
  const [a, y, d] = g.dice(
    [
      ["aldrin", "Pensada para todos: se abre desde el navegador y **se instala como app**."],
      ["yaeko", "Tu abuela, tu hijo, tu vecino: **si saben tocar, pueden usarla**."],
      ["diego", "Letra grande, tema claro u oscuro y, en computador, más columnas."],
    ],
    0.3,
  );
  g.va("aldrin", a.t, junto("U", "izq", 0.3), "senalar");
  g.va("aldrin", a.t + 3.0, junto("U", "izq", 0.6), "senalar");
  g.espera("aldrin", y.t + 0.5);
  g.va("yaeko", y.t, junto("U", "izq", 0.5), "senalar");
  g.espera("yaeko", d.t + 0.3);
  g.va("diego", d.t, junto("U", "der", 0.5), "senalarIzq");
  return g.construir();
};

// ---------- 8 · Dónde empezamos y cierre · 2:28 a 2:50 ----------
const escena8 = () => {
  const g = new Guion("8", "8", "Dónde empezamos y cierre", 10, []);
  const [y, d, a] = g.dice(
    [
      ["yaeko", "Empezamos en Cochabamba: Cala Cala, Sarco y el Centro."],
      ["diego", "En 30 días: piloto con 30 cuentas y 5 negocios."],
      ["aldrin", "**Hoy una ciudad. Mañana, toda Bolivia.**"],
    ],
    0.2,
    0.25,
  );
  const [todos] = g.dice([["todos", "Bolivia ya sabe todo. Falta un lugar donde ese saber dure y se premie. **Entre bolivianos nos ayudamos.**"]], a.t + a.dur + 0.3);
  // Yaeko recorre los pines del mapa
  g.va("yaeko", y.t, [700, 560], "senalar");
  g.va("yaeko", y.t + 2.2, [880, 650], "senalar");
  g.va("yaeko", y.t + 4, [800, 760], "senalar");
  // Diego pasa por las tres tarjetas del plan
  g.va("diego", d.t - 0.5, [1400, 290], "senalar");
  g.va("diego", d.t + 1.8, [1400, 400], "senalar");
  g.va("diego", d.t + 3.8, [1400, 510], "senalar");
  g.va("aldrin", a.t, [960, 900], "senalarArriba");
  // Los tres se juntan para el cierre y saltan juntos en la última frase
  g.va("diego", todos.t, [780, 1030], "saludar");
  g.va("yaeko", todos.t, [960, 1030], "saludar");
  g.va("aldrin", todos.t, [1140, 1030], "saludar");
  for (const q of QUIENES) g.va(q, todos.t + todos.dur - 2.4, null, "celebrar");
  for (const q of QUIENES) g.va(q, todos.t + todos.dur - 0.6, null, "triunfo");
  return g.construir();
};

export const ESCENAS: Escena[] = [escena1(), escena2(), escena3(), escena4(), escena5(), escena6(), escena7(), escena8()];
export const escenaPorId = (id: string) => ESCENAS.find((e) => e.id === id) ?? ESCENAS[0];
