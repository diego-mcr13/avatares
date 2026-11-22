import { spring } from "remotion";
import type { BocaVar, CejaVar, OjoVar } from "./modelo";

// Rotaciones en radianes [x, y, z]. Izq/Der = lado de la pantalla.
// Brazos: z levanta hacia afuera (negativo en Izq, positivo en Der); x negativo = hacia la cámara.
// Antebrazo: x negativo dobla el codo hacia adelante.
export type Rot = [number, number, number];

export type Pose = {
  altura: number;
  torso: Rot;
  cabeza: Rot;
  brazoIzq: Rot;
  antebrazoIzq: Rot;
  brazoDer: Rot;
  antebrazoDer: Rot;
  piernaIzq: Rot;
  piernaDer: Rot;
};

export type Expresion = {
  ojos: OjoVar;
  cejas: [CejaVar, CejaVar];
  // "habla" = la boca sigue la voz; si no hay voz usa `reposo`
  boca: "habla" | BocaVar;
  reposo: BocaVar;
  feliz: boolean;
};

export type PoseNombre =
  | "neutral"
  | "hablar"
  | "saludar"
  | "celebrar"
  | "senalar"
  | "pensar"
  | "encoger"
  | "sorpresa"
  | "escribir"
  | "triunfo"
  | "apuntar"
  | "rascar"
  | "desesperar"
  | "facepalm"
  | "ansioso"
  | "caminar"
  | "correr"
  | "senalarIzq"
  | "senalarArriba"
  | "senalarAbajo"
  | "tocar"
  | "deslizar"
  | "aplaudir"
  | "esperar";

const BASE: Pose = {
  altura: 0,
  torso: [0, 0, 0],
  cabeza: [0, 0, 0],
  brazoIzq: [0, 0, -0.15],
  antebrazoIzq: [-0.25, 0, 0],
  brazoDer: [0, 0, 0.15],
  antebrazoDer: [-0.25, 0, 0],
  piernaIzq: [0, 0, 0],
  piernaDer: [0, 0, 0],
};

const EXPR_BASE: Expresion = {
  ojos: "normal",
  cejas: ["normal", "normal"],
  boca: "habla",
  reposo: "sonrisa",
  feliz: false,
};

