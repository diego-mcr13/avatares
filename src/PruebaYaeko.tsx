import { useThree } from "@react-three/fiber";
import { ThreeCanvas } from "@remotion/three";
import { useMemo } from "react";
import { AbsoluteFill, Audio, Composition, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import * as THREE from "three";
import envolventeJson from "./data/envolvente.json";
import palabrasJson from "./data/palabras_corta.json";
import { Escenario, YaekoVoxel, SueloSombra } from "./yaeko/YaekoVoxel";
import {
  ETIQUETA_MOV,
  POSES,
  estadoEn,
  estadoFijo,
  type Clave,
  type Movimiento,
  type PoseNombre,
} from "./yaeko/poses";

const FPS = 30;
const FONT = "system-ui, -apple-system, 'Helvetica Neue', Arial, sans-serif";
const C = { tinta: "#14110F", papel: "#F6F3EE", lima: "#C6F432" };

const ENVOLVENTE = envolventeJson as number[];
const PALABRAS = (palabrasJson as { words: { start: number; end: number; word: string }[] }).words;

// Tramo de voz que usa la prueba: "Este video va a estar editado..." hasta "...inicia sesión."
const FIN_VOZ = 13.6;
const DURACION = 17;

// Pose en cada momento, alineada con lo que dice la voz
const CLAVES: Clave[] = [
  { t: 0, pose: "neutral" }, // entra a escena
  { t: 1.25, pose: "saludar" }, // "...video va a estar editado"
  { t: 2.3, pose: "triunfo" }, // "100 %"
  { t: 3.45, pose: "senalar" }, // "con Claude"
  { t: 4.25, pose: "apuntar" }, // "te voy a enseñar"
  { t: 5.2, pose: "hablar" }, // "cómo hacerlo"
  { t: 6.0, pose: "pensar" }, // "Primero, necesitas..."
  { t: 7.4, pose: "senalar" }, // "la app de Claude para escritorio"
  { t: 9.9, pose: "escribir" }, // "La descargas, la abres e inicia sesión"
  { t: 12.75, pose: "sorpresa" }, // "sesión."
  { t: 13.7, pose: "rascar" },
  { t: 14.6, pose: "celebrar" },
  { t: 15.4, pose: "neutral" }, // sale de escena
];

// Entradas y salidas de cada personaje
const MOVIMIENTOS: Movimiento[] = [
  { tipo: "entrarCaminando", t: 0, dur: 1.3, lado: -1 },
  { tipo: "salirCaminando", t: 15.45, dur: 1.45, lado: 1 },
];

const volumen = (frame: number) => (frame >= 0 && frame < FIN_VOZ * FPS ? ENVOLVENTE[frame] ?? 0 : 0);

const fondoPixel: React.CSSProperties = {
  background: C.papel,
  backgroundImage:
    "linear-gradient(rgba(20,17,15,0.045) 2px, transparent 2px), linear-gradient(90deg, rgba(20,17,15,0.045) 2px, transparent 2px)",
  backgroundSize: "48px 48px",
};

const Etiqueta: React.FC<{ arriba: string; texto: string }> = ({ arriba, texto }) => (
  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
    <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 30, letterSpacing: 4, color: C.tinta, opacity: 0.55 }}>
      {arriba}
    </div>
    <div
      style={{
        fontFamily: FONT,
        fontWeight: 800,
        fontSize: 64,
        letterSpacing: 2,
        color: C.lima,
        background: C.tinta,
        padding: "14px 34px",
        textTransform: "uppercase",
      }}
    >
      {texto}
    </div>
  </div>
);

// Subtítulo de 3 palabras con la palabra activa resaltada (para revisar la boca)
const Subtitulo: React.FC<{ T: number }> = ({ T }) => {
  if (T > FIN_VOZ) return null;
  // Última palabra que ya empezó
  let idx = -1;
  PALABRAS.forEach((p, k) => {
    if (p.start <= T) idx = k;
  });
  if (idx < 0) return null;
  const hablando = T < PALABRAS[idx].end + 0.15;
  const inicio = Math.floor(idx / 3) * 3;
  const grupo = PALABRAS.slice(inicio, inicio + 3);
  return (
    <div style={{ display: "flex", gap: 18, justifyContent: "center", flexWrap: "wrap", padding: "0 60px" }}>
      {grupo.map((p, j) => {
        const activa = hablando && inicio + j === idx;
        return (
          <span
            key={`${inicio + j}`}
            style={{
              fontFamily: FONT,
              fontWeight: 800,
              fontSize: 62,
              textTransform: "uppercase",
              color: activa ? C.lima : C.papel,
              background: C.tinta,
              padding: "8px 18px",
            }}
          >
            {p.word}
          </span>
        );
      })}
    </div>
  );
};

