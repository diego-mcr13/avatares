import { abrir } from "./navegador.mjs";
const b = await abrir({ oscuro: true, puerto: 9364 });
try {
  await b.ir("https://boliviasabe.vercel.app/", 5000);
  await b.tocarTexto("Iniciar sesión", 1200);
  await b.tocarTexto("Usar mi correo", 1200);
  await b.evaluar(`document.querySelector('input[type=email]').focus()`);
  await b.escribir("ana@example.com");
  await b.evaluar(`document.querySelector('input[type=password]').focus()`);
  await b.escribir(process.env.CLAVE_DEMO);
  await b.tocarTexto("Continuar", 6000);
  console.log(JSON.stringify(await b.evaluar(`[...document.querySelectorAll('button,a')].filter(e=>e.offsetParent&&e.getBoundingClientRect().top<70).map(e=>({tx:(e.innerText||'').slice(0,20),aria:e.getAttribute('aria-label'),x:Math.round(e.getBoundingClientRect().x),w:Math.round(e.getBoundingClientRect().width)}))`)));
  await b.tocarTexto("Avisos", 1800);
  await b.captura("out/capturas/registro/a03-avisos.png");
  console.log((await b.evaluar("document.body.innerText")).split("\n").map(s=>s.trim()).filter(Boolean).slice(-22).join(" | "));
} finally { b.cerrar(); }