export const POSES: Record<PoseNombre, { pose: Pose; expr: Expresion; etiqueta: string }> = {
  neutral: { pose: BASE, expr: EXPR_BASE, etiqueta: "Neutral" },
  hablar: {
    pose: {
      ...BASE,
      brazoIzq: [-0.35, 0, -0.35],
      antebrazoIzq: [-1.1, 0, 0],
      brazoDer: [-0.35, 0, 0.35],
      antebrazoDer: [-1.1, 0, 0],
    },
    expr: EXPR_BASE,
    etiqueta: "Hablar",
  },
  saludar: {
    pose: {
      ...BASE,
      torso: [0, 0, 0.05],
      cabeza: [0, 0, -0.1],
      brazoDer: [0, 0, 1.75],
      antebrazoDer: [0, 0, 1.3],
    },
    expr: { ...EXPR_BASE, ojos: "feliz", cejas: ["arriba", "arriba"], feliz: true },
    etiqueta: "Saludar",
  },
  celebrar: {
    pose: {
      ...BASE,
      cabeza: [-0.12, 0, 0],
      brazoIzq: [0, 0, -2.15],
      antebrazoIzq: [0, 0, -0.6],
      brazoDer: [0, 0, 2.15],
      antebrazoDer: [0, 0, 0.6],
    },
    expr: { ...EXPR_BASE, ojos: "feliz", cejas: ["arriba", "arriba"], reposo: "sonrisaAbierta", feliz: true },
    etiqueta: "Celebrar",
  },
  senalar: {
    pose: {
      ...BASE,
      torso: [0, 0.25, 0],
      cabeza: [0.04, 0.25, 0],
      brazoIzq: [0, 0, -0.2],
      brazoDer: [-0.25, 0, 1.45],
      antebrazoDer: [0, 0, 0.1],
    },
    expr: { ...EXPR_BASE, cejas: ["arriba", "normal"] },
    etiqueta: "Señalar",
  },
  pensar: {
    pose: {
      ...BASE,
      cabeza: [-0.12, -0.15, 0.1],
      brazoIzq: [-0.15, 0, -0.1],
      antebrazoIzq: [-0.4, 0, 0],
      brazoDer: [-0.55, 0, 0.15],
      antebrazoDer: [-2.2, 0, -0.75],
    },
    expr: { ...EXPR_BASE, cejas: ["arriba", "enojo"], reposo: "cerrada" },
    etiqueta: "Pensar",
  },
  encoger: {
    pose: {
      ...BASE,
      altura: 0.3,
      cabeza: [0, 0, 0.15],
      brazoIzq: [-0.2, 0, -0.7],
      antebrazoIzq: [-1.2, 0, -0.4],
      brazoDer: [-0.2, 0, 0.7],
      antebrazoDer: [-1.2, 0, 0.4],
    },
    expr: { ...EXPR_BASE, cejas: ["triste", "triste"], reposo: "sonrisa" },
    etiqueta: "Encoger hombros",
  },
  sorpresa: {
    pose: {
      ...BASE,
      altura: 0.5,
      cabeza: [-0.08, 0, 0],
      brazoIzq: [-0.3, 0, -0.5],
      antebrazoIzq: [-1.6, 0, 0],
      brazoDer: [-0.3, 0, 0.5],
      antebrazoDer: [-1.6, 0, 0],
    },
    expr: { ...EXPR_BASE, cejas: ["arriba", "arriba"], boca: "O", reposo: "O" },
    etiqueta: "Sorpresa",
  },
  // Teclear en la laptop (el dev) o en el teclado holográfico (el robot)
  escribir: {
    pose: {
      ...BASE,
      torso: [0.08, 0, 0],
      cabeza: [0.16, 0, 0],
      brazoIzq: [-0.5, 0, 0.15],
      antebrazoIzq: [-1.1, 0, 0],
      brazoDer: [-0.5, 0, -0.15],
      antebrazoDer: [-1.1, 0, 0],
    },
    expr: { ...EXPR_BASE, reposo: "cerrada" },
    etiqueta: "Escribir",
  },
  // Puño arriba: "¡sí!"
  triunfo: {
    pose: {
      ...BASE,
      torso: [0, 0, -0.05],
      cabeza: [-0.1, 0, -0.08],
      brazoIzq: [0, 0, -0.2],
      brazoDer: [0, 0, 0.9],
      antebrazoDer: [0, 0, 1.7],
    },
    expr: { ...EXPR_BASE, ojos: "feliz", cejas: ["arriba", "arriba"], reposo: "sonrisaAbierta", feliz: true },
    etiqueta: "Triunfo",
  },
  // Apuntar a la cámara: "tú"
  apuntar: {
    pose: {
      ...BASE,
      torso: [0.06, 0, 0],
      cabeza: [0.04, 0, 0],
      brazoIzq: [0, 0, -0.2],
      brazoDer: [-1.35, 0, 0.25],
      antebrazoDer: [-0.15, 0, -0.1],
    },
    expr: { ...EXPR_BASE, cejas: ["arriba", "arriba"] },
    etiqueta: "Apuntar a cámara",
  },
  // Rascarse la cabeza: "ups"
  rascar: {
    pose: {
      ...BASE,
      cabeza: [0, 0, 0.15],
      brazoIzq: [0, 0, -0.15],
      brazoDer: [0, 0, 2.5],
      antebrazoDer: [0, 0, 0.6],
    },
    expr: { ...EXPR_BASE, cejas: ["triste", "triste"], reposo: "sonrisa" },
    etiqueta: "Rascarse la cabeza",
  },
  // Las dos manos en la cabeza, encorvado: "¡no puede ser!"
  desesperar: {
    pose: {
      ...BASE,
      altura: -0.3,
      torso: [0.08, 0, 0],
      cabeza: [0.12, 0, 0],
      brazoIzq: [0, 0, -2.65],
      antebrazoIzq: [0, 0, -0.85],
      brazoDer: [0, 0, 2.65],
      antebrazoDer: [0, 0, 0.85],
    },
    expr: { ...EXPR_BASE, ojos: "chicos", cejas: ["triste", "triste"], reposo: "apretada" },
    etiqueta: "Desesperarse",
  },
  // "No lo puedo creer": la cabeza se agacha y se apoya en la mano (con brazos chibi la mano
  // no llega a los ojos, así que la cabeza baja hasta ella)
  facepalm: {
    pose: {
      ...BASE,
      altura: -0.3,
      torso: [0.14, 0, 0],
      cabeza: [0.38, 0, -0.08],
      brazoIzq: [0, 0, -0.1],
      brazoDer: [-0.75, 0, 0.1],
      antebrazoDer: [-2.25, 0, -0.85],
    },
    expr: { ...EXPR_BASE, ojos: "cerrados", cejas: ["triste", "triste"], reposo: "cerrada" },
    etiqueta: "Facepalm",
  },
  // Las manos juntas en la boca, hombros arriba, temblando: ansiedad
  ansioso: {
    pose: {
      ...BASE,
      altura: 0.25,
      cabeza: [0.06, 0, 0],
      brazoIzq: [-0.6, 0, -0.1],
      antebrazoIzq: [-2.2, 0, 0.6],
      brazoDer: [-0.6, 0, 0.1],
      antebrazoDer: [-2.2, 0, -0.6],
    },
    expr: { ...EXPR_BASE, ojos: "chicos", cejas: ["triste", "triste"], reposo: "apretada" },
    etiqueta: "Ansioso",
  },
  // ---------- Poses del video (el avatar camina por la pantalla y señala la app) ----------
  // Paso al caminar: las piernas y los brazos se mueven solos (ver la capa "caminata" en estadoEn)
  caminar: {
    pose: { ...BASE, torso: [0.05, 0, 0] },
    expr: EXPR_BASE,
    etiqueta: "Caminar",
  },
  correr: {
    pose: {
      ...BASE,
      torso: [0.22, 0, 0],
      cabeza: [-0.1, 0, 0],
      brazoIzq: [0, 0, -0.2],
      antebrazoIzq: [-1.5, 0, 0],
      brazoDer: [0, 0, 0.2],
      antebrazoDer: [-1.5, 0, 0],
    },
    expr: { ...EXPR_BASE, ojos: "feliz", cejas: ["arriba", "arriba"], reposo: "sonrisaAbierta", feliz: true },
    etiqueta: "Correr",
  },
  // Señalar hacia la izquierda de la pantalla (el espejo de "senalar"): para cuando está a la derecha del celular
  senalarIzq: {
    pose: {
      ...BASE,
      torso: [0, -0.25, 0],
      cabeza: [0.04, -0.25, 0],
      brazoIzq: [-0.25, 0, -1.45],
      antebrazoIzq: [0, 0, -0.1],
      brazoDer: [0, 0, 0.2],
    },
    expr: { ...EXPR_BASE, cejas: ["normal", "arriba"] },
    etiqueta: "Señalar a la izquierda",
  },
  // Brazo estirado hacia arriba: la franja de aguayo, la barra de direcciones, el título
  senalarArriba: {
    pose: {
      ...BASE,
      cabeza: [-0.22, 0, 0.05],
      brazoIzq: [0, 0, -0.2],
      brazoDer: [0, 0, 2.7],
      antebrazoDer: [0, 0, 0.1],
    },
    expr: { ...EXPR_BASE, cejas: ["arriba", "arriba"] },
    etiqueta: "Señalar arriba",
  },
  // Brazo hacia abajo y afuera: el menú de abajo, el botón Publicar
  senalarAbajo: {
    pose: {
      ...BASE,
      torso: [0.1, 0.2, 0],
      cabeza: [0.2, 0.2, 0],
      brazoIzq: [0, 0, -0.2],
      brazoDer: [-0.2, 0, 0.75],
      antebrazoDer: [0, 0, 0.1],
    },
    expr: { ...EXPR_BASE, cejas: ["arriba", "normal"] },
    etiqueta: "Señalar abajo",
  },
  // Tocar la pantalla con el dedo: el antebrazo da toquecitos
  tocar: {
    pose: {
      ...BASE,
      torso: [0.06, 0.12, 0],
      cabeza: [0.06, 0.12, 0],
      brazoIzq: [0, 0, -0.2],
      brazoDer: [-1.15, 0, 0.2],
      antebrazoDer: [-0.55, 0, -0.1],
    },
    expr: { ...EXPR_BASE, cejas: ["arriba", "normal"] },
    etiqueta: "Tocar",
  },
  // Tirar hacia abajo para actualizar: el brazo baja una y otra vez
  deslizar: {
    pose: {
      ...BASE,
      torso: [0.05, 0.1, 0],
      brazoIzq: [0, 0, -0.2],
      brazoDer: [-1.0, 0, 0.2],
      antebrazoDer: [-0.35, 0, -0.1],
    },
    expr: EXPR_BASE,
    etiqueta: "Deslizar",
  },
  aplaudir: {
    pose: {
      ...BASE,
      brazoIzq: [-0.5, 0, -0.4],
      antebrazoIzq: [-1.5, 0, 0.5],
      brazoDer: [-0.5, 0, 0.4],
      antebrazoDer: [-1.5, 0, -0.5],
    },
    expr: { ...EXPR_BASE, ojos: "feliz", cejas: ["arriba", "arriba"], reposo: "sonrisaAbierta", feliz: true },
    etiqueta: "Aplaudir",
  },
  // Esperar su turno en la esquina: manos juntas adelante, atento
  esperar: {
    pose: {
      ...BASE,
      cabeza: [0, 0, 0.06],
      brazoIzq: [-0.3, 0, -0.1],
      antebrazoIzq: [-0.9, 0, 0.5],
      brazoDer: [-0.3, 0, 0.1],
      antebrazoDer: [-0.9, 0, -0.5],
    },
    expr: { ...EXPR_BASE, cejas: ["arriba", "normal"], reposo: "sonrisa" },
    etiqueta: "Esperar",
  },
};

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const lerpRot = (a: Rot, b: Rot, t: number): Rot => [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)];
const sumar = (a: Rot, b: Rot): Rot => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];

