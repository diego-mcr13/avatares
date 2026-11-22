import { useThree } from "@react-three/fiber";
import { ThreeCanvas } from "@remotion/three";
import { AbsoluteFill, Composition, useCurrentFrame, useVideoConfig } from "remotion";
import { AldrinVoxel, Escenario, SueloSombra } from "../aldrin/AldrinVoxel";
import { estadoEn as estadoAldrin } from "../aldrin/poses";
import { DiegoVoxel } from "../diegoBambino/DiegoVoxel";
import { estadoEn as estadoDiego } from "../diegoBambino/poses";
import { YaekoVoxel } from "../yaeko/YaekoVoxel";
import { estadoEn as estadoYaeko } from "../yaeko/poses";
import { ESCENAS, NOMBRE, QUIENES, VOZ, escenaPorId, type Escena, type Punto, type Quien, type Recorrido } from "./escenas";
import {
  CAM,
  CEL_ALTO,
  CEL_ANCHO,
  CEL_TOPE,
  PX_POR_VOXEL,
  W,
  H,
  aMundo,
  celIzquierda,
  type Celular,
} from "./layout";
import { VOCES } from "./voces";

const FPS = 30;
const FONT = "'Figtree', system-ui, -apple-system, 'Helvetica Neue', Arial, sans-serif";
const COLOR: Record<Quien, string> = { diego: "#22D3EE", yaeko: "#8B5CFF", aldrin: "#C6F432" };
const AGUAYO = ["#C2185B", "#F28C28", "#2E9E5B", "#1E5AA8", "#F2C230"];

const PASO = 5.5; // largo del paso en voxels
const PASO_CORRER = 8;

// ---------- Dónde está cada avatar en cada momento ----------

type Marcha = { pos: Punto; w: number; dir: -1 | 1; fase: number; correr: boolean };

const marcha = (r: Recorrido, T: number): Marcha => {
  let pos = r.inicio;
  let dir: -1 | 1 = 1;
  for (const m of r.tramos) {
    if (T < m.t0) break;
    const dx = m.hasta[0] - m.desde[0];
    if (Math.abs(dx) > 4) dir = dx > 0 ? 1 : -1;
    if (T < m.t1) {
      const q = (T - m.t0) / (m.t1 - m.t0);
      const total = Math.hypot(dx, m.hasta[1] - m.desde[1]);
      const w = Math.min(1, (T - m.t0) / 0.15, (m.t1 - T) / 0.2);
      return {
        pos: [m.desde[0] + dx * q, m.desde[1] + (m.hasta[1] - m.desde[1]) * q],
        w,
        dir,
        fase: (q * total) / PX_POR_VOXEL / (m.correr ? PASO_CORRER : PASO),
        correr: m.correr,
      };
    }
    pos = m.hasta;
  }
  return { pos, w: 0, dir, fase: 0, correr: false };
};

// ---------- Voz: la boca se mueve cuando le toca hablar ----------

const volumenDe = (escena: Escena, quien: Quien) => (frame: number) => {
  const real = VOCES[`${escena.id}-${quien}`];
  if (real) return real[frame] ?? 0;
  const T = frame / FPS;
  for (const l of escena.lineas) {
    if (l.camara || (l.quien !== quien && l.quien !== "todos")) continue;
    if (T >= l.t && T < l.t + l.dur) {
      if (l.env) return l.env[Math.floor((T - l.t) * FPS)] ?? 0;
      // Voz de ejemplo: la boca sigue el volumen del audio de esa frase
      const datos = VOZ[l.clave];
      if (datos) return datos.env[Math.floor((T - l.t) * FPS)] ?? 0;
      const entra = Math.min(1, (T - l.t) / 0.1, (l.t + l.dur - T) / 0.15);
      const silaba = Math.abs(Math.sin(T * 13.1)) * (0.5 + 0.5 * Math.abs(Math.sin(T * 4.3 + quien.length)));
      return entra * (0.2 + 0.55 * silaba);
    }
  }
  return 0;
};

// ---------- Un avatar ----------

