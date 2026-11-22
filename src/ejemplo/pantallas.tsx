import type { ReactNode } from "react";
import { interpolate } from "remotion";
import type { Escena, Linea } from "../elenco/escenas";
import type { Celular } from "../elenco/layout";
import {
  AGUAYO,
  Aviso,
  Boton,
  Cabecera,
  Campo,
  CLARO,
  Chip,
  Estrella,
  FAB,
  Fila,
  Foto,
  Franja,
  Hoja,
  Letrero,
  Nav,
  OSCURO,
  Pantalla,
  Pregunta,
  SeccionTitulo,
  TEXTO,
  TITULO,
  TemaCtx,
  aparece,
  escribir,
  useTema,
} from "./ui";

// Lo que se ve dentro de cada celular en cada escena (para el ejemplo). En el video real va la grabación de la app.
// Coordenadas en el marco de diseño 360 × 800. `toques` marca dónde se toca y cuándo.

export type Toque = { cel: Celular; t: number; x: number; y: number };
export type Vista = Partial<Record<Celular | "pc" | "camara" | "mapa", ReactNode>>;
export type EscenaUI = { vista: (T: number) => Vista; toques: Toque[] };

const rango = (T: number, a: number, b: number, v0 = 0, v1 = 1) =>
  interpolate(T, [a, b], [v0, v1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

const Tema: React.FC<{ claro?: boolean; children: ReactNode }> = ({ claro, children }) => (
  <TemaCtx.Provider value={claro ? CLARO : OSCURO}>{children}</TemaCtx.Provider>
);

const FEED = [
  { titulo: "Almuerzo con sopa y segundo", zona: "Cala Cala", hace: "hace 20 min", foto: "almuerzo", precio: "Bs 15" },
  { titulo: "Papa de Cochabamba, bolsa de 5 kg", zona: "Centro", hace: "hace 2 h", foto: "papa", precio: "Bs 20" },
];
const SEMANA = [
  { titulo: "Reparación de celulares al instante", zona: "Sarco", hace: "ayer", foto: "celulares", precio: undefined },
  { titulo: "Corte de pelo", zona: "Cala Cala", hace: "hace 3 días", foto: "pelo", precio: "Bs 12" },
];

// ---------- Feed de Hoy ----------
const Feed: React.FC<{
  yapitas: number;
  destello?: number;
  scroll?: number;
  nuevo?: number;
  sirvio?: boolean;
  gracias?: number;
  conNuevo?: boolean;
}> = ({ yapitas, destello, scroll = 0, nuevo = 1, sirvio, gracias, conNuevo }) => (
  <>
    <div style={{ transform: `translateY(${-scroll}px)` }}>
      <div style={{ height: 55 }} />
      <SeccionTitulo>Hoy</SeccionTitulo>
      {conNuevo ? <Letrero {...FEED[0]} nuevo={nuevo} /> : null}
      {FEED.map((l, i) => (
        <Letrero key={l.titulo} {...l} sirvio={i === 0 && !conNuevo ? sirvio : false} gracias={i === 0 && !conNuevo ? gracias : 0} titulo={i === 0 && conNuevo ? "Menú del día, sopa y segundo" : l.titulo} />
      ))}
      <SeccionTitulo>Esta semana</SeccionTitulo>
      {SEMANA.map((l) => (
        <Letrero key={l.titulo} {...l} />
      ))}
      <SeccionTitulo>Antes</SeccionTitulo>
      <Letrero titulo="Se vende bicicleta de ruta" zona="Centro" hace="hace 2 semanas" foto="celulares" precio="Bs 350" />
    </div>
    <div style={{ position: "absolute", left: 0, right: 0, top: 0, background: "inherit" }}>
      <div style={{ background: "inherit" }}>
        <Cabecera yapitas={yapitas} destello={destello} />
      </div>
    </div>
  </>
);

const CabeceraFija: React.FC<{ yapitas: number; destello?: number }> = ({ yapitas, destello }) => {
  const p = useTema();
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: 0, background: p.fondo, zIndex: 3 }}>
      <Cabecera yapitas={yapitas} destello={destello} />
    </div>
  );
};

// ---------- Escena 1 · cámara ----------
const camaraUI = (L: Linea[]): EscenaUI => ({
  toques: [],
  vista: (T) => ({
    camara: (
      <CamaraFalsa T={T} L={L} />
    ),
  }),
});

const COLORES = { diego: "#22D3EE", yaeko: "#8B5CFF", aldrin: "#C6F432" } as const;
const NOMBRES = { diego: "Diego", yaeko: "Yaeko", aldrin: "Aldrin" } as const;

