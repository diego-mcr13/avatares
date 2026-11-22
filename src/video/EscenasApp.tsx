// Escenas 3 a 8: la app funcionando (contrato §5). Horas en segundos desde el inicio de cada escena.
import React from "react";
import { Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import {
  Anillo,
  Avatares,
  Burbuja,
  CEL,
  FUERA_DER,
  Fondo,
  Rotulo,
  Sonidos,
  Subtitulos,
  Telefono,
  Voces,
  armarAvatares,
  entrar,
  junto,
  tramo,
} from "./comunes";
import { CARA } from "./caras";
import { C, FPS, LETRA } from "./estilo";

const IZQ_FUERA: [number, number] = [-260, 900];
const DER_CEL = 960 + CEL.ancho / 2 + 28; // borde derecho del celular + margen
const IZQ_CEL = 960 - CEL.ancho / 2 - 28;

const RotuloCuenta: React.FC<{ texto: string; lado?: "izq" | "der"; cx?: number; t?: number }> = ({ texto, lado = "der", cx = 960, t = 0.2 }) => (
  <Rotulo
    texto={texto}
    x={lado === "der" ? cx + CEL.ancho / 2 + 28 : cx - CEL.ancho / 2 - 28}
    y={70}
    t={t}
    alinear={lado === "der" ? "izq" : "der"}
    tam={24}
    color={C.apagado}
  />
);

// ---------- Escena 3 · Sin cuenta ----------
const av3 = armarAvatares("3", (g) => {
  g.empieza("aldrin", IZQ_FUERA);
  g.empieza("yaeko", FUERA_DER);
  g.va("aldrin", 0.9, junto("izq", 0.12), "senalarArriba", CARA.atento);
  g.va("aldrin", 3.2, junto("izq", 0.45), "senalar", CARA.feliz);
  g.va("aldrin", 6.6, [250, 930], "esperar", CARA.atento);
  g.va("yaeko", 6.7, junto("der", 0.23), "senalarArriba", CARA.atento);
  g.va("yaeko", 10.4, junto("der", 0.55), "senalarIzq", CARA.atento);
  g.va("yaeko", 11.8, null, "sorpresa", CARA.sorpresa);
  g.va("yaeko", 12.5, null, "celebrar", CARA.feliz);
});

export const Escena3: React.FC = () => (
  <>
    <Fondo />
    <Telefono
      tramos={[
        { t0: 0, t1: 6.2, clip: "e3-hoy", desde: 0, vel: 0.68 },
        { t0: 6.2, t1: 13, clip: "e3-hoy", desde: 4.2, vel: 1.35 },
      ]}
      lupas={[
        { t: 6.7, s: 1.35, u: 0.5, v: 0.23 },
        { t: 9.4, s: 1.35, u: 0.5, v: 0.23 },
        { t: 10.5, s: 1.35, u: 0.5, v: 0.62 },
        { t: 13, s: 1.35, u: 0.5, v: 0.62 },
      ]}
    />
    <Rotulo texto="boliviasabe.vercel.app" x={IZQ_CEL} y={70} t={0.4} alinear="der" color={C.fucsiaTexto} tam={30} />
    <Rotulo texto="Sin cuenta · sin registrarte" x={IZQ_CEL} y={140} t={3.4} alinear="der" tam={24} />
    <Rotulo texto="«almuerzo» → 2 letreros" x={DER_CEL} y={500} t={10.4} tam={26} color={C.naranja} />
    <Avatares escena={av3} />
    <Subtitulos id="3" />
    <Voces id="3" />
    <Sonidos lista={[["pop", 0.4], ["pop", 3.4], ["blip", 6.25], ["pop", 10.4], ["ding", 11.9]]} />
  </>
);

// ---------- Escena 4 · Crear la cuenta y +5 ----------
const av4 = armarAvatares("4", (g) => {
  g.empieza("diego", IZQ_FUERA);
  g.empieza("aldrin", FUERA_DER);
  g.va("diego", 0.6, junto("izq", 0.8), "tocar", CARA.atento);
  g.va("diego", 2.0, null, "hablar", CARA.atento);
  g.va("diego", 5.0, junto("izq", 0.45), "senalar", CARA.atento);
  g.va("diego", 7.4, [300, 930], "esperar", CARA.atento);
  g.va("diego", 10.3, null, "aplaudir", CARA.feliz);
  g.va("aldrin", 7.8, junto("der", 0.1), "senalarArriba", CARA.feliz);
  g.va("aldrin", 10.3, null, "aplaudir", CARA.feliz);
  g.va("aldrin", 12.6, null, "celebrar", CARA.feliz);
});

export const Escena4: React.FC = () => (
  <>
    <Fondo />
    <Telefono
      tramos={[
        { t0: 0, t1: 1.7, clip: "e4-registro", desde: 0.5, vel: 1.5 },
        { t0: 1.7, t1: 3.0, clip: "e4-registro", desde: 18.5, vel: 2 },
        { t0: 3.0, t1: 7.0, clip: "e4-registro", desde: 24.2, vel: 2.08 },
        { t0: 7.0, t1: 7.8, clip: "e4-registro", desde: 54.6, vel: 1 },
        { t0: 7.8, t1: 15, img: "f-e4-saldo.png" },
      ]}
      lupas={[
        { t: 1.2, s: 1.45, u: 0.5, v: 0.8 },
        { t: 2.4, s: 1.4, u: 0.5, v: 0.78 },
        { t: 3.4, s: 1, u: 0.5, v: 0.5 },
        { t: 5.2, s: 1.6, u: 0.35, v: 0.45 },
        { t: 6.6, s: 1, u: 0.5, v: 0.5 },
        { t: 8.4, s: 1.5, u: 0.85, v: 0.05 },
        { t: 15, s: 1.5, u: 0.85, v: 0.05 },
      ]}
    />
    <RotuloCuenta texto="Camila · cuenta nueva de demo" />
    <Rotulo texto="Zona: Queru Queru" x={IZQ_CEL} y={430} t={5.4} hasta={7.4} alinear="der" tam={26} />
    <Rotulo texto="Cuenta en Stellar lista" x={DER_CEL} y={330} t={9.2} tam={26} color={C.tinta} />
    <Burbuja texto="+5 yapitas · bienvenida" x={DER_CEL + 230} y={230} t={10.3} dur={2.6} />
    <Avatares escena={av4} />
    <Subtitulos id="4" />
    <Voces id="4" />
    <Sonidos lista={[["blip", 0.5], ["blip", 1.75], ["blip", 5.5], ["blip", 6.7], ["pop", 9.2], ["campanitas", 10.3]]} />
  </>
);

// ---------- Escena 5 · Preguntar urgente ----------
const av5 = armarAvatares("5", (g) => {
  g.empieza("yaeko", IZQ_FUERA);
  g.empieza("aldrin", FUERA_DER);
  g.va("yaeko", 0.4, junto("izq", 0.95), "senalarAbajo", CARA.preocupado);
  g.va("yaeko", 1.3, null, "tocar", CARA.preocupado);
  g.va("yaeko", 2.3, [470, 930], "escribir", CARA.preocupado);
  g.va("yaeko", 5.3, [230, 930], "esperar", CARA.atento);
  g.va("aldrin", 5.4, junto("der", 0.69), "senalarIzq", CARA.atento);
  g.va("aldrin", 7.7, junto("der", 0.95), "tocar", CARA.atento);
  g.va("aldrin", 8.3, null, "celebrar", CARA.feliz);
  g.va("aldrin", 10.6, null, "esperar", CARA.feliz);
});

export const Escena5: React.FC = () => (
  <>
    <Fondo />
    <Telefono
      tramos={[
        { t0: 0, t1: 2.0, clip: "e5-pregunta", desde: 0.5, vel: 2.75 },
        { t0: 2.0, t1: 5.1, clip: "e5-pregunta", desde: 8.0, vel: 8.3 },
        { t0: 5.1, t1: 8.6, clip: "e5-pregunta", desde: 33.8, vel: 0.91 },
        { t0: 8.6, t1: 9.6, clip: "e5-pregunta", desde: 47.5, vel: 1.4 },
        { t0: 9.6, t1: 14, img: "f-e5-detalle.png" },
      ]}
      lupas={[
        { t: 2.6, s: 1.5, u: 0.5, v: 0.09 },
        { t: 4.6, s: 1.5, u: 0.5, v: 0.09 },
        { t: 5.2, s: 1.7, u: 0.28, v: 0.69 },
        { t: 7.6, s: 1.6, u: 0.5, v: 0.955 },
        { t: 9.0, s: 1, u: 0.5, v: 0.5 },
        { t: 10.4, s: 1.45, u: 0.3, v: 0.4 },
        { t: 14, s: 1.45, u: 0.3, v: 0.4 },
      ]}
    />
    <RotuloCuenta texto="Camila · cuenta nueva de demo" />
    <Rotulo texto="Urgente: sale primero 24 h" x={DER_CEL} y={560} t={5.6} hasta={9.4} tam={26} color={C.coral} />
    <Burbuja texto="−5 yapitas" x={DER_CEL + 170} y={330} t={8.05} color={C.coral} dur={2.2} />
    <Rotulo texto="Publicada en Queru Queru" x={DER_CEL} y={420} t={10.2} tam={26} color={C.tinta} />
    <Avatares escena={av5} />
    <Subtitulos id="5" />
    <Voces id="5" />
    <Sonidos lista={[["blip", 0.6], ["blip", 1.6], ["blip", 5.1], ["pop", 5.6], ["blip", 8.05], ["pop", 10.2]]} />
  </>
);

// ---------- Escena 6 · Otra cuenta responde (dos celulares) ----------
const A = 650;
const B = 1270;
const av6 = armarAvatares("6", (g) => {
  g.empieza("diego", IZQ_FUERA);
  g.empieza("yaeko", FUERA_DER);
  g.va("diego", 0.4, [300, 930], "senalarArriba", CARA.atento);
  g.va("diego", 1.8, null, "senalar", CARA.atento);
  g.va("diego", 3.9, null, "hablar", CARA.atento);
  g.va("diego", 7.3, null, "aplaudir", CARA.feliz);
  g.va("yaeko", 6.9, [1630, 930], "sorpresa", CARA.sorpresa);
  g.va("yaeko", 8.7, null, "senalarIzq", CARA.feliz);
  g.va("yaeko", 11.0, null, "celebrar", CARA.feliz);
});

// Tapa el saldo de Ana en su encabezado (contrato §7)
const TapaSaldo: React.FC<{ hasta: number }> = ({ hasta }) => {
  const frame = useCurrentFrame();
  if (frame / FPS > hasta) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: 342,
        top: 14,
        width: 58,
        height: 36,
        borderRadius: 999,
        background: "#221c1a",
        border: "1px solid rgba(243,237,232,0.14)",
        color: C.naranja,
        fontSize: 18,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: LETRA,
      }}
    >
      ★
    </div>
  );
};

