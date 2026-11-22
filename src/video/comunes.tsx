// Piezas comunes del video final: fondo, celular con lupa, subtítulos, rótulos, burbujas, voces y sonidos.
import { Audio, Video } from "@remotion/media";
import React from "react";
import {
  AbsoluteFill,
  Easing,
  Img,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { CapaAvatares, marcha } from "../elenco/Elenco";
import { aMundo } from "../elenco/layout";
import { Guion, type Punto, type Quien } from "../elenco/escenas";
import { AGUAYO, C, FPS, LETRA, LETRA_TITULO } from "./estilo";
import { VOCES, durArchivo, envDe, escenaVideo, finHabla, inicioArchivo, type IdEscena } from "./datos";

export const W = 1920;
export const H = 1080;

// ---------- Zonas (contrato §2) ----------
export const CEL = { ancho: 405, alto: 900, tope: 40 };
export const PIES_MAX = 930;

// Dónde se para un avatar para señalar algo del celular a la altura v (0 arriba, 1 abajo)
export const junto = (lado: "izq" | "der", v: number, cx = 960): Punto => {
  // Siempre en el piso (no flotan): para lo alto señalan hacia arriba. `v` queda para elegir la pose.
  void v;
  const x = lado === "izq" ? cx - CEL.ancho / 2 - 130 : cx + CEL.ancho / 2 + 130;
  return [x, PIES_MAX];
};

// Fuera de cuadro, por el costado que le toca a cada uno
export const FUERA: Record<Quien, Punto> = { yaeko: [-260, 900], aldrin: [-260, 900], diego: [2180, 900] };
export const FUERA_DER: Punto = [2180, 900];

const t2f = (t: number) => Math.round(t * FPS);

// ---------- Fondo ----------
export const Fondo: React.FC<{ brillo?: Punto }> = ({ brillo = [960, 500] }) => (
  <AbsoluteFill style={{ background: C.fondo }}>
    <AbsoluteFill
      style={{
        background: `radial-gradient(900px 700px at ${brillo[0]}px ${brillo[1]}px, rgba(194,24,91,0.16), rgba(21,17,16,0) 70%)`,
      }}
    />
    <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 6, display: "flex" }}>
      {Array.from({ length: 40 }).map((_, i) => (
        <div key={i} style={{ flex: 1, background: AGUAYO[i % AGUAYO.length] }} />
      ))}
    </div>
  </AbsoluteFill>
);

// ---------- Curvas ----------
export const entrar = (frame: number, t: number, dur = 0.45) =>
  spring({ frame: frame - t2f(t), fps: FPS, config: { damping: 200 }, durationInFrames: Math.round(dur * FPS) });

export const tramo = (T: number, t0: number, t1: number) =>
  interpolate(T, [t0, t1], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) });

// ---------- Celular ----------
export type Tramo =
  | { t0: number; t1: number; clip: string; desde: number; vel?: number }
  | { t0: number; t1: number; img: string; suave?: number };

// Lupa: en `t` el contenido llega a escala `s` centrado en (u, v) de la pantalla
export type Lupa = { t: number; s: number; u: number; v: number };

const lupaEn = (lupas: Lupa[], T: number) => {
  const ls = [{ t: 0, s: 1, u: 0.5, v: 0.5 }, ...lupas].sort((a, b) => a.t - b.t);
  let a = ls[0];
  let b = ls[0];
  for (let i = 0; i < ls.length; i++) {
    if (ls[i].t <= T) {
      a = ls[i];
      b = ls[Math.min(ls.length - 1, i + 1)];
    }
  }
  if (a === b || T >= b.t) return a;
  // Cada cambio de lupa dura 0,5 s y termina en la hora indicada
  const q = tramo(T, b.t - 0.5, b.t);
  return { t: T, s: a.s + (b.s - a.s) * q, u: a.u + (b.u - a.u) * q, v: a.v + (b.v - a.v) * q };
};

// El fundido entre cuadros solo ayuda en los clips entrecortados y a poca velocidad; acelerado deja fantasmas
const ENTRECORTADOS = ["e4-registro", "e6-ana", "e7-ana"];
const usarSuave = (clip: string, vel: number) => ENTRECORTADOS.includes(clip) && vel <= 2.5;

