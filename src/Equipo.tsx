import { useThree } from "@react-three/fiber";
import { ThreeCanvas } from "@remotion/three";
import { useMemo } from "react";
import { AbsoluteFill, Composition, useVideoConfig } from "remotion";
import * as THREE from "three";
import { AldrinVoxel } from "./aldrin/AldrinVoxel";
import { estadoFijo, type PoseNombre } from "./aldrin/poses";
import { DiegoVoxel } from "./diegoBambino/DiegoVoxel";
import { Escenario, SueloSombra, YaekoVoxel } from "./yaeko/YaekoVoxel";

// Foto del equipo CodeBambinos: Diego, Yaeko y Aldrin con el mismo outfit.
// Colores de la marca (Tinta, Papel, Lima, Violeta, Cian).
const FONT = "'Space Grotesk', system-ui, -apple-system, 'Helvetica Neue', Arial, sans-serif";
const C = { tinta: "#16151A", papel: "#F2F0EA", lima: "#C6F432", violeta: "#8B5CFF", cian: "#22D3EE" };

type Quien = "diego" | "yaeko" | "aldrin";
type Integrante = { quien: Quien; nombre: string; rol: string; x: number; pose: PoseNombre; giro: number };

const EQUIPO: Integrante[] = [
  { quien: "diego", nombre: "Diego", rol: "Líder técnico", x: -46, pose: "hablar", giro: 0.3 },
  { quien: "yaeko", nombre: "Yaeko", rol: "Marca y producto", x: 0, pose: "saludar", giro: 0 },
  { quien: "aldrin", nombre: "Aldrin", rol: "Interfaz", x: 46, pose: "triunfo", giro: -0.3 },
];

const CAM = { fov: 18, near: 10, far: 1500, position: [0, 14, 250] as [number, number, number] };
const SUELO = -20;

// Apunta la cámara al centro de la fila
const Mirar: React.FC = () => {
  const camera = useThree((st) => st.camera);
  camera.lookAt(0, -4, 0);
  return null;
};

const fondo: React.CSSProperties = {
  background: C.papel,
  backgroundImage:
    "linear-gradient(rgba(22,21,26,0.045) 2px, transparent 2px), linear-gradient(90deg, rgba(22,21,26,0.045) 2px, transparent 2px)",
  backgroundSize: "48px 48px",
};

const Equipo: React.FC = () => {
  const { width, height } = useVideoConfig();
  const proyectar = useMemo(() => {
    const cam = new THREE.PerspectiveCamera(CAM.fov, width / height, 0.1, 2000);
    cam.position.set(...CAM.position);
    cam.lookAt(0, -4, 0);
    cam.updateMatrixWorld();
    return (x: number, y: number) => {
      const v = new THREE.Vector3(x, y, 0).project(cam);
      return { left: ((v.x + 1) / 2) * width, top: ((1 - v.y) / 2) * height };
    };
  }, [width, height]);

  return (
    <AbsoluteFill style={fondo}>
      <AbsoluteFill style={{ alignItems: "center", paddingTop: 70 }}>
        <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 84, color: C.tinta, letterSpacing: -2 }}>CodeBambinos</div>
        <div style={{ display: "flex", gap: 16, marginTop: 14 }}>
          {[C.violeta, C.cian, C.lima].map((c) => (
            <div key={c} style={{ width: 22, height: 22, borderRadius: 11, background: c }} />
          ))}
        </div>
      </AbsoluteFill>
      <ThreeCanvas width={width} height={height} camera={CAM} shadows flat>
        <Mirar />
        <Escenario>
          {EQUIPO.map((m) => {
            const estado = { ...estadoFijo(m.pose), giro: m.giro };
            return (
              <group key={m.quien}>
                <SueloSombra position={[m.x, SUELO, 0]} ancho={40} fondo={30} />
                {m.quien === "diego" ? <DiegoVoxel estado={estado} position={[m.x, SUELO, 0]} /> : null}
                {m.quien === "yaeko" ? <YaekoVoxel estado={estado} position={[m.x, SUELO, 0]} /> : null}
                {m.quien === "aldrin" ? <AldrinVoxel estado={estado} position={[m.x, SUELO, 0]} /> : null}
              </group>
            );
          })}
        </Escenario>
      </ThreeCanvas>
      {EQUIPO.map((m) => {
        const { left, top } = proyectar(m.x, SUELO - 3);
        return (
          <div
            key={m.quien}
            style={{
              position: "absolute",
              left,
              top,
              transform: "translateX(-50%)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 8,
              fontFamily: FONT,
            }}
          >
            <div style={{ fontWeight: 700, fontSize: 34, color: C.lima, background: C.tinta, padding: "6px 22px" }}>
              {m.nombre}
            </div>
            <div style={{ fontWeight: 400, fontSize: 24, color: C.tinta }}>{m.rol}</div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

export const EquipoComposition = () => (
  <Composition id="EquipoCodeBambinos" component={Equipo} durationInFrames={1} fps={30} width={1920} height={1080} />
);