// Mezcla con desfase: cada parte del cuerpo llega a la pose nueva en su propio momento
// (cuerpo primero, luego brazos, cabeza y antebrazos). Eso da un movimiento más orgánico.
type Avance = { cuerpo: number; cabeza: number; brazo: number; antebrazo: number };

const mezclar = (a: Pose, b: Pose, t: Avance): Pose => ({
  altura: lerp(a.altura, b.altura, t.cuerpo),
  torso: lerpRot(a.torso, b.torso, t.cuerpo),
  cabeza: lerpRot(a.cabeza, b.cabeza, t.cabeza),
  brazoIzq: lerpRot(a.brazoIzq, b.brazoIzq, t.brazo),
  antebrazoIzq: lerpRot(a.antebrazoIzq, b.antebrazoIzq, t.antebrazo),
  brazoDer: lerpRot(a.brazoDer, b.brazoDer, t.brazo),
  antebrazoDer: lerpRot(a.antebrazoDer, b.antebrazoDer, t.antebrazo),
  piernaIzq: lerpRot(a.piernaIzq, b.piernaIzq, t.cuerpo),
  piernaDer: lerpRot(a.piernaDer, b.piernaDer, t.cuerpo),
});

// ---------- Entradas y salidas ----------

export type Movimiento = {
  tipo: "entrarCaminando" | "salirCaminando" | "aparecer" | "desaparecer";
  t: number;
  dur: number;
  // Lado de la pantalla por donde entra o sale (-1 izquierda, 1 derecha)
  lado?: -1 | 1;
};

