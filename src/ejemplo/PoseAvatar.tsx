import { useThree } from "@react-three/fiber";
import { ThreeCanvas } from "@remotion/three";
import { AbsoluteFill, Composition, useVideoConfig } from "remotion";
import { AldrinVoxel, Escenario, SueloSombra } from "../aldrin/AldrinVoxel";
import { estadoFijo as fijoAldrin, type PoseNombre } from "../aldrin/poses";
import { DiegoVoxel } from "../diegoBambino/DiegoVoxel";
import { estadoFijo as fijoDiego } from "../diegoBambino/poses";
import type { Quien } from "../elenco/escenas";
import { YaekoVoxel } from "../yaeko/YaekoVoxel";
import { estadoFijo as fijoYaeko } from "../yaeko/poses";

// Un solo avatar con fondo transparente, para la presentación y las miniaturas.
// Se exporta con `node scripts/exportar-poses.mjs` a out/poses/<quien>-<pose>.png

const CAM = { fov: 18, near: 10, far: 1500, position: [0, 6, 135] as [number, number, number] };
const FIJO = { diego: fijoDiego, yaeko: fijoYaeko, aldrin: fijoAldrin };
const VOXEL = { diego: DiegoVoxel, yaeko: YaekoVoxel, aldrin: AldrinVoxel };

const Mirar: React.FC = () => {
  const camera = useThree((st) => st.camera);
  camera.lookAt(0, 5, 0);
  return null;
};

export type PropsPose = { quien: Quien; pose: PoseNombre; giro: number };

export const PoseAvatar: React.FC<PropsPose> = ({ quien, pose, giro }) => {
  const { width, height } = useVideoConfig();
  const Voxel = VOXEL[quien];
  return (
    <AbsoluteFill>
      <ThreeCanvas width={width} height={height} camera={CAM} shadows flat>
        <Mirar />
        <Escenario>
          <SueloSombra position={[0, -13, 0]} ancho={60} fondo={40} />
          <Voxel estado={FIJO[quien](pose, giro)} position={[0, -13, 0]} />
        </Escenario>
      </ThreeCanvas>
    </AbsoluteFill>
  );
};

export const PoseAvatarComposition = () => (
  <Composition
    id="PoseAvatar"
    component={PoseAvatar}
    durationInFrames={1}
    fps={30}
    width={800}
    height={1000}
    defaultProps={{ quien: "yaeko" as Quien, pose: "saludar" as PoseNombre, giro: 0.2 }}
  />
);
