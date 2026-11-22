import { ThreeCanvas } from "@remotion/three";
import { AbsoluteFill, Composition, useVideoConfig } from "remotion";
import { useMemo } from "react";
import * as THREE from "three";
import { AldrinVoxel, Escenario, SueloSombra } from "../aldrin/AldrinVoxel";
import { POSES as POSES_ALDRIN, estadoFijo as fijoAldrin, type PoseNombre } from "../aldrin/poses";
import { DiegoVoxel } from "../diegoBambino/DiegoVoxel";
import { estadoFijo as fijoDiego } from "../diegoBambino/poses";
import { YaekoVoxel } from "../yaeko/YaekoVoxel";
import { estadoFijo as fijoYaeko } from "../yaeko/poses";
import type { Quien } from "./escenas";
import { NOMBRE } from "./escenas";

// Hoja con las poses que usa el video: las 12 que se ven en pantalla mientras el avatar camina y señala la app.
const FONT = "'Figtree', system-ui, -apple-system, 'Helvetica Neue', Arial, sans-serif";
const C = { tinta: "#14110F", papel: "#F6F3EE", lima: "#C6F432" };

const HOJA: PoseNombre[] = [
  "caminar",
  "correr",
  "senalar",
  "senalarIzq",
  "senalarArriba",
  "senalarAbajo",
  "tocar",
  "deslizar",
  "aplaudir",
  "esperar",
  "escribir",
  "triunfo",
];

const CAM_HOJA = { fov: 18, near: 10, far: 1500, position: [0, 40, 440] as [number, number, number] };
const COLUMNAS = [-90, -30, 30, 90];
const FILAS = [32, -12, -56];

const FIJO = { diego: fijoDiego, yaeko: fijoYaeko, aldrin: fijoAldrin };
const VOXEL = { diego: DiegoVoxel, yaeko: YaekoVoxel, aldrin: AldrinVoxel };

const HojaVideo: React.FC<{ quien: Quien }> = ({ quien }) => {
  const { width, height } = useVideoConfig();
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
  const Voxel = VOXEL[quien];
  return (
    <AbsoluteFill
      style={{
        background: C.papel,
        backgroundImage:
          "linear-gradient(rgba(20,17,15,0.045) 2px, transparent 2px), linear-gradient(90deg, rgba(20,17,15,0.045) 2px, transparent 2px)",
        backgroundSize: "48px 48px",
      }}
    >
      <ThreeCanvas width={width} height={height} camera={CAM_HOJA} shadows flat>
        <Escenario>
          {HOJA.map((nombre, i) => {
            const x = COLUMNAS[i % 4];
            const y = FILAS[Math.floor(i / 4)];
            return (
              <group key={nombre}>
                <SueloSombra position={[x, y, 0]} ancho={56} fondo={40} />
                <Voxel estado={FIJO[quien](nombre)} position={[x, y, 0]} />
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
            {POSES_ALDRIN[nombre].etiqueta}
          </div>
        );
      })}
      <div
        style={{
          position: "absolute",
          top: 8,
          left: 48,
          fontFamily: FONT,
          fontWeight: 800,
          fontSize: 26,
          color: C.tinta,
        }}
      >
        {NOMBRE[quien]} · poses del video
      </div>
    </AbsoluteFill>
  );
};

export const HojaVideoComposition = () => (
  <>
    {(["diego", "yaeko", "aldrin"] as Quien[]).map((q) => (
      <Composition
        key={q}
        id={`${NOMBRE[q]}PosesVideo`}
        component={HojaVideo}
        durationInFrames={1}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{ quien: q }}
      />
    ))}
  </>
);
