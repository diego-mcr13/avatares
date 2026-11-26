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

// ---------- Estampado de las poleras del evento (25 nov) ----------
// DEMODAY = true: los tres con la polera negra del evento (Demo Day, 27 nov).
// DEMODAY = false: el outfit del video final (Diego polera verde, Aldrin canguro café, Yaeko polera negra con el logo chico).
export const DEMODAY = true;

// Polera negra con el logo horizontal de BoliviaSabe y la franja de aguayo, como la ficha técnica del estampador
// (`frente-talla-L.png`). Cuadrícula de 120 × 31 sacada de ese PNG; cada letra es un color.
export const ESTAMPADO_FILAS = [
  "...............ffffff...................................................................................................",
  ".pppppppppppp..fffffff..................................................................................................",
  ".pppppppppppppfffppfff..................................................................................................",
  ".ppppppppppppppfffffff..................................................................................................",
  ".ppppppppppppppffffff...................................................................................................",
  ".pppp.......pppf........................................................................................................",
  ".pppp........ppp....................................pp............pp....................................................",
  ".pppp........ppp..........ppppppppp............pppppppp..........pppp............tttttt..............ttt................",
  ".pppp......pppp...........pppppppppp...........pppp.pp............pp............ttttttttt............ttt................",
  ".pppppppppppppp...........pppp...ppp....pppp...pppp....ppp....pp...p...ppp..ppp.ttt...ttt....tt...tt.ttt..tt......ttt...",
  ".ppppppppppppppp...........ppp...ppp..pppppppp.ppppppppppp...ppppppp..ppppppppp.ttt........ttttttttt.ttttttttt..ttttttt.",
  ".pppppppppppppppp..........pppppppp...pppppppp.pppppppp.ppp..ppp.ppp.pppppppppp.tttttttt...ttttttttt.ttttttttt.tttt.ttt.",
  ".pppppppoppppppppp.........ppppppppp.ppp....ppppppppppp.ppp..ppp.ppp.ppp...pppp..tttttttttttt....ttt.ttt...ttttttttttttt",
  ".pppppoooppppppppp.........ppp....pppppp....ppppppppppp..pppppp..ppp.ppp....ppp.......ttttttt....ttt.ttt....tttttttttttt",
  ".ppppppoooopppppppp.......ppp....pppppppp..pppppppppppp..pppppp..ppp.pppp..pppp.ttt...tttttttt..tttt.tttt..tttttttt.....",
  ".pppppooooooppppppp.......ppppppppppp.pppppppp.pppppppp..ppppp...ppp.pppppppppp.ttttttttt..ttttttttt.ttttttttt..tttttttt",
  ".pppppooooooopppppp.......pppppppppp...pppppp..pppppppp...pppp...ppp..ppppp.ppp..ttttttt....tttt.ttt.ttt.tttt....tttttt.",
  ".pppppoooooooopppp......................................................................................................",
  ".ppppppooooooppppp......................................................................................................",
  ".ppppppoooopppppp.......................................................................................................",
  ".ppppppooopppppp........................................................................................................",
  ".ppppp..................................................................................................................",
  ".ppp....................................................................................................................",
  ".p......................................................................................................................",
  "........................................................................................................................",
  "........................................................................................................................",
  "........................................................................................................................",
  "........................................................................................................................",
  "........................................................................................................................",
  "........fffffffffffffffffffffooooooooooooooooooooovvvvvvvvvvvvvvvvvvvvvaaaaaaaaaaaaaaaaaaaayyyyyyyyyyyyyyyyyyyyy........",
  "........fffffffffffffffffffffooooooooooooooooooooovvvvvvvvvvvvvvvvvvvvvaaaaaaaaaaaaaaaaaaaayyyyyyyyyyyyyyyyyyyyy........",
];
const COLOR_ESTAMPADO: Record<string, string> = {
  p: "#F5F2EF", // papel (letras «Bolivia» y la B)
  t: "#E0A96A", // arena («Sabe»)
  o: "#F28C28", // naranja (el mapa)
  f: "#C2185B", // fucsia
  v: "#2E9E5B", // verde
  a: "#1E5AA8", // azul
  y: "#F2C230", // amarillo
};