export const ETIQUETA_MOV: Record<Movimiento["tipo"], string> = {
  entrarCaminando: "Entrar caminando",
  salirCaminando: "Salir caminando",
  aparecer: "Aparecer",
  desaparecer: "Apagarse",
};

const DISTANCIA = 42; // cuánto camina para entrar o salir de cuadro
const PASO = 5; // largo de un paso: el pie no patina porque la fase sale de la distancia

// ---------- Estado del personaje en un frame ----------

export type Clave = { t: number; pose: PoseNombre };

export type Estado = {
  pose: Pose;
  ojos: OjoVar;
  cejas: [CejaVar, CejaVar];
  boca: BocaVar;
  // 0..1: aplastamiento al cambiar de pose (anticipación)
  aplastar: number;
  giro: number;
  nombre: PoseNombre;
  // Desplazamiento horizontal (entrar o salir caminando)
  x: number;
  escala: [number, number, number];
  // 0..1+: tamaño de la laptop o del teclado holográfico (aparece en la pose "escribir")
  laptop: number;
  // 0..1 mientras dura el destello de aparecer; -1 si no hay
  destello: number;
  movimiento: Movimiento["tipo"] | null;
};

// Parpadeos deterministas: cada 2,4–4,2 s, 4 frames con los ojos cerrados
const parpadea = (frame: number, fps: number) => {
  let t = 1.1;
  let s = 7;
  while (t * fps <= frame + 4) {
    const inicio = Math.round(t * fps);
    if (frame >= inicio && frame < inicio + 4) return true;
    s = (s * 9301 + 49297) % 233280;
    t += 2.4 + (s / 233280) * 1.8;
  }
  return false;
};

