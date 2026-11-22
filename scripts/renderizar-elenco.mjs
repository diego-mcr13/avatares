// Exporta las escenas del video (los tres avatares caminando) a la carpeta out/elenco/.
//
//   node scripts/renderizar-elenco.mjs                  -> las 8 escenas, transparentes, en .webm (lo más liviano)
//   node scripts/renderizar-elenco.mjs mov              -> transparentes en .mov ProRes 4444 (Premiere, DaVinci, Final Cut)
//   node scripts/renderizar-elenco.mjs previa           -> vista previa mp4 con marcos de celular y subtítulos
//   node scripts/renderizar-elenco.mjs webm 5 6         -> solo las escenas 5 y 6
//
// Las tres formas se pueden combinar: `node scripts/renderizar-elenco.mjs previa webm 2 3`.
import { spawnSync } from "node:child_process";
import { mkdirSync } from "node:fs";

const args = process.argv.slice(2);
const formatos = args.filter((a) => ["webm", "mov", "previa"].includes(a));
const escenas = args.filter((a) => /^[1-8]$/.test(a));
const lista = escenas.length ? escenas : ["1", "2", "3", "4", "5", "6", "7", "8"];
const que = formatos.length ? formatos : ["webm"];

mkdirSync("out/elenco", { recursive: true });

const correr = (id, salida, extra) => {
  console.log(`\n== ${id} -> ${salida}`);
  const r = spawnSync("npx", ["remotion", "render", id, salida, "--gl=angle", ...extra], {
    stdio: "inherit",
    shell: true,
  });
  if (r.status !== 0) {
    console.error(`Falló ${id}`);
    process.exit(r.status ?? 1);
  }
};

for (const n of lista) {
  for (const f of que) {
    if (f === "previa") correr(`Escena${n}Previa`, `out/elenco/escena${n}-previa.mp4`, []);
    if (f === "webm")
      correr(`Escena${n}`, `out/elenco/escena${n}.webm`, ["--codec=vp9", "--image-format=png", "--pixel-format=yuva420p"]);
    if (f === "mov")
      correr(`Escena${n}`, `out/elenco/escena${n}.mov`, [
        "--codec=prores",
        "--prores-profile=4444",
        "--image-format=png",
        "--pixel-format=yuva444p10le",
      ]);
  }
}
console.log("\nListo. Los archivos están en out/elenco/");