// `arriba` = altura del borde de arriba del diseño; `ancho` = ancho en voxels (el torso mide 10)
export const estampadoFrente = (arriba = 6.5, ancho = 8.4, z = 3.06): Vox[] => {
  const columnas = ESTAMPADO_FILAS[0].length;
  const pix = ancho / columnas;
  const out: Vox[] = [];
  ESTAMPADO_FILAS.forEach((fila, i) => {
    for (let j = 0; j < columnas; j++) {
      const c = COLOR_ESTAMPADO[fila[j]];
      if (!c) continue;
      out.push({ x: -ancho / 2 + (j + 0.5) * pix, y: arriba - (i + 0.5) * pix, z, c, s: pix * 1.02, sz: 0.12, vari: false });
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

// ---------- Ropa propia de cada uno (video final, 22 nov) ----------
// Diego: polera oversize verde militar, jean negro y tenis blancos.
// Aldrin: canguro café claro, jean negro y tenis negros.
// Yaeko: polera negra, falda negra y tenis blancos.
// En los tres, el logo de CodeBambinos chico en el pecho derecho (a la izquierda de la pantalla).

export type Tela = { base: string; claro: string; puno: string; cordon?: string };
export type Tenis = { zapato: string; suela: string };

export const TELA = {
  verdeMilitar: { base: "#4F5A35", claro: "#5E6A41", puno: "#454E2E" },
  cafeClaro: { base: "#A88B68", claro: "#B89C79", puno: "#957A59", cordon: "#EDE6DA" },
  negro: { base: "#1F1C1A", claro: "#2B2725", puno: "#2F2B29" },
} satisfies Record<string, Tela>;

export const TENIS = {
  blancos: { zapato: ROPA.zapato, suela: ROPA.suela },
  negros: { zapato: "#1D1D21", suela: "#55555C" },
} satisfies Record<string, Tenis>;

// Logo chico en el pecho derecho
export const logoPecho = (): Vox[] => logoBambinos(6.4, 2.9, 3.06, -2.5);

// Polera oversize: sin capucha ni bolsillo, cuello redondo un poco más claro y el ruedo abajo
export const poleraTorso = (base: number, tela: Tela, logo: Vox[] = logoPecho()): Vox[] => [
  ...caja(-5, 5, base, 8, -3, 3, (x, y) => {
    if (y === base) return tela.puno;
    if (y === 7 && x >= -2 && x <= 1) return tela.claro;
    return tela.base;
  }),
  ...logo,
];

// Canguro de otro color, con el logo chico
export const canguroColor = (base: number, tela: Tela, capucha = true): Vox[] => {
  const out = caja(-5, 5, base, 8, -3, 3, (x, y, z) => {
    if (y === base) return tela.puno;
    if (z === 2 && y >= base + 1 && y <= base + 2 && x >= -3 && x <= 2) {
      if (y === base + 2 && (x === -3 || x === 2)) return tela.puno;
      return tela.claro;
    }
    if (y === 7) return tela.claro;
    return tela.base;
  });
  if (capucha) out.push(...caja(-4, 4, 3, 8, -6, -3, tela.claro));
  for (const x of [-4.55, 4.55]) {
    for (let y = 6.5; y >= 3.5; y -= 0.5) out.push({ x, y, z: 3.06, c: tela.cordon ?? ROPA.cordon, s: 0.35, sz: 0.12, vari: false });
  }
  out.push(...logoPecho());
  return out;
};

export const mangaColor = (tela: Tela): Vox[] => caja(-2, 2, -3, 0, -2, 2, tela.base, false);

// Antebrazo de canguro (manga larga con puño) del color dado
export const antebrazoManga = (tela: Tela, piel: string): Vox[] => [
  ...caja(-2, 2, -3, 0, -2, 2, (_x, y) => (y === -3 ? tela.puno : tela.base), false),
  ...caja(-1.5, 1.5, -5, -3, -1.5, 1.5, piel, false),
];

// Antebrazo de polera oversize: la manga baja un poquito del codo y el resto es piel
export const antebrazoPolera = (tela: Tela, piel: string, pulsera = false): Vox[] => [
  ...caja(-2, 2, -1, 0, -2, 2, tela.puno, false),
  ...caja(-1.5, 1.5, -5, -1, -1.5, 1.5, (_x, y) => (pulsera && y === -4 ? ROPA.perla : piel), false),
];

export const jeansConTenis = (tenis: Tenis): Vox[] => [
  ...caja(-2, 2, -4, 0, -2, 2, (_x, y) => (y === -4 ? ROPA.jeanClaro : ROPA.jean)),
  ...caja(-2, 2, -6, -4, -2, 3, (_x, y) => (y === -6 ? tenis.suela : tenis.zapato)),
];
