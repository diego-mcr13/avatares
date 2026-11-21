// Outfit CodeBambinos, compartido por Diego, Yaeko y Aldrin:
// canguro (sudadera con capucha) negro con el logo del equipo en el pecho, jeans negros y tenis blancos.
// Yaeko usa una falda negra en lugar del pantalón.
// El logo sale de `codebambinos-simbolo-oscuro.svg` (versión para fondos negros), dibujado en pixeles.
// Unidades: 1 = un voxel. Izq/Der = lado de la pantalla.

export type Vox = {
  x: number;
  y: number;
  z: number;
  c: string;
  sz?: number;
  s?: number;
  vari?: boolean;
};

export const ROPA = {
  // Canguro negro (no es negro puro para que se vea la luz)
  canguro: "#1B1A1E",
  canguroClaro: "#2A292F",
  puno: "#35343A",
  cordon: "#D9D6D0",
  // Jeans y falda negros: un poco más claros y fríos que el canguro para que se separen de él
  jean: "#2B2C33",
  jeanClaro: "#44454E",
  // Tenis blancos con la suela gris clara
  zapato: "#F6F3EE",
  suela: "#D6D2CB",
  perla: "#F4EFEA",
  // Colores del logo de CodeBambinos
  papel: "#F2F0EA",
  violeta: "#8B5CFF",
  cian: "#22D3EE",
  lima: "#C6F432",
  tinta: "#16151A",
};

type ColorFn = (x: number, y: number, z: number) => string | null;

// Caja de voxels [x0,x1) × [y0,y1) × [z0,z1). Hueca por defecto (solo la cáscara).
const caja = (
  x0: number,
  x1: number,
  y0: number,
  y1: number,
  z0: number,
  z1: number,
  color: string | ColorFn,
  hueca = true,
): Vox[] => {
  const out: Vox[] = [];
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
  return out;
};

// ---------- Logo de CodeBambinos en pixeles ----------
// Dos llaves { } y tres puntos con carita (violeta, cian y lima), dibujados a mano en una cuadrícula
// de 19 × 13 pixeles. X = llave (papel), V/C/L = punto, o = ojos y boca (tinta).

const LLAVE_IZQ = [".XX", ".X.", ".X.", ".X.", ".X.", ".X.", "X..", ".X.", ".X.", ".X.", ".X.", ".X.", ".XX"];
const LLAVE_DER = LLAVE_IZQ.map((f) => [...f].reverse().join(""));
// Cara de un punto: ojos arriba, boca abajo
const CARA = (c: string) => ["o" + c + "o", c + c + c, c + "o" + c];

const LOGO_FILAS = LLAVE_IZQ.map((izq, i) => {
  const punto = (c: string) => (i >= 5 && i <= 7 ? CARA(c)[i - 5] : "   ");
  return `${izq} ${punto("V")} ${punto("C")} ${punto("L")} ${LLAVE_DER[i]}`;
});

const COLOR_LOGO: Record<string, string> = {
  X: ROPA.papel,
  V: ROPA.violeta,
  C: ROPA.cian,
  L: ROPA.lima,
  o: ROPA.tinta,
};

// `ancho` en voxels, `arriba` = altura del borde de arriba del logo, `z` = cara de la tela donde se pega
export const logoBambinos = (arriba = 7.3, ancho = 7.6, z = 3.06, x0 = 0): Vox[] => {
  const columnas = LOGO_FILAS[0].length;
  const pix = ancho / columnas;
  const out: Vox[] = [];
  LOGO_FILAS.forEach((fila, i) => {
    for (let j = 0; j < columnas; j++) {
      const c = COLOR_LOGO[fila[j]];
      if (!c) continue;
      out.push({ x: x0 - ancho / 2 + (j + 0.5) * pix, y: arriba - (i + 0.5) * pix, z, c, s: pix, sz: 0.12, vari: false });
    }
  });
  return out;
};

// ---------- Canguro (origen en la cadera) ----------

// Cuerpo del canguro oversize: puño abajo, bolsillo canguro, cuello de la capucha, capucha caída
// detrás del cuello (si no hay pelo largo que la tape), cordones y el logo del equipo.
// `base` = fila de abajo del canguro (-1 en Diego y Aldrin, 0 en Yaeko, que lleva falda).
export const canguroTorso = (base: number, capucha = true): Vox[] => {
  const out = caja(-5, 5, base, 8, -3, 3, (x, y, z) => {
    if (y === base) return ROPA.puno;
    // Bolsillo canguro: dos filas de la cara de adelante, con las bocas de entrada oscuras
    if (z === 2 && y >= base + 1 && y <= base + 2 && x >= -3 && x <= 2) {
      if (y === base + 2 && (x === -3 || x === 2)) return ROPA.puno;
      return ROPA.canguroClaro;
    }
    // Borde de la capucha alrededor del cuello
    if (y === 7) return ROPA.canguroClaro;
    return ROPA.canguro;
  });
  if (capucha) out.push(...caja(-4, 4, 3, 8, -6, -3, ROPA.canguroClaro));
  // Cordones que cuelgan a los dos lados del logo
  for (const x of [-4.55, 4.55]) {
    for (let y = 6.5; y >= 3.5; y -= 0.5) out.push({ x, y, z: 3.06, c: ROPA.cordon, s: 0.35, sz: 0.12, vari: false });
  }
  out.push(...logoBambinos());
  return out;
};

// Manga del canguro: más ancha que el brazo (oversize), hasta el codo
export const mangaBrazo = (): Vox[] => caja(-2, 2, -3, 0, -2, 2, ROPA.canguro, false);

// Antebrazo: manga con puño y, abajo, la mano. `pulsera` agrega una pulsera de perlas en la muñeca.
export const mangaAntebrazo = (piel: string, pulsera = false): Vox[] => [
  ...caja(-2, 2, -3, 0, -2, 2, (_x, y) => (y === -3 ? ROPA.puno : ROPA.canguro), false),
  ...caja(-1.5, 1.5, -5, -3, -1.5, 1.5, (_x, y) => (pulsera && y === -4 ? ROPA.perla : piel), false),
];

// ---------- Jeans y tenis (origen en la cadera) ----------

// Jean negro recto (sin vuelta) y tenis blancos con la suela gris clara
export const jeansPierna = (): Vox[] => [
  ...caja(-2, 2, -4, 0, -2, 2, (_x, y) => (y === -4 ? ROPA.jeanClaro : ROPA.jean)),
  ...caja(-2, 2, -6, -4, -2, 3, (_x, y) => (y === -6 ? ROPA.suela : ROPA.zapato)),
];

// ---------- Falda negra (Yaeko) ----------

// Falda de cintura alta con vuelo; el borde del vuelo es un poco más claro para que se vea la forma
export const faldaNegra = (): Vox[] => [
  ...caja(-5, 5, -1, 0, -3, 3, ROPA.jean),
  ...caja(-6, 6, -2, -1, -4, 4, ROPA.jeanClaro),
];

// Piernas con la piel descubierta y tenis blancos (para la falda)
export const piernaConTenis = (piel: string): Vox[] => [
  ...caja(-1.5, 1.5, -5, 0, -1.5, 1.5, piel, false),
  ...caja(-2, 2, -7, -5, -2, 3, (_x, y) => (y === -7 ? ROPA.suela : ROPA.zapato)),
];
