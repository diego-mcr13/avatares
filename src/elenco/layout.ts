import * as THREE from "three";

// Lienzo del video: 1920 × 1080. Todas las posiciones del elenco son píxeles de ese lienzo
// y marcan DÓNDE PISAN los pies del avatar (no el centro).
export const W = 1920;
export const H = 1080;

// Cámara 3D del elenco (la misma para los tres personajes)
export const CAM = { fov: 18, near: 10, far: 1500, position: [0, 30, 390] as [number, number, number] };

// Con esta cámara un personaje de 35 voxels mide unos 300 px de alto
export const ALTO_PERSONAJE_PX = 300;
export const PX_POR_VOXEL = ALTO_PERSONAJE_PX / 35;

// ---------- Celulares ----------
// La grabación del celular (360 × 800) va escalada a 940 px de alto → 423 px de ancho.
export type Celular = "U" | "A" | "B"; // U = uno solo al centro; A y B = dos lado a lado (escenas 4 y 5)
export const CEL_ANCHO = 423;
export const CEL_ALTO = 940;
export const CEL_TOPE = 70;
export const CEL_CENTRO: Record<Celular, number> = { U: 960, A: 620, B: 1300 };

export const celIzquierda = (c: Celular) => CEL_CENTRO[c] - CEL_ANCHO / 2;
export const celDerecha = (c: Celular) => CEL_CENTRO[c] + CEL_ANCHO / 2;

// Punto de la pantalla del celular: u de 0 (izquierda) a 1 (derecha), v de 0 (arriba) a 1 (abajo)
export const enCelular = (c: Celular, u: number, v: number): [number, number] => [
  celIzquierda(c) + u * CEL_ANCHO,
  CEL_TOPE + v * CEL_ALTO,
];

export type Lado = "izq" | "der";

// Dónde se para el avatar para señalar algo del celular que está a la altura v:
// al costado del celular, con la mano a la altura de ese punto. `sangria` = cuántos px se mete sobre el celular.
export const junto = (c: Celular, lado: Lado, v: number, sangria = 40): [number, number] => {
  const x = lado === "izq" ? celIzquierda(c) + sangria - 90 : celDerecha(c) - sangria + 90;
  const y = CEL_TOPE + v * CEL_ALTO + 150;
  return [x, Math.min(1050, Math.max(330, y))];
};

// Esquinas donde esperan los que no están hablando
export const ESPERA = {
  yaeko: [150, 1050] as [number, number],
  aldrin: [330, 1050] as [number, number],
  diego: [1770, 1050] as [number, number],
};

// ---------- De píxeles de pantalla a mundo 3D ----------
// Lanza un rayo desde la cámara por ese píxel y lo corta con el plano z = 0 donde viven los personajes.
const camara = (() => {
  const c = new THREE.PerspectiveCamera(CAM.fov, W / H, CAM.near, CAM.far);
  c.position.set(...CAM.position);
  c.lookAt(0, 0, 0);
  c.updateMatrixWorld();
  c.updateProjectionMatrix();
  return c;
})();

export const aMundo = (px: number, py: number): [number, number] => {
  const ndc = new THREE.Vector3((px / W) * 2 - 1, 1 - (py / H) * 2, 0.5).unproject(camara);
  const origen = camara.position;
  const dir = ndc.sub(origen).normalize();
  const t = -origen.z / dir.z;
  return [origen.x + dir.x * t, origen.y + dir.y * t];
};