export const Escena6: React.FC = () => (
  <>
    <Fondo brillo={[960, 500]} />
    <Telefono
      cx={A}
      tramos={[
        { t0: 0, t1: 3.9, clip: "e6-ana", desde: 1.5, vel: 2.28 },
        { t0: 3.9, t1: 6.3, clip: "e6-ana", desde: 10.4, vel: 9.33 },
        { t0: 6.3, t1: 7.0, clip: "e6-ana", desde: 32.8, vel: 1 },
        { t0: 7.0, t1: 13, img: "f-e6-ana.png" },
      ]}
      encima={
        <>
          <TapaSaldo hasta={2.3} />
          <Anillo x={296} y={4} w={60} h={56} t0={0.2} t1={1.5} radio={30} />
          <Anillo x={8} y={385} w={389} h={120} t0={1.5} t1={2.7} />
        </>
      }
    />
    <Telefono
      cx={B}
      tramos={[
        { t0: 0, t1: 3.9, clip: "e6-camila", desde: 1.5, vel: 2.28 },
        { t0: 3.9, t1: 6.3, clip: "e6-camila", desde: 10.4, vel: 9.33 },
        { t0: 6.3, t1: 7.0, clip: "e6-camila", desde: 32.8, vel: 1 },
        { t0: 7.0, t1: 13, img: "f-e6-camila.png" },
      ]}
      encima={<Anillo x={12} y={408} w={381} h={220} t0={7.0} t1={12.6} color={C.verde} />}
    />
    <Rotulo texto="Ana · cuenta de ejemplo" x={A - CEL.ancho / 2 - 24} y={70} t={0.2} alinear="der" tam={24} color={C.apagado} />
    <Rotulo texto="Camila · cuenta nueva de demo" x={B + CEL.ancho / 2 + 24} y={70} t={0.2} tam={24} color={C.apagado} />
    <Rotulo texto="Aviso: pregunta urgente en su zona" x={A - CEL.ancho / 2 - 24} y={140} t={1.4} hasta={4.2} alinear="der" tam={22} color={C.coral} />
    <Rotulo texto="Sin recargar · 0,7 s" x={B + CEL.ancho / 2 + 24} y={440} t={7.1} tam={26} color={C.verde} />
    <Avatares escena={av6} />
    <Subtitulos id="6" />
    <Voces id="6" />
    <Sonidos lista={[["blip", 0.5], ["blip", 2.1], ["pop", 1.4], ["ding", 7.0], ["pop", 7.1]]} />
  </>
);