const CamaraFalsa: React.FC<{ T: number; L: Linea[] }> = ({ T, L }) => {
  const actual = [...L].reverse().find((l) => l.camara && T >= l.t - 0.3 && T < l.t + l.dur + 1.2);
  const quien = (actual?.quien ?? "diego") as keyof typeof COLORES;
  const termino = actual ? T > actual.t + actual.dur + 0.2 : false;
  // Cuando se vuelve avatar, la persona se pixela y desaparece
  const salida = actual ? rango(T, actual.t + actual.dur + 0.2, actual.t + actual.dur + 0.7) : 0;
  const mostrar = L.filter((l) => l.camara).every((l) => T < l.t + l.dur + 1.1) || termino === false || salida < 1;
  const hablando = L.some((l) => l.camara && T >= l.t && T < l.t + l.dur);
  if (!actual) return null;
  const todosListos = L.filter((l) => l.camara).every((l) => T > l.t + l.dur + 0.8);
  if (todosListos) return null;
  void mostrar;
  return (
    <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div
        style={{
          width: 560,
          height: 640,
          borderRadius: 28,
          border: `3px dashed ${COLORES[quien]}`,
          background: "rgba(255,255,255,0.04)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-end",
          overflow: "hidden",
          filter: `blur(${salida * 14}px)`,
          opacity: 1 - salida,
        }}
      >
        <div style={{ width: 150, height: 150, borderRadius: 999, background: COLORES[quien], opacity: 0.85 }} />
        <div style={{ width: 330, height: 260, borderRadius: "150px 150px 0 0", background: COLORES[quien], opacity: 0.55, marginTop: 10 }} />
        <div style={{ position: "absolute", top: 20, left: 0, right: 0, textAlign: "center", fontFamily: TEXTO, color: "#F5F2EF" }}>
          <div style={{ fontSize: 22, opacity: 0.7 }}>TOMA EN CÁMARA</div>
          <div style={{ fontSize: 44, fontWeight: 800, color: COLORES[quien] }}>
            {NOMBRES[quien]} {hablando ? "· habla" : ""}
          </div>
        </div>
      </div>
    </div>
  );
};

// ---------- Escena 2 · el problema ----------
const MENSAJES = ["Buenos días vecinos ☀️", "Jajaja 😂😂", "Quién va a la reunión?", "👍", "Foto de la rifa", "Se vende refri", "Gracias!!", "Feliz cumple Don Lucho 🎂", "Alguien tiene gas?", "Ok", "Reenviado: cadena", "😂", "Sticker", "Nos vemos mañana", "Quién cobra la cuota?"];

const Whatsapp: React.FC<{ T: number; t0: number }> = ({ T, t0 }) => {
  const n = Math.max(0, Math.floor((T - t0) / 0.42));
  const sinLeer = Math.min(99, 12 + n * 4);
  return (
    <div style={{ position: "absolute", inset: 0, background: "#0B141A", fontFamily: TEXTO, color: "#E9EDEF" }}>
      <div style={{ height: 64, background: "#1F2C34", display: "flex", alignItems: "center", padding: "0 16px", gap: 12 }}>
        <div style={{ width: 38, height: 38, borderRadius: 99, background: "#2A7F62", display: "flex", alignItems: "center", justifyContent: "center" }}>🏘️</div>
        <div>
          <div style={{ fontWeight: 700, fontSize: 17 }}>Vecinos Sarco</div>
          <div style={{ fontSize: 12.5, color: "#8696A0" }}>5 grupos con la misma pregunta</div>
        </div>
        <div style={{ marginLeft: "auto", background: "#25D366", color: "#0B141A", fontWeight: 800, fontSize: 13, borderRadius: 99, padding: "3px 9px" }}>
          {sinLeer >= 99 ? "99+" : sinLeer}
        </div>
      </div>
      <div style={{ position: "absolute", top: 64, bottom: 0, left: 0, right: 0, overflow: "hidden" }}>
        {[-1, ...Array.from({ length: n }, (_, i) => i)].map((i) => {
          const y = 690 - (n - i) * 66;
          const pregunta = i === -1;
          if (y < -70) return null;
          const entra = pregunta ? aparece(T, 0.4) : 1;
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: pregunta ? "auto" : 14,
                right: pregunta ? 14 : "auto",
                top: y,
                maxWidth: 250,
                background: pregunta ? "#005C4B" : "#202C33",
                borderRadius: 12,
                padding: "10px 13px",
                fontSize: 15,
                opacity: entra,
                border: pregunta ? "2px solid #F2C230" : "none",
              }}
            >
              {pregunta ? "¿Alguien sabe de un plomero para hoy? 🆘" : MENSAJES[i % MENSAJES.length]}
            </div>
          );
        })}
      </div>
    </div>
  );
};

const problemaUI = (L: Linea[]): EscenaUI => ({
  toques: [],
  vista: (T) => ({ U: <Whatsapp T={T} t0={L[0].t + 2.2} /> }),
});

