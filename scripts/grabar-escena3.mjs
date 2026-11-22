// Escena 3: entras directo a Hoy sin cuenta (solo mira; no escribe nada en la página).
//   node scripts/grabar-escena3.mjs  -> out/grabaciones/escena3.mp4
import { spawnSync } from "node:child_process";
import { mkdirSync } from "node:fs";
import { abrir } from "./navegador.mjs";

const URL = "https://boliviasabe.vercel.app/";
mkdirSync("out/grabaciones", { recursive: true });
const b = await abrir({ oscuro: true, puerto: 9351 });
try {
  await b.ir(URL, 2500);
  await b.empezarGrabacion();
  await b.esperar(1800);
  // Baja despacio por la grilla
  for (let y = 0; y <= 1500; y += 100) {
    await b.evaluar(`window.scrollTo(0, ${y})`);
    await b.esperar(90);
  }
  await b.esperar(600);
  await b.evaluar("window.scrollTo(0, 0)");
  await b.esperar(900);
  // Abre un letrero y toca «Me sirvió» sin cuenta: sube la hoja para entrar
  const c = await b.evaluar(`(() => { const e=document.querySelector('.tile__open'); e.scrollIntoView({block:'center'}); const r=e.getBoundingClientRect(); return {x:r.x+r.width/2,y:r.y+r.height/2}; })()`);
  await b.esperar(500);
  await b.tocar(c.x, c.y);
  await b.esperar(1800);
  await b.tocarTexto("Me sirvió", 1800);
  await b.tocarTexto("Usar mi correo", 1800);
  const r = await b.terminarGrabacion("out/grabaciones/escena3.mp4");
  console.log("cuadros:", r.cuadros, "duración:", r.duracion.toFixed(1), "s");
  const f = spawnSync("npx", ["remotion", "ffmpeg", "-y", "-f", "concat", "-safe", "0", "-i", `${r.carpeta}/lista.txt`, "-vf", "fps=30,scale=720:-2", "-pix_fmt", "yuv420p", "out/grabaciones/escena3.mp4"], { shell: true, stdio: "ignore" });
  console.log("mp4:", f.status === 0 ? "listo" : "falló");
} finally {
  b.cerrar();
}