// Lo que se ve en la pantalla del celular (los tramos de clip e imágenes)
const Pantalla: React.FC<{ tramos: Tramo[] }> = ({ tramos }) => (
  <>
    {tramos.map((tr, i) => (
      <Sequence key={i} from={t2f(tr.t0)} durationInFrames={Math.max(1, t2f(tr.t1) - t2f(tr.t0)) + ("img" in tr ? 6 : 0)} layout="none">
        {"clip" in tr ? (
          <Video
            src={staticFile(`video/${usarSuave(tr.clip, tr.vel ?? 1) ? "suave" : "clips"}/${tr.clip}.mp4`)}
            trimBefore={Math.round(tr.desde * FPS)}
            playbackRate={tr.vel ?? 1}
            muted
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          <Fundido sin={tr.t0 === 0} dur={tr.suave}>
            <Img src={staticFile(tr.img.startsWith("tomas/") ? `video/${tr.img}` : `video/img/${tr.img}`)} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
          </Fundido>
        )}
      </Sequence>
    ))}
  </>
);

// Cada captura entra con un fundido corto sobre la anterior
const Fundido: React.FC<{ children: React.ReactNode; sin?: boolean; dur?: number }> = ({ children, sin, dur }) => {
  const f = useCurrentFrame();
  return <AbsoluteFill style={{ opacity: sin ? 1 : Math.min(1, f / (dur ? dur * FPS : 5)) }}>{children}</AbsoluteFill>;
};

// Toque: un círculo amarillo que se expande donde se toca (x, y en px de la pantalla de 360 × 800)
export type Toque = { t: number; x: number; y: number };
const Toques: React.FC<{ toques: Toque[] }> = ({ toques }) => {
  const frame = useCurrentFrame();
  const T = frame / FPS;
  const k = CEL.ancho / 360;
  return (
    <>
      {toques.map((q, i) => {
        const d = T - q.t;
        if (d < -0.15 || d > 0.6) return null;
        const apoyo = d < 0 ? 1 + d / 0.15 : 1;
        const onda = Math.max(0, d) / 0.6;
        return (
          <div key={i} style={{ position: "absolute", left: q.x * k, top: q.y * k, width: 0, height: 0 }}>
            <div style={{ position: "absolute", left: -22, top: -22, width: 44, height: 44, borderRadius: 22, background: "rgba(242,194,48,0.45)", border: "3px solid #F2C230", opacity: apoyo * (1 - onda), transform: `scale(${0.8 + onda * 0.6})` }} />
            <div style={{ position: "absolute", left: -22, top: -22, width: 44, height: 44, borderRadius: 22, border: "3px solid #F2C230", opacity: (1 - onda) * 0.8, transform: `scale(${1 + onda * 1.4})` }} />
          </div>
        );
      })}
    </>
  );
};

// Lupa de verdad: entre t0 y t1 se posa sobre (u, v) de la pantalla y muestra eso ampliado `m` veces.
// Si la siguiente mirada empieza poco después, la lupa se desliza hasta ella en vez de irse.
export type Mira = { t0: number; t1: number; u: number; v: number; m?: number };

const D_LUPA = 290;

const lupaEnT = (miras: Mira[], T: number) => {
  const ms = [...miras].sort((a, b) => a.t0 - b.t0);
  for (let i = 0; i < ms.length; i++) {
    const a = ms[i];
    const b = ms[i + 1];
    const llega = i > 0 && a.t0 - ms[i - 1].t1 <= 1.2 ? null : a.t0 - 0.35;
    if (llega !== null && T >= llega && T < a.t0) {
      return { u: a.u, v: a.v, m: a.m ?? 2, e: tramo(T, llega, a.t0) };
    }
    if (T >= a.t0 && T <= a.t1) return { u: a.u, v: a.v, m: a.m ?? 2, e: 1 };
    if (b && T > a.t1 && T < b.t0 && b.t0 - a.t1 <= 1.2) {
      const q = tramo(T, a.t1, b.t0);
      return { u: a.u + (b.u - a.u) * q, v: a.v + (b.v - a.v) * q, m: (a.m ?? 2) + ((b.m ?? 2) - (a.m ?? 2)) * q, e: 1 };
    }
    if ((!b || b.t0 - a.t1 > 1.2) && T > a.t1 && T < a.t1 + 0.3) {
      return { u: a.u, v: a.v, m: a.m ?? 2, e: 1 - tramo(T, a.t1, a.t1 + 0.3) };
    }
  }
  return null;
};