// ---------- Escena 3 · entras directo a Hoy ----------
const hoyUI = (L: Linea[]): EscenaUI => {
  const tSirvio = L[2].t - 0.1;
  return {
    toques: [{ cel: "U", t: tSirvio, x: 292, y: 259 }],
    vista: (T) => {
      const url = escribir("boliviasabe.vercel.app", T, 0.4, 12);
      const navegador = 1 - rango(T, 2.6, 3.1);
      const scroll = rango(T, L[1].t + 0.6, L[1].t + 5.2, 0, 560);
      const sirvio = T > tSirvio + 0.1;
      const hoja = rango(T, tSirvio + 0.5, tSirvio + 0.9) * (1 - rango(T, L[2].t + L[2].dur - 0.4, L[2].t + L[2].dur));
      return {
        U: (
          <Tema>
            <Pantalla>
              <Feed yapitas={0} scroll={T > 3 ? Math.min(scroll, 560) : 0} sirvio={sirvio} gracias={0} />
              {T < 3.1 ? (
                <div style={{ position: "absolute", inset: 0, background: OSCURO.fondo, opacity: navegador }}>
                  <div style={{ margin: "20px 14px", background: OSCURO.superficie, border: `1px solid ${OSCURO.linea}`, borderRadius: 999, padding: "12px 18px", fontSize: 16, color: OSCURO.texto, fontFamily: TEXTO }}>
                    🔒 {url}
                    <span style={{ color: OSCURO.fucsia }}>|</span>
                  </div>
                  <div style={{ textAlign: "center", marginTop: 220, fontFamily: TITULO, fontSize: 38, fontWeight: 700, color: OSCURO.texto }}>
                    Bolivia<span style={{ color: OSCURO.fucsia }}>Sabe</span>
                  </div>
                  <div style={{ margin: "14px 0 0", opacity: 0.9 }}>
                    <Franja />
                  </div>
                </div>
              ) : null}
              {hoja > 0.01 ? (
                <Hoja alto={330} progreso={hoja}>
                  <div style={{ fontFamily: TITULO, fontWeight: 700, fontSize: 24, marginBottom: 6 }}>Crea tu cuenta para seguir</div>
                  <div style={{ color: OSCURO.suave, fontSize: 14.5, marginBottom: 20 }}>Mirar es gratis. Para participar necesitas una cuenta.</div>
                  <Boton ancho="100%">Continuar con Google</Boton>
                  <div style={{ height: 10 }} />
                  <Boton tipo="linea" ancho="100%">Usar mi correo</Boton>
                </Hoja>
              ) : null}
            </Pantalla>
          </Tema>
        ),
      };
    },
  };
};

// ---------- Escena 4 · subir un letrero ----------
const Foto2: React.FC<{ visible: number }> = ({ visible }) => {
  const p = useTema();
  return (
    <div style={{ height: 150, borderRadius: 14, border: `1px dashed ${p.linea}`, overflow: "hidden", position: "relative", marginBottom: 14 }}>
      {visible > 0 ? <Foto tipo="almuerzo" alto={150} /> : <div style={{ textAlign: "center", paddingTop: 54, color: p.suave, fontWeight: 600 }}>📷 Tomar foto</div>}
    </div>
  );
};

const subirUI = (L: Linea[]): EscenaUI => {
  const a = L[0].t;
  const tFab = a + 2.4;
  const tFoto = a + 3.3;
  const tTitulo = a + 3.9;
  const tPrecio = a + 5.8;
  const tPub = a + 6.6;
  const tB = L[1].t - 0.4;
  const tSirve = L[2].t - 0.6;
  return {
    toques: [
      { cel: "A", t: tFab, x: 285, y: 702 },
      { cel: "A", t: tFoto, x: 180, y: 190 },
      { cel: "A", t: tPub, x: 180, y: 712 },
      { cel: "B", t: tSirve, x: 180, y: 582 },
    ],
    vista: (T) => {
      const formulario = T >= tFab + 0.25 && T < tPub + 0.25;
      const titulo = escribir("Almuerzo con sopa y segundo", T, tTitulo, 13);
      const precio = escribir("Bs 15", T, tPrecio, 8);
      const nuevo = rango(T, tPub + 0.3, tPub + 0.8);
      const yapitas = T > tSirve + 1 ? 7 : T > tPub + 0.7 ? 6 : 5;
      const destello = Math.max(rango(T, tPub + 0.5, tPub + 0.7) * (1 - rango(T, tPub + 0.9, tPub + 1.4)), rango(T, tSirve + 1, tSirve + 1.2) * (1 - rango(T, tSirve + 1.4, tSirve + 1.9)));
      const detalleB = T >= tB;
      const gracias = rango(T, tSirve + 0.2, tSirve + 0.55);
      return {
        A: (
          <Tema>
            <Pantalla>
              {!formulario ? (
                <>
                  <Feed yapitas={yapitas} destello={destello} conNuevo={T > tPub + 0.25} nuevo={nuevo} />
                  <FAB>+ Subir</FAB>
                  <Nav activa="hoy" />
                </>
              ) : (
                <>
                  <CabeceraFija yapitas={5} />
                  <div style={{ padding: "74px 16px 0" }}>
                    <div style={{ fontFamily: TITULO, fontWeight: 700, fontSize: 24, marginBottom: 14 }}>Subir un letrero</div>
                    <Foto2 visible={T > tFoto + 0.3 ? 1 : 0} />
                    <Campo etiqueta="Título" valor={titulo} cursor={T >= tTitulo && T < tPrecio - 0.4} />
                    <div style={{ fontSize: 14, fontWeight: 700, color: OSCURO.suave, margin: "2px 0 10px" }}>Más detalles ▾</div>
                    <Campo etiqueta="Precio" valor={precio} cursor={T >= tPrecio && T < tPub - 0.2} />
                  </div>
                  <div style={{ position: "absolute", left: 16, right: 16, bottom: 28 }}>
                    <Boton ancho="100%" apagado={T < tTitulo + 1.2} presionado={rango(T, tPub, tPub + 0.1)}>Publicar</Boton>
                  </div>
                </>
              )}
            </Pantalla>
          </Tema>
        ),
        B: (
          <Tema>
            <Pantalla>
              {!detalleB ? (
                <>
                  <Feed yapitas={5} />
                  <Nav activa="hoy" />
                </>
              ) : (
                <>
                  <CabeceraFija yapitas={5} />
                  <div style={{ paddingTop: 64 }}>
                    <div style={{ margin: "0 16px", borderRadius: 16, overflow: "hidden", position: "relative", border: `1px solid ${OSCURO.linea}` }}>
                      <Foto tipo="almuerzo" alto={250} />
                      <div style={{ position: "absolute", left: 12, bottom: 14, background: OSCURO.amarillo, color: "#1F1A18", fontFamily: TITULO, fontWeight: 700, fontSize: 26, padding: "5px 14px 8px", borderRadius: 8, borderBottom: "4px solid #1F1A18" }}>
                        Bs 15
                      </div>
                      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0 }}>
                        <Franja />
                      </div>
                    </div>
                    <div style={{ padding: "16px 16px 0", fontFamily: TITULO, fontWeight: 500, fontSize: 24, lineHeight: 1.2 }}>Almuerzo con sopa y segundo</div>
                    <div style={{ padding: "8px 16px 0", color: OSCURO.suave, fontSize: 14 }}>Sarco · hace 1 min · subido por Ana</div>
                  </div>
                  <div style={{ position: "absolute", left: 16, right: 16, top: 560 }}>
                    <Boton ancho="100%" presionado={gracias > 0.5 ? 1 : 0}>{gracias > 0.5 ? "✓ Me sirvió" : "Me sirvió"}</Boton>
                  </div>
                  <Aviso progreso={rango(T, tSirve + 0.4, tSirve + 0.7) * (1 - rango(T, tSirve + 3.4, tSirve + 3.8))} color={OSCURO.verde}>
                    ¡Gracias, pues! Ana recibe +1 yapita
                  </Aviso>
                </>
              )}
            </Pantalla>
          </Tema>
        ),
      };
    },
  };
};

