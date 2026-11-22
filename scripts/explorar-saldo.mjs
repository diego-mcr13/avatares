import { abrir } from "./navegador.mjs";
const [CORREO, CLAVE] = process.argv.slice(2);
const b = await abrir({ oscuro: true, puerto: 9362 });
try {
  await b.ir("https://boliviasabe.vercel.app/", 5000);
  await b.tocarTexto("Iniciar sesión", 1200);
  await b.tocarTexto("Usar mi correo", 1200);
  await b.evaluar(`document.querySelector('input[type=email]').focus()`);
  await b.escribir(CORREO);
  await b.evaluar(`document.querySelector('input[type=password]').focus()`);
  await b.escribir(CLAVE);
  await b.tocarTexto("Continuar", 6000);
  await b.captura("out/capturas/registro/s01-hoy.png");
  await b.tocarTexto("Yo", 2500);
  for (let i = 0; i < 12; i++) {
    const t = (await b.evaluar("document.body.innerText")).split("\n").map((s) => s.trim()).filter(Boolean);
    console.log(i * 5, "s |", t.slice(10, 30).join(" | ").slice(0, 300));
    if (t.some((x) => /^\d+$/.test(x)) ) { await b.captura("out/capturas/registro/s02-yo.png"); }
    await b.esperar(5000);
  }
  await b.captura("out/capturas/registro/s03-yo-final.png");
} finally { b.cerrar(); }
