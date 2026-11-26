// Modelo voxel de Yaeko: cada pieza es una lista de cubitos con color.
// Pelo largo y rizado, castaño oscuro con mechas caramelo hacia las puntas, flequillo cortina
// con raya al medio y estrellitas doradas; ojos oscuros con delineado, mejillas rosadas y sonrisa
// grande. Outfit de CodeBambinos: canguro negro con el logo, falda negra, pulsera de perlas y tenis
// blancos. El outfit anterior (top fucsia y falda negra) queda como `*Fucsia`.
// Unidades: 1 = un voxel. Mide ~37 voxels de alto (con el pelo).
// Izq/Der = lado de la pantalla (no del personaje).

import { TELA, antebrazoPolera, estampadoFrente, faldaNegra, mangaColor, piernaConTenis, poleraTorso } from "../bambinos/ropa";

export type Vox = {
  x: number;
  y: number;
  z: number;
  c: string;
  // Escala del cubito (las "calcomanías" de la cara son cubitos muy delgados)
  sz?: number;
  // Tamaño en x/y (por defecto 1)
  s?: number;
  // false = sin variación de tono (para rasgos de la cara)
  vari?: boolean;
};

export const PAL = {
  piel: "#E8B08C",
  pielSombra: "#CC9070",
  rubor: "#E8807A",
  // Pelo: castaño oscuro con mechas que se aclaran hacia las puntas (balayage)
  pelo: "#3B2016",
  peloMedio: "#5A321F",
  peloCaramelo: "#8E5530",
  peloMiel: "#B5733F",
  labio: "#D9877E",
  ojo: "#2B1810",
  brillo: "#F6F3EE",
  boca: "#3A1410",
  dientes: "#F6F3EE",
  lengua: "#E0526B",
  dorado: "#E8B53A",
  // Top fucsia sin mangas
  top: "#E0157A",
  topOscuro: "#B80F62",
  // Falda negra con vuelo
  falda: "#1E1B1C",
  faldaVuelta: "#2E2A2B",
  pulsera: "#F4EFEA",
  // Después de una explosión: hollín y ceniza
  hollin: "#3A2F2A",
  ceniza: "#6E6862",
  brasa: "#E0662A",
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

// Número pseudoaleatorio fijo por celda (0..1): siempre da lo mismo para la misma celda
const azar = (x: number, y: number, z: number) => {
  const h = Math.sin(x * 12.9898 + y * 78.233 + z * 37.719) * 43758.5453;
  return h - Math.floor(h);
};

// ---------- Cabeza (origen en el cuello) ----------
// Celdas x -7..6, y 0..10, z -6..5. El frente está en z = 6. Los costados y la nuca van del
// color del pelo porque el pelo largo los tapa; las orejas no se ven.

export const cabeza = (): Vox[] => {
  const out: Vox[] = [];
  caja(out, -7, 7, 0, 11, -6, 6, (x, y, z) => {
    const lado = x === -7 || x === 6;
    // Mandíbula un poco redondeada: sin las esquinas de abajo
    if (lado && y === 0) return null;
    if (z === 5 || y <= 1) return PAL.piel;
    return PAL.pelo;
  });
  // Nariz chica: dos voxels que sobresalen
  out.push({ x: -0.5, y: 4.5, z: 6.5, c: PAL.pielSombra });
  out.push({ x: 0.5, y: 4.5, z: 6.5, c: PAL.pielSombra });
  // Mejillas rosadas
  out.push(...dibujo(["RR"], -6, 4, { R: PAL.rubor }));
  out.push(...dibujo(["RR"], 4, 4, { R: PAL.rubor }));
  return out;
};

// ---------- Pelo largo y rizado ----------
// Se arma en dos piezas para que los brazos no lo atraviesen:
// - peloCabeza(): de la mandíbula para arriba (gira con la cabeza): casco con volumen, flequillo
//   cortina y melena a los costados de la cara.
// - peloEspalda(): del cuello para abajo (va con el torso): la melena por la espalda y dos
//   mechones que caen por delante de los hombros.
// Los rizos se notan en el borde irregular y en las mechas de color.

// Color de cada cubito. Cada columna es un mechón con su propio tono y cada rizo cambia cada
// 2 voxels de alto. Arriba casi todo es castaño oscuro; las mechas caramelo y miel aparecen
// hacia las puntas.
const colorPelo = (x: number, y: number, z: number) => {
  const abajo = Math.min(1, Math.max(0, (11 - y) / 20));
  const mechon = azar(x, 0, z);
  const rizo = azar(x, Math.floor((y + 40) / 2), z);
  const t = mechon * 0.6 + rizo * 0.4;
  const claro = 0.04 + 0.62 * abajo * abajo;
  if (t > 1 - claro * 0.35) return PAL.peloMiel;
  if (t > 1 - claro) return PAL.peloCaramelo;
  if (t > 0.58) return PAL.peloMedio;
  return PAL.pelo;
};

const dentroCabeza = (x: number, y: number, z: number) => x >= -7 && x <= 6 && y >= 0 && y <= 10 && z >= -6 && z <= 5;

// Flequillo cortina: raya al medio y cae hacia los dos lados enmarcando la cara.
// Deja libres las cejas (y 8-9, x -6..-3 y 2..5) y la punta del delineado (y 7, x -7 y 6).
const flequillo = (x: number, y: number, z: number) => {
  if (z !== 6) return false;
  if (y === 11) return x >= -8 && x <= 7 && x !== -1;
  if (y === 10) return (x >= -7 && x <= -4) || (x >= 3 && x <= 6);
  if (y === 9 || y === 8) return x === -7 || x === 6;
  return false;
};

// Casco y melena de la cabeza (y >= 0)
const enPeloCabeza = (x: number, y: number, z: number) => {
  if (y < 0) return false;
  if (dentroCabeza(x, y, z)) return false;
  if (flequillo(x, y, z)) return true;
  const px = x + 0.5;
  const py = y + 0.5;
  const pz = z + 0.5;
  // La cara queda libre: nada delante de la cara salvo el flequillo
  if (x >= -7 && x <= 6 && z >= 0 && y <= 10) return false;
  // Casco con volumen (un poco irregular por los rizos)
  const bulto = 1 + 0.06 * (azar(x, y, z) - 0.5);
  const d = Math.hypot(px / 8.3, (py - 8.3) / 6.8, (pz + 1) / 8);
  if (d <= bulto && y >= 6) return true;
  // Melena a los costados de la cara: baja hasta la mandíbula
  // Los rizos: el borde entra y sale en ondas a lo largo del pelo
  const anchoLado = 8.4 + azar(x, 0, z) * 0.8 + Math.sin(y * 1.4 + z * 0.9) * 0.75;
  if (Math.abs(px) >= 7 && Math.abs(px) <= anchoLado && pz >= -7.5 && pz <= 5.5 && y <= 10) return true;
  // Por detrás de la cabeza
  const fondo = -8.5 - azar(x, y, 0) * 1.1;
  if (Math.abs(px) <= anchoLado && pz <= -6 && pz >= fondo && y <= 10) return true;
  return d <= bulto;
};

// Melena del cuello para abajo (coordenadas desde el cuello: y < 0). El torso va de y = -9 a -1.
// Las puntas terminan a la altura de la cintura, en ondas
const finMelena = (x: number) => -9 + Math.round(Math.sin(x * 1.7) * 1 + azar(x, 0, 0) * 1.2);

// Mechones de adelante: zigzaguean como un rizo y caen sobre el pecho, delante de los hombros
const enMechon = (x: number, y: number, z: number) => {
  if (y > -1 || y < -7 + Math.round(azar(x > 0 ? 1 : 0, 0, 0) * 1.5)) return false;
  if (z < 3 || z > 4) return false;
  const centro = 6.3 + Math.sin(y * 1.2) * 0.8;
  return Math.abs(Math.abs(x + 0.5) - centro) <= 1.3;
};

const enPeloEspalda = (x: number, y: number, z: number) => {
  if (y >= 0) return false;
  if (enMechon(x, y, z)) return true;
  const px = x + 0.5;
  const pz = z + 0.5;
  if (y < finMelena(x)) return false;
  // Detrás de la espalda (el torso termina en z = -3); se angosta un poco hacia las puntas
  const ancho = 8.5 + azar(x, y, 0) * 0.6 + Math.sin(y * 1.4 + x * 0.3) * 0.75 - Math.max(0, -y - 5) * 0.35;
  const fondo = -7.3 - azar(x, y, 1) * 0.8 - Math.sin(y * 1.4 + x * 0.9) * 0.8;
  return Math.abs(px) <= ancho && pz <= -3.5 && pz >= fondo;
};

// Se queda solo con la cáscara (los cubitos que tienen algún vecino vacío)
const cascara = (dentro: (x: number, y: number, z: number) => boolean): Vox[] => {
  const out: Vox[] = [];
  for (let x = -12; x <= 11; x++)
    for (let y = -15; y <= 17; y++)
      for (let z = -11; z <= 8; z++) {
        if (!dentro(x, y, z)) continue;
        const borde =
          !dentro(x + 1, y, z) ||
          !dentro(x - 1, y, z) ||
          !dentro(x, y + 1, z) ||
          !dentro(x, y - 1, z) ||
          !dentro(x, y, z + 1) ||
          !dentro(x, y, z - 1);
        if (borde) out.push({ x: x + 0.5, y: y + 0.5, z: z + 0.5, c: colorPelo(x, y, z) });
      }
  return out;
};

export const peloCabeza = (): Vox[] => cascara(enPeloCabeza);
export const peloEspalda = (): Vox[] => cascara(enPeloEspalda);

// Dos estrellitas doradas en el pelo, arriba a la izquierda (como los clips de la foto)
const estrella = (cx: number, cy: number, z: number): Vox[] =>
  [
    [0, 0],
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
  ].map(([dx, dy]) => ({ x: cx + dx * 0.42, y: cy + dy * 0.42, z, c: PAL.dorado, s: 0.42, sz: 0.12, vari: false }));

export const estrellas = (): Vox[] => [...estrella(-4.5, 11.5, 7.06), ...estrella(-6.5, 11.5, 7.06)];

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
        // La cara queda a la vista
        if (z >= 2 && y <= 10) continue;
        if (y <= 9 && Math.abs(x + 0.5) >= 6) continue;
        const h = azar(x, y, z);
        const c = h > 0.985 ? PAL.brasa : h > 0.8 ? PAL.ceniza : PAL.pelo;
        out.push({ x: x + 0.5, y: y + 0.5, z: z + 0.5, c });
      }
  return out;
};

