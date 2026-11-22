// Escenas 1, 2 y 9: equipo y transformación, el problema, y el plan con el cierre (contrato §5).
import { Audio, Video } from "@remotion/media";
import React from "react";
import { AbsoluteFill, Freeze, Img, Sequence, interpolate, random, spring, staticFile, useCurrentFrame } from "remotion";
import { Avatares, Cifra, Fondo, PrimerPlano, Rotulo, Sonidos, Subtitulos, Telefono, Voces, armarAvatares, entrar, tramo } from "./comunes";
import { CARA } from "./caras";
import { VOCES, durArchivo, envDe, escenaVideo } from "./datos";
import { AGUAYO, C, COLOR_PERSONA, FPS, LETRA, LETRA_TITULO } from "./estilo";
import { Guion, type Quien } from "../elenco/escenas";
import { FUERA } from "./comunes";

const t2f = (t: number) => Math.round(t * FPS);

// ---------- Logo ----------
export const Logo: React.FC<{ x: number; y: number; tam: number; t?: number; conNombre?: boolean; sub?: string }> = ({
  x,
  y,
  tam,
  t = 0,
  conNombre = true,
  sub,
}) => {
  const frame = useCurrentFrame();
  const e = spring({ frame: frame - t2f(t), fps: FPS, config: { damping: 13, stiffness: 120 } });
  if (frame < t2f(t)) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        transform: `translate(-50%, 0) scale(${0.6 + 0.4 * e})`,
        opacity: Math.min(1, e * 1.5),
        display: "flex",
        alignItems: "center",
        gap: tam * 0.28,
      }}
    >
      <div style={{ width: tam, height: tam, borderRadius: tam * 0.24, background: C.azulejo, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Img src={staticFile("video/img/logo.svg")} style={{ width: tam * 0.86, height: tam * 0.86 }} />
      </div>
      {conNombre ? (
        <div>
          <div style={{ fontFamily: LETRA_TITULO, fontWeight: 500, fontSize: tam * 0.62, color: C.tinta, lineHeight: 1 }}>BoliviaSabe</div>
          {sub ? <div style={{ fontFamily: LETRA, fontSize: tam * 0.2, color: C.apagado, marginTop: tam * 0.08 }}>{sub}</div> : null}
        </div>
      ) : null}
    </div>
  );
};

// ---------- Escena 1 · Somos CodeBambinos y la transformación ----------
const TARJETAS: { quien: Quien; cx: number; rol: string; hablaDesde: number }[] = [
  { quien: "diego", cx: 520, rol: "Diego · líder técnico", hablaDesde: 0.15 },
  { quien: "yaeko", cx: 960, rol: "Yaeko · product owner", hablaDesde: 4.4 },
  { quien: "aldrin", cx: 1400, rol: "Aldrin · desarrollador", hablaDesde: 9.8 },
];
const T_PIXEL = 14.8; // justo después de «¡Y ahora nos ven así!»: empiezan a pixelarse las tres
const T_CAE = 16.0; // los avatares caen desde arriba (uno tras otro)
const TW = 360;
const TH = 640;
const TY = 150;

