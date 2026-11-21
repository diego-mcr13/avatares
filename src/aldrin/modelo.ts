// Modelo voxel de Aldrin con el outfit de CodeBambinos (canguro negro con el logo, jeans negros y tenis blancos):
// cada pieza es una lista de cubitos con color. La ropa vive en `../bambinos/ropa.ts`.
// Pelo negro corto y despeinado, con flequillo largo que llega hasta las cejas, piel morena, cejas
// gruesas y rectas, ojos oscuros de párpado pesado, labios llenos y orejas a la vista.
// Unidades: 1 = un voxel. El personaje mide ~35 voxels de alto (con el pelo).
// Izq/Der = lado de la pantalla (no del personaje).

import { canguroTorso, jeansPierna, mangaAntebrazo, mangaBrazo } from "../bambinos/ropa";

export type Vox = {
  x: number;
  y: number;
  z: number;
  c: string;
  // Escala del cubito (las "calcomanías" de la cara son cubitos muy delgados)
  sz?: number;
  // Tamaño en x/y (por defecto 1); el logo usa pixeles más chicos
  s?: number;
  // false = sin variación de tono (para rasgos de la cara)
  vari?: boolean;
};

export const PAL = {
  piel: "#C58B64",
  pielSombra: "#A36F4D",
  rubor: "#C9755F",
  // Pelo negro con reflejos un poco más claros
  pelo: "#15110E",
  peloClaro: "#2B231D",
  peloMedio: "#201A16",
  labio: "#B46C61",
  ojo: "#1C130F",
  brillo: "#F6F3EE",
  boca: "#3A1410",
  dientes: "#F6F3EE",
  lengua: "#E0526B",
  // Después de una explosión: hollín y ceniza
  hollin: "#3A2F2A",
  ceniza: "#6E6862",
  brasa: "#E0662A",
};

type ColorFn = (x: number, y: number, z: number) => string | null;

// Caja de voxels [x0,x1) × [y0,y1) × [z0,z1). Hueca por defecto (solo la cáscara).
const caja = (
  out: Vox[],
  x0: number,
  x1: number,
  y0: number,
  y1: number,
  z0: number,
  z1: number,
  color: string | ColorFn,
  hueca = true,
) => {
  for (let x = x0; x < x1; x++) {
    for (let y = y0; y < y1; y++) {
      for (let z = z0; z < z1; z++) {
        const dentro = x > x0 && x < x1 - 1 && y > y0 && y < y1 - 1 && z > z0 && z < z1 - 1;
        if (hueca && dentro) continue;
        const c = typeof color === "string" ? color : color(x, y, z);
        if (c) out.push({ x: x + 0.5, y: y + 0.5, z: z + 0.5, c });
      }
    }
  }
};

// Dibujo pixel sobre la cara (frente de la cabeza, z = 6).
// filas[0] es la fila de arriba (yArriba). `espejo` invierte el dibujo en horizontal.
const FRENTE = 6.06;
const dibujo = (
  filas: string[],
  x0: number,
  yArriba: number,
  colores: Record<string, string>,
  espejo = false,
  z = FRENTE,
): Vox[] => {
  const out: Vox[] = [];
  filas.forEach((fila, i) => {
    const ancho = fila.length;
    for (let j = 0; j < ancho; j++) {
      const c = colores[fila[j]];
      if (!c) continue;
      const col = espejo ? ancho - 1 - j : j;
      out.push({ x: x0 + col + 0.5, y: yArriba - i + 0.5, z, c, sz: 0.12, vari: false });
    }
  });
  return out;
};

// Número pseudoaleatorio fijo por celda (0..1): siempre da lo mismo para la misma celda
const azar = (x: number, y: number, z: number) => {
  const h = Math.sin(x * 12.9898 + y * 78.233 + z * 37.719) * 43758.5453;
  return h - Math.floor(h);
};

// ---------- Cabeza (origen en el cuello) ----------
// Celdas x -7..6, y 0..10, z -6..5. El frente está en z = 6. Cara ancha y redonda.
// El pelo cubre arriba, los costados (hasta arriba de la oreja) y la nuca; las orejas quedan a la vista.