// Boca según el volumen de la voz (0..1)
const bocaPorVolumen = (v: number, feliz: boolean): BocaVar | null => {
  if (v < 0.07) return null;
  if (v < 0.22) return "abierta1";
  if (v < 0.45) return feliz ? "sonrisaAbierta" : "abierta2";
  return feliz ? "sonrisaAbierta" : "abierta3";
};

const RESORTE = { damping: 14, mass: 0.85, stiffness: 95 };

type Opciones = {
  frame: number;
  fps: number;
  claves: Clave[];
  volumen: (frame: number) => number;
  movimientos?: Movimiento[];
  giro?: number;
  // Caminata por la pantalla: la fase sale de la distancia recorrida (el pie no patina)
  caminata?: Caminata;
};

// Se usa en el video: el avatar se mueve por la pantalla y camina o corre mientras avanza.
// fase = distancia recorrida / largo del paso; w = 0..1 cuánto camina; dir = hacia dónde mira (-1 izquierda, 1 derecha)
export type Caminata = { fase: number; w: number; dir: -1 | 1; correr?: boolean };

export const estadoEn = ({ frame, fps, claves, volumen, movimientos = [], giro = 0, caminata }: Opciones): Estado => {
  // Clave activa y la anterior
  let i = 0;
  for (let k = 0; k < claves.length; k++) if (claves[k].t * fps <= frame) i = k;
  const actual = claves[i];
  const previa = claves[Math.max(0, i - 1)];
  const local = frame - Math.round(actual.t * fps);
  const resorte = (retraso: number) =>
    i === 0 ? 1 : spring({ frame: local - retraso, fps, config: RESORTE });
  const avance: Avance = { cuerpo: resorte(0), brazo: resorte(1), cabeza: resorte(2), antebrazo: resorte(3) };
  const s = avance.cuerpo;
  const pose = mezclar(POSES[previa.pose].pose, POSES[actual.pose].pose, avance);
  const expr = s > 0.5 || i === 0 ? POSES[actual.pose].expr : POSES[previa.pose].expr;
  const pesoActual = Math.min(1, s);
  const peso = (n: PoseNombre) =>
    (actual.pose === n ? pesoActual : 0) + (previa.pose === n && i > 0 ? 1 - pesoActual : 0);

  const T = frame / fps;
  const v = volumen(frame);
  const vSuave = Math.max(v, volumen(frame - 1) * 0.7);

  // Énfasis: cuando la voz sube de golpe, cejas arriba y un cabeceo corto
  let enfasis = 0;
  for (let d = 0; d < 7; d++) {
    if (volumen(frame - d) - volumen(frame - d - 3) > 0.22) {
      enfasis = Math.max(enfasis, 1 - d / 7);
    }
  }

  // Capas automáticas encima de la pose
  pose.altura += Math.sin(T * Math.PI) * 0.15; // respirar
  pose.torso = sumar(pose.torso, [0, 0, Math.sin(T * 0.9) * 0.025]); // cambiar el peso de pie
  pose.cabeza = sumar(pose.cabeza, [
    Math.sin(T * Math.PI + 1) * 0.02 + vSuave * 0.07 * Math.sin(T * 11) + enfasis * 0.09,
    vSuave * 0.06 * Math.sin(T * 5.3),
    Math.sin(T * 1.7) * 0.025,
  ]);
  // Saludar: la mano se mueve de lado a lado
  pose.antebrazoDer = sumar(pose.antebrazoDer, [0, 0, Math.sin(T * 2 * Math.PI * 2.2) * 0.45 * peso("saludar")]);
  // Celebrar: saltitos
  pose.altura += Math.abs(Math.sin(T * 2 * Math.PI * 1.6)) * 1.6 * peso("celebrar");
  // Triunfo: el puño baja y sube
  const golpe = Math.sin(T * 2 * Math.PI * 1.8);
  pose.antebrazoDer = sumar(pose.antebrazoDer, [0, 0, golpe * 0.28 * peso("triunfo")]);
  pose.altura += Math.max(0, golpe) * 0.5 * peso("triunfo");
  // Hablar: las manos acompañan la voz
  const gesto = Math.sin(T * 2 * Math.PI * 1.3) * (0.15 + vSuave * 0.4) * peso("hablar");
  pose.antebrazoIzq = sumar(pose.antebrazoIzq, [gesto, 0, 0]);
  pose.antebrazoDer = sumar(pose.antebrazoDer, [-gesto, 0, 0]);
  // Escribir: las manos teclean alternadas
  const tecla = Math.sin(T * 2 * Math.PI * 4.5) * 0.14 * peso("escribir");
  pose.antebrazoIzq = sumar(pose.antebrazoIzq, [tecla, 0, 0]);
  pose.antebrazoDer = sumar(pose.antebrazoDer, [-tecla, 0, 0]);
  // Apuntar: el brazo empuja un poco hacia la cámara al ritmo de la voz
  pose.brazoDer = sumar(pose.brazoDer, [-vSuave * 0.12 * peso("apuntar"), 0, 0]);
  // Desesperarse: las manos se sacuden sobre la cabeza
  const sacudon = Math.sin(T * 2 * Math.PI * 6) * 0.12 * peso("desesperar");
  pose.antebrazoIzq = sumar(pose.antebrazoIzq, [0, 0, -sacudon]);
  pose.antebrazoDer = sumar(pose.antebrazoDer, [0, 0, sacudon]);
  // Ansioso: la cabeza tiembla un poco
  pose.cabeza = sumar(pose.cabeza, [0, Math.sin(T * 2 * Math.PI * 9) * 0.05 * peso("ansioso"), 0]);
  // Rascarse: la mano se mueve rápido sobre la cabeza
  pose.antebrazoDer = sumar(pose.antebrazoDer, [0, 0, Math.sin(T * 2 * Math.PI * 4) * 0.12 * peso("rascar")]);

  // Aplaudir: las manos se juntan y se separan
  const palmada = (Math.sin(T * 2 * Math.PI * 3.4) + 1) / 2;
  pose.antebrazoIzq = sumar(pose.antebrazoIzq, [0, 0, -0.5 * palmada * peso("aplaudir")]);
  pose.antebrazoDer = sumar(pose.antebrazoDer, [0, 0, 0.5 * palmada * peso("aplaudir")]);
  pose.altura += Math.abs(Math.sin(T * 2 * Math.PI * 1.7)) * 0.35 * peso("aplaudir");
  // Tocar: toquecitos con el dedo
  pose.antebrazoDer = sumar(pose.antebrazoDer, [Math.max(0, Math.sin(T * 2 * Math.PI * 2.4)) * 0.28 * peso("tocar"), 0, 0]);
  // Deslizar: el brazo baja de golpe, vuelve a subir y repite
  const bajada = (T * 1.1) % 1;
  const diente = bajada < 0.7 ? bajada / 0.7 : (1 - bajada) / 0.3;
  pose.brazoDer = sumar(pose.brazoDer, [diente * 0.6 * peso("deslizar"), 0, 0]);
  // Señalar: el dedo da un golpecito hacia donde apunta
  const picoteo = Math.max(0, Math.sin(T * 2 * Math.PI * 1.5)) * 0.12;
  pose.brazoDer = sumar(pose.brazoDer, [0, 0, picoteo * (peso("senalar") + peso("senalarAbajo") + peso("senalarArriba") * 0.5)]);
  pose.brazoIzq = sumar(pose.brazoIzq, [0, 0, -picoteo * peso("senalarIzq")]);

  // Caminar y correr: si no viene una caminata del video, la pose las anima sola (para el Studio)
  const cam: Caminata | null =
    caminata ??
    (peso("caminar") + peso("correr") > 0.01
      ? { fase: T * 2.2, w: Math.min(1, peso("caminar") + peso("correr")), dir: 1, correr: peso("correr") > 0.5 }
      : null);
  let giroCamina = 0;
  if (cam && cam.w > 0.001) {
    const k = cam.correr ? 1.5 : 1;
    const swing = Math.sin(cam.fase * Math.PI);
    pose.piernaIzq = sumar(pose.piernaIzq, [swing * 0.55 * k * cam.w, 0, 0]);
    pose.piernaDer = sumar(pose.piernaDer, [-swing * 0.55 * k * cam.w, 0, 0]);
    pose.brazoIzq = sumar(pose.brazoIzq, [-swing * 0.45 * k * cam.w, 0, 0]);
    pose.brazoDer = sumar(pose.brazoDer, [swing * 0.45 * k * cam.w, 0, 0]);
    pose.altura += Math.abs(Math.cos(cam.fase * Math.PI)) * 0.45 * k * cam.w;
    giroCamina = cam.dir * 0.9 * cam.w;
    pose.torso = sumar(pose.torso, [0.05 * cam.w, 0, -cam.dir * 0.06 * cam.w]);
  }

  // ---------- Entradas y salidas ----------
  let x = 0;
  let escala: [number, number, number] = [1, 1, 1];
  let destello = -1;
  let movimiento: Movimiento["tipo"] | null = null;
  let girar = giro + giroCamina;
  const primero = movimientos.find((m) => m.tipo === "entrarCaminando" || m.tipo === "aparecer");
  if (primero && frame < primero.t * fps) escala = [0, 0, 0];

  movimientos.forEach((m) => {
    const p = (T - m.t) / m.dur;
    const lado = m.lado ?? -1;
    if (m.tipo === "entrarCaminando" || m.tipo === "salirCaminando") {
      const entra = m.tipo === "entrarCaminando";
      if (entra && p < 0) return;
      if (!entra && p < 0) return;
      const q = Math.min(1, p);
      // Entra desacelerando y sale acelerando
      const recorrido = entra ? 1 - Math.pow(1 - q, 1.6) : Math.pow(q, 1.3);
      x = entra ? lado * DISTANCIA * (1 - recorrido) : lado * DISTANCIA * recorrido;
      if (p >= 1) return;
      movimiento = m.tipo;
      // Peso de la caminata: se apaga al final de la entrada
      const w = entra ? Math.min(1, (1 - q) / 0.15) : Math.min(1, q / 0.1);
      const fase = (Math.abs(x) / PASO) * Math.PI;
      const swing = Math.sin(fase);
      pose.piernaIzq = sumar(pose.piernaIzq, [swing * 0.55 * w, 0, 0]);
      pose.piernaDer = sumar(pose.piernaDer, [-swing * 0.55 * w, 0, 0]);
      pose.brazoIzq = sumar(pose.brazoIzq, [-swing * 0.45 * w, 0, 0]);
      pose.brazoDer = sumar(pose.brazoDer, [swing * 0.45 * w, 0, 0]);
      pose.altura += Math.abs(Math.cos(fase)) * 0.45 * w;
      // Mira hacia donde camina y se inclina un poco
      const haciaDerecha = entra ? -lado : lado;
      girar += haciaDerecha * 0.9 * w;
      pose.torso = sumar(pose.torso, [0.05 * w, 0, -haciaDerecha * 0.06 * w]);
    }
    if (m.tipo === "aparecer" && p >= 0) {
      const e = spring({ frame: frame - Math.round(m.t * fps), fps, config: { damping: 9, mass: 0.5, stiffness: 170 } });
      // Se estira hacia arriba al aparecer
      escala = [e, e * (1 + 0.35 * Math.max(0, 1 - e)), e];
      if (p < 1) {
        destello = p;
        movimiento = m.tipo;
      }
    }
    if (m.tipo === "desaparecer" && p >= 0) {
      // Como un televisor viejo al apagarse: se aplana y luego se cierra en un punto
      const q = Math.min(1, p);
      const aplana = Math.min(1, q / 0.55);
      const cierra = Math.max(0, (q - 0.55) / 0.45);
      const ey = 1 - 0.94 * aplana * aplana;
      const ex = (1 + 0.3 * aplana) * (1 - cierra * cierra);
      escala = [ex, ey, ex];
      if (p < 1) movimiento = m.tipo;
    }
  });

  const cerrados = parpadea(frame, fps) && expr.ojos === "normal";
  const porVoz = expr.boca === "habla" ? bocaPorVolumen(vSuave, expr.feliz) : null;
  const boca: BocaVar = expr.boca === "habla" ? porVoz ?? expr.reposo : expr.boca;
  const cejasNormales = expr.cejas[0] === "normal" && expr.cejas[1] === "normal";
  const cejas: [CejaVar, CejaVar] = cejasNormales && enfasis > 0.3 ? ["arriba", "arriba"] : expr.cejas;

  // La laptop aparece con un pequeño rebote al empezar a escribir
  const laptop =
    actual.pose === "escribir" ? (i === 0 ? 1 : s) : previa.pose === "escribir" && i > 0 ? Math.max(0, 1 - s * 1.6) : 0;

  return {
    pose,
    ojos: cerrados ? "cerrados" : expr.ojos,
    cejas,
    boca,
    aplastar: i === 0 ? 0 : Math.sin(Math.PI * Math.min(1, Math.max(0, local / (0.35 * fps)))),
    giro: girar,
    nombre: actual.pose,
    x,
    escala,
    laptop,
    destello,
    movimiento,
  };
};

