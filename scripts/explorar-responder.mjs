import { abrir } from "./navegador.mjs";
const b = await abrir({ oscuro: true, puerto: 9363 });
try {
  await b.ir("https://boliviasabe.vercel.app/", 5000);
  await b.tocarTexto("Iniciar sesión", 1200);
  await b.tocarTexto("Usar mi correo", 1200);
  await b.evaluar(`document.querySelector('input[type=email]').focus()`);
  await b.escribir("ana@example.com");
  await b.evaluar(`document.querySelector('input[type=password]').focus()`);
  await b.escribir(process.env.CLAVE_DEMO);
  await b.tocarTexto("Continuar", 6000);
  await b.captura("out/capturas/registro/a01-hoy.png");
  console.log("top:", (await b.evaluar("document.body.innerText")).split("\n").map(s=>s.trim()).filter(Boolean).slice(0,14).join(" | "));
  await b.tocarTexto("¿Alguien sabe?", 2500);
  await b.tocarTexto("licuadoras", 2500);
  await b.captura("out/capturas/registro/a02-pregunta.png");
  const t = (await b.evaluar("document.body.innerText")).split("\n").map(s=>s.trim()).filter(Boolean);
  console.log("pregunta:", t.slice(0,30).join(" | "));
  console.log(JSON.stringify(await b.evaluar(`[...document.querySelectorAll('button,textarea,input')].filter(e=>e.offsetParent).map(e=>({t:e.tagName,tx:(e.innerText||e.placeholder||'').slice(0,40),aria:e.getAttribute('aria-label')}))`)));
} finally { b.cerrar(); }
