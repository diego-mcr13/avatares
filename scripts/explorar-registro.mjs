// Ensayo del registro: abre «Iniciar sesión», «Usar mi correo» y llena el formulario, con capturas de cada paso.
import { abrir } from "./navegador.mjs";

const CORREO = process.argv[2];
const CLAVE = process.argv[3];
const b = await abrir({ oscuro: true, puerto: 9360 });
const paso = async (n) => {
  await b.captura(`out/capturas/registro/${n}.png`);
  const t = (await b.evaluar("document.body.innerText")).split("\n").map((s) => s.trim()).filter(Boolean);
  console.log("##", n, "|", t.slice(-25).join(" | "));
};
try {
  await b.ir("https://boliviasabe.vercel.app/", 5000);
  await b.tocarTexto("Iniciar sesión", 1200);
  await b.tocarTexto("Usar mi correo", 1200);
  await paso("01-form");
  console.log(JSON.stringify(await b.evaluar(`[...document.querySelectorAll('input,button')].filter(e=>e.offsetParent).map(e=>({t:e.tagName,ty:e.type,tx:(e.innerText||'').slice(0,30),ph:e.placeholder,ac:e.autocomplete}))`)));
  await b.evaluar(`document.querySelector('input[type=email]').focus()`);
  await b.escribir(CORREO);
  await b.evaluar(`document.querySelector('input[type=password]').focus()`);
  await b.escribir(CLAVE);
  await paso("02-lleno");
  await b.tocarTexto("Continuar", 6000);
  await paso("03-despues-continuar");
  console.log(JSON.stringify(await b.evaluar(`[...document.querySelectorAll('input,button,select,textarea,[role=option],[role=listbox]')].filter(e=>e.offsetParent).slice(-14).map(e=>({t:e.tagName,ty:e.type,tx:(e.innerText||'').slice(0,30),ph:e.placeholder,id:e.id,nm:e.name,v:e.value}))`)));
} finally {
  b.cerrar();
}