const LupaDibujo: React.FC<{ tramos: Tramo[]; miras: Mira[]; cx: number; escala: number }> = ({ tramos, miras, cx, escala }) => {
  const frame = useCurrentFrame();
  const T = frame / FPS;
  const l = lupaEnT(miras, T);
  if (!l || l.e <= 0.001) return null;
  const izq = cx - (CEL.ancho * escala) / 2;
  const tope = CEL.tope + (CEL.alto * (1 - escala)) / 2;
  // Centro de la lupa sobre el punto mirado (en px del lienzo)
  const px = izq + l.u * CEL.ancho * escala;
  const py = tope + l.v * CEL.alto * escala;
  const m = l.m * escala;
  const e = l.e;
  return (
    <div style={{ position: "absolute", left: px - D_LUPA / 2, top: py - D_LUPA / 2, width: D_LUPA, height: D_LUPA, transform: `scale(${0.4 + 0.6 * e}) rotate(${(1 - e) * -20}deg)`, opacity: Math.min(1, e * 1.5), zIndex: 5 }}>
      {/* Mango */}
      <div
        style={{
          position: "absolute",
          left: D_LUPA * 0.82,
          top: D_LUPA * 0.82,
          width: 34,
          height: 120,
          borderRadius: 17,
          background: "linear-gradient(90deg, #3a2f2b, #241d1b)",
          transform: "rotate(-45deg)",
          transformOrigin: "50% 0",
          boxShadow: "0 10px 24px rgba(0,0,0,0.5)",
        }}
      >
        <div style={{ position: "absolute", left: 0, right: 0, top: 18, height: 12, background: C.fucsia }} />
      </div>
      {/* Vidrio con el contenido ampliado */}
      <div style={{ position: "absolute", inset: 0, borderRadius: "50%", overflow: "hidden", background: "#0d0b0a", boxShadow: "0 18px 40px rgba(0,0,0,0.55)" }}>
        <div
          style={{
            position: "absolute",
            width: CEL.ancho,
            height: CEL.alto,
            left: D_LUPA / 2 - l.u * CEL.ancho * m,
            top: D_LUPA / 2 - l.v * CEL.alto * m,
            transform: `scale(${m})`,
            transformOrigin: "0 0",
          }}
        >
          <Pantalla tramos={tramos} />
        </div>
        <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "radial-gradient(circle at 30% 25%, rgba(255,255,255,0.18), rgba(255,255,255,0) 45%)" }} />
      </div>
      {/* Aro */}
      <div style={{ position: "absolute", inset: -9, borderRadius: "50%", border: "11px solid #EDE6DF", boxShadow: "inset 0 0 0 2px rgba(0,0,0,0.25), 0 0 0 2px rgba(0,0,0,0.35)" }} />
    </div>
  );
};

export const Telefono: React.FC<{
  tramos: Tramo[];
  // Lupa de verdad (recomendada)
  miras?: Mira[];
  // Toques animados sobre las capturas
  toques?: Toque[];
  // Acercamiento dentro del marco (anterior; ya no se usa en el video)
  lupas?: Lupa[];
  cx?: number;
  escala?: number;
  // Lo que va encima de la pantalla (pastillas, anillos), en px de la pantalla 405×900
  encima?: React.ReactNode;
  arriba?: React.ReactNode;
}> = ({ tramos, miras = [], toques = [], lupas = [], cx = 960, escala = 1, encima, arriba }) => {
  const frame = useCurrentFrame();
  const T = frame / FPS;
  const l = lupaEn(lupas, T);
  const tx = (0.5 - l.u) * CEL.ancho * (l.s - 1);
  const ty = (0.5 - l.v) * CEL.alto * (l.s - 1);
  const maxX = (CEL.ancho * (l.s - 1)) / 2;
  const maxY = (CEL.alto * (l.s - 1)) / 2;
  const x = Math.max(-maxX, Math.min(maxX, tx));
  const y = Math.max(-maxY, Math.min(maxY, ty));
  return (
    <>
      <div
        style={{
          position: "absolute",
          left: cx - CEL.ancho / 2,
          top: CEL.tope,
          width: CEL.ancho,
          height: CEL.alto,
          borderRadius: 44,
          overflow: "hidden",
          background: "#0d0b0a",
          boxShadow: "0 30px 80px rgba(0,0,0,0.55), 0 0 0 2px rgba(243,237,232,0.18)",
          transform: `scale(${escala})`,
          transformOrigin: "50% 50%",
        }}
      >
        <div style={{ position: "absolute", inset: 0, transform: `translate(${x}px, ${y}px) scale(${l.s})`, transformOrigin: "50% 50%" }}>
          <Pantalla tramos={tramos} />
          {encima}
          <Toques toques={toques} />
        </div>
        {arriba}
      </div>
      <LupaDibujo tramos={tramos} miras={miras} cx={cx} escala={escala} />
    </>
  );
};