const ESTADO_EN = { diego: estadoDiego, yaeko: estadoYaeko, aldrin: estadoAldrin };
const VOXEL = { diego: DiegoVoxel, yaeko: YaekoVoxel, aldrin: AldrinVoxel };

const Avatar: React.FC<{ quien: Quien; escena: Escena; frame: number }> = ({ quien, escena, frame }) => {
  const r = escena.personajes[quien];
  const T = frame / FPS;
  const m = marcha(r, T);
  // De pie mira un poco hacia el centro de la pantalla; al caminar mira hacia donde va
  const haciaElCentro = Math.max(-0.45, Math.min(0.45, ((W / 2 - m.pos[0]) / (W / 2)) * 0.45));
  const estado = ESTADO_EN[quien]({
    frame,
    fps: FPS,
    claves: r.claves,
    volumen: volumenDe(escena, quien),
    movimientos: r.apareceEn !== null ? [{ tipo: "aparecer", t: r.apareceEn, dur: 0.7 }] : [],
    giro: haciaElCentro * (1 - m.w),
    caminata: { fase: m.fase, w: m.w, dir: m.dir, correr: m.correr },
  });
  const [wx, wy] = aMundo(m.pos[0], m.pos[1]);
  const Voxel = VOXEL[quien];
  // Caída (escena 1): no se ve antes de `t`; cae con gravedad, choca, se cae de lado y se levanta
  let dy = 0;
  let rot = 0;
  let aplastar = 1;
  if (r.caida) {
    const { t, lado } = r.caida;
    if (T < t) return null;
    const CAE = 0.45;
    const q = Math.min(1, (T - t) / CAE);
    dy = 120 * (1 - q * q);
    const choque = T - t - CAE;
    if (choque >= 0 && choque < 0.18) aplastar = 1 - 0.28 * Math.sin((choque / 0.18) * Math.PI);
    const tumba = Math.min(1, Math.max(0, (T - t - CAE - 0.05) / 0.22));
    const vuelve = Math.min(1, Math.max(0, (T - t - 1.25) / 0.4));
    const ease = (x: number) => 1 - Math.pow(1 - x, 3);
    rot = lado * 1.45 * ease(tumba) * (1 - ease(vuelve));
    // Saltito al levantarse
    if (vuelve > 0 && vuelve < 1) dy += Math.sin(vuelve * Math.PI) * 5;
  }
  const estadoFinal = r.caida ? { ...estado, escala: [estado.escala[0] * (2 - aplastar), estado.escala[1] * aplastar, estado.escala[2]] as [number, number, number] } : estado;
  return (
    <group>
      {dy < 25 ? <SueloSombra position={[wx, wy, 0]} ancho={46} fondo={36} /> : null}
      <group position={[wx, wy + dy, 0]} rotation={[0, 0, rot]}>
        <Voxel estado={estadoFinal} position={[0, 0, 0]} />
      </group>
    </group>
  );
};

const Mirar: React.FC = () => {
  const camera = useThree((st) => st.camera);
  camera.lookAt(0, 0, 0);
  return null;
};

// ---------- Vista previa: marcos de celular, nombres y subtítulos (no va en el render final) ----------

const Celulares: React.FC<{ celulares: Celular[] }> = ({ celulares }) => (
  <>
    {celulares.map((c) => (
      <div
        key={c}
        style={{
          position: "absolute",
          left: celIzquierda(c),
          top: CEL_TOPE,
          width: CEL_ANCHO,
          height: CEL_ALTO,
          background: "#151110",
          border: "1px solid #3a322d",
          borderRadius: 28,
          overflow: "hidden",
        }}
      >
        <div style={{ display: "flex", height: 3 }}>
          {AGUAYO.map((a) => (
            <div key={a} style={{ flex: 1, background: a }} />
          ))}
        </div>
        <div style={{ fontFamily: FONT, color: "#6f635b", fontSize: 26, textAlign: "center", marginTop: 420 }}>
          {c === "U" ? "Celular" : c === "A" ? "Celular A · Ana" : "Celular B · Luis"}
        </div>
      </div>
    ))}
  </>
);

