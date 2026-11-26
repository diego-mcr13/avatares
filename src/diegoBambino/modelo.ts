// Modelo voxel de Diego con el outfit de CodeBambinos (canguro negro con el logo, jeans negros y tenis blancos):
// cada pieza es una lista de cubitos con color. La ropa vive en `../bambinos/ropa.ts`.
// Pelo peinado de costado con los lados en degradado, cejas gruesas, piel clara con mejillas
// rosadas, orejas un poco salidas y labios gruesos.
// Unidades: 1 = un voxel. El personaje mide ~35 voxels de alto (con el pelo).
// Izq/Der = lado de la pantalla (no del personaje).

import { TELA, TENIS, antebrazoPolera, estampadoFrente, jeansConTenis, mangaColor, poleraTorso } from "../bambinos/ropa";

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
  piel: "#E6B898",
  pielSombra: "#CC9878",
  rubor: "#EC8C80",
  pelo: "#221813",
  peloClaro: "#3A2A20",
  // Costados y nuca con degradado (pelo muy corto): más oscuro arriba, casi piel abajo
  rapado: "#5A463B",
  rapadoClaro: "#9C7D69",
  labio: "#D68C7C",
  ojo: "#17110E",
  brillo: "#F6F3EE",
  boca: "#3A1410",
  dientes: "#F6F3EE",
  lengua: "#E0526B",
  tinta: "#14110F",
  papel: "#F6F3EE",
  lima: "#C6FF3D",
  menta: "#2EE6C5",
  ambar: "#FFB81F",
  magenta: "#FF3D8B",
  // Polera (camiseta) negra: no es negro puro para que se vea la luz
  polera: "#1F1C1A",
  poleraOscura: "#171513",
  // Mom jean negro (un negro más frío que la polera para que se separen); la vuelta, más clara
  pantalon: "#26272C",
  pantalonVuelta: "#3D3E45",
  // Después de una explosión: hollín y ceniza
  hollin: "#3A2F2A",
  ceniza: "#6E6862",
  brasa: "#E0662A",
  sudor: "#8FD3FF",
  // Tenis blancos con la suela gris clara
  zapato: "#F6F3EE",
  suela: "#D6D2CB",
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

// ---------- Cabeza (origen en el cuello) ----------
// Celdas x -7..6, y 0..10, z -6..5. El frente está en z = 6. Es un voxel más alta que ancha
// (cara ovalada) y deja dos filas de frente para que el flequillo no tape las cejas.
// Costados y nuca en degradado: pelo corto pero oscuro arriba, que se aclara hacia la oreja y el cuello.
// El volumen del pelo va arriba (ver pelo()).

export const cabeza = (): Vox[] => {
  const out: Vox[] = [];
  caja(out, -7, 7, 0, 11, -6, 6, (x, y, z) => {
    const atras = z === -6;
    const lado = x === -7 || x === 6;
    // Mandíbula un poco redondeada: sin las esquinas de abajo
    if (lado && y === 0) return null;
    // Arriba de la cabeza: pelo (menos la frente)
    if (y === 10 && z < 5) return PAL.pelo;
    const degradado = y >= 7 ? PAL.pelo : y >= 5 ? PAL.rapado : PAL.rapadoClaro;
    // Nuca
    if (atras && y >= 4) return degradado;
    // Costados: pelo oscuro hasta arriba de la oreja, degradado detrás de la oreja y en la patilla
    if (lado && y >= 7 && z < 4) return PAL.pelo;
    if (lado && y >= 4 && z < -1) return degradado;
    if (lado && y >= 5 && (z === 1 || z === 2)) return degradado;
    return PAL.piel;
  });
  // Orejas un poco salidas, con la parte de adentro más oscura
  for (const x of [-8, 7])
    caja(out, x, x + 1, 3, 7, -1, 1, (_x, y, z) => (z === 0 && (y === 4 || y === 5) ? PAL.pielSombra : PAL.piel), false);
  // Nariz: dos voxels que sobresalen
  out.push({ x: -0.5, y: 4.5, z: 6.5, c: PAL.pielSombra });
  out.push({ x: 0.5, y: 4.5, z: 6.5, c: PAL.pielSombra });
  // Mejillas
  out.push(...dibujo(["RR"], -6, 4, { R: PAL.rubor }));
  out.push(...dibujo(["RR"], 4, 4, { R: PAL.rubor }));
  return out;
};

// ---------- Pelo (encima de la cabeza) ----------
// Pelo lleno, peinado de costado: raya a la izquierda de la pantalla y el pelo se peina desde ahí
// hacia la derecha. Del lado chico de la raya va más pegado; del otro lado queda el volumen y el
// flequillo corto tapa la fila de arriba de la frente. Los costados van en degradado (ver cabeza()).

// Columna de la raya (x). A la izquierda queda el lado chico.
const RAYA = -4;

// Brillos sueltos en la superficie del pelo, siempre en las mismas columnas
const brilloPelo = (x: number, z: number) => {
  const h = Math.sin(x * 12.9898 + z * 78.233) * 43758.5453;
  return h - Math.floor(h) > 0.8;
};