// ---------- Cámara: acercamientos de toda la escena (los subtítulos quedan fuera) ----------
// En `t` la cámara llega a escala `s` mirando el punto (x, y) del lienzo. Cada cambio dura `dur` (0,8 s por defecto).
export type Toma = { t: number; s: number; x: number; y: number; dur?: number };

export const Camara: React.FC<{ tomas: Toma[]; children: React.ReactNode }> = ({ tomas, children }) => {
  const frame = useCurrentFrame();
  const T = frame / FPS;
  const ts = [{ t: 0, s: 1, x: 960, y: 540, dur: 0.01 }, ...tomas].sort((a, b) => a.t - b.t);
  let cur = ts[0];
  let prev = ts[0];
  for (const k of ts) {
    if (k.t - (k.dur ?? 0.8) <= T) {
      prev = cur;
      cur = k;
    }
  }
  const q = tramo(T, cur.t - (cur.dur ?? 0.8), cur.t);
  const s = prev.s + (cur.s - prev.s) * q;
  const fx = prev.x + (cur.x - prev.x) * q;
  const fy = prev.y + (cur.y - prev.y) * q;
  // El punto (fx, fy) queda en el centro del cuadro, sin mostrar bordes vacíos
  let tx = 960 - fx * s;
  let ty = 540 - fy * s;
  tx = Math.min(0, Math.max(1920 - 1920 * s, tx));
  ty = Math.min(0, Math.max(1080 - 1080 * s, ty));
  return (
    <AbsoluteFill style={{ transform: `translate(${tx}px, ${ty}px) scale(${s})`, transformOrigin: "0 0" }}>{children}</AbsoluteFill>
  );
};

// ---------- Rótulos, burbujas y anillos ----------
export const Rotulo: React.FC<{
  texto: React.ReactNode;
  x: number;
  y: number;
  t: number;
  hasta?: number;
  alinear?: "izq" | "der" | "centro";
  color?: string;
  fondo?: string;
  tam?: number;
}> = ({ texto, x, y, t, hasta = 999, alinear = "izq", color = C.tinta, fondo = "rgba(31,26,24,0.92)", tam = 26 }) => {
  const frame = useCurrentFrame();
  const T = frame / FPS;
  const e = entrar(frame, t);
  const sale = hasta < 999 ? 1 - tramo(T, hasta - 0.3, hasta) : 1;
  const o = Math.min(e, sale);
  if (o <= 0.001) return null;
  const desplazar = alinear === "der" ? "-100%" : alinear === "centro" ? "-50%" : "0";
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        transform: `translate(${desplazar}, ${(1 - e) * 14}px) scale(${0.92 + 0.08 * e})`,
        opacity: o,
        fontFamily: LETRA,
        fontWeight: 600,
        fontSize: tam,
        color,
        background: fondo,
        border: `1.5px solid ${C.linea}`,
        padding: "10px 20px",
        borderRadius: 999,
        whiteSpace: "nowrap",
      }}
    >
      {texto}
    </div>
  );
};

// Pastilla «+5 yapitas» que sube y se desvanece
export const Burbuja: React.FC<{ texto: string; x: number; y: number; t: number; color?: string; dur?: number; tam?: number }> = ({
  texto,
  x,
  y,
  t,
  color = C.naranja,
  dur = 1.8,
  tam = 34,
}) => {
  const frame = useCurrentFrame();
  const T = frame / FPS;
  if (T < t || T > t + dur) return null;
  const q = (T - t) / dur;
  const e = spring({ frame: frame - t2f(t), fps: FPS, config: { damping: 12, stiffness: 160 } });
  const o = q < 0.75 ? 1 : 1 - (q - 0.75) / 0.25;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y - q * 90,
        transform: `translate(-50%, -50%) scale(${0.6 + 0.4 * e})`,
        opacity: o,
        fontFamily: LETRA,
        fontWeight: 700,
        fontSize: tam,
        color: "#1f1a17",
        background: color,
        padding: "10px 24px",
        borderRadius: 999,
        boxShadow: `0 10px 30px ${color}66`,
        whiteSpace: "nowrap",
        display: "flex",
        alignItems: "center",
        gap: 10,
      }}
    >
      <span style={{ fontSize: tam * 0.9 }}>★</span>
      {texto}
    </div>
  );
};

