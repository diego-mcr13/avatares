import { useMemo } from "react";
import * as THREE from "three";
import type { Vox } from "./modelo";
import { crearPieza } from "./piezas";

const COLORES = { menta: "#2EE6C5", lima: "#C6FF3D", carcasa: "#3A3633", teclas: "#1A1816" };

// ---------- Laptop del dev (origen: centro del borde delantero de la base) ----------

const laptopBase = (): Vox[] => {
  const out: Vox[] = [];
  for (let x = -6; x < 6; x++)
    for (let z = 0; z < 6; z++) {
      const tecla = x >= -5 && x < 5 && z >= 1 && z < 4;
      out.push({ x: x + 0.5, y: 0.5, z: z + 0.5, c: tecla ? COLORES.teclas : COLORES.carcasa });
    }
  return out;
};

const laptopTapa = (): Vox[] => {
  const out: Vox[] = [];
  for (let x = -6; x < 6; x++) for (let y = 0; y < 7; y++) out.push({ x: x + 0.5, y: y + 0.5, z: -0.5, c: COLORES.carcasa });
  return out;
};

export const Laptop: React.FC<{ tam: number; position: [number, number, number] }> = ({ tam, position }) => {
  const piezas = useMemo(() => ({ base: crearPieza(laptopBase()), tapa: crearPieza(laptopTapa()) }), []);
  return (
    <group position={position} scale={tam} visible={tam > 0.01}>
      <primitive object={piezas.base} />
      {/* Bisagra al fondo; la tapa se inclina un poco hacia la cámara */}
      <group position={[0, 1, 6]} rotation={[0.22, 0, 0]}>
        <primitive object={piezas.tapa} />
        {/* Ficha redonda en la tapa */}
        <mesh position={[0, 3.6, 0.03]}>
          <circleGeometry args={[0.9, 32]} />
          <meshStandardMaterial color={COLORES.lima} roughness={0.9} />
        </mesh>
      </group>
    </group>
  );
};

// ---------- Teclado holográfico del robot ----------

const MATERIAL_HOLO = new THREE.MeshBasicMaterial({ color: COLORES.menta, transparent: true, opacity: 0.28, depthWrite: false });
const MATERIAL_TECLA = new THREE.MeshBasicMaterial({ transparent: true, opacity: 0.85, depthWrite: false });

const teclasHolo = (): Vox[] => {
  const out: Vox[] = [];
  for (let fila = 0; fila < 3; fila++)
    for (let col = 0; col < 12; col++)
      out.push({ x: -9.9 + col * 1.8, y: 0.12, z: 3.4 + fila * 1.5, c: COLORES.menta, vari: false, s: 1.1, sz: 0.9 });
  return out;
};

export const TecladoHolo: React.FC<{ tam: number; position: [number, number, number] }> = ({ tam, position }) => {
  const teclas = useMemo(() => {
    const m = crearPieza(teclasHolo(), MATERIAL_TECLA);
    // Las teclas son planas: se aplastan en altura
    m.scale.set(1, 0.1, 1);
    return m;
  }, []);
  return (
    <group position={position} scale={tam} visible={tam > 0.01}>
      <mesh position={[0, 0, 5]} material={MATERIAL_HOLO}>
        <boxGeometry args={[23, 0.12, 6]} />
      </mesh>
      <primitive object={teclas} />
    </group>
  );
};

// ---------- Destello al aparecer: cubitos que salen disparados en círculo ----------

const N = 14;
export const Destello: React.FC<{ progreso: number; centroY: number }> = ({ progreso, centroY }) => {
  if (progreso < 0 || progreso >= 1) return null;
  const p = progreso;
  const radio = 3 + p * 16;
  const tam = 1.5 * (1 - p);
  return (
    <group position={[0, centroY, 2]}>
      {Array.from({ length: N }).map((_, i) => {
        const a = (i / N) * Math.PI * 2 + p * 0.8;
        return (
          <mesh key={i} position={[Math.cos(a) * radio, Math.sin(a) * radio, 0]} rotation={[a, a, 0]} scale={tam}>
            <boxGeometry args={[1, 1, 1]} />
            <meshBasicMaterial color={i % 2 === 0 ? COLORES.menta : COLORES.lima} />
          </mesh>
        );
      })}
    </group>
  );
};