const Previa: React.FC<{ escena: Escena; frame: number }> = ({ escena, frame }) => {
  const T = frame / FPS;
  return (
    <>
      <AbsoluteFill style={{ background: "#0C0A09" }} />
      <Celulares celulares={escena.celulares} />
      <AbsoluteFill style={{ pointerEvents: "none" }}>
        {QUIENES.map((q) => {
          const m = marcha(escena.personajes[q], T);
          if (escena.personajes[q].apareceEn !== null && T < (escena.personajes[q].apareceEn ?? 0)) return null;
          return (
            <div
              key={q}
              style={{
                position: "absolute",
                left: m.pos[0],
                top: m.pos[1] - 345,
                transform: "translateX(-50%)",
                fontFamily: FONT,
                fontWeight: 700,
                fontSize: 22,
                color: "#0C0A09",
                background: COLOR[q],
                padding: "2px 12px",
                borderRadius: 999,
              }}
            >
              {NOMBRE[q]}
            </div>
          );
        })}
      </AbsoluteFill>
    </>
  );
};

const Subtitulo: React.FC<{ escena: Escena; T: number }> = ({ escena, T }) => {
  const linea = escena.lineas.find((l) => T >= l.t && T < l.t + l.dur + 0.2);
  if (!linea) return null;
  const color = linea.quien === "todos" ? "#F2F0EA" : COLOR[linea.quien];
  const nombre = linea.quien === "todos" ? "Los tres" : NOMBRE[linea.quien];
  const partes = linea.texto.split("**");
  return (
    <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: 26 }}>
      <div
        style={{
          fontFamily: FONT,
          color: "#fff",
          background: "rgba(12,10,9,0.86)",
          padding: "14px 28px",
          borderRadius: 16,
          fontSize: 34,
          maxWidth: 1500,
          textAlign: "center",
          lineHeight: 1.25,
        }}
      >
        <span style={{ color, fontWeight: 800, marginRight: 14 }}>
          {nombre}
          {linea.camara ? " (en cámara)" : ""}
        </span>
        {partes.map((p, i) => (
          <span key={i} style={i % 2 === 1 ? { color: "#F8A8C6", fontWeight: 800 } : undefined}>
            {p}
          </span>
        ))}
      </div>
    </AbsoluteFill>
  );
};

// ---------- La escena ----------

// Los tres avatares sobre fondo transparente (se usa también en las escenas de ejemplo)
export const CapaAvatares: React.FC<{ escena: Escena; frame: number }> = ({ escena, frame }) => {
  const { width, height } = useVideoConfig();
  return (
    <ThreeCanvas width={width} height={height} camera={CAM} shadows flat>
      <Mirar />
      <Escenario>
        {QUIENES.map((q) => (
          <Avatar key={q} quien={q} escena={escena} frame={frame} />
        ))}
      </Escenario>
    </ThreeCanvas>
  );
};

type Props = { idEscena: string; previa: boolean };

const ElencoEscena: React.FC<Props> = ({ idEscena, previa }) => {
  const frame = useCurrentFrame();
  const escena = escenaPorId(idEscena);
  return (
    <AbsoluteFill>
      {previa ? <Previa escena={escena} frame={frame} /> : null}
      <CapaAvatares escena={escena} frame={frame} />
      {previa ? <Subtitulo escena={escena} T={frame / FPS} /> : null}
    </AbsoluteFill>
  );
};

export const ElencoComposition = () => (
  <>
    {ESCENAS.map((e) => (
      <Composition
        key={e.id}
        id={`Escena${e.id}`}
        component={ElencoEscena}
        durationInFrames={Math.round(e.dur * FPS)}
        fps={FPS}
        width={W}
        height={H}
        defaultProps={{ idEscena: e.id, previa: false }}
      />
    ))}
    {ESCENAS.map((e) => (
      <Composition
        key={`p${e.id}`}
        id={`Escena${e.id}Previa`}
        component={ElencoEscena}
        durationInFrames={Math.round(e.dur * FPS)}
        fps={FPS}
        width={W}
        height={H}
        defaultProps={{ idEscena: e.id, previa: true }}
      />
    ))}
  </>
);
