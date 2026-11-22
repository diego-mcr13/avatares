// Estilo del video final (contrato §3): los colores y las letras de la app.
import { loadFont as cargarBricolage } from "@remotion/google-fonts/BricolageGrotesque";
import { loadFont as cargarFigtree } from "@remotion/google-fonts/Figtree";

const bricolage = cargarBricolage("normal", { weights: ["500"], subsets: ["latin", "latin-ext"] });
const figtree = cargarFigtree("normal", { weights: ["400", "500", "600", "700"], subsets: ["latin", "latin-ext"] });

export const LETRA_TITULO = bricolage.fontFamily;
export const LETRA = figtree.fontFamily;

export const C = {
  fondo: "#151110",
  tarjeta: "#1f1a18",
  hundido: "#2a2421",
  tinta: "#F3EDE8",
  apagado: "#B0A59C",
  linea: "rgba(243,237,232,0.14)",
  fucsia: "#C2185B",
  fucsiaTexto: "#F6A3C3",
  naranja: "#F28C28",
  coral: "#E4572E",
  verde: "#2E9E5B",
  azul: "#1E5AA8",
  amarillo: "#F2C230",
  azulejo: "#F5F2EF",
};

export const AGUAYO = [C.fucsia, C.naranja, C.verde, C.azul, C.amarillo];

export const COLOR_PERSONA = { diego: "#22D3EE", yaeko: "#8B5CFF", aldrin: "#C6F432" } as const;

export const FPS = 30;