// Estado quieto de una pose (para las hojas de poses)
export const estadoFijo = (nombre: PoseNombre, giro = 0): Estado => {
  const { expr } = POSES[nombre];
  // Caminar y correr se ven a medio paso en la hoja de poses
  const pose: Pose = { ...POSES[nombre].pose };
  if (nombre === "caminar" || nombre === "correr") {
    const k = nombre === "correr" ? 1.5 : 1;
    pose.piernaIzq = [0.5 * k, 0, 0];
    pose.piernaDer = [-0.5 * k, 0, 0];
    pose.brazoIzq = [pose.brazoIzq[0] - 0.4 * k, pose.brazoIzq[1], pose.brazoIzq[2]];
    pose.brazoDer = [pose.brazoDer[0] + 0.4 * k, pose.brazoDer[1], pose.brazoDer[2]];
    pose.altura += 0.3;
    giro = giro || 0.9;
  }
  return {
    pose,
    ojos: expr.ojos,
    cejas: expr.cejas,
    boca: expr.boca === "habla" ? expr.reposo : expr.boca,
    aplastar: 0,
    giro,
    nombre,
    x: 0,
    escala: [1, 1, 1],
    laptop: nombre === "escribir" ? 1 : 0,
    destello: -1,
    movimiento: null,
  };
};
