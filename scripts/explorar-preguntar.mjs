// Ensayo con la cuenta de ensayo: Tu barrio, saldo, y el formulario Preguntar (NO publica nada).
import { abrir } from "./navegador.mjs";

const [CORREO, CLAVE] = process.argv.slice(2);
const b = await abrir({ oscuro: true, puerto: 9361 });
let n = 0;
const paso = async (nombre) => {
  n++;
  await b.captura(`out/capturas/registro/p${String(n).padStart(2, "0")}-${nombre}.png`);
  const t = (await b.evaluar("document.body.innerText")).split("\n").map((s) => s.trim()).filter(Boolean);
  console.log("##", nombre, "|", t.slice(0, 40).join(" | ").slice(0, 700));
};
try {
  await b.ir("https://boliviasabe.vercel.app/", 5000);
  await b.tocarTexto("Iniciar sesión", 1200);
  await b.tocarTexto("Usar mi correo", 1200);
  await b.evaluar(`document.querySelector('input[type=email]').focus()`);
  await b.escribir(CORREO);
  await b.evaluar(`document.querySelector('input[type=password]').focus()`);
  await b.escribir(CLAVE);
  await b.tocarTexto("Continuar", 5000);
  await paso("barrio");
  // Nombre y zona
  await b.evaluar(`document.querySelector('input:not([type=search])').focus()`);
  await b.escribir("Camila E.");
  await b.tocarTexto("Queru Queru", 600);
  await paso("barrio-lleno");
  await b.tocarTexto("Listo", 9000);
  await paso("despues-listo");
  await b.evaluar("window.scrollTo(0,0)");
  await b.tocarTexto("¿Alguien sabe?", 2500);
  await paso("alguien-sabe");
  await b.tocarTexto("Preguntar", 2000);
  await paso("preguntar-vacio");
  await b.evaluar(`document.querySelector('textarea').focus()`);
  await b.escribir("¿Quién arregla una tubería hoy en Queru Queru? Se está saliendo el agua.");
  await paso("preguntar-escrito");
  await b.tocarTexto("Urgente", 1200);
  await paso("preguntar-urgente");
  console.log(JSON.stringify(await b.evaluar(`[...document.querySelectorAll('button,input,[role=switch]')].filter(e=>e.offsetParent).map(e=>({t:e.tagName,ty:e.type,tx:(e.innerText||'').slice(0,30),role:e.getAttribute('role'),dis:e.disabled,chk:e.getAttribute('aria-checked')}))`)));
} finally {
  b.cerrar();
}