// ---------- Escena 7 · «Me sirvió» ----------
const av7 = armarAvatares("7", (g) => {
  g.empieza("aldrin", IZQ_FUERA);
  g.empieza("diego", FUERA_DER);
  g.va("aldrin", 0.5, junto("izq", 0.86), "senalar", CARA.atento);
  g.va("aldrin", 1.8, null, "tocar", CARA.atento);
  g.va("aldrin", 3.9, null, "celebrar", CARA.feliz);
  g.va("aldrin", 5.4, null, "aplaudir", CARA.feliz);
  g.va("diego", 6.5, junto("der", 0.55), "celebrar", CARA.feliz);
});

export const Escena7: React.FC = () => (
  <>
    <Fondo />
    <Telefono
      tramos={[
        { t0: 0, t1: 4.5, clip: "e7-camila", desde: 0, vel: 0.8 },
        { t0: 4.5, t1: 10, img: "f-e7-camila.png" },
      ]}
      lupas={[
        { t: 1.3, s: 1.7, u: 0.25, v: 0.86 },
        { t: 2.4, s: 1.7, u: 0.25, v: 0.86 },
        { t: 3.9, s: 1.4, u: 0.35, v: 0.2 },
        { t: 5.4, s: 1.5, u: 0.5, v: 0.55 },
        { t: 10, s: 1.5, u: 0.5, v: 0.55 },
      ]}
    />
    <RotuloCuenta texto="Camila · cuenta nueva de demo" />
    <Rotulo texto="Solo quien preguntó" x={IZQ_CEL} y={300} t={0.8} hasta={4.4} alinear="der" tam={26} />
    <Rotulo texto="Solucionada" x={DER_CEL} y={240} t={3.8} hasta={6.2} tam={28} color={C.verde} />
    <Burbuja texto="+5 yapitas para Ana" x={DER_CEL + 220} y={560} t={7.5} dur={2.4} />
    <Avatares escena={av7} />
    <Subtitulos id="7" />
    <Voces id="7" />
    <Sonidos lista={[["blip", 1.9], ["ding", 3.75], ["pop", 3.8], ["campanitas", 7.5]]} />
  </>
);