const Tarjeta: React.FC<{ quien: Quien; cx: number; rol: string; hablaDesde: number }> = ({ quien, cx, rol, hablaDesde }) => {
  const frame = useCurrentFrame();
  const T = frame / FPS;
  const voz = VOCES[quien];
  const largo = voz.hasta - voz.desde;
  const habla = T >= hablaDesde - 0.1 && T < hablaDesde + largo + 0.2;
  const activa = spring({ frame: frame - t2f(hablaDesde - 0.2), fps: FPS, config: { damping: 200 }, durationInFrames: 12 });
  const termina = spring({ frame: frame - t2f(hablaDesde + largo + 0.1), fps: FPS, config: { damping: 200 }, durationInFrames: 12 });
  const foco = T < hablaDesde ? 0 : Math.max(0, activa - termina * 0.6);
  // Pixelado: el bloque crece de 1 a 40 px
  const k = interpolate(T, [T_PIXEL, T_PIXEL + 0.8], [1, 40], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const se_va = tramo(T, T_PIXEL + 0.7, T_PIXEL + 1.1);
  const entra = entrar(frame, 0.05 + (cx - 520) / 4400, 0.5);
  if (se_va >= 1) return null;
  const pequeno = k > 2;
  const PASOS = [3, 6, 10, 15, 22, 30, 40];
  const paso = PASOS.reduce((m, p) => (k >= p ? p : m), 3);
  const contenido = habla ? (
    <Sequence from={t2f(hablaDesde - voz.desde)} layout="none">
      <Video src={staticFile(voz.archivo)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
    </Sequence>
  ) : (
    <Img src={staticFile(`video/img/p-${quien}${T >= hablaDesde ? "-fin" : ""}.png`)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
  );
  return (
    <div
      style={{
        position: "absolute",
        left: cx - TW / 2,
        top: TY,
        width: TW,
        height: TH,
        transform: `scale(${(0.94 + 0.06 * entra) * (1 + 0.06 * foco) * (1 - 0.2 * se_va)})`,
        opacity: entra * (1 - se_va),
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: 28,
          overflow: "hidden",
          border: `4px solid ${COLOR_PERSONA[quien]}`,
          boxShadow: foco > 0.1 ? `0 0 40px ${COLOR_PERSONA[quien]}66` : "0 20px 50px rgba(0,0,0,0.45)",
          filter: `brightness(${0.55 + 0.45 * Math.max(foco, T >= T_PIXEL ? 1 : 0)})`,
          background: "#000",
        }}
      >
        {pequeno ? (
          // Bloques pregenerados (px-<quien>-<k>.png): Chrome suaviza las imágenes agrandadas con CSS
          <Img src={staticFile(`video/img/px-${quien}-${paso}.png`)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        ) : (
          contenido
        )}
      </div>
      <div
        style={{
          position: "absolute",
          top: TH + 22,
          left: "50%",
          transform: `translateX(-50%)`,
          opacity: T >= hablaDesde ? Math.min(1, activa * 1.4) : 0,
          fontFamily: LETRA,
          fontWeight: 600,
          fontSize: 28,
          color: C.tinta,
          whiteSpace: "nowrap",
        }}
      >
        {rol}
      </div>
    </div>
  );
};

// Voxels que salen de las tarjetas y suben girando hasta salir por arriba (de ahí caen los avatares)
const Voxels: React.FC = () => {
  const frame = useCurrentFrame();
  const T = frame / FPS;
  if (T < T_PIXEL + 0.6 || T > T_PIXEL + 1.6) return null;
  const piezas: React.ReactNode[] = [];
  TARJETAS.forEach(({ quien, cx }, n) => {
    for (let i = 0; i < 30; i++) {
      const sx = cx - TW / 2 + random(`x${n}${i}`) * TW;
      const sy = TY + random(`y${n}${i}`) * TH;
      const q = tramo(T, T_PIXEL + 0.6, T_PIXEL + 1.5 + random(`v${n}${i}`) * 0.1);
      // Primero se abren un poco y después suben rápido
      const abre = Math.min(1, q * 3);
      const x = sx + (random(`dx${n}${i}`) - 0.5) * 220 * abre + (cx - sx) * q * 0.6;
      const y = sy - q * q * (sy + 260);
      const lado = 14 + random(`s${n}${i}`) * 22;
      const color = i % 3 === 0 ? COLOR_PERSONA[quien] : AGUAYO[(i + n) % AGUAYO.length];
      piezas.push(
        <div
          key={`${n}-${i}`}
          style={{
            position: "absolute",
            left: x,
            top: y,
            width: lado,
            height: lado,
            background: color,
            transform: `rotate(${q * 540 * (random(`r${n}${i}`) - 0.5) * 2}deg)`,
            boxShadow: `inset -3px -3px 0 rgba(0,0,0,0.25)`,
          }}
        />,
      );
    }
  });
  return <AbsoluteFill>{piezas}</AbsoluteFill>;
};

const Destello: React.FC<{ t: number }> = ({ t }) => {
  const frame = useCurrentFrame();
  const d = frame - t2f(t);
  if (d < 0 || d > 5) return null;
  return <AbsoluteFill style={{ background: "#fff", opacity: d < 1 ? 0.55 : 0.55 * (1 - (d - 1) / 4) }} />;
};

// Caen desde arriba, chocan, quedan tirados y se levantan (idea de Diego); después, «Somos CodeBambinos»
const CAIDAS: { quien: Quien; x: number; lado: -1 | 1; t: number }[] = [
  { quien: "diego", x: 720, lado: 1, t: T_CAE },
  { quien: "yaeko", x: 960, lado: -1, t: T_CAE + 0.14 },
  { quien: "aldrin", x: 1200, lado: -1, t: T_CAE + 0.28 },
];
const av1 = armarAvatares("1", (g) => {
  for (const c of CAIDAS) {
    g.cae(c.quien, c.t, [c.x, 930], c.lado);
    // Cae agitando los brazos
    g.va(c.quien, c.t, null, "desesperar", CARA.sorpresa);
    g.va(c.quien, c.t + 0.5, null, "esperar", CARA.mareado);
    g.va(c.quien, c.t + 1.3, null, "esperar", CARA.sorpresa);
    g.va(c.quien, c.t + 1.75, null, "saludar", CARA.feliz);
  }
  g.va("yaeko", 18.4, [960, 930], "hablar", CARA.orgullo);
  g.va("diego", 18.6, [780, 930], "celebrar", CARA.orgullo);
  g.va("aldrin", 18.6, [1140, 930], "celebrar", CARA.orgullo);
  g.va("diego", 20.6, null, "triunfo", CARA.orgullo);
  g.va("aldrin", 20.6, null, "triunfo", CARA.orgullo);
  g.va("yaeko", 20.8, null, "triunfo", CARA.orgullo);
});

// Polvillo de voxels donde cae cada uno
const Polvo: React.FC = () => {
  const frame = useCurrentFrame();
  const T = frame / FPS;
  const piezas: React.ReactNode[] = [];
  CAIDAS.forEach((c, n) => {
    const t = c.t + 0.45;
    const d = T - t;
    if (d < 0 || d > 0.6) return;
    const q = d / 0.6;
    for (let i = 0; i < 14; i++) {
      const ang = Math.PI * (0.05 + 0.9 * random(`pa${n}${i}`));
      const vel = 90 + random(`pv${n}${i}`) * 140;
      const x = c.x + Math.cos(ang) * vel * q * (i % 2 ? 1 : -1);
      const y = 925 - Math.sin(ang) * vel * 0.6 * q + q * q * 60;
      const lado = 8 + random(`ps${n}${i}`) * 10;
      piezas.push(<div key={`${n}-${i}`} style={{ position: "absolute", left: x, top: y, width: lado, height: lado, background: i % 3 ? "#8a7f77" : "#b0a59c", opacity: 1 - q }} />);
    }
  });
  return <AbsoluteFill>{piezas}</AbsoluteFill>;
};

// Temblor corto de la cámara en cada golpe contra el piso
const temblor = (T: number) => {
  let dx = 0;
  let dy = 0;
  for (const c of CAIDAS) {
    const d = T - (c.t + 0.45);
    if (d >= 0 && d < 0.25) {
      const a = 9 * (1 - d / 0.25);
      dx += Math.sin(d * 90) * a;
      dy += Math.cos(d * 110) * a * 0.7;
    }
  }
  return { dx, dy };
};

export const Escena1: React.FC = () => {
  const frame = useCurrentFrame();
  const T = frame / FPS;
  const { dx, dy } = temblor(T);
  return (
    <>
      <Fondo />
      <AbsoluteFill style={{ transform: `translate(${dx}px, ${dy}px)` }}>
      {TARJETAS.map((x) => (
        <Tarjeta key={x.quien} {...x} />
      ))}
      <Voxels />
      <Destello t={T_PIXEL + 0.7} />
      {T >= 18.3 ? <Logo x={960} y={170} tam={210} t={18.4} sub="por CodeBambinos" /> : null}
      <Avatares escena={av1} />
      <Polvo />
      </AbsoluteFill>
      <Subtitulos id="1" />
      <Voces id="1" />
      <Sonidos
        lista={[
          ["chispitas", T_PIXEL],
          ["giro", T_PIXEL + 0.7],
          ...CAIDAS.map((c) => ["golpe", c.t + 0.45] as ["golpe", number]),
          ["pop", T_CAE + 1.4],
          ["titulo", 18.4],
        ]}
      />
    </>
  );
};

// ---------- Escena 2 · El problema ----------
const av2 = armarAvatares("2", (g) => {
  g.entra("yaeko", 0.2, [250, 930], "salto", "senalar", CARA.atento);
  g.sale("yaeko", 5.1, "salto");
  g.entra("diego", 5.0, [1680, 930], "puf", "esperar", CARA.atento);
  g.usaCelular("diego", 5.3, 8.9, CARA.preocupado);
  g.va("diego", 9.1, null, "desesperar", CARA.preocupado);
  g.va("diego", 10.4, null, "encoger", CARA.preocupado);
  g.sale("diego", 11.7, "puf");
  g.entra("aldrin", 11.6, [250, 930], "salto", "esperar", CARA.atento);
  g.usaCelular("aldrin", 11.9, 13.2, CARA.atento);
  g.va("aldrin", 13.4, null, "encoger", CARA.preocupado);
  g.sale("aldrin", 15.9, "salto");
  g.entra("yaeko", 16.2, [250, 930], "puf", "apuntar", CARA.atento);
  g.va("yaeko", 20.8, null, "senalar", CARA.atento);
  g.va("yaeko", 23.0, null, "senalarArriba", CARA.feliz);
  g.va("yaeko", 26.4, null, "celebrar", CARA.feliz);
});

// «Por eso hicimos BoliviaSabe»: el logo y lo que resuelve
const Solucion: React.FC = () => {
  const frame = useCurrentFrame();
  const T = frame / FPS;
  if (T < 22.9) return null;
  return (
    <AbsoluteFill>
      <Logo x={960} y={180} tam={150} t={23.0} />
      <Cifra texto={<span>Lo que pasa hoy en tu barrio, <span style={{ color: C.naranja }}>ordenado</span></span>} x={1060} y={520} t={25.0} tam={56} />
      <Cifra texto={<span>y vecinos que <span style={{ color: C.fucsiaTexto }}>responden</span></span>} x={1060} y={620} t={26.9} tam={56} />
    </AbsoluteFill>
  );
};

const GrupoFacebook: React.FC = () => {
  const frame = useCurrentFrame();
  const T = frame / FPS;
  if (T > 5.7) return null;
  const e = entrar(frame, 0.2, 0.5);
  const z = interpolate(T, [0.6, 5.2], [1, 1.45], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const sale = tramo(T, 5.2, 5.7);
  const subr = tramo(T, 3.0, 3.6);
  return (
    <div style={{ position: "absolute", left: 360, top: 170, width: 1200, opacity: e * (1 - sale), transform: `translateY(${(1 - e) * 30}px)` }}>
      <div style={{ background: "#2a2421", borderRadius: "18px 18px 0 0", padding: "12px 18px", display: "flex", gap: 8, alignItems: "center" }}>
        {["#e4572e", "#f2c230", "#2e9e5b"].map((c) => (
          <div key={c} style={{ width: 14, height: 14, borderRadius: 7, background: c }} />
        ))}
        <div style={{ marginLeft: 16, fontFamily: LETRA, color: C.apagado, fontSize: 20 }}>facebook.com · grupo público</div>
      </div>
      <div style={{ width: 1200, height: 503, overflow: "hidden", borderRadius: "0 0 18px 18px", position: "relative" }}>
        <div style={{ width: 1200, height: 503, transform: `scale(${z})`, transformOrigin: "24% 75%", position: "relative" }}>
          <Img src={staticFile("video/img/e2-grupo-facebook-cabecera.png")} style={{ width: 1200, height: 503 }} />
          <div style={{ position: "absolute", left: 196, top: 392, height: 6, width: 176 * subr, background: C.amarillo, borderRadius: 3 }} />
        </div>
      </div>
    </div>
  );
};

const MENSAJES = [
  "¿Alguien vende garrafa por Sarco?",
  "Busco departamento en el Centro",
  "¿Qué micro va a la terminal?",
  "Vendo bici casi nueva",
  "¿Hay agua en Cala Cala?",
  "¿Farmacia de turno?",
  "Perdí mi perrito, es café",
  "¿Alguien sabe si hay paro?",
  "Clases de inglés baratas",
  "¿Dónde arreglan celulares?",
];

const Burbujas: React.FC = () => {
  const frame = useCurrentFrame();
  const T = frame / FPS;
  if (T < 5.4 || T > 16.3) return null;
  const sale = tramo(T, 15.8, 16.3);
  // Como un chat: cada mensaje nuevo entra abajo y empuja los anteriores hacia arriba.
  // La pregunta amarilla es el primero; los demás la tapan y se va perdiendo arriba.
  const items = [{ texto: "¿Alguien sabe quién arregla tuberías?", t: 6.25, amarilla: true }].concat(
    Array.from({ length: 16 }).map((_, i) => ({ texto: MENSAJES[i % MENSAJES.length], t: 6.5 + i * 0.3, amarilla: false })),
  );
  const PASO = 64;
  const ABAJO = 820;
  const visibles = items.filter((m) => T >= m.t);
  const llegada = (m: { t: number }) => spring({ frame: frame - t2f(m.t), fps: FPS, config: { damping: 18, stiffness: 170 } });
  // Desplazamiento suave: cada mensaje que entra sube la pila un paso
  let subida = 0;
  for (const m of visibles) subida += llegada(m);
  const respuesta = entrar(frame, 12.4, 0.5);
  const vieja = tramo(T, 9.6, 10.0);
  return (
    <AbsoluteFill style={{ opacity: 1 - sale }}>
      <div style={{ position: "absolute", left: 560, top: 60, width: 800, height: 830, overflow: "hidden", maskImage: "linear-gradient(to bottom, transparent 0, #000 140px)" }}>
        {visibles.map((m, i) => {
          const y = ABAJO - 60 - (subida - i - 1) * PASO - 60;
          const e = llegada(m);
          const izq = i % 2 === 0;
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: izq ? 40 : 360,
                top: y,
                transform: `scale(${0.75 + 0.25 * e})`,
                transformOrigin: izq ? "0 100%" : "100% 100%",
                opacity: e,
                background: m.amarilla ? C.amarillo : "#2f2825",
                color: m.amarilla ? "#1f1a17" : "#d9d0c9",
                fontFamily: LETRA,
                fontWeight: m.amarilla ? 700 : 400,
                fontSize: m.amarilla ? 30 : 26,
                padding: "12px 22px",
                borderRadius: 20,
                whiteSpace: "nowrap",
              }}
            >
              {m.texto}
            </div>
          );
        })}
      </div>
      <div
        style={{
          position: "absolute",
          left: 1380,
          top: 360,
          opacity: vieja * (T < 11.8 ? 1 : 1 - tramo(T, 11.8, 12.1)),
          transform: `rotate(-4deg) scale(${0.8 + 0.2 * vieja})`,
          background: C.coral,
          color: "#fff",
          fontFamily: LETRA,
          fontWeight: 700,
          fontSize: 30,
          padding: "10px 20px",
          borderRadius: 12,
        }}
      >
        ¿sigue vigente?
      </div>
      {T >= 12.4 ? (
        <div
          style={{
            position: "absolute",
            left: 640,
            top: 400,
            opacity: respuesta,
            transform: `scale(${0.8 + 0.2 * respuesta})`,
            display: "flex",
            alignItems: "center",
            gap: 24,
            background: "rgba(21,17,16,0.9)",
            padding: 24,
            borderRadius: 28,
          }}
        >
          <div style={{ background: "#3a322d", color: C.tinta, fontFamily: LETRA, fontSize: 32, padding: "16px 26px", borderRadius: 22 }}>
            Yo sé: Don Remberto, en la Av. América
          </div>
          <div
            style={{
              fontFamily: LETRA_TITULO,
              fontSize: 72,
              color: "#8a7f77",
              opacity: tramo(T, 13.3, 13.6),
              transform: `translateY(${tramo(T, 13.6, 15.5) * 20}px)`,
            }}
          >
            +0
          </div>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

// La pregunta de Diego sale de su celular y vuela al chat
const PreguntaVuela: React.FC = () => {
  const frame = useCurrentFrame();
  const T = frame / FPS;
  if (T < 5.6 || T > 6.35) return null;
  const q = tramo(T, 5.6, 6.3);
  const x = interpolate(q, [0, 1], [1560, 640]);
  const y = interpolate(q, [0, 1], [720, 760]) - Math.sin(q * Math.PI) * 160;
  return (
    <div style={{ position: "absolute", left: x, top: y, transform: `scale(${0.5 + 0.5 * q})`, background: C.amarillo, color: "#1f1a17", fontFamily: LETRA, fontWeight: 700, fontSize: 30, padding: "12px 22px", borderRadius: 20, whiteSpace: "nowrap", opacity: 1 - tramo(T, 6.2, 6.35) }}>
      ¿Alguien sabe quién arregla tuberías?
    </div>
  );
};

const Figuritas: React.FC = () => {
  const frame = useCurrentFrame();
  const T = frame / FPS;
  if (T < 16.3 || T > 23.0) return null;
  const e = entrar(frame, 16.4, 0.5) * (1 - tramo(T, 22.6, 23.0));
  const figs: React.ReactNode[] = [];
  for (let i = 0; i < 24; i++) {
    const col = i % 8;
    const fila = Math.floor(i / 8);
    const prendida = i < 14 && T >= 19.25 + i * 0.09;
    const p = prendida ? spring({ frame: frame - t2f(19.25 + i * 0.09), fps: FPS, config: { damping: 12 } }) : 0;
    const color = prendida ? C.fucsia : "#4a403b";
    figs.push(
      <div key={i} style={{ position: "absolute", left: 640 + col * 96, top: 160 + fila * 150, transform: `scale(${1 + 0.15 * p})`, opacity: e }}>
        <div style={{ width: 44, height: 44, borderRadius: 22, background: color, margin: "0 auto" }} />
        <div style={{ width: 64, height: 60, borderRadius: "30px 30px 10px 10px", background: color, marginTop: 6 }} />
      </div>,
    );
  }
  return (
    <AbsoluteFill>
      {figs}
      <Cifra texto={<span><span style={{ color: C.fucsiaTexto }}>14</span> de 24</span>} x={1020} y={640} t={19.3} tam={110} />
      <Cifra texto="les molesta que la pregunta se pierda" x={1020} y={780} t={20.5} tam={40} color={C.apagado} />
    </AbsoluteFill>
  );
};

export const Escena2: React.FC = () => (
  <>
    <Fondo />
    <>
    <GrupoFacebook />
    {useCurrentFrame() / FPS < 5.4 ? <Cifra texto={<span style={{ color: C.amarillo }}>209 mil miembros</span>} x={960} y={760} t={3.2} tam={84} /> : null}
    <Burbujas />
    <Figuritas />
    <Solucion />
    <Avatares escena={av2} />
    </>
    <PreguntaVuela />
    <PrimerPlano
      escena={av2}
      quien="diego"
      t0={8.6}
      t1={11.4}
      lado="der"
      junto={
        <>
          <Cifra texto={<span style={{ color: C.amarillo }}>¿Alguien sabe quién arregla tuberías?</span>} x={640} y={380} t={8.7} tam={40} />
          <Cifra texto={<span style={{ color: C.coral }}>¿sigue vigente?</span>} x={640} y={470} t={9.6} tam={52} />
          <Cifra texto="¿y la respuesta?" x={640} y={560} t={10.3} tam={40} color={C.apagado} />
        </>
      }
    />
    <Subtitulos id="2" />
    <Voces id="2" />
    <Sonidos lista={[["pop", 0.3], ["ding", 3.2], ["pop", 6.0], ["pop", 9.7], ["pop", 12.4], ["ding_roto", 13.4], ["pop", 16.5], ["ding", 20.6], ["titulo", 23.0], ["pop", 25.0], ["pop", 26.9]]} />
  </>
);

// ---------- Escena 9 · Plan y cierre ----------
const av9 = armarAvatares("9", (g) => {
  g.entra("yaeko", 0.3, [230, 930], "salto", "senalarArriba", CARA.orgullo);
  g.va("yaeko", 7.5, null, "senalar", CARA.orgullo);
  g.va("yaeko", 10.2, null, "celebrar", CARA.feliz);
  g.sale("yaeko", 10.8, "puf");
  g.entra("diego", 10.9, [560, 930], "puf", "apuntar", CARA.atento);
  g.va("diego", 15.5, null, "esperar", CARA.feliz);
  g.sale("diego", 16.2, "puf");
  g.entra("aldrin", 17.0, [1000, 930], "salto", "senalarIzq", CARA.orgullo);
  g.va("aldrin", 25.0, null, "triunfo", CARA.orgullo);
  g.sale("aldrin", 25.6, "puf");
  // Cierre: los tres de un salto, juntos
  g.entra("yaeko", 26.0, [960, 930], "salto", "hablar", CARA.feliz);
  g.entra("diego", 26.1, [740, 930], "salto", "aplaudir", CARA.feliz);
  g.entra("aldrin", 26.2, [1180, 930], "salto", "senalarArriba", CARA.orgullo);
  g.va("diego", 30.0, null, "celebrar", CARA.feliz);
  g.va("aldrin", 30.6, null, "aplaudir", CARA.feliz);
  g.va("yaeko", 32.2, null, "senalarArriba", CARA.orgullo);
  // Despedida: cada uno a su manera
  g.va("yaeko", 34.4, null, "saludar", CARA.feliz);
  g.va("diego", 34.6, null, "triunfo", CARA.orgullo);
  g.va("aldrin", 34.8, null, "celebrar", CARA.feliz);
});

const Plan: React.FC = () => {
  const frame = useCurrentFrame();
  const T = frame / FPS;
  if (T > 11.2) return null;
  const sale = tramo(T, 10.7, 11.2);
  const mapa = entrar(frame, 0.6, 0.6);
  const punto = (t: number) => spring({ frame: frame - t2f(t), fps: FPS, config: { damping: 10, stiffness: 140 } });
  const sarco = T >= 5.6 ? punto(5.6) : 0;
  const centro = T >= 6.6 ? punto(6.6) : 0;
  const tarjeta = (t: number, cifra: string, texto: string, y: number) => {
    if (T < t) return null;
    const e = spring({ frame: frame - t2f(t), fps: FPS, config: { damping: 14, stiffness: 150 } });
    return (
      <div
        style={{
          position: "absolute",
          left: 1180,
          top: y,
          width: 520,
          transform: `translateX(${(1 - e) * 60}px) scale(${0.85 + 0.15 * e})`,
          opacity: Math.min(1, e * 1.4),
          background: C.tarjeta,
          border: `1.5px solid ${C.linea}`,
          borderRadius: 24,
          padding: "18px 28px",
          display: "flex",
          alignItems: "baseline",
          gap: 18,
        }}
      >
        <span style={{ fontFamily: LETRA_TITULO, fontSize: 72, color: C.naranja }}>{cifra}</span>
        <span style={{ fontFamily: LETRA, fontSize: 32, color: C.tinta }}>{texto}</span>
      </div>
    );
  };
  return (
    <AbsoluteFill style={{ opacity: 1 - sale }}>
      <Cifra texto="Plan de 30 días" x={500} y={70} t={0.3} tam={64} alinear="izq" />
      {/* Mapa de Cochabamba: calles, el río Rocha, la laguna Alalay y dos pines */}
      <div style={{ position: "absolute", left: 500, top: 190, width: 620, height: 540, borderRadius: 28, overflow: "hidden", opacity: mapa, background: "#1f2a2c", border: `1.5px solid ${C.linea}`, boxShadow: "0 24px 60px rgba(0,0,0,0.45)" }}>
        <svg width={620} height={540} viewBox="0 0 620 540">
          {/* Manzanas: cuadrícula de calles */}
          {Array.from({ length: 14 }).map((_, i) => (
            <line key={`v${i}`} x1={i * 46 + 10} y1={0} x2={i * 46 - 20} y2={540} stroke="rgba(243,237,232,0.07)" strokeWidth={2} />
          ))}
          {Array.from({ length: 12 }).map((_, i) => (
            <line key={`h${i}`} x1={0} y1={i * 46 + 18} x2={620} y2={i * 46 + 30} stroke="rgba(243,237,232,0.07)" strokeWidth={2} />
          ))}
          {/* Avenidas */}
          <path d="M0 330 L620 300" stroke="rgba(243,237,232,0.22)" strokeWidth={7} />
          <path d="M300 0 L330 540" stroke="rgba(243,237,232,0.22)" strokeWidth={7} />
          <path d="M40 60 C 200 150, 380 140, 600 90" stroke="rgba(243,237,232,0.16)" strokeWidth={5} fill="none" />
          {/* Río Rocha */}
          <path d="M0 200 C 120 180, 220 230, 340 205 C 450 182, 540 215, 620 195" stroke="#3b78c4" strokeWidth={9} fill="none" opacity={0.85} />
          <text x={560} y={180} fill="#8fb4e0" fontSize={19} textAnchor="middle" fontFamily={LETRA}>río Rocha</text>
          {/* Laguna Alalay */}
          <ellipse cx={470} cy={445} rx={74} ry={40} fill="#3b78c4" opacity={0.7} />
          <text x={470} y={510} fill="#8fb4e0" fontSize={19} textAnchor="middle" fontFamily={LETRA}>laguna Alalay</text>
        </svg>
        <div style={{ position: "absolute", left: 22, top: 18, background: "rgba(21,17,16,0.85)", borderRadius: 999, padding: "8px 18px", fontFamily: LETRA, fontWeight: 600, fontSize: 24, color: C.tinta }}>
          Cochabamba
        </div>
        {[
          { x: 175, y: 290, nombre: "Sarco", e: sarco },
          { x: 335, y: 360, nombre: "Centro", e: centro },
        ].map((p) => (
          <div key={p.nombre} style={{ position: "absolute", left: p.x, top: p.y, opacity: Math.min(1, p.e * 1.5), transform: `translate(-50%, -100%) scale(${0.5 + 0.5 * p.e})`, transformOrigin: "50% 100%", textAlign: "center" }}>
            <div style={{ fontFamily: LETRA, fontWeight: 700, fontSize: 30, color: C.tinta, background: "rgba(21,17,16,0.85)", borderRadius: 12, padding: "4px 14px", marginBottom: 6 }}>{p.nombre}</div>
            <svg width={44} height={58} viewBox="0 0 44 58">
              <path d="M22 56 C 22 56, 2 32, 2 21 A 20 20 0 0 1 42 21 C 42 32, 22 56, 22 56 Z" fill={C.fucsia} stroke="#fff" strokeWidth={2.5} />
              <circle cx={22} cy={21} r={7} fill="#fff" />
            </svg>
          </div>
        ))}
      </div>
      <Rotulo texto="cerca de las universidades" x={810} y={760} t={4.2} alinear="centro" tam={28} color={C.fucsiaTexto} />
      <Rotulo texto="estudiantes" x={1180} y={200} t={2.1} tam={28} />
      <Rotulo texto="negocios de barrio" x={1410} y={200} t={3.1} tam={28} />
      {tarjeta(7.6, "1", "semana", 320)}
      {tarjeta(8.75, "30", "cuentas", 470)}
      {tarjeta(9.8, "5", "negocios", 620)}
    </AbsoluteFill>
  );
};

// Hoy con un letrero «Destacado · próximo»
const Destacado: React.FC = () => {
  const frame = useCurrentFrame();
  const T = frame / FPS;
  const e = T >= 12.0 ? spring({ frame: frame - t2f(12.0), fps: FPS, config: { damping: 12, stiffness: 130 } }) : 0;
  return (
    <>
      <div
        style={{
          position: "absolute",
          left: 10,
          top: 300,
          width: 192,
          height: 330,
          borderRadius: 18,
          border: `4px solid ${C.naranja}`,
          boxShadow: `0 0 30px ${C.naranja}aa`,
          opacity: e,
          transform: `scale(${1.1 - 0.1 * e})`,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 22,
          top: 272,
          opacity: e,
          background: C.naranja,
          color: "#1f1a17",
          fontFamily: LETRA,
          fontWeight: 700,
          fontSize: 18,
          padding: "6px 14px",
          borderRadius: 999,
        }}
      >
        Destacado · próximo
      </div>
    </>
  );
};

const Cierre: React.FC = () => {
  const frame = useCurrentFrame();
  const T = frame / FPS;
  const linea = (t: number, contenido: React.ReactNode, y: number) => {
    if (T < t) return null;
    const e = spring({ frame: frame - t2f(t), fps: FPS, config: { damping: 15, stiffness: 140 } });
    return (
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: y,
          textAlign: "center",
          fontFamily: LETRA_TITULO,
          fontWeight: 500,
          fontSize: 58,
          color: C.tinta,
          opacity: Math.min(1, e * 1.3),
          transform: `translateY(${(1 - e) * 24}px)`,
        }}
      >
        {contenido}
      </div>
    );
  };
  if (T < 26.0) return null;
  const fin = T >= 35.0;
  return (
    <AbsoluteFill>
      <Logo x={960} y={70} tam={170} t={26.1} />
      {fin ? null : (
        <>
          {linea(26.3, "¿Viste algo útil? Súbelo.", 300)}
          {linea(29.2, "¿Necesitas algo ya? Pregunta.", 385)}
          {linea(32.2, <span>En Bolivia, ayudar a tus vecinos <span style={{ color: C.naranja }}>tiene premio.</span></span>, 470)}
        </>
      )}
      {fin ? (
        <>
          <Cifra texto="boliviasabe.vercel.app" x={960} y={310} t={35.0} tam={64} color={C.fucsiaTexto} />
          <Cifra texto="github.com/codebambinos/boliviasabe" x={960} y={410} t={35.15} tam={34} color={C.apagado} />
          <Cifra texto="CodeBambinos · National Startups Hackathon by Stellar" x={960} y={470} t={35.3} tam={30} color={C.apagado} />
        </>
      ) : null}
    </AbsoluteFill>
  );
};

const Escena9Base: React.FC<{ fijo?: boolean }> = ({ fijo = false }) => {
  const frame = useCurrentFrame();
  const T = frame / FPS;
  const celB = tramo(T, 10.8, 11.3) * (1 - tramo(T, 16.5, 16.9));
  const celC = tramo(T, 16.5, 16.9) * (1 - tramo(T, 25.6, 26.0));
  return (
    <>
      <Fondo brillo={T < 17 ? [960, 500] : [1380, 500]} />
      <>
      <Plan />
      {celB > 0 ? (
        <div style={{ position: "absolute", inset: 0, opacity: celB }}>
          <Telefono tramos={[{ t0: 0, t1: 37, img: "tomas/c07-hoy-saldo-5.png" }]} encima={<Destacado />} />
          <Cifra texto={<span style={{ color: C.naranja }}>Bs 20 al mes</span>} x={1210} y={330} t={13.3} tam={84} alinear="izq" />
          <Cifra texto="aparecer primero en su zona" x={1210} y={445} t={14.4} tam={38} alinear="izq" />
          <Cifra texto="hipótesis por validar · aún no está en la app" x={1210} y={510} t={15.0} tam={24} color={C.apagado} alinear="izq" />
        </div>
      ) : null}
      {celC > 0 ? (
        <div style={{ position: "absolute", inset: 0, opacity: celC }}>
          <Telefono cx={1440} tramos={[{ t0: 0, t1: 37, img: "tomas/c07-hoy-saldo-5.png" }]} />
          <Cifra texto="Pruébala hoy" x={150} y={200} t={17.3} tam={48} color={C.apagado} alinear="izq" />
          <Cifra texto={<span style={{ color: C.fucsiaTexto }}>boliviasabe.vercel.app</span>} x={150} y={270} t={17.6} tam={76} alinear="izq" />
          {T >= 18.2 ? (
            <div style={{ position: "absolute", left: 150, top: 400, background: "#fff", borderRadius: 18, padding: 14, opacity: tramo(T, 18.2, 18.6) }}>
              <Img src={staticFile("video/img/qr.svg")} style={{ width: 220, height: 220, display: "block" }} />
            </div>
          ) : null}
          <Cifra texto="Hoy una ciudad," x={150} y={680} t={23.3} tam={44} alinear="izq" />
          <Cifra texto={<span>mañana <span style={{ color: C.naranja }}>toda Bolivia</span></span>} x={150} y={745} t={24.4} tam={52} alinear="izq" />
        </div>
      ) : null}
      <Cierre />
      {fijo ? null : <Avatares escena={av9} />}
      </>
      <PrimerPlano
        escena={av9}
        quien="aldrin"
        t0={23.3}
        t1={25.7}
        junto={
          <>
            <Cifra texto="Hoy una ciudad," x={1300} y={360} t={23.4} tam={60} />
            <Cifra texto={<span>mañana <span style={{ color: C.naranja }}>toda Bolivia</span></span>} x={1300} y={460} t={24.3} tam={72} />
          </>
        }
      />
      {fijo ? null : (
        <>
          <Subtitulos id="9" />
          <Voces id="9" />
          <Sonidos
            lista={[
          ["pop", 0.3],
          ["pop", 2.1],
          ["pop", 3.1],
          ["pop", 4.2],
          ["ding", 5.6],
          ["ding", 6.6],
          ["pop", 7.6],
          ["pop", 8.75],
          ["pop", 9.8],
          ["campanitas", 12.0],
          ["pop", 13.3],
          ["pop", 17.6],
          ["titulo", 26.1],
          ["ding", 32.2],
        ]}
          />
        </>
      )}
    </>
  );
};

// Escena 9 con un tramo nuevo en medio: después de «Bs 20 al mes», Yaeko cuenta el canje (frase 9-5).
// La escena se corta en CORTE, queda quieta PUENTE segundos con Yaeko hablando y sigue igual que antes.
const CORTE = 16.85;
const PUENTE = 4.0;
const f9 = (t: number) => Math.round(t * FPS);

const avPuente = (() => {
  const g = new Guion("v9b", "9", "Canje", PUENTE, []);
  for (const q of ["diego", "yaeko", "aldrin"] as Quien[]) g.empieza(q, FUERA[q], "esperar");
  const voz = VOCES["9-5"];
  g.voz("yaeko", voz.texto, 0.35 - voz.desde, durArchivo("9-5"), envDe("9-5"));
  g.entra("yaeko", 0.05, [560, 930], "puf", "senalarArriba", CARA.feliz);
  g.va("yaeko", 2.2, null, "celebrar", CARA.feliz);
  g.sale("yaeko", PUENTE - 0.45, "puf");
  return { ...g.construir(), dur: PUENTE };
})();

const Puente9: React.FC = () => {
  const frame = useCurrentFrame();
  const T = frame / FPS;
  const e = spring({ frame: frame - f9(0.4), fps: FPS, config: { damping: 14, stiffness: 140 } });
  const sale = tramo(T, PUENTE - 0.4, PUENTE);
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 150, top: 230, width: 820, opacity: Math.min(1, e * 1.4) * (1 - sale), transform: `translateY(${(1 - e) * 30}px)` }}>
        <div style={{ fontFamily: LETRA_TITULO, fontSize: 64, color: C.tinta, lineHeight: 1.1 }}>
          Canjear yapitas en <span style={{ color: C.naranja }}>negocios del barrio</span>
        </div>
        <div style={{ fontFamily: LETRA, fontSize: 30, color: C.apagado, marginTop: 18 }}>Próximo paso · ya probamos un canje en la red de pruebas</div>
      </div>
      <Avatares escena={avPuente} />
      <Sequence from={f9(0.35)} layout="none">
        <Audio src={staticFile(VOCES["9-5"].archivo)} />
      </Sequence>
      {T >= 0.35 && T < 0.35 + 3.24 + 0.2 ? (
        <div style={{ position: "absolute", left: 0, right: 0, top: 958, display: "flex", justifyContent: "center" }}>
          <div style={{ fontFamily: LETRA, fontWeight: 600, fontSize: 36, lineHeight: 1.2, color: "#fff", background: "rgba(12,10,9,0.82)", padding: "12px 28px", borderRadius: 16 }}>
            {VOCES["9-5"].texto}
          </div>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

export const Escena9: React.FC = () => (
  <>
    <Sequence durationInFrames={f9(CORTE)} layout="none">
      <AbsoluteFill>
        <Escena9Base />
      </AbsoluteFill>
    </Sequence>
    <Sequence from={f9(CORTE)} durationInFrames={f9(PUENTE)} layout="none">
      <AbsoluteFill>
        <Freeze frame={f9(CORTE)}>
          <Escena9Base fijo />
        </Freeze>
        <Puente9 />
      </AbsoluteFill>
    </Sequence>
    <Sequence from={f9(CORTE + PUENTE)} layout="none">
      <Sequence from={-f9(CORTE)} layout="none">
        <AbsoluteFill>
          <Escena9Base />
        </AbsoluteFill>
      </Sequence>
    </Sequence>
  </>
);

export const _usar = escenaVideo;