// Manchas de hollín en la cara (sin tapar ojos, cejas, nariz ni boca)
const MANCHAS: [number, number][] = [
  [-7, 3], [-6, 2], [-7, 2], [-6, 1], [-5, 1], [5, 2], [6, 2], [6, 1], [-1, 10], [0, 10], [1, 9], [0, 9],
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

// Ojos almendrados con delineado: la columna 0 es la punta de afuera, que sube (el "rabito")
// y se queda incluso con los ojos cerrados
const OJOS: Record<OjoVar, string[]> = {
  normal: ["X...", "..XX", ".XXX"],
  feliz: ["X...", "..X.", ".X.X"],
  cerrados: ["X...", "....", ".XXX"],
  // Pupilas chiquitas: ansiedad, susto, mirada perdida
  chicos: ["X...", "..X.", "...."],
};

// Cejas finas y arqueadas (la columna 0 es la punta de afuera, que baja un poco)
const CEJAS: Record<CejaVar, string[]> = {
  normal: [".XXX", "X..."],
  arriba: ["XXXX", "...."],
  enojo: ["XX..", "..XX"],
  triste: ["..XX", "XX.."],
};

// P = labio de abajo (labios llenos)
const BOCAS: Record<BocaVar, string[]> = {
  cerrada: ["......", ".XXXX.", "..PP..", "......"],
  sonrisa: ["X....X", ".XXXX.", "..PP..", "......"],
  abierta1: ["......", ".XXXX.", "..XX..", "......"],
  abierta2: [".TTTT.", ".XXXX.", ".XLLX.", "......"],
  abierta3: ["XTTTTX", "XXXXXX", "XXLLXX", ".XXXX."],
  // Su sonrisa grande, con los dientes
  sonrisaAbierta: ["XTTTTX", ".TTTT.", "..XX..", "......"],
  O: ["..XX..", ".XXXX.", ".XXXX.", "..XX.."],
  // Dientes apretados: estrés
  apretada: ["XXXXXX", "XTTTTX", "XXXXXX", "......"],
};

const COLORES_OJO = { X: PAL.ojo };
const COLORES_BOCA = { X: PAL.boca, T: PAL.dientes, L: PAL.lengua, P: PAL.labio };

export const OJO_VARIANTES = Object.keys(OJOS) as OjoVar[];
export const CEJA_VARIANTES = Object.keys(CEJAS) as CejaVar[];
export const BOCA_VARIANTES = Object.keys(BOCAS) as BocaVar[];

// Brillo chico arriba a la izquierda de cada ojo (la luz viene de ese lado en los dos)
const brilloOjo = (x: number): Vox => ({ x, y: 6.68, z: FRENTE + 0.03, c: PAL.brillo, s: 0.42, sz: 0.12, vari: false });

// Ambos ojos (el derecho es el espejo del izquierdo)
export const ojos = (v: OjoVar): Vox[] => [
  ...dibujo(OJOS[v], -7, 7, COLORES_OJO),
  ...dibujo(OJOS[v], 3, 7, COLORES_OJO, true),
  ...(v === "normal" ? [brilloOjo(-4.72), brilloOjo(4.28)] : []),
];

export const ceja = (v: CejaVar, lado: "izq" | "der"): Vox[] =>
  lado === "izq" ? dibujo(CEJAS[v], -6, 9, { X: PAL.pelo }) : dibujo(CEJAS[v], 2, 9, { X: PAL.pelo }, true);

export const boca = (v: BocaVar): Vox[] => dibujo(BOCAS[v], -3, 3, COLORES_BOCA);

// ---------- Ropa (origen en la cadera / hombro / codo) ----------
// Canguro negro oversize con el logo de CodeBambinos, falda negra con vuelo, piernas al aire y
// tenis blancos. El pelo largo tapa el cuello, así que no lleva la capucha caída.

export const torso = (): Vox[] => [...poleraTorso(0, TELA.negro, estampadoFrente()), ...faldaNegra()];

export const brazo = (): Vox[] => mangaColor(TELA.negro);

// Antebrazo + mano (origen en el codo). `pulsera` agrega la pulsera de perlas en la muñeca.
export const antebrazo = (pulsera = false): Vox[] => antebrazoPolera(TELA.negro, PAL.piel, pulsera);

// Piernas que salen de la falda y tenis blancos. Un voxel más largas que las de Diego.
export const pierna = (): Vox[] => piernaConTenis(PAL.piel);

// ---------- Outfit anterior: top fucsia y falda negra ----------

// Top fucsia sin mangas con escote redondo y un collar dorado; falda negra de cintura alta con vuelo
export const torsoFucsia = (): Vox[] => {
  const out: Vox[] = [];
  caja(out, -5, 5, 1, 8, -3, 3, (x, y, z) => {
    // Escote: el centro de la fila de arriba, por delante, es piel
    if (z === 2 && y === 7 && x >= -2 && x <= 1) return PAL.piel;
    return y === 1 ? PAL.topOscuro : PAL.top;
  });
  // Pretina de la falda (cintura alta)
  caja(out, -5, 5, -1, 1, -3, 3, PAL.falda);
  // Vuelo de la falda: más ancha, con el borde un poco más claro
  caja(out, -6, 6, -2, -1, -4, 4, PAL.faldaVuelta);
  // Collar dorado con un dije chico
  out.push({ x: 0, y: 6.4, z: 3.06, c: PAL.dorado, s: 0.5, sz: 0.12, vari: false });
  return out;
};

// ---------- Brazos (origen en el hombro, cuelgan hacia abajo) ----------

// Brazo sin manga
export const brazoFucsia = (): Vox[] => {
  const out: Vox[] = [];
  caja(out, -1.5, 1.5, -3, 0, -1.5, 1.5, PAL.piel, false);
  return out;
};

// Antebrazo + mano (origen en el codo). `pulsera` agrega la pulsera de perlas en la muñeca.
export const antebrazoFucsia = (pulsera = false): Vox[] => {
  const out: Vox[] = [];
  caja(out, -1.5, 1.5, -5, 0, -1.5, 1.5, (_x, y) => (pulsera && y === -4 ? PAL.pulsera : PAL.piel), false);
  return out;
};

// ---------- Piernas (origen en la cadera) ----------

// Piernas que salen de la falda y tenis blancos. Un voxel más largas que las de Diego para que
// se vean debajo del vuelo.
export const piernaFucsia = (): Vox[] => {
  const out: Vox[] = [];
  caja(out, -1.5, 1.5, -5, 0, -1.5, 1.5, PAL.piel, false);
  caja(out, -2, 2, -7, -5, -2, 3, (_x, y) => (y === -7 ? PAL.suela : PAL.zapato));
  return out;
};

// Medidas del esqueleto (dónde va cada articulación)
export const ESQUELETO = {
  cadera: 7,
  cuello: 8,
  hombroX: 6.5,
  hombroY: 7.5,
  codo: -3,
  piernaX: 2.5,
};
