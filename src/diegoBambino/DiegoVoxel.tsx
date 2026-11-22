import { useMemo } from "react";
import {
  BOCA_VARIANTES,
  CEJA_VARIANTES,
  ESQUELETO,
  OJO_VARIANTES,
  antebrazo,
  boca,
  brazo,
  cabeza,
  ceja,
  hollinCara,
  ojos,
  pelo,
  peloExplotado,
  pierna,
  torso,
} from "./modelo";
import { Destello, Laptop } from "./efectos";
import { Celular } from "../bambinos/Celular";
import { crearPieza, crearVariantes } from "./piezas";
import type { Estado, Rot } from "./poses";

const usePiezas = () =>
  useMemo(
    () => ({
      cabeza: crearPieza(cabeza()),
      pelo: crearPieza(pelo()),
      peloExplotado: crearPieza(peloExplotado()),
      hollin: crearPieza(hollinCara()),
      torso: crearPieza(torso()),
      brazoIzq: crearPieza(brazo()),
      antebrazoIzq: crearPieza(antebrazo()),
      brazoDer: crearPieza(brazo()),
      antebrazoDer: crearPieza(antebrazo()),
      piernaIzq: crearPieza(pierna()),
      piernaDer: crearPieza(pierna()),
      ojos: crearVariantes(OJO_VARIANTES, ojos),
      cejaIzq: crearVariantes(CEJA_VARIANTES, (v) => ceja(v, "izq")),
      cejaDer: crearVariantes(CEJA_VARIANTES, (v) => ceja(v, "der")),
      boca: crearVariantes(BOCA_VARIANTES, boca),
    }),
    [],
  );

const r = (rot: Rot): [number, number, number] => [rot[0], rot[1], rot[2]];

type Props = {
  // Muestra un celular en vez de la laptop (gesto «escribir»)
  celular?: boolean;
  estado: Estado;
  position?: [number, number, number];
  escala?: number;
  // Después de una explosión: pelo esponjado y chamuscado y hollín en la cara
  explotado?: boolean;
};

// Diego con el outfit de CodeBambinos: canguro negro con el logo del equipo, jeans negros y tenis blancos
export const DiegoVoxel: React.FC<Props> = ({ estado, position = [0, 0, 0], escala = 1, celular = false, explotado = false }) => {
  const p = usePiezas();
  const { pose } = estado;
  const k = estado.aplastar;
  const E = ESQUELETO;

  const visible = estado.escala[0] > 0.001 && estado.escala[1] > 0.001;

  return (
    <group position={[position[0] + estado.x, position[1], position[2]]} scale={escala} rotation={[0, estado.giro, 0]}>
      <Destello progreso={estado.destello} centroY={13} />
      <group scale={estado.escala} visible={visible}>
      <group scale={[1 + 0.03 * k, 1 - 0.045 * k, 1 + 0.03 * k]}>
        <group position={[0, E.cadera + pose.altura, 0]}>
          {celular ? <Celular tam={estado.laptop} position={[0, 4.2, 4.6]} /> : <Laptop tam={estado.laptop} position={[0, 2.6, 3.4]} />}
          <group rotation={r(pose.torso)}>
            <primitive object={p.torso} />
            <group position={[0, E.cuello, 0]} rotation={r(pose.cabeza)}>
              <primitive object={p.cabeza} />
              <primitive object={p.pelo} visible={!explotado} />
              <primitive object={p.peloExplotado} visible={explotado} />
              <primitive object={p.hollin} visible={explotado} />
              {OJO_VARIANTES.map((v) => (
                <primitive key={`o-${v}`} object={p.ojos[v]} visible={estado.ojos === v} />
              ))}
              {CEJA_VARIANTES.map((v) => (
                <primitive key={`ci-${v}`} object={p.cejaIzq[v]} visible={estado.cejas[0] === v} />
              ))}
              {CEJA_VARIANTES.map((v) => (
                <primitive key={`cd-${v}`} object={p.cejaDer[v]} visible={estado.cejas[1] === v} />
              ))}
              {BOCA_VARIANTES.map((v) => (
                <primitive key={`b-${v}`} object={p.boca[v]} visible={estado.boca === v} />
              ))}
            </group>
            <group position={[-E.hombroX, E.hombroY, 0]} rotation={r(pose.brazoIzq)}>
              <primitive object={p.brazoIzq} />
              <group position={[0, E.codo, 0]} rotation={r(pose.antebrazoIzq)}>
                <primitive object={p.antebrazoIzq} />
              </group>
            </group>
            <group position={[E.hombroX, E.hombroY, 0]} rotation={r(pose.brazoDer)}>
              <primitive object={p.brazoDer} />
              <group position={[0, E.codo, 0]} rotation={r(pose.antebrazoDer)}>
                <primitive object={p.antebrazoDer} />
              </group>
            </group>
          </group>
          <group position={[-E.piernaX, 0, 0]} rotation={r(pose.piernaIzq)}>
            <primitive object={p.piernaIzq} />
          </group>
          <group position={[E.piernaX, 0, 0]} rotation={r(pose.piernaDer)}>
            <primitive object={p.piernaDer} />
          </group>
        </group>
      </group>
      </group>
    </group>
  );
};

// Luces y suelo que recibe la sombra (el fondo lo pone el HTML de atrás)
export const Escenario: React.FC<{ suelo?: number; children: React.ReactNode }> = ({ suelo, children }) => (
  <>
    <hemisphereLight args={["#ffffff", "#d9cfc3", 1.15]} />
    <directionalLight
      position={[-45, 90, 70]}
      intensity={2.9}
      color="#fff4e6"
      castShadow
      shadow-mapSize={[2048, 2048]}
      shadow-bias={-0.0004}
      shadow-normalBias={0.03}
      shadow-camera-left={-120}
      shadow-camera-right={120}
      shadow-camera-top={80}
      shadow-camera-bottom={-80}
      shadow-camera-near={1}
      shadow-camera-far={400}
    />
    <directionalLight position={[50, 20, 40]} intensity={0.5} color="#e8f6ff" />
    {suelo !== undefined ? <SueloSombra position={[0, suelo, 0]} ancho={600} fondo={600} /> : null}
    {children}
  </>
);

// Plano invisible que solo muestra la sombra
export const SueloSombra: React.FC<{ position: [number, number, number]; ancho: number; fondo: number }> = ({
  position,
  ancho,
  fondo,
}) => (
  <mesh rotation={[-Math.PI / 2, 0, 0]} position={position} receiveShadow>
    <planeGeometry args={[ancho, fondo]} />
    <shadowMaterial opacity={0.22} color="#14110F" />
  </mesh>
);
