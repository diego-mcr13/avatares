// Exporta el video de ejemplo y los fondos de cada escena a out/ejemplo/.
//
//   node scripts/renderizar-ejemplo.mjs                 -> ejemplo de las 8 escenas + el ejemplo completo unido
//   node scripts/renderizar-ejemplo.mjs fondos          -> solo los fondos (para armar el video real, sin avatares ni app)
//   node scripts/renderizar-ejemplo.mjs ejemplo 4 5     -> solo el ejemplo de las escenas 4 y 5 (sin unirlos)
//
// out/ejemplo/ejemplo1.mp4 … ejemplo8.mp4   escena con guía de grabación, app simulada, avatares y voces de ejemplo
// out/ejemplo/ejemplo-completo.mp4          las 8 escenas seguidas
// out/ejemplo/fondo1.mp4 … fondo8.mp4       fondo + paneles + marcos de celular vacíos (sin guía, sin avatares, sin voz)
import { spawnSync } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";

const args = process.argv.slice(2);
const queFondos = args.includes("fondos");
const queEjemplo = args.includes("ejemplo") || !queFondos;
const escenas = args.filter((a) => /^[1-8]$/.test(a));
const lista = escenas.length ? escenas : ["1", "2", "3", "4", "5", "6", "7", "8"];

mkdirSync("out/ejemplo", { recursive: true });

const correr = (cmd) => {
  const r = spawnSync("npx", cmd, { stdio: "inherit", shell: true });
  if (r.status !== 0) process.exit(r.status ?? 1);
};

for (const n of lista) {
  if (queEjemplo) {
    console.log(`\n== Ejemplo${n}`);
    correr(["remotion", "render", `Ejemplo${n}`, `out/ejemplo/ejemplo${n}.mp4`, "--gl=angle", "--audio-codec=aac"]);
  }
  if (queFondos) {
    console.log(`\n== Fondo${n}`);
    correr(["remotion", "render", `Fondo${n}`, `out/ejemplo/fondo${n}.mp4`, "--gl=angle"]);
  }
}

if (queEjemplo && !escenas.length) {
  const txt = lista.map((n) => `file 'ejemplo${n}.mp4'`).join("\n");
  writeFileSync("out/ejemplo/lista.txt", txt);
  console.log("\n== Uniendo las 8 escenas");
  correr(["remotion", "ffmpeg", "-y", "-f", "concat", "-safe", "0", "-i", "out/ejemplo/lista.txt", "-c", "copy", "out/ejemplo/ejemplo-completo.mp4"]);
}
console.log("\nListo. Los archivos están en out/ejemplo/");