// ---------- Escena 5 · ¿Alguien sabe? ----------
const PREGUNTA = "¿Quién arregla una tubería hoy en Sarco? Se está saliendo el agua.";
const RESPUESTA = "Don Remberto, plomero en la Av. América. Atiende domingos.";

const alguienUI = (L: Linea[]): EscenaUI => {
  const a1 = L[0].t;
  const tNav = a1 + 0.9;
  const tFab = a1 + 2.9;
  const tTexto = a1 + 3.5;
  const tUrg = a1 + 7.0;
  const tPub = a1 + 8.7;
  const d2 = L[2].t;
  const a2 = L[3].t;
  const y3 = L[4].t;
  const tRefresca = d2 - 0.2;
  const tAbre = d2 + 1.5;
  const tResp = d2 + 1.9;
  const tEnvia = d2 + 4.7;
  const tLlega = d2 + 5.7;
  const tComenta = a2 + 0.8;
  const tPide = a2 + 2.5;
  const tAviso = a2 + 3.4;
  const tAcepta = a2 + 4.7;
  const tCaja = a2 + 5.5;
  const tSirve = y3 + 1.6;
  return {
    toques: [
      { cel: "A", t: tNav, x: 180, y: 770 },
      { cel: "A", t: tFab, x: 285, y: 702 },
      { cel: "A", t: tUrg, x: 180, y: 435 },
      { cel: "A", t: tPub, x: 180, y: 712 },
      { cel: "A", t: tPide, x: 100, y: 470 },
      { cel: "A", t: tSirve, x: 262, y: 470 },
      { cel: "B", t: tAbre, x: 180, y: 128 },
      { cel: "B", t: tEnvia, x: 180, y: 712 },
      { cel: "B", t: tAcepta, x: 100, y: 548 },
    ],
    vista: (T) => {
      const solucionada = rango(T, tSirve + 0.3, tSirve + 0.8);
      const yapitasA = T > tPub + 0.5 ? 2 : 7;
      const yapitasB = T > tSirve + 1.6 ? 10 : 5;
      const enTab = T >= tNav + 0.2;
      const formulario = T >= tFab + 0.25 && T < tPub + 0.25;
      const detalle = T >= tPub + 0.25;
      const respuesta = rango(T, tLlega, tLlega + 0.4);
      const comentario = rango(T, tComenta, tComenta + 0.4);
      const caja = rango(T, tCaja, tCaja + 0.4);
      const destelloA = rango(T, tPub + 0.5, tPub + 0.7) * (1 - rango(T, tPub + 0.9, tPub + 1.4));
      const destelloB = rango(T, tSirve + 1.6, tSirve + 1.8) * (1 - rango(T, tSirve + 2.1, tSirve + 2.6));
      const A = (
        <Tema>
          <Pantalla>
            {!formulario && !detalle ? (
              <>
                <CabeceraFija yapitas={yapitasA} />
                <div style={{ paddingTop: 64 }}>
                  {enTab ? (
                    <>
                      <Pregunta texto="¿Dónde compro leña para parrilla en Cala Cala?" zona="Cala Cala" hace="hace 1 h" respuestas={2} />
                      <Pregunta texto="¿Alguien da clases de matemática para secundaria?" zona="Centro" hace="hace 3 h" respuestas={1} />
                      <Pregunta texto="¿Hay agua hoy en Quillacollo?" zona="Quillacollo" hace="ayer" respuestas={4} />
                    </>
                  ) : (
                    <Feed yapitas={yapitasA} />
                  )}
                </div>
                <FAB>{enTab ? "+ Preguntar" : "+ Subir"}</FAB>
                <Nav activa={enTab ? "alguien" : "hoy"} />
              </>
            ) : null}
            {formulario ? (
              <>
                <CabeceraFija yapitas={yapitasA} />
                <div style={{ padding: "74px 16px 0" }}>
                  <div style={{ fontFamily: TITULO, fontWeight: 700, fontSize: 24, marginBottom: 14 }}>Preguntar</div>
                  <Campo etiqueta="Tu pregunta" valor={escribir(PREGUNTA, T, tTexto, 17)} cursor={T >= tTexto && T < tUrg - 0.4} alto={104} />
                  <div style={{ display: "flex", gap: 6, marginBottom: 14 }}>
                    <Chip color={OSCURO.fucsia} relleno>Servicios</Chip>
                    <Chip>Comida</Chip>
                    <Chip>Salud</Chip>
                  </div>
                  <div style={{ fontSize: 12.5, fontWeight: 700, color: OSCURO.suave, margin: "6px 0 8px" }}>Destacar</div>
                  <div style={{ border: `1px solid ${OSCURO.linea}`, borderRadius: 14, padding: "13px 14px", marginBottom: 10, fontWeight: 600 }}>Normal · gratis</div>
                  <div
                    style={{
                      border: `1px solid ${T > tUrg + 0.1 ? OSCURO.coral : OSCURO.linea}`,
                      background: T > tUrg + 0.1 ? "rgba(228,87,46,0.12)" : "transparent",
                      borderRadius: 14,
                      padding: "13px 14px",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 700 }}>Urgente <span style={{ color: OSCURO.naranja }}>(−5 yapitas)</span></div>
                      <div style={{ fontSize: 12.5, color: OSCURO.suave, marginTop: 2 }}>Sube arriba por 24 horas</div>
                    </div>
                    <div style={{ width: 46, height: 26, borderRadius: 99, background: T > tUrg + 0.1 ? OSCURO.coral : OSCURO.linea, position: "relative" }}>
                      <div style={{ position: "absolute", top: 3, left: T > tUrg + 0.1 ? 23 : 3, width: 20, height: 20, borderRadius: 99, background: "#fff" }} />
                    </div>
                  </div>
                </div>
                <div style={{ position: "absolute", left: 16, right: 16, bottom: 28 }}>
                  <Boton ancho="100%" apagado={T < tTexto + 2} presionado={rango(T, tPub, tPub + 0.1)}>Publicar</Boton>
                </div>
              </>
            ) : null}
            {detalle ? (
              <>
                <CabeceraFija yapitas={yapitasA} destello={destelloA} />
                <div style={{ paddingTop: 66 }}>
                  <Pregunta texto={PREGUNTA} zona="Sarco" hace="ahora" urgente respuestas={T > tLlega ? 1 : 0} solucionada={solucionada} nuevo={rango(T, tPub + 0.3, tPub + 0.7)} />
                  {respuesta > 0.01 ? (
                    <div style={{ margin: "0 16px 12px", background: OSCURO.superficie, border: `1px solid ${solucionada > 0.5 ? OSCURO.verde : OSCURO.linea}`, borderRadius: 16, padding: "13px 14px", opacity: respuesta }}>
                      <div style={{ fontSize: 12.5, fontWeight: 700, color: OSCURO.suave, marginBottom: 6 }}>Respuesta de Luis</div>
                      <div style={{ fontSize: 16, lineHeight: 1.3 }}>{RESPUESTA}</div>
                      {comentario > 0.01 ? (
                        <div style={{ marginTop: 10, paddingTop: 10, borderTop: `1px solid ${OSCURO.linea}`, fontSize: 14, color: OSCURO.suave, opacity: comentario }}>
                          <b style={{ color: OSCURO.texto }}>Ana:</b> ¿Cobra la visita?
                          <br />
                          <b style={{ color: OSCURO.texto }}>Luis:</b> Te dice el precio al llegar.
                        </div>
                      ) : null}
                      <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                        <div style={{ flex: 1 }}>
                          <Boton tipo="linea" ancho="100%" presionado={rango(T, tPide, tPide + 0.1) * (1 - rango(T, tPide + 0.15, tPide + 0.3))}>Pedir contacto</Boton>
                        </div>
                        <div style={{ flex: 1 }}>
                          <Boton ancho="100%" presionado={rango(T, tSirve, tSirve + 0.1) * (1 - rango(T, tSirve + 0.15, tSirve + 0.3))}>Me sirvió</Boton>
                        </div>
                      </div>
                      {caja > 0.01 ? (
                        <div style={{ marginTop: 12, background: "rgba(30,90,168,0.16)", border: `1px solid ${OSCURO.azul}`, borderRadius: 12, padding: "10px 12px", opacity: caja, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <div>
                            <div style={{ fontSize: 12, color: OSCURO.azulTexto, fontWeight: 700 }}>Contacto de Luis</div>
                            <div style={{ fontSize: 15 }}>luis.prueba@correo.com</div>
                          </div>
                          <div style={{ fontSize: 13, fontWeight: 700, color: OSCURO.azulTexto }}>Copiar</div>
                        </div>
                      ) : null}
                    </div>
                  ) : (
                    <div style={{ margin: "30px 16px 0", textAlign: "center", color: OSCURO.suave, fontSize: 14 }}>Esperando respuestas…</div>
                  )}
                  {respuesta < 0.01 || solucionada < 0.01 ? (
                    <div style={{ position: "absolute", left: 16, right: 16, top: 590, background: OSCURO.superficie, border: `1px solid ${OSCURO.linea}`, borderRadius: 16, padding: 14, opacity: 1 - respuesta * 0.4 }}>
                      <div style={{ fontFamily: TITULO, fontWeight: 500, fontSize: 16 }}>Pregúntale a tus grupos</div>
                      <div style={{ fontSize: 13, color: OSCURO.suave, margin: "3px 0 10px" }}>Comparte la pregunta con un toque.</div>
                      <Boton tipo="suave" ancho="100%">Compartir por WhatsApp</Boton>
                    </div>
                  ) : null}
                </div>
                {solucionada > 0.01 ? (
                  <div style={{ position: "absolute", left: 0, right: 0, top: 360 - solucionada * 60, textAlign: "center", opacity: 1 - rango(T, tSirve + 1.1, tSirve + 1.7), transform: `scale(${0.5 + solucionada})`, fontSize: 70 }}>
                    <Estrella tam={90} />
                  </div>
                ) : null}
                <Nav activa="alguien" />
              </>
            ) : null}
          </Pantalla>
        </Tema>
      );
      const refresca = rango(T, tRefresca, tRefresca + 0.5) * (1 - rango(T, tRefresca + 1.0, tRefresca + 1.2));
      const abierta = T >= tAbre + 0.2;
      const B = (
        <Tema>
          <Pantalla>
            <CabeceraFija yapitas={yapitasB} destello={destelloB} />
            {!abierta ? (
              <div style={{ paddingTop: 64 }}>
                {refresca > 0.01 ? (
                  <div style={{ textAlign: "center", height: 44 * refresca, overflow: "hidden", color: OSCURO.suave, fontSize: 14, paddingTop: 10 }}>↻ Actualizando…</div>
                ) : null}
                {T > tRefresca + 1 ? <Pregunta texto={PREGUNTA} zona="Sarco" hace="ahora" urgente respuestas={0} nuevo={rango(T, tRefresca + 1, tRefresca + 1.4)} /> : null}
                <Pregunta texto="¿Dónde compro leña para parrilla en Cala Cala?" zona="Cala Cala" hace="hace 1 h" respuestas={2} />
                <Pregunta texto="¿Alguien da clases de matemática para secundaria?" zona="Centro" hace="hace 3 h" respuestas={1} />
              </div>
            ) : (
              <div style={{ paddingTop: 66 }}>
                <Pregunta texto={PREGUNTA} zona="Sarco" hace="ahora" urgente respuestas={T > tEnvia ? 1 : 0} solucionada={solucionada} />
                {T < tEnvia + 0.3 ? (
                  <div style={{ margin: "0 16px" }}>
                    <Campo etiqueta="Tu respuesta" valor={escribir(RESPUESTA, T, tResp, 22)} cursor={T >= tResp && T < tEnvia} alto={96} />
                  </div>
                ) : (
                  <div style={{ margin: "0 16px 12px", background: OSCURO.superficie, border: `1px solid ${OSCURO.linea}`, borderRadius: 16, padding: "13px 14px" }}>
                    <div style={{ fontSize: 12.5, fontWeight: 700, color: OSCURO.suave, marginBottom: 6 }}>Tu respuesta</div>
                    <div style={{ fontSize: 16, lineHeight: 1.3 }}>{RESPUESTA}</div>
                    {T > tComenta + 1.3 ? <div style={{ marginTop: 10, paddingTop: 10, borderTop: `1px solid ${OSCURO.linea}`, fontSize: 14, color: OSCURO.suave }}><b style={{ color: OSCURO.texto }}>Ana:</b> ¿Cobra la visita?</div> : null}
                  </div>
                )}
              </div>
            )}
            {T < tEnvia + 0.3 && abierta ? (
              <div style={{ position: "absolute", left: 16, right: 16, bottom: 28 }}>
                <Boton ancho="100%" apagado={T < tResp + 1.5} presionado={rango(T, tEnvia, tEnvia + 0.1)}>Responder</Boton>
              </div>
            ) : null}
            {T >= tAviso && T < tAcepta + 0.6 ? (
              <Hoja alto={250} progreso={rango(T, tAviso, tAviso + 0.4) * (1 - rango(T, tAcepta + 0.3, tAcepta + 0.6))}>
                <div style={{ fontFamily: TITULO, fontWeight: 700, fontSize: 21, marginBottom: 6 }}>Ana quiere tu contacto</div>
                <div style={{ color: OSCURO.suave, fontSize: 14, marginBottom: 18 }}>Solo se comparte el dato que elegiste en Ajustes.</div>
                <div style={{ display: "flex", gap: 10 }}>
                  <div style={{ flex: 1 }}><Boton tipo="linea" ancho="100%">Ahora no</Boton></div>
                  <div style={{ flex: 1 }}><Boton ancho="100%" presionado={rango(T, tAcepta, tAcepta + 0.1)}>Aceptar</Boton></div>
                </div>
              </Hoja>
            ) : null}
            <Nav activa="alguien" />
          </Pantalla>
        </Tema>
      );
      return { A, B };
    },
  };
};

// ---------- Escena 6 · Stellar ----------
const Explorador: React.FC = () => (
  <div style={{ position: "absolute", inset: 0, background: "#0F1115", color: "#E6E8EE", fontFamily: TEXTO }}>
    <div style={{ height: 56, borderBottom: "1px solid #272B34", display: "flex", alignItems: "center", padding: "0 16px", gap: 8, fontWeight: 700 }}>
      🔎 Explorador · Red de pruebas
    </div>
    <div style={{ padding: 16 }}>
      <div style={{ fontSize: 13, color: "#8B93A5" }}>Operación de pago</div>
      <div style={{ fontFamily: TITULO, fontSize: 30, fontWeight: 700, margin: "6px 0 16px" }}>5 YAPITA</div>
      {[
        ["Estado", "Exitosa"],
        ["De", "GBQ2…7XHA"],
        ["Para", "GCM4…Q9LP"],
        ["Activo", "YAPITA"],
        ["Memo", "bs:r4f2"],
        ["Red", "Testnet"],
      ].map(([k, v]) => (
        <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "11px 0", borderBottom: "1px solid #272B34", fontSize: 15 }}>
          <span style={{ color: "#8B93A5" }}>{k}</span>
          <span style={{ fontWeight: 600, color: k === "Estado" ? "#4ADE80" : "#E6E8EE" }}>{v}</span>
        </div>
      ))}
    </div>
  </div>
);