const SUELO = -13;

const PruebaYaekoVideo: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const T = frame / FPS;
  const estado = estadoEn({ frame, fps: FPS, claves: CLAVES, volumen, movimientos: MOVIMIENTOS });
  const etiqueta = estado.movimiento ? ETIQUETA_MOV[estado.movimiento] : POSES[estado.nombre].etiqueta;

  return (
    <AbsoluteFill style={fondoPixel}>
      <ThreeCanvas width={width} height={height} camera={{ fov: 18, near: 10, far: 1500, position: [0, 40, 215] }} shadows flat>
        <Escenario suelo={SUELO}>
          <YaekoVoxel estado={estado} position={[0, SUELO, 0]} />
        </Escenario>
      </ThreeCanvas>
      <AbsoluteFill style={{ justifyContent: "flex-start", alignItems: "center", paddingTop: 170 }}>
        <Etiqueta arriba="YAEKO · PRUEBA DE PERSONAJE" texto={etiqueta} />
      </AbsoluteFill>
      <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: 260 }}>
        <Subtitulo T={T} />
      </AbsoluteFill>
      <Sequence durationInFrames={Math.round(FIN_VOZ * FPS)}>
        <Audio src={staticFile("voz_corta.wav")} />
      </Sequence>
    </AbsoluteFill>
  );
};

// ---------- Hoja de poses (imagen fija) ----------

const HOJA: PoseNombre[] = [
  "neutral",
  "hablar",
  "saludar",
  "celebrar",
  "senalar",
  "apuntar",
  "pensar",
  "encoger",
  "sorpresa",
  "escribir",
  "triunfo",
  "rascar",
];
// near en 10 (no 0,1): con la cámara lejos, la profundidad no alcanza para separar los rasgos de la cara
// (están 0,12 voxels delante) y parpadean o desaparecen cuando la cabeza gira
const CAM_HOJA = { fov: 18, near: 10, far: 1500, position: [0, 40, 440] as [number, number, number] };
const COLUMNAS = [-90, -30, 30, 90];
const FILAS = [32, -12, -56]; // altura de los pies de cada fila