export const Anillo: React.FC<{ x: number; y: number; w: number; h: number; t0: number; t1: number; color?: string; radio?: number }> = ({
  x,
  y,
  w,
  h,
  t0,
  t1,
  color = C.fucsia,
  radio = 18,
}) => {
  const frame = useCurrentFrame();
  const T = frame / FPS;
  if (T < t0 || T > t1) return null;
  const e = entrar(frame, t0, 0.35);
  const o = Math.min(e, 1 - tramo(T, t1 - 0.25, t1));
  const pulso = 1 + Math.sin((T - t0) * 2 * Math.PI * 1.2) * 0.015;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: w,
        height: h,
        border: `4px solid ${color}`,
        borderRadius: radio,
        boxShadow: `0 0 24px ${color}aa`,
        opacity: o,
        transform: `scale(${(1.15 - 0.15 * e) * pulso})`,
      }}
    />
  );
};

// ---------- Título grande con movimiento ----------
export const Cifra: React.FC<{ texto: React.ReactNode; x: number; y: number; t: number; tam?: number; color?: string; alinear?: "izq" | "centro" }> = ({
  texto,
  x,
  y,
  t,
  tam = 96,
  color = C.tinta,
  alinear = "centro",
}) => {
  const frame = useCurrentFrame();
  const e = spring({ frame: frame - t2f(t), fps: FPS, config: { damping: 14, stiffness: 140 } });
  if (frame < t2f(t)) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        transform: `translate(${alinear === "centro" ? "-50%" : "0"}, ${(1 - e) * 30}px) scale(${0.7 + 0.3 * e})`,
        opacity: Math.min(1, e * 1.4),
        fontFamily: LETRA_TITULO,
        fontWeight: 500,
        fontSize: tam,
        lineHeight: 1.05,
        color,
        whiteSpace: "nowrap",
      }}
    >
      {texto}
    </div>
  );
};

// ---------- Subtítulos (contrato §6) ----------
type Sub = { t0: number; t1: number; texto: string };

const partir = (texto: string): string[] => {
  if (texto.length <= 64) return [texto];
  const mitad = texto.length / 2;
  let mejor = -1;
  for (let i = 0; i < texto.length; i++) {
    if ((texto[i] === "," || texto[i] === "." || texto[i] === ":" || texto[i] === "?" || texto[i] === "!") && texto[i + 1] === " ") {
      if (mejor < 0 || Math.abs(i - mitad) < Math.abs(mejor - mitad)) mejor = i;
    }
  }
  if (mejor < 0) mejor = texto.lastIndexOf(" ", Math.round(mitad));
  return [texto.slice(0, mejor + 1).trim(), texto.slice(mejor + 1).trim()];
};

export const subtitulosDe = (id: IdEscena): Sub[] => {
  const out: Sub[] = [];
  for (const f of escenaVideo(id).frases) {
    const voz = VOCES[f.codigo];
    const partes = partir(voz.texto);
    const total = partes.reduce((s, p) => s + p.length, 0);
    const largo = finHabla(f) - f.t;
    let t = f.t;
    partes.forEach((p, i) => {
      const d = (p.length / total) * largo;
      out.push({ t0: t, t1: i === partes.length - 1 ? t + d + 0.2 : t + d, texto: p });
      t += d;
    });
  }
  return out;
};

export const Subtitulos: React.FC<{ id: IdEscena }> = ({ id }) => {
  const frame = useCurrentFrame();
  const T = frame / FPS;
  const s = subtitulosDe(id).find((x) => T >= x.t0 && T < x.t1);
  if (!s) return null;
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: 958, display: "flex", justifyContent: "center" }}>
      <div
        style={{
          fontFamily: LETRA,
          fontWeight: 600,
          fontSize: 36,
          lineHeight: 1.2,
          color: "#fff",
          background: "rgba(12,10,9,0.82)",
          padding: "12px 28px",
          borderRadius: 16,
          maxWidth: 1400,
          textAlign: "center",
        }}
      >
        {s.texto}
      </div>
    </div>
  );
};