const stellarUI = (L: Linea[]): EscenaUI => {
  const tMov = 1.0;
  const tLink = L[0].t + 6.0;
  const tVuelve = L[0].t + 9.4;
  const a = L[1].t;
  return {
    toques: [
      { cel: "U", t: tMov, x: 180, y: 258 },
      { cel: "U", t: tLink, x: 270, y: 330 },
    ],
    vista: (T) => {
      const enMov = T >= tMov + 0.25 && T < a - 0.2;
      const explorador = T >= tLink + 0.3 && T < tVuelve;
      return {
        U: (
          <Tema>
            <Pantalla>
              <CabeceraFija yapitas={10} />
              {!enMov && T < a - 0.2 ? (
                <div style={{ paddingTop: 66 }}>
                  <div style={{ padding: "16px", display: "flex", gap: 14, alignItems: "center" }}>
                    <div style={{ width: 62, height: 62, borderRadius: 99, background: "linear-gradient(135deg,#C2185B,#F28C28)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: TITULO, fontSize: 28, fontWeight: 700 }}>L</div>
                    <div>
                      <div style={{ fontFamily: TITULO, fontSize: 24, fontWeight: 500 }}>Luis</div>
                      <div style={{ color: OSCURO.suave, fontSize: 14 }}>Cochabamba · Sarco</div>
                    </div>
                  </div>
                  <Fila titulo="Mi actividad" />
                  <Fila titulo="Avisos" />
                  <Fila titulo="Movimientos" detalle="Tus yapitas, una por una" />
                  <Fila titulo="Ajustes" />
                </div>
              ) : null}
              {enMov ? (
                <div style={{ paddingTop: 66 }}>
                  <div style={{ padding: "14px 16px 6px", fontFamily: TITULO, fontSize: 24, fontWeight: 700 }}>Movimientos</div>
                  <div style={{ margin: "6px 16px 14px", background: "rgba(30,90,168,0.16)", border: `1px solid ${OSCURO.azul}`, color: OSCURO.azulTexto, borderRadius: 12, padding: "9px 12px", fontSize: 13.5, fontWeight: 600 }}>
                    Red de pruebas, sin dinero real
                  </div>
                  <div style={{ margin: "0 16px", background: OSCURO.superficie, border: `1px solid ${OSCURO.linea}`, borderRadius: 16, padding: "14px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div style={{ fontWeight: 600, fontSize: 15.5 }}>Tu respuesta le sirvió a Ana</div>
                      <div style={{ color: OSCURO.naranja, fontWeight: 700, fontSize: 17 }}>+5 ★</div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 10 }}>
                      <Chip color={OSCURO.verde} relleno>Confirmado</Chip>
                      <span style={{ fontSize: 12.5, color: OSCURO.suave }}>7f3a…c91e</span>
                    </div>
                    <div style={{ marginTop: 10, fontSize: 13.5, fontWeight: 700, color: OSCURO.azulTexto }}>Ver en el explorador ↗</div>
                  </div>
                </div>
              ) : null}
              {T >= a - 0.2 ? (
                <div style={{ paddingTop: 66 }}>
                  <div style={{ padding: "14px 16px 6px", fontFamily: TITULO, fontSize: 24, fontWeight: 700 }}>Yo</div>
                  <div style={{ margin: "6px 16px 14px", background: "rgba(30,90,168,0.16)", border: `1px solid ${OSCURO.azul}`, color: OSCURO.azulTexto, borderRadius: 12, padding: "9px 12px", fontSize: 13.5, fontWeight: 600 }}>
                    Red de pruebas, sin dinero real
                  </div>
                  <div style={{ margin: "0 16px", background: OSCURO.superficie, border: `1px solid ${OSCURO.linea}`, borderRadius: 16, padding: "14px" }}>
                    <div style={{ fontSize: 12.5, fontWeight: 700, color: OSCURO.suave }}>Mi cuenta de prueba</div>
                    <div style={{ fontSize: 18, fontFamily: TEXTO, fontWeight: 600, margin: "6px 0 12px" }}>GCM4…Q9LP</div>
                    <Boton tipo="suave" ancho="100%">Copiar</Boton>
                  </div>
                </div>
              ) : null}
              {explorador ? <Explorador /> : null}
              {!explorador ? <Nav activa="yo" /> : null}
            </Pantalla>
          </Tema>
        ),
      };
    },
  };
};

// ---------- Escena 7 · para todo público ----------
const Rejilla: React.FC<{ columnas: number }> = ({ columnas }) => {
  const p = useTema();
  const items = [...FEED, ...SEMANA, FEED[1], SEMANA[1]];
  return (
    <div style={{ position: "absolute", inset: 0, background: p.fondo, fontFamily: TEXTO, color: p.texto }}>
      <div style={{ height: 60, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 28px", borderBottom: `1px solid ${p.linea}` }}>
        <div style={{ fontFamily: TITULO, fontWeight: 700, fontSize: 26 }}>Bolivia<span style={{ color: p.fucsia }}>Sabe</span></div>
        <div style={{ display: "flex", gap: 24, fontWeight: 600, color: p.suave }}><span style={{ color: p.texto }}>Hoy</span><span>¿Alguien sabe?</span><span>Yo</span></div>
      </div>
      <Franja />
      <div style={{ display: "grid", gridTemplateColumns: `repeat(${columnas}, 1fr)`, gap: 0, padding: "14px 10px", transform: "scale(1)" }}>
        {items.map((l, i) => (
          <div key={i} style={{ marginBottom: -6 }}>
            <Letrero {...l} alto={120} />
          </div>
        ))}
      </div>
    </div>
  );
};

const publicoUI = (L: Linea[]): EscenaUI => {
  const a = L[0].t;
  const tClaro = a + 1.7;
  const tLetra = L[1].t + 0.8;
  const tPc = L[2].t - 0.3;
  return {
    toques: [
      { cel: "U", t: tClaro, x: 262, y: 262 },
      { cel: "U", t: a + 3.2, x: 180, y: 712 },
    ],
    vista: (T) => {
      const claro = T > tClaro + 0.1;
      const esc = T > tLetra ? 1.3 : 1;
      const pc = T >= tPc;
      const p = claro ? CLARO : OSCURO;
      return {
        U: pc ? null : (
          <Tema claro={claro}>
            <Pantalla>
              <CabeceraFija yapitas={10} />
              <div style={{ paddingTop: 66 }}>
                <div style={{ padding: "14px 16px 6px", fontFamily: TITULO, fontSize: 24, fontWeight: 700 }}>Ajustes</div>
                <div style={{ padding: "12px 16px" }}>
                  <div style={{ fontSize: 12.5, fontWeight: 700, color: p.suave, marginBottom: 8 }}>Tema</div>
                  <div style={{ display: "flex", border: `1px solid ${p.linea}`, borderRadius: 999, padding: 3 }}>
                    {["Oscuro", "Claro", "Sistema"].map((n) => {
                      const sel = (n === "Claro") === claro && n !== "Sistema";
                      return (
                        <div key={n} style={{ flex: 1, textAlign: "center", padding: "9px 0", borderRadius: 999, fontWeight: 700, fontSize: 14.5, background: sel ? p.fucsia : "transparent", color: sel ? "#fff" : p.suave }}>{n}</div>
                      );
                    })}
                  </div>
                </div>
                <div style={{ padding: "8px 16px" }}>
                  <div style={{ fontSize: 12.5, fontWeight: 700, color: p.suave, marginBottom: 8 }}>Tamaño de letra · {Math.round(esc * 100)} %</div>
                  <div style={{ background: p.superficie, border: `1px solid ${p.linea}`, borderRadius: 14, padding: "12px 14px", fontSize: 15 * esc, lineHeight: 1.3 }}>
                    Así se ve el texto con tu tamaño de letra.
                  </div>
                </div>
                <div style={{ padding: "18px 16px" }}>
                  <Boton tipo="suave" ancho="100%">Instalar la app</Boton>
                </div>
              </div>
              <Nav activa="yo" />
            </Pantalla>
          </Tema>
        ),
        pc: pc ? (
          <Tema claro>
            <Rejilla columnas={4} />
          </Tema>
        ) : null,
      };
    },
  };
};

// ---------- Fábrica ----------
export const UI_POR_ESCENA: Record<string, (L: Linea[]) => EscenaUI> = {
  "1": camaraUI,
  "2": problemaUI,
  "3": hoyUI,
  "4": subirUI,
  "5": alguienUI,
  "6": stellarUI,
  "7": publicoUI,
  "8": () => ({ toques: [], vista: () => ({}) }),
};

export const interfazDe = (e: Escena): EscenaUI => UI_POR_ESCENA[e.id](e.lineas);

export { AGUAYO };
