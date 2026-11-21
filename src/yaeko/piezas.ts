import * as THREE from "three";
import type { Vox } from "./modelo";

const CUBO = new THREE.BoxGeometry(1, 1, 1);
// Material mate con luz (cuerpo) y material sin luz (pixeles que brillan en una pantalla)
export const MATERIAL = new THREE.MeshStandardMaterial({ roughness: 0.92, metalness: 0 });
export const MATERIAL_BRILLO = new THREE.MeshBasicMaterial();

// Variación de tono determinista por voxel (textura de cubitos)
const variacion = (x: number, y: number, z: number) => {
  const h = Math.sin(x * 12.9898 + y * 78.233 + z * 37.719) * 43758.5453;
  return 0.94 + (h - Math.floor(h)) * 0.1;
};

// Una pieza = un InstancedMesh con un cubito por voxel
export const crearPieza = (voxels: Vox[], material: THREE.Material = MATERIAL) => {
  const malla = new THREE.InstancedMesh(CUBO, material, voxels.length);
  const m = new THREE.Matrix4();
  const pos = new THREE.Vector3();
  const esc = new THREE.Vector3();
  const rot = new THREE.Quaternion();
  const color = new THREE.Color();
  voxels.forEach((v, i) => {
    pos.set(v.x, v.y, v.z);
    esc.set(v.s ?? 1, v.s ?? 1, v.sz ?? 1);
    m.compose(pos, rot, esc);
    malla.setMatrixAt(i, m);
    color.set(v.c);
    if (v.vari !== false) color.multiplyScalar(variacion(v.x, v.y, v.z));
    malla.setColorAt(i, color);
  });
  malla.instanceMatrix.needsUpdate = true;
  if (malla.instanceColor) malla.instanceColor.needsUpdate = true;
  malla.castShadow = material === MATERIAL;
  malla.receiveShadow = material === MATERIAL;
  malla.frustumCulled = false;
  return malla;
};

// Variantes de una pieza (ojos, bocas...): una malla por variante, se muestra solo una
export const crearVariantes = <K extends string>(claves: K[], f: (k: K) => Vox[], material?: THREE.Material) => {
  const out = {} as Record<K, THREE.InstancedMesh>;
  claves.forEach((k) => {
    out[k] = crearPieza(f(k), material);
  });
  return out;
};
