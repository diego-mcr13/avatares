import { abrir } from "./navegador.mjs";

const b = await abrir({ oscuro: true });
try {
  await b.ir("https://boliviasabe.vercel.app/", 6000);
  await b.captura("out/capturas/prueba-oscuro.png");
  console.log("título:", await b.evaluar("document.title"), "| ruta:", await b.evaluar("location.pathname"));
  console.log("textos:", (await b.evaluar("document.body.innerText")).slice(0, 600).replace(/\n+/g, " | "));
} finally {
  b.cerrar();
}