const suave = (t: number) => {
  const c = Math.min(1, Math.max(0, t));
  return c * c * (3 - 2 * c);
};

// Hasta qué altura llega el pelo en cada columna (x, z): baja atrás, sube hacia adelante, se
// redondea hacia los dos costados y la fila de la frente queda un voxel más baja. El lado chico
// de la raya va un voxel más abajo y la raya es un surco de dos (desde la frente hasta la coronilla).
const alturaPelo = (x: number, z: number) => {
  const adelante = (z + 6) / 12; // 0 en la nuca, 1 sobre la frente
  let alto = 11.6 + 2.6 * suave(adelante * 1.3);
  if (z === 6) alto -= 0.8;
  alto -= Math.max(0, Math.abs(x + 0.5) - 4) ** 2 * 0.35;
  alto += (x + 0.5) * 0.04;
  let h = Math.round(alto);
  if (x < RAYA) h -= 1;
  else if (x === RAYA && z > -4) h -= 2;
  return h;
};

// Dónde empieza el pelo por abajo (la cabeza termina en y = 10). La fila de adelante (z = 6) es el
// flequillo: del lado de la raya deja ver toda la frente y del otro lado tapa la fila de arriba.
// Nunca baja a y = 9, para no tapar las cejas cuando suben.
const basePelo = (x: number, z: number) => (z === 6 && x > RAYA + 1 ? 10 : 11);

export const pelo = (): Vox[] => {
  const out: Vox[] = [];
  for (let x = -7; x <= 6; x++)
    for (let z = -6; z <= 6; z++) {
      const tope = alturaPelo(x, z);
      for (let y = basePelo(x, z); y <= tope; y++) {
        const c = y === tope && brilloPelo(x, z) ? PAL.peloClaro : PAL.pelo;
        out.push({ x: x + 0.5, y: y + 0.5, z: z + 0.5, c });
      }
    }
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

// Lentes cuadrados de marco fino (como Diego en el video): un rectángulo delgado alrededor de cada ojo,
// el puente sobre la nariz y las patillas hasta el costado de la cabeza
const MARCO = "#26262B";
const GROSOR = 0.26;
const linea = (x0: number, y0: number, x1: number, y1: number): Vox[] => {
  const out: Vox[] = [];
  const largo = Math.hypot(x1 - x0, y1 - y0);
  const n = Math.max(1, Math.ceil(largo / (GROSOR * 0.9)));
  for (let i = 0; i <= n; i++) {
    const q = i / n;
    out.push({ x: x0 + (x1 - x0) * q, y: y0 + (y1 - y0) * q, z: FRENTE + 0.08, c: MARCO, s: GROSOR, sz: 0.14, vari: false });
  }
  return out;
};
const aro = (x0: number, x1: number, y0: number, y1: number): Vox[] => [
  ...linea(x0, y1, x1, y1),
  ...linea(x0, y0, x1, y0),
  ...linea(x0, y0, x0, y1),
  ...linea(x1, y0, x1, y1),
];
export const lentes = (): Vox[] => [
  ...aro(-6.55, -2.45, 4.7, 7.55),
  ...aro(2.45, 6.55, 4.7, 7.55),
  ...linea(-2.45, 6.9, 2.45, 6.9),
  ...linea(-6.55, 7.1, -7.0, 7.1),
  ...linea(6.55, 7.1, 7.0, 7.1),
];

export const ojos = (v: OjoVar): Vox[] => [
  ...dibujo(OJOS[v], -6, 6, COLORES_OJO),
  ...dibujo(OJOS[v], 3, 6, COLORES_OJO, true),
  ...(v === "normal" ? [brilloOjo(-4.72), brilloOjo(4.28)] : []),
  ...lentes(),
];

export const ceja = (v: CejaVar, lado: "izq" | "der"): Vox[] =>
  lado === "izq" ? dibujo(CEJAS[v], -6, 9, { X: PAL.pelo }) : dibujo(CEJAS[v], 2, 9, { X: PAL.pelo }, true);

export const boca = (v: BocaVar): Vox[] => dibujo(BOCAS[v], -3, 3, COLORES_BOCA);

// ---------- Ropa (origen en la cadera / hombro / codo) ----------
// Canguro negro oversize con el logo de CodeBambinos, jeans negros y tenis blancos.

export const torso = (): Vox[] => poleraTorso(-1, TELA.negro, estampadoFrente());

export const brazo = (): Vox[] => mangaColor(TELA.negro);

export const antebrazo = (): Vox[] => antebrazoPolera(TELA.negro, PAL.piel);

export const pierna = (): Vox[] => jeansConTenis(TENIS.blancos);

// Medidas del esqueleto (dónde va cada articulación)
export const ESQUELETO = {
  cadera: 6,
  cuello: 8,
  hombroX: 6.5,
  hombroY: 7.5,
  codo: -3,
  piernaX: 2.5,
};