const HojaPoses: React.FC = () => {
  const { width, height } = useVideoConfig();
  // Proyecta un punto 3D a la pantalla para poner el nombre debajo de cada personaje
  const proyectar = useMemo(() => {
    const cam = new THREE.PerspectiveCamera(CAM_HOJA.fov, width / height, 0.1, 2000);
    cam.position.set(...CAM_HOJA.position);
    cam.lookAt(0, 0, 0);
    cam.updateMatrixWorld();
    return (x: number, y: number) => {
      const v = new THREE.Vector3(x, y, 0).project(cam);
      return { left: ((v.x + 1) / 2) * width, top: ((1 - v.y) / 2) * height };
    };
  }, [width, height]);

  return (
    <AbsoluteFill style={fondoPixel}>
      <ThreeCanvas width={width} height={height} camera={CAM_HOJA} shadows flat>
        <Escenario>
          {HOJA.map((nombre, i) => {
            const x = COLUMNAS[i % 4];
            const y = FILAS[Math.floor(i / 4)];
            return (
              <group key={nombre}>
                <SueloSombra position={[x, y, 0]} ancho={56} fondo={40} />
                <YaekoVoxel estado={estadoFijo(nombre)} position={[x, y, 0]} />
              </group>
            );
          })}
        </Escenario>
      </ThreeCanvas>
      {HOJA.map((nombre, i) => {
        const { left, top } = proyectar(COLUMNAS[i % 4], FILAS[Math.floor(i / 4)] - 3);
        return (
          <div
            key={nombre}
            style={{
              position: "absolute",
              left,
              top,
              transform: "translateX(-50%)",
              fontFamily: FONT,
              fontWeight: 800,
              fontSize: 22,
              letterSpacing: 2,
              textTransform: "uppercase",
              color: C.lima,
              background: C.tinta,
              padding: "6px 14px",
              whiteSpace: "nowrap",
            }}
          >
            {POSES[nombre].etiqueta}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

// ---------- Hoja de giro: el dev desde 4 ángulos (para comparar con las fotos) ----------

type Vista = { nombre: string; giro: number; pose?: PoseNombre; explotado?: boolean };
const GIRO: Vista[] = [
  { nombre: "Frente", giro: 0 },
  { nombre: "Tres cuartos", giro: 0.65 },
  { nombre: "Perfil", giro: Math.PI / 2 },
  { nombre: "Espalda", giro: Math.PI },
];
// Poses de estrés y cómo queda después de una explosión
const ESTRES: Vista[] = [
  { nombre: "Desesperarse", giro: 0.3, pose: "desesperar" },
  { nombre: "Facepalm", giro: 0.3, pose: "facepalm" },
  { nombre: "Ansioso", giro: 0.3, pose: "ansioso" },
  { nombre: "Explotado", giro: 0.3, explotado: true },
];
const CAM_GIRO = { fov: 18, near: 10, far: 1500, position: [0, 14, 250] as [number, number, number] };
const GIRO_X = [-51, -17, 17, 51];
const GIRO_SUELO = -20;

// Apunta la cámara al centro de la fila
const Mirar: React.FC = () => {
  const camera = useThree((st) => st.camera);
  camera.lookAt(0, -4, 0);
  return null;
};

const HojaGiro: React.FC<{ vistas: Vista[] }> = ({ vistas }) => {
  const { width, height } = useVideoConfig();
  const proyectar = useMemo(() => {
    const cam = new THREE.PerspectiveCamera(CAM_GIRO.fov, width / height, 0.1, 2000);
    cam.position.set(...CAM_GIRO.position);
    cam.lookAt(0, -4, 0);
    cam.updateMatrixWorld();
    return (x: number, y: number) => {
      const v = new THREE.Vector3(x, y, 0).project(cam);
      return { left: ((v.x + 1) / 2) * width, top: ((1 - v.y) / 2) * height };
    };
  }, [width, height]);
  return (
    <AbsoluteFill style={fondoPixel}>
      <ThreeCanvas width={width} height={height} camera={CAM_GIRO} shadows flat>
        <Mirar />
        <Escenario>
          {vistas.map((g, i) => (
            <group key={g.nombre}>
              <SueloSombra position={[GIRO_X[i], GIRO_SUELO, 0]} ancho={34} fondo={30} />
              <YaekoVoxel
                estado={{ ...estadoFijo(g.pose ?? "neutral"), giro: g.giro }}
                position={[GIRO_X[i], GIRO_SUELO, 0]}
                explotado={g.explotado}
              />
            </group>
          ))}
        </Escenario>
      </ThreeCanvas>
      {vistas.map((g, i) => {
        const { left, top } = proyectar(GIRO_X[i], GIRO_SUELO - 3);
        return (
          <div
            key={g.nombre}
            style={{
              position: "absolute",
              left,
              top,
              transform: "translateX(-50%)",
              fontFamily: FONT,
              fontWeight: 800,
              fontSize: 22,
              letterSpacing: 2,
              textTransform: "uppercase",
              color: C.lima,
              background: C.tinta,
              padding: "6px 14px",
              whiteSpace: "nowrap",
            }}
          >
            {g.nombre}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

export const PruebaYaekoComposition = () => (
  <>
    <Composition
      id="PruebaYaeko"
      component={PruebaYaekoVideo}
      durationInFrames={DURACION * FPS}
      fps={FPS}
      width={1080}
      height={1920}
    />
    <Composition
      id="YaekoPoses"
      component={HojaPoses}
      durationInFrames={1}
      fps={FPS}
      width={1920}
      height={1080}
    />
    <Composition
      id="YaekoGiro"
      component={HojaGiro}
      durationInFrames={1}
      fps={FPS}
      width={1920}
      height={1080}
      defaultProps={{ vistas: GIRO }}
    />
    <Composition
      id="YaekoEstres"
      component={HojaGiro}
      durationInFrames={1}
      fps={FPS}
      width={1920}
      height={1080}
      defaultProps={{ vistas: ESTRES }}
    />
  </>
);