// ---------- Voces y sonidos ----------
export const Voces: React.FC<{ id: IdEscena }> = ({ id }) => (
  <>
    {escenaVideo(id).frases
      .filter((f) => !VOCES[f.codigo].archivo.includes("personas"))
      .map((f) => {
        const ini = inicioArchivo(f);
        return (
          <Sequence key={f.codigo} from={Math.max(0, t2f(ini))} layout="none">
            <Audio src={staticFile(VOCES[f.codigo].archivo)} trimBefore={ini < 0 ? t2f(-ini) : undefined} />
          </Sequence>
        );
      })}
  </>
);

export type NombreSfx = "blip" | "pop" | "campanitas" | "ding" | "ding_roto" | "chispitas" | "giro" | "titulo" | "golpe" | "yei";
const VOL_SFX: Record<NombreSfx, number> = {
  yei: 0.95,
  blip: 0.12,
  pop: 0.1,
  campanitas: 0.16,
  ding: 0.13,
  ding_roto: 0.14,
  chispitas: 0.2,
  giro: 0.16,
  titulo: 0.16,
  golpe: 0.22,
};

export const Sonidos: React.FC<{ lista: [NombreSfx, number][] }> = ({ lista }) => (
  <>
    {lista.map(([n, t], i) => (
      <Sequence key={i} from={t2f(t)} layout="none">
        <Audio src={staticFile(`video/sfx/${n}.wav`)} volume={VOL_SFX[n]} />
      </Sequence>
    ))}
  </>
);

// ---------- Avatares ----------
// Arma el recorrido de los tres en una escena: las voces reales mueven la boca, y `armar` define movimientos y caras.
export const armarAvatares = (id: IdEscena, armar: (g: Guion) => void) => {
  const e = escenaVideo(id);
  const g = new Guion(`v${id}`, id, e.titulo, e.dur, []);
  for (const q of ["diego", "yaeko", "aldrin"] as Quien[]) g.empieza(q, FUERA[q], "esperar");
  for (const f of e.frases) {
    const voz = VOCES[f.codigo];
    // En la escena 1 la voz sale del video en persona: el avatar todavía no existe
    const camara = voz.archivo.includes("personas");
    g.voz(voz.quien, voz.texto, inicioArchivo(f), durArchivo(f.codigo), envDe(f.codigo), camara);
  }
  armar(g);
  return { ...g.construir(), dur: e.dur };
};

export const Avatares: React.FC<{ escena: ReturnType<typeof armarAvatares> }> = ({ escena }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <CapaAvatares escena={escena} frame={frame} />
    </AbsoluteFill>
  );
};

export const useT = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return frame / fps;
};

// ---------- Primer plano: corte a un personaje de cerca (cámara 3D propia, nítido) ----------
// Entre t0 y t1 tapa toda la escena: fondo, el personaje de cerca (a la izquierda o a la derecha del cuadro)
// y lo que se ponga en `junto` (un celular grande, una burbuja, un texto) en la otra mitad.
export const PrimerPlano: React.FC<{
  escena: ReturnType<typeof armarAvatares>;
  quien: Quien;
  t0: number;
  t1: number;
  lado?: "izq" | "der";
  cerca?: number;
  junto?: React.ReactNode;
  // Centrado y sin los demás personajes en el cuadro
  solo?: boolean;
  // Segundos de fundido al entrar y al salir del plano (0 = corte seco)
  fundido?: number;
}> = ({ escena, quien, t0, t1, lado = "izq", cerca = 170, junto, solo = false, fundido = 0 }) => {
  const frame = useCurrentFrame();
  const T = frame / FPS;
  if (T < t0 || T >= t1) return null;
  const opacidad = fundido > 0 ? tramo(T, t0, t0 + fundido) * (1 - tramo(T, t1 - fundido, t1)) : 1;
  const m = marcha(escena.personajes[quien], T);
  const [wx, wy] = aMundo(m.pos[0], m.pos[1]);
  // Empuje lento durante el plano
  const q = (T - t0) / Math.max(0.1, t1 - t0);
  const z = cerca * (1 - 0.06 * q);
  const corre = solo ? 0 : (lado === "izq" ? 1 : -1) * z * 0.15;
  return (
    <AbsoluteFill style={{ opacity: opacidad }}>
      <Fondo brillo={solo ? [960, 520] : [lado === "izq" ? 560 : 1360, 520]} />
      <CapaAvatares
        escena={escena}
        frame={frame}
        camara={{ position: [wx + corre, wy + 22, z], mira: [wx + corre, wy + 17, 0], fov: 18 }}
        solo={solo ? quien : undefined}
      />
      {junto ? <AbsoluteFill>{junto}</AbsoluteFill> : null}
    </AbsoluteFill>
  );
};

