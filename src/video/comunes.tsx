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
import { CapaAvatares } from "../elenco/Elenco";
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
  | { t0: number; t1: number; img: string };

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

export const Telefono: React.FC<{
  tramos: Tramo[];
  lupas?: Lupa[];
  cx?: number;
  escala?: number;
  // Lo que va encima de la pantalla y se mueve con la lupa (pastillas, anillos), en px de la pantalla 405×900
  encima?: React.ReactNode;
  // Lo que va encima sin lupa
  arriba?: React.ReactNode;
}> = ({ tramos, lupas = [], cx = 960, escala = 1, encima, arriba }) => {
  const frame = useCurrentFrame();
  const T = frame / FPS;
  const l = lupaEn(lupas, T);
  // Con lupa, el punto (u, v) se acerca al centro de la pantalla para que el botón quede a la vista
  const tx = (0.5 - l.u) * CEL.ancho * (l.s - 1);
  const ty = (0.5 - l.v) * CEL.alto * (l.s - 1);
  const maxX = (CEL.ancho * (l.s - 1)) / 2;
  const maxY = (CEL.alto * (l.s - 1)) / 2;
  const x = Math.max(-maxX, Math.min(maxX, tx));
  const y = Math.max(-maxY, Math.min(maxY, ty));
  return (
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
        {tramos.map((tr, i) => (
          <Sequence key={i} from={t2f(tr.t0)} durationInFrames={Math.max(1, t2f(tr.t1) - t2f(tr.t0))} layout="none">
            {"clip" in tr ? (
              <Video
                src={staticFile(`video/${usarSuave(tr.clip, tr.vel ?? 1) ? "suave" : "clips"}/${tr.clip}.mp4`)}
                trimBefore={Math.round(tr.desde * FPS)}
                playbackRate={tr.vel ?? 1}
                muted
                style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
              />
            ) : (
              <Img src={staticFile(`video/img/${tr.img}`)} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
            )}
          </Sequence>
        ))}
        {encima}
      </div>
      {arriba}
    </div>
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

export type NombreSfx = "blip" | "pop" | "campanitas" | "ding" | "ding_roto" | "chispitas" | "giro" | "titulo";
const VOL_SFX: Record<NombreSfx, number> = {
  blip: 0.12,
  pop: 0.1,
  campanitas: 0.16,
  ding: 0.13,
  ding_roto: 0.14,
  chispitas: 0.2,
  giro: 0.16,
  titulo: 0.16,
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