// ---------- Escena 8 · El pago en Stellar ----------
const av8 = armarAvatares("8", (g) => {
  g.empieza("diego", IZQ_FUERA);
  g.empieza("aldrin", FUERA_DER);
  g.empieza("yaeko", IZQ_FUERA);
  g.va("diego", 0.5, junto("izq", 0.2), "senalarArriba", CARA.atento);
  g.va("diego", 2.6, junto("izq", 0.25), "senalar", CARA.atento);
  g.va("diego", 5.0, null, "senalarArriba", CARA.atento);
  g.va("diego", 6.9, [200, 930], "esperar", CARA.atento);
  g.va("diego", 11.4, IZQ_FUERA, "esperar", CARA.atento);
  g.va("aldrin", 7.2, [1745, 930], "senalarIzq", CARA.sorpresa);
  g.va("aldrin", 9.4, null, "triunfo", CARA.orgullo);
  g.va("aldrin", 11.2, null, "esperar", CARA.orgullo);
  g.va("yaeko", 12.2, [230, 930], "hablar", CARA.atento);
});

// Memo: «YXl1ZGE6NTU=» se transforma letra a letra en «ayuda:55»
const MEMO_B64 = "YXl1ZGE6NTU=";
const MEMO = "ayuda:55";
const LETRAS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789:";
const memoEn = (T: number) => {
  const q = tramo(T, 8.0, 9.2);
  if (q <= 0) return MEMO_B64;
  if (q >= 1) return MEMO;
  const n = Math.round(interpolate(q, [0, 1], [MEMO_B64.length, MEMO.length]));
  const listas = Math.floor(q * MEMO.length);
  let s = "";
  for (let i = 0; i < n; i++) {
    if (i < listas) s += MEMO[i] ?? "";
    else s += LETRAS[(i * 7 + Math.floor(T * 30)) % LETRAS.length];
  }
  return s;
};

