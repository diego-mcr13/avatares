// Exporta a cada avatar en varias poses, con fondo transparente (PNG), para la presentación y las miniaturas.
//   node scripts/exportar-poses.mjs                -> out/poses/<quien>-<pose>.png (los tres, todas las poses de la lista)
//   node scripts/exportar-poses.mjs yaeko saludar  -> solo esa
import { mkdirSync } from "node:fs";
import path from "node:path";
import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition } from "@remotion/renderer";

const QUIENES = ["diego", "yaeko", "aldrin"];
const POSES = ["neutral", "saludar", "hablar", "senalar", "senalarIzq", "senalarArriba", "tocar", "pensar", "encoger", "sorpresa", "escribir", "celebrar", "triunfo", "aplaudir", "esperar", "apuntar"];
// Los que miran un poco hacia la derecha o la izquierda (para que se vean de tres cuartos)
const GIRO = { senalarIzq: -0.25, senalar: 0.25, apuntar: 0 };

const args = process.argv.slice(2);
const quienes = args.filter((a) => QUIENES.includes(a));
const poses = args.filter((a) => POSES.includes(a));
const listaQuienes = quienes.length ? quienes : QUIENES;
const listaPoses = poses.length ? poses : POSES;

mkdirSync("out/poses", { recursive: true });
const url = await bundle({ entryPoint: path.resolve("src/index.ts") });

for (const quien of listaQuienes) {
  for (const pose of listaPoses) {
    const props = { quien, pose, giro: GIRO[pose] ?? 0.2 };
    const comp = await selectComposition({ serveUrl: url, id: "PoseAvatar", inputProps: props });
    await renderStill({
      composition: comp,
      serveUrl: url,
      output: `out/poses/${quien}-${pose}.png`,
      inputProps: props,
      imageFormat: "png",
      chromiumOptions: { gl: "angle" },
    });
    console.log("✓", quien, pose);
  }
}
console.log("Listo: out/poses/");