export const cabeza = (): Vox[] => {
  const out: Vox[] = [];
  caja(out, -7, 7, 0, 11, -6, 6, (x, y, z) => {
    const atras = z === -6;
    const lado = x === -7 || x === 6;
    // Mandíbula un poco redondeada: sin las esquinas de abajo
    if (lado && y === 0) return null;
    // Arriba de la cabeza y la frente (el flequillo tapa las dos filas de arriba)
    if (y === 10 && z < 5) return PAL.pelo;
    if (z === 5 && y >= 10) return PAL.pelo;
    // Nuca y costados: pelo corto hasta arriba de la oreja
    if (atras && y >= 3) return PAL.pelo;
    if (lado && y >= 8 && z < 5) return PAL.pelo;
    if (lado && y >= 6 && z < -1) return PAL.pelo;
    return PAL.piel;
  });
  // Orejas a la vista, con la parte de adentro más oscura
  for (const x of [-8, 7])
    caja(out, x, x + 1, 3, 7, -1, 1, (_x, y, z) => (z === 0 && (y === 4 || y === 5) ? PAL.pielSombra : PAL.piel), false);
  // Nariz ancha: dos voxels que sobresalen
  out.push({ x: -0.5, y: 4.5, z: 6.5, c: PAL.pielSombra });
  out.push({ x: 0.5, y: 4.5, z: 6.5, c: PAL.pielSombra });
  // Mejillas
  out.push(...dibujo(["RR"], -6, 4, { R: PAL.rubor }));
  out.push(...dibujo(["RR"], 4, 4, { R: PAL.rubor }));
  return out;
};

// ---------- Pelo (encima de la cabeza) ----------
// Pelo corto y despeinado: más alto en el centro, con mechones sueltos que sobresalen. El flequillo
// es largo y de punta; baja hasta las cejas solo en algunos mechones, para no taparlas. Los costados se abultan sobre la oreja y la nuca baja con un poco de volumen.

// Hasta qué altura llega el pelo en cada columna (x, z)
const alturaPelo = (x: number, z: number) => {
  let alto = 12 + (z >= 2 ? 0 : 0.2);
  // El centro de la cabeza va más alto
  if (Math.abs(x + 0.5) < 4.5 && z > -4) alto += 1;
  // Mechones que sobresalen
  if (azar(x, 3, z) > 0.78) alto += 1;
  return Math.round(alto);
};

export const pelo = (): Vox[] => {
  const out: Vox[] = [];
  const poner = (x: number, y: number, z: number) => {
    const r = azar(x, y, z);
    out.push({ x: x + 0.5, y: y + 0.5, z: z + 0.5, c: r > 0.8 ? PAL.peloClaro : r > 0.5 ? PAL.peloMedio : PAL.pelo });
  };
  // Capa de arriba
  for (let x = -7; x <= 6; x++)
    for (let z = -6; z <= 5; z++) for (let y = 11; y <= alturaPelo(x, z); y++) poner(x, y, z);
  // Flequillo: cae por delante de la frente. La fila de abajo queda con puntas desiguales.
  for (let x = -7; x <= 6; x++) {
    const tope = alturaPelo(x, 5);
    for (let y = 11; y <= tope; y++) poner(x, y, 6);
    poner(x, 10, 6);
    // Mechones que bajan hasta las cejas: solo entre las cejas y en las puntas, para no taparlas
    if ([-7, -2, -1, 0, 1, 6].includes(x) && azar(x, 9, 6) > 0.25) poner(x, 9, 6);
  }
  // Los costados se abultan sobre la oreja y la nuca baja un poco más
  for (const x of [-8, 7])
    for (let z = -6; z <= 4; z++)
      for (let y = 8; y <= 11; y++) if (y > 8 || azar(x, 8, z) > 0.4) poner(x, y, z);
  for (let x = -7; x <= 6; x++)
    for (let y = 5; y <= 11; y++) if (y > 5 || azar(x, 5, -7) > 0.4) poner(x, y, -7);
  return out;
};

// ---------- Pelo después de la explosión ----------
// Una bola de pelo esponjada y chamuscada (con ceniza y alguna brasa). Deja libre la cara.

export const peloExplotado = (): Vox[] => {
  const out: Vox[] = [];
  const cx = -0.5;
  const cy = 13;
  const cz = -0.5;
  for (let x = -11; x <= 10; x++)
    for (let y = 7; y <= 24; y++)
      for (let z = -11; z <= 10; z++) {
        const ruido = Math.abs(Math.sin(x * 3.7 + y * 1.9 + z * 5.3)) * 1.6;
        const d = Math.hypot(x + 0.5 - cx, (y + 0.5 - cy) * 1.15, z + 0.5 - cz);
        const radio = 9.2 + ruido;
        if (d > radio || d < radio - 2.2) continue;
        // La cara y las orejas quedan a la vista
        if (z >= 2 && y <= 10) continue;
        if (y <= 9 && Math.abs(x + 0.5) >= 6) continue;
        const r = Math.sin(x * 12.9898 + y * 78.233 + z * 37.719) * 43758.5453;
        const h = r - Math.floor(r);
        const c = h > 0.985 ? PAL.brasa : h > 0.8 ? PAL.ceniza : PAL.pelo;
        out.push({ x: x + 0.5, y: y + 0.5, z: z + 0.5, c });
      }
  return out;
};

