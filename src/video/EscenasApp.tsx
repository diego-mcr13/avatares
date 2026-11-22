// Escenas 3 a 8: la app funcionando (contrato §5). Horas en segundos desde el inicio de cada escena.
import React from "react";
import { Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import {
  Anillo,
  Avatares,
  Burbuja,
  CEL,
  Confeti,
  SaleDelCel,
  Fondo,
  PrimerPlano,
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

// Escribe en el buscador de Hoy letra por letra (tapa el texto de ejemplo de la captura)
const Tipeo: React.FC<{ texto: string; t0: number; t1: number; hasta: number }> = ({ texto, t0, t1, hasta }) => {
  const frame = useCurrentFrame();
  const T = frame / FPS;
  if (T < t0 - 0.1 || T >= hasta) return null;
  const n = Math.round(texto.length * tramo(T, t0, t1));
  const cursor = Math.floor(T * 2.4) % 2 === 0;
  return (
    <div style={{ position: "absolute", left: 18, top: 182, width: 370, height: 52, borderRadius: 26, border: `2px solid ${C.fucsia}`, background: "#2a2421", display: "flex", alignItems: "center", paddingLeft: 52, fontFamily: LETRA, fontSize: 19, color: C.tinta }}>
      <svg width={18} height={18} viewBox="0 0 24 24" style={{ position: "absolute", left: 20 }}>
        <circle cx={10} cy={10} r={7} stroke="#B0A59C" strokeWidth={2.4} fill="none" />
        <path d="M15 15 L21 21" stroke="#B0A59C" strokeWidth={2.4} />
      </svg>
      {texto.slice(0, n)}
      <span style={{ opacity: cursor ? 1 : 0, color: C.fucsia, marginLeft: 1 }}>|</span>
    </div>
  );
};

// ---------- Escena 3 · Sin cuenta ----------
const av3 = armarAvatares("3", (g) => {
  g.entra("aldrin", 0.1, junto("izq", 0.1), "salto", "senalarArriba", CARA.atento);
  g.va("aldrin", 3.2, null, "senalar", CARA.feliz);
  g.va("aldrin", 7.6, [330, 930], "esperar", CARA.atento);
  g.entra("yaeko", 6.0, junto("der", 0.2), "puf", "senalarIzq", CARA.atento);
  // Saca la laptop y escribe «almuerzo» (se ve escribirse en la app)
  g.va("yaeko", 8.2, null, "escribir", CARA.atento);
  g.va("yaeko", 10.1, null, "senalarIzq", CARA.feliz);
  g.va("yaeko", 11.8, null, "sorpresa", CARA.sorpresa);
  g.va("yaeko", 12.4, null, "celebrar", CARA.feliz);
});

export const Escena3: React.FC = () => (
  <>
    <Fondo />
    <>
      <Telefono
        tramos={[
          { t0: 0, t1: 10.0, img: "tomas/c01-hoy.png" },
          { t0: 10.0, t1: 11.4, img: "tomas/c02-busqueda.png" },
          { t0: 11.4, t1: 13, img: "tomas/c02b-resultados.png" },
        ]}
        toques={[{ t: 8.3, x: 180, y: 206 }]}
        encima={<Tipeo texto="almuerzo" t0={8.6} t1={9.8} hasta={10.0} />}
      />
      <Rotulo texto="boliviasabe.vercel.app" x={IZQ_CEL} y={70} t={0.4} alinear="der" color={C.fucsiaTexto} tam={30} />
      <Rotulo texto="Sin cuenta · sin registrarte" x={IZQ_CEL} y={140} t={3.4} alinear="der" tam={24} />
      <Rotulo texto="«almuerzo» → 2 letreros" x={DER_CEL} y={140} t={10.4} tam={26} color={C.naranja} />
      <Avatares escena={av3} />
    </>
    <Subtitulos id="3" />
    <Voces id="3" />
    <Sonidos lista={[["pop", 0.4], ["pop", 3.4], ["blip", 8.3], ["pop", 6.0], ["pop", 10.4], ["ding", 11.9]]} />
  </>
);

// ---------- Escena 4 · Crear la cuenta y +5 ----------
const av4 = armarAvatares("4", (g) => {
  g.entra("diego", 0.0, junto("izq", 0.8), "salto", "esperar", CARA.atento);
  g.usaCelular("diego", 0.6, 9.9, CARA.atento);
  g.va("diego", 10.1, null, "celebrar", CARA.feliz);
  g.entra("aldrin", 7.3, junto("der", 0.1), "puf", "senalarArriba", CARA.feliz);
  g.va("aldrin", 10.3, null, "aplaudir", CARA.feliz);
  g.va("aldrin", 12.6, null, "celebrar", CARA.feliz);
});

export const Escena4: React.FC = () => (
  <>
    <Fondo />
    <>
      <Telefono
        tramos={[
          { t0: 0, t1: 1.0, img: "tomas/c03-hoy-sin-sesion.png" },
          { t0: 1.0, t1: 2.3, img: "tomas/c04-hoja-entrar.png" },
          { t0: 2.3, t1: 3.4, img: "tomas/c05-correo.png" },
          { t0: 3.4, t1: 7.0, img: "tomas/c06-tu-barrio.png" },
          { t0: 7.0, t1: 15, img: "tomas/c07-hoy-saldo-5.png" },
        ]}
        toques={[
          { t: 0.75, x: 294, y: 31 },
          { t: 2.0, x: 180, y: 717 },
          { t: 3.1, x: 180, y: 661 },
          { t: 4.9, x: 74, y: 417 },
          { t: 6.7, x: 180, y: 764 },
        ]}
        miras={[
          { t0: 4.5, t1: 6.4, u: 0.22, v: 0.52, m: 1.8 },
          { t0: 8.2, t1: 10.1, u: 0.88, v: 0.045, m: 2.4 },
          { t0: 12.9, t1: 14.8, u: 0.88, v: 0.045, m: 2.4 },
        ]}
      />
      <RotuloCuenta texto="Camila · cuenta nueva de demo" />
      <Rotulo texto="Zona: Queru Queru" x={IZQ_CEL} y={430} t={5.4} hasta={7.4} alinear="der" tam={26} />
      <Rotulo texto="Cuenta en Stellar lista" x={DER_CEL + 60} y={330} t={9.2} tam={26} color={C.tinta} />
      <Burbuja texto="+5 yapitas · bienvenida" x={DER_CEL + 290} y={250} t={10.3} dur={2.6} />
      <Avatares escena={av4} />
    </>
    <PrimerPlano
      escena={av4}
      quien="diego"
      t0={10.2}
      t1={12.8}
      solo
      junto={
        <>
          <Burbuja texto="+5 yapitas de bienvenida" x={960} y={200} t={10.35} dur={2.4} tam={52} />
          <Rotulo texto="Su cuenta en Stellar, lista" x={960} y={870} t={10.6} alinear="centro" tam={34} />
        </>
      }
    />
    <Confeti t={12.8} />
    <Subtitulos id="4" />
    <Voces id="4" />
    <Sonidos lista={[["blip", 0.5], ["blip", 1.75], ["blip", 5.5], ["blip", 6.7], ["pop", 7.3], ["pop", 9.2], ["campanitas", 10.3], ["chispitas", 12.8]]} />
  </>
);

// ---------- Escena 5 · Preguntar urgente ----------
const av5 = armarAvatares("5", (g) => {
  g.entra("yaeko", 0.0, junto("izq", 0.95), "salto", "esperar", CARA.preocupado);
  g.usaCelular("yaeko", 0.5, 8.7, CARA.preocupado);
  g.va("yaeko", 9.0, null, "esperar", CARA.atento);
  g.entra("aldrin", 4.9, junto("der", 0.69), "salto", "senalarIzq", CARA.atento);
  g.va("aldrin", 7.7, null, "tocar", CARA.atento);
  g.va("aldrin", 8.3, null, "celebrar", CARA.feliz);
  g.va("aldrin", 10.6, null, "esperar", CARA.feliz);
});

export const Escena5: React.FC = () => (
  <>
    <Fondo />
    <>
      <Telefono
        tramos={[
          { t0: 0, t1: 2.2, img: "tomas/c08-alguien-sabe.png" },
          { t0: 2.2, t1: 5.4, img: "tomas/c09-pregunta-escrita.png" },
          { t0: 5.4, t1: 8.6, img: "tomas/c10-urgente.png" },
          { t0: 8.6, t1: 14, img: "tomas/c11-publicada.png" },
        ]}
        toques={[
          { t: 1.9, x: 269, y: 694 },
          { t: 5.5, x: 180, y: 565 },
          { t: 8.3, x: 180, y: 764 },
        ]}
        miras={[
          { t0: 5.6, t1: 7.5, u: 0.28, v: 0.7, m: 1.9 },
          { t0: 7.8, t1: 8.6, u: 0.5, v: 0.955, m: 1.6 },
          { t0: 9.6, t1: 13.5, u: 0.15, v: 0.385, m: 2.2 },
        ]}
      />
      <RotuloCuenta texto="Camila · cuenta nueva de demo" />
      <SaleDelCel
        t0={2.2}
        t1={5.5}
        desde={[960, 210]}
        x={1500}
        y={330}
        ancho={640}
        etiqueta="¿Qué necesitas?"
        texto="¿Quién arregla una tubería hoy en Queru Queru? Se está saliendo el agua."
        dictado={[2.5, 4.9]}
      />
      <Rotulo texto="Urgente: sale primero 24 h" x={DER_CEL} y={140} t={5.6} hasta={9.4} tam={26} color={C.coral} />
      <Burbuja texto="−5 yapitas" x={DER_CEL + 170} y={330} t={8.05} color={C.coral} dur={2.2} />
      <Rotulo texto="Publicada en Queru Queru" x={DER_CEL} y={420} t={10.2} tam={26} color={C.tinta} />
      <Avatares escena={av5} />
    </>
    <Subtitulos id="5" />
    <Voces id="5" />
    <Sonidos lista={[["blip", 0.6], ["blip", 1.6], ["blip", 5.1], ["pop", 5.6], ["blip", 8.05], ["pop", 10.2]]} />
  </>
);

// ---------- Escena 6 · Otra cuenta responde (dos celulares) ----------
const A = 650;
const B = 1270;
const av6 = armarAvatares("6", (g) => {
  g.entra("diego", 0.0, [300, 930], "salto", "senalarArriba", CARA.atento);
  g.va("diego", 1.8, null, "senalar", CARA.atento);
  g.va("diego", 3.9, null, "hablar", CARA.atento);
  g.va("diego", 7.3, null, "aplaudir", CARA.feliz);
  g.entra("yaeko", 5.6, [1630, 930], "puf", "esperar", CARA.atento);
  g.usaCelular("yaeko", 5.9, 9.4, CARA.atento);
  g.va("yaeko", 7.1, null, "escribir", CARA.sorpresa);
  g.va("yaeko", 9.6, null, "senalarIzq", CARA.feliz);
  g.va("yaeko", 11.0, null, "celebrar", CARA.feliz);
});

export const Escena6: React.FC = () => (
  <>
    <Fondo brillo={[960, 500]} />
    <>
    <Telefono
      cx={A}
      tramos={[
        { t0: 0, t1: 1.6, img: "tomas/a01-hoy-aviso.png" },
        { t0: 1.6, t1: 3.1, img: "tomas/a02-avisos.png" },
        { t0: 3.1, t1: 4.4, img: "tomas/a03-pregunta.png" },
        { t0: 4.4, t1: 7.0, img: "tomas/a04-respuesta-escrita.png" },
        { t0: 7.0, t1: 13, img: "tomas/a05-respondida.png" },
      ]}
      toques={[
        { t: 1.3, x: 266, y: 31 },
        { t: 2.8, x: 180, y: 722 },
        { t: 4.2, x: 180, y: 597 },
        { t: 6.4, x: 63, y: 650 },
      ]}
      encima={
        <>
          <Anillo x={274} y={10} w={50} h={50} t0={0.2} t1={1.5} radio={25} />
          <Anillo x={9} y={750} w={387} h={121} t0={1.7} t1={2.9} />
        </>
      }
    />
    <Telefono
      cx={B}
      tramos={[
        { t0: 0, t1: 7.0, img: "tomas/c11b-sin-respuesta.png" },
        { t0: 7.0, t1: 13, img: "tomas/c12-llega-respuesta.png" },
      ]}
      encima={<Anillo x={18} y={592} w={369} h={292} t0={7.0} t1={12.6} color={C.verde} />}
    />
    <Rotulo texto="Ana · cuenta de ejemplo" x={A - CEL.ancho / 2 - 24} y={70} t={0.2} alinear="der" tam={24} color={C.apagado} />
    <Rotulo texto="Camila · cuenta nueva de demo" x={B + CEL.ancho / 2 + 24} y={70} t={0.2} tam={24} color={C.apagado} />
    <Rotulo texto="Aviso: pregunta urgente en su zona" x={A - CEL.ancho / 2 - 24} y={140} t={1.4} hasta={4.2} alinear="der" tam={22} color={C.coral} />
    <Rotulo texto="Sin recargar · 0,7 s" x={B + CEL.ancho / 2 + 24} y={440} t={7.1} tam={26} color={C.verde} />
    <Avatares escena={av6} />
    </>
    <PrimerPlano
      escena={av6}
      quien="yaeko"
      t0={7.3}
      t1={9.6}
      lado="der"
      junto={
        <>
        <Rotulo texto="Llegó sola · sin recargar" x={480} y={720} t={7.5} alinear="centro" tam={34} color={C.verde} />
        <div style={{ position: "absolute", left: 200, top: 250, width: 560, height: 415, borderRadius: 28, overflow: "hidden", boxShadow: "0 24px 60px rgba(0,0,0,0.5), 0 0 0 4px " + C.verde }}>
          <Img src={staticFile("video/tomas/c12-llega-respuesta.png")} style={{ position: "absolute", width: 560, top: -1560 * (560 / 1080), left: 0 }} />
        </div>
        </>
      }
    />
    <Subtitulos id="6" />
    <Voces id="6" />
    <Sonidos lista={[["blip", 0.5], ["blip", 2.1], ["pop", 1.4], ["ding", 7.0], ["pop", 7.1]]} />
  </>
);

// ---------- Escena 7 · «Me sirvió» ----------
const av7 = armarAvatares("7", (g) => {
  g.entra("aldrin", 0.0, junto("izq", 0.86), "salto", "senalar", CARA.atento);
  g.va("aldrin", 1.8, null, "tocar", CARA.atento);
  g.va("aldrin", 3.9, null, "celebrar", CARA.feliz);
  g.va("aldrin", 5.4, null, "aplaudir", CARA.feliz);
  g.entra("diego", 6.2, junto("der", 0.55), "puf", "celebrar", CARA.feliz);
});

export const Escena7: React.FC = () => (
  <>
    <Fondo />
    <>
      <Telefono
        tramos={[
          { t0: 0, t1: 2.1, img: "tomas/c12-llega-respuesta.png" },
          { t0: 2.1, t1: 10, img: "tomas/c13-solucionada.png" },
        ]}
        toques={[{ t: 1.9, x: 85, y: 686 }]}
        miras={[
          { t0: 0.8, t1: 1.9, u: 0.24, v: 0.86, m: 2 },
          { t0: 2.6, t1: 4.0, u: 0.19, v: 0.158, m: 2 },
        ]}
      />
      <RotuloCuenta texto="Camila · cuenta nueva de demo" />
      <Rotulo texto="Solo quien preguntó" x={IZQ_CEL} y={140} t={0.8} hasta={4.4} alinear="der" tam={26} />
      <Rotulo texto="Solucionada" x={DER_CEL} y={140} t={3.8} hasta={6.2} tam={28} color={C.verde} />
      <SaleDelCel
        t0={4.3}
        t1={6.8}
        desde={[960, 480]}
        x={1530}
        y={360}
        ancho={600}
        borde={C.naranja}
        titulo="¡Gracias, pues!"
        texto="Ana recibe +5 yapitas por ayudarte. Tu pregunta quedó Solucionada."
        tam={34}
      />
      <Avatares escena={av7} />
    </>
    <PrimerPlano
      escena={av7}
      quien="diego"
      t0={6.8}
      t1={9.6}
      solo
      junto={
        <>
          <Burbuja texto="+5 yapitas para Ana" x={960} y={200} t={7.0} dur={2.6} tam={56} />
          <Rotulo texto="por ayudar a una vecina" x={960} y={870} t={7.3} alinear="centro" tam={34} />
        </>
      }
    />
    <Subtitulos id="7" />
    <Voces id="7" />
    <Sonidos lista={[["blip", 1.9], ["ding", 3.75], ["pop", 3.8], ["pop", 6.2], ["campanitas", 7.5]]} />
  </>
);

// ---------- Escena 8 · El pago en Stellar ----------
const av8 = armarAvatares("8", (g) => {
  g.entra("diego", 0.0, junto("izq", 0.2), "salto", "senalarArriba", CARA.atento);
  g.va("diego", 2.6, null, "senalar", CARA.atento);
  g.va("diego", 5.0, null, "senalarArriba", CARA.atento);
  g.sale("diego", 6.3, "puf");
  g.entra("aldrin", 6.8, [1745, 930], "salto", "senalarIzq", CARA.sorpresa);
  g.va("aldrin", 9.4, null, "triunfo", CARA.orgullo);
  g.va("aldrin", 11.2, null, "esperar", CARA.orgullo);
  g.entra("yaeko", 11.6, [200, 930], "puf", "hablar", CARA.atento);
});

// Memo: «YXl1ZGE6NTU=» se transforma letra a letra en «ayuda:55»
const MEMO_B64 = "YXl1ZGE6NTY=";
const MEMO = "ayuda:56";
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
        <Img src={staticFile("video/img/explorador-pago2.png")} style={{ width: 720, display: "block" }} />
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
            = premio por la respuesta n.º 56
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
      <>
      <Telefono
        cx={cx}
        tramos={[
          { t0: 0, t1: 4.8, img: "tomas/a06-movimientos.png" },
          { t0: 4.8, t1: 18, img: "tomas/a07-explorador.png" },
        ]}
        toques={[{ t: 4.5, x: 136, y: 166 }]}
        encima={<TapaComision desde={4.8} />}
      />
      <Rotulo texto="Ana · cuenta de ejemplo" x={96} y={70} t={0.2} tam={24} color={C.apagado} />
      <SaleDelCel
        t0={1.4}
        t1={4.5}
        desde={[960, 210]}
        x={1520}
        y={330}
        ancho={600}
        borde={C.verde}
        etiqueta="Movimientos · cuenta de Ana"
        titulo={<span>Tu respuesta sirvió <span style={{ color: C.naranja, float: "right" }}>+5 yapitas</span></span>}
        texto="● Confirmado · Registro b80f…eca3"
        tam={32}
      />
      <Rotulo texto="Registro público: stellar.expert" x={DER_CEL} y={380} t={5.0} hasta={6.6} tam={24} />
      <TarjetaExplorador />
      <Avatares escena={av8} />
      </>
      <Subtitulos id="8" />
      <Voces id="8" />
      <Sonidos lista={[["blip", 0.5], ["pop", 2.7], ["blip", 4.7], ["pop", 6.9], ["ding", 9.2], ["pop", 12.1]]} />
    </>
  );
};