// Un cuadro que sale de la pantalla del celular hacia un costado, para leer un texto de la app.
// Con `dictado`, el texto se escribe letra por letra entre esas dos horas.
export const SaleDelCel: React.FC<{
  t0: number;
  t1: number;
  // Punto de la pantalla de donde sale (px del cuadro 1920×1080)
  desde: Punto;
  x: number;
  y: number;
  ancho?: number;
  etiqueta?: string;
  titulo?: React.ReactNode;
  texto: string;
  dictado?: [number, number];
  borde?: string;
  tam?: number;
}> = ({ t0, t1, desde, x, y, ancho = 620, etiqueta, titulo, texto, dictado, borde = C.fucsia, tam = 36 }) => {
  const frame = useCurrentFrame();
  const T = frame / FPS;
  if (T < t0 || T > t1) return null;
  const e = spring({ frame: frame - t2f(t0), fps: FPS, config: { damping: 15, stiffness: 120 } });
  const sale = tramo(T, t1 - 0.35, t1);
  const cx = desde[0] + (x - desde[0]) * e;
  const cy = desde[1] + (y - desde[1]) * e;
  const n = dictado ? Math.round(texto.length * tramo(T, dictado[0], dictado[1])) : texto.length;
  const escribiendo = dictado ? T < dictado[1] + 0.3 : false;
  const cursor = escribiendo && Math.floor(T * 2.4) % 2 === 0;
  return (
    <div
      style={{
        position: "absolute",
        left: cx,
        top: cy,
        width: ancho,
        transform: `translate(-50%, -50%) scale(${(0.3 + 0.7 * e) * (1 - 0.08 * sale)})`,
        opacity: Math.min(1, e * 2) * (1 - sale),
        background: "#241e1b",
        border: `4px solid ${borde}`,
        borderRadius: 30,
        padding: "26px 34px",
        boxShadow: `0 30px 80px rgba(0,0,0,0.6), 0 0 40px ${borde}55`,
        fontFamily: LETRA,
        color: C.tinta,
      }}
    >
      {etiqueta ? <div style={{ fontSize: tam * 0.62, color: C.apagado, marginBottom: 10 }}>{etiqueta}</div> : null}
      {titulo ? <div style={{ fontSize: tam * 1.05, fontWeight: 700, marginBottom: 8 }}>{titulo}</div> : null}
      <div style={{ fontSize: tam, lineHeight: 1.3 }}>
        {texto.slice(0, n)}
        <span style={{ opacity: cursor ? 1 : 0, color: borde }}>|</span>
      </div>
    </div>
  );
};

// Lluvia de confeti con los colores del aguayo
export const Confeti: React.FC<{ t: number; dur?: number; n?: number }> = ({ t, dur = 2.4, n = 90 }) => {
  const frame = useCurrentFrame();
  const T = frame / FPS;
  if (T < t || T > t + dur) return null;
  const q = T - t;
  const colores = ["#C2185B", "#F28C28", "#2E9E5B", "#1E5AA8", "#F2C230"];
  const piezas: React.ReactNode[] = [];
  for (let i = 0; i < n; i++) {
    const r = (k: number) => {
      const v = Math.sin(i * 12.9898 + k * 78.233) * 43758.5453;
      return v - Math.floor(v);
    };
    const x0 = 960 + (r(1) - 0.5) * 300;
    const vx = (r(2) - 0.5) * 1500;
    const vy = -900 - r(3) * 700;
    const x = x0 + vx * q * (1 - 0.25 * q);
    const y = 620 + vy * q + 900 * q * q;
    const giro = (r(4) - 0.5) * 1440 * q;
    const o = 1 - tramo(T, t + dur - 0.5, t + dur);
    piezas.push(
      <div
        key={i}
        style={{
          position: "absolute",
          left: x,
          top: y,
          width: 14 + r(5) * 10,
          height: 8 + r(6) * 6,
          background: colores[i % colores.length],
          transform: `rotate(${giro}deg) rotateX(${giro * 1.3}deg)`,
          borderRadius: 2,
          opacity: o,
        }}
      />,
    );
  }
  return <AbsoluteFill style={{ pointerEvents: "none" }}>{piezas}</AbsoluteFill>;
};