const TarjetaExplorador: React.FC = () => {
  const frame = useCurrentFrame();
  const T = frame / FPS;
  const e = entrar(frame, 6.9, 0.5);
  if (T < 6.9) return null;
  const listo = T >= 9.2;
  const franja = entrar(frame, 12.1, 0.45);
  return (
    <div style={{ position: "absolute", left: 880, top: 200, width: 720, opacity: e, transform: `translateX(${(1 - e) * 80}px)` }}>
      <div style={{ fontFamily: LETRA, color: C.apagado, fontSize: 24, marginBottom: 12 }}>stellar.expert · registro público</div>
      <div style={{ background: "#1c3a46", borderRadius: 24, overflow: "hidden", boxShadow: "0 24px 60px rgba(0,0,0,0.5)" }}>
        <Img src={staticFile("video/img/explorador-pago.png")} style={{ width: 720, display: "block" }} />
        <div style={{ padding: "22px 34px 28px", borderTop: "1px solid rgba(255,255,255,0.1)", fontFamily: LETRA }}>
          <div style={{ fontSize: 30, color: "#b9c7cc" }}>
            Memo (TEXT):{" "}
            <span
              style={{
                fontFamily: "ui-monospace, Menlo, monospace",
                fontSize: 36,
                color: listo ? C.naranja : "#fff",
                fontWeight: listo ? 700 : 400,
              }}
            >
              {memoEn(T)}
            </span>
          </div>
          <div style={{ fontSize: 26, color: C.tinta, marginTop: 14, opacity: tramo(T, 9.3, 9.7) }}>
            = premio por la respuesta n.º 55
          </div>
        </div>
      </div>
      <div style={{ fontFamily: LETRA, color: C.apagado, fontSize: 20, marginTop: 12, opacity: tramo(T, 8.1, 8.5) }}>
        stellar.expert muestra el memo codificado; aquí, traducido
      </div>
      <div
        style={{
          marginTop: 22,
          background: C.azul,
          color: "#fff",
          borderRadius: 18,
          padding: "16px 24px",
          fontFamily: LETRA,
          fontWeight: 600,
          fontSize: 26,
          opacity: franja,
          transform: `translateY(${(1 - franja) * 16}px)`,
        }}
      >
        Red de pruebas · sin dinero real · hoy la app custodia las cuentas
      </div>
    </div>
  );
};

// Tapa las filas de comisión (XLM) en la página del explorador
const TapaComision: React.FC<{ desde: number }> = ({ desde }) => {
  const frame = useCurrentFrame();
  if (frame / FPS < desde) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: 0.515 * CEL.alto,
        height: 0.075 * CEL.alto,
        backdropFilter: "blur(9px)",
        background: "rgba(28,58,70,0.75)",
      }}
    />
  );
};

export const Escena8: React.FC = () => {
  const frame = useCurrentFrame();
  const T = frame / FPS;
  const cx = interpolate(tramo(T, 6.6, 7.3), [0, 1], [960, 560]);
  return (
    <>
      <Fondo brillo={[cx, 500]} />
      <Telefono
        cx={cx}
        tramos={[
          { t0: 0, t1: 2.0, clip: "e7-ana", desde: 0.5, vel: 3.0 },
          { t0: 2.0, t1: 4.6, img: "e7-movimientos.png" },
          { t0: 4.6, t1: 5.0, clip: "e7-ana", desde: 8.1, vel: 2.25 },
          { t0: 5.0, t1: 18, img: "e7-explorador.png" },
        ]}
        lupas={[
          { t: 2.6, s: 1.3, u: 0.6, v: 0.2 },
          { t: 4.4, s: 1.3, u: 0.6, v: 0.2 },
          { t: 5.2, s: 1, u: 0.5, v: 0.5 },
        ]}
        encima={<TapaComision desde={5.0} />}
      />
      <Rotulo texto="Ana · cuenta de ejemplo" x={96} y={70} t={0.2} tam={24} color={C.apagado} />
      <Rotulo texto="+5 yapitas · Confirmado" x={DER_CEL} y={300} t={2.7} hasta={6.4} tam={26} color={C.verde} />
      <Rotulo texto="Registro público: stellar.expert" x={DER_CEL} y={380} t={5.0} hasta={6.6} tam={24} />
      <TarjetaExplorador />
      <Avatares escena={av8} />
      <Subtitulos id="8" />
      <Voces id="8" />
      <Sonidos lista={[["blip", 0.5], ["pop", 2.7], ["blip", 4.7], ["pop", 6.9], ["ding", 9.2], ["pop", 12.1]]} />
    </>
  );
};