// Manchas de hollín en la cara (sin tapar ojos, cejas, nariz ni boca)
const MANCHAS: [number, number][] = [
  [-7, 3], [-6, 2], [-7, 2], [-6, 1], [-5, 1], [5, 2], [6, 2], [6, 1], [-1, 10], [0, 10], [1, 9], [0, 9], [-4, 10], [3, 10], [4, 10],
];
export const hollinCara = (): Vox[] =>
  MANCHAS.map(([x, y], i) => ({
    x: x + 0.5,
    y: y + 0.5,
    z: FRENTE + 0.02,
    c: i % 3 === 0 ? PAL.ceniza : PAL.hollin,
    sz: 0.12,
    vari: false,
  }));

// ---------- Ojos, cejas y bocas (variantes que se intercambian) ----------

export type OjoVar = "normal" | "feliz" | "cerrados" | "chicos";
export type CejaVar = "normal" | "arriba" | "enojo" | "triste";
export type BocaVar =
  | "cerrada"
  | "sonrisa"
  | "abierta1"
  | "abierta2"
  | "abierta3"
  | "sonrisaAbierta"
  | "O"
  | "apretada";

// Ojos almendrados, más anchos que altos (el brillo va aparte, ver ojos())
const OJOS: Record<OjoVar, string[]> = {
  normal: [".XX", "XXX"],
  feliz: [".X.", "X.X"],
  cerrados: ["...", "XXX"],
  // Pupilas chiquitas: ansiedad, susto, mirada perdida
  chicos: [".X.", "..."],
};

// Cejas gruesas y rectas (la columna 0 es la punta de afuera)
const CEJAS: Record<CejaVar, string[]> = {
  normal: ["....", "XXXX"],
  arriba: ["XXXX", "...."],
  enojo: ["XX..", "..XX"],
  triste: ["..XX", "XX.."],
};

// P = labio de abajo (labios gruesos), solo con la boca cerrada
const BOCAS: Record<BocaVar, string[]> = {
  cerrada: ["......", ".XXXX.", "..PP..", "......"],
  sonrisa: ["X....X", ".XXXX.", "......", "......"],
  abierta1: ["......", ".XXXX.", "..XX..", "......"],
  abierta2: [".TTTT.", ".XXXX.", ".XLLX.", "......"],
  abierta3: ["XTTTTX", "XXXXXX", "XXLLXX", ".XXXX."],
  sonrisaAbierta: ["XTTTTX", ".XXXX.", "..LL..", "......"],
  O: ["..XX..", ".XXXX.", ".XXXX.", "..XX.."],
  // Dientes apretados: estrés
  apretada: ["XXXXXX", "XTTTTX", "XXXXXX", "......"],
};

const COLORES_OJO = { X: PAL.ojo };
const COLORES_BOCA = { X: PAL.boca, T: PAL.dientes, L: PAL.lengua, P: PAL.labio };

export const OJO_VARIANTES = Object.keys(OJOS) as OjoVar[];
export const CEJA_VARIANTES = Object.keys(CEJAS) as CejaVar[];
export const BOCA_VARIANTES = Object.keys(BOCAS) as BocaVar[];

// Ambos ojos (el derecho es el espejo del izquierdo)
// Brillo chico arriba a la izquierda de cada ojo (la luz viene de ese lado en los dos)
const brilloOjo = (x: number): Vox => ({ x, y: 6.68, z: FRENTE + 0.03, c: PAL.brillo, s: 0.42, sz: 0.12, vari: false });

export const ojos = (v: OjoVar): Vox[] => [
  ...dibujo(OJOS[v], -6, 6, COLORES_OJO),
  ...dibujo(OJOS[v], 3, 6, COLORES_OJO, true),
  ...(v === "normal" ? [brilloOjo(-4.72), brilloOjo(4.28)] : []),
];

export const ceja = (v: CejaVar, lado: "izq" | "der"): Vox[] =>
  lado === "izq" ? dibujo(CEJAS[v], -6, 9, { X: PAL.pelo }) : dibujo(CEJAS[v], 2, 9, { X: PAL.pelo }, true);

export const boca = (v: BocaVar): Vox[] => dibujo(BOCAS[v], -3, 3, COLORES_BOCA);

// ---------- Ropa (origen en la cadera / hombro / codo) ----------
// Canguro negro oversize con el logo de CodeBambinos, jeans negros y tenis blancos.

export const torso = (): Vox[] => canguroTorso(-1);

export const brazo = (): Vox[] => mangaBrazo();

export const antebrazo = (): Vox[] => mangaAntebrazo(PAL.piel);

export const pierna = (): Vox[] => jeansPierna();

// Medidas del esqueleto (dónde va cada articulación)
export const ESQUELETO = {
  cadera: 6,
  cuello: 8,
  hombroX: 6.5,
  hombroY: 7.5,
  codo: -3,
  piernaX: 2.5,
};
