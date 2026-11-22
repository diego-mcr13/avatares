// Capturas de la página REAL con una cuenta de la demo (solo mira: no publica, no responde, no da «Me sirvió»).
// Las cuentas de la demo están en la wiki (pitch › Explicarlo). Uso:
//   node scripts/capturar-sesion.mjs ana@example.com
// Guarda en out/capturas/sesion-<nombre>/ y los textos en textos.json
import { mkdirSync, writeFileSync } from "node:fs";
import { abrir } from "./navegador.mjs";

const correo = process.argv[2] ?? "ana@example.com";
const nombre = correo.split("@")[0];
const CLAVE = process.env.CLAVE_DEMO;
const URL = "https://boliviasabe.vercel.app/";
const SAL = `out/capturas/sesion-${nombre}`;
mkdirSync(SAL, { recursive: true });
const textos = {};

const b = await abrir({ oscuro: true, puerto: 9340 });
const guardar = async (n, nota = "") => {
  await b.captura(`${SAL}/${n}.png`);
  textos[n] = {
    nota,
    ruta: await b.evaluar("location.pathname"),
    texto: (await b.evaluar("document.body.innerText")).split("\n").map((s) => s.trim()).filter(Boolean).slice(0, 90),
  };
  console.log("✓", n, textos[n].ruta);
};
const intentar = async (n, f) => {
  try {
    await f();
  } catch (e) {
    console.log("✗", n, String(e.message).slice(0, 140));
  }
};
const volver = async () => {
  await b.ir(URL, 3500);
};

try {
  await b.ir(URL, 5000);
  await b.tocarTexto("Iniciar sesión", 1200);
  await b.tocarTexto("Usar mi correo", 1200);
  await guardar("00-form-correo", "Hoja de correo");
  // Campos: correo y contraseña
  const campos = await b.evaluar(`[...document.querySelectorAll('input')].filter(i=>i.offsetParent).map(i=>({t:i.type,p:i.placeholder,n:i.name,a:i.autocomplete}))`);
  console.log("campos:", JSON.stringify(campos));
  await b.evaluar(`document.querySelector('input[type=email]').focus()`);
  await b.escribir(correo);
  await b.evaluar(`document.querySelector('input[type=password]').focus()`);
  await b.escribir(CLAVE);
  await guardar("01-form-lleno");
  await b.evaluar(`(() => { const f=document.querySelector('input[type=password]').closest('form'); const btn=[...f.querySelectorAll('button')].find(x=>/entrar|continuar|iniciar/i.test(x.innerText)&&x.type!=='button') || f.querySelector('button[type=submit]'); btn.click(); })()`);
  await b.esperar(5000);
  await guardar("02-despues-de-entrar", "Debería abrir Hoy con sesión");

  await intentar("hoy", async () => {
    await b.evaluar("window.scrollTo(0,0)");
    await guardar("03-hoy-con-sesion");
  });
  await intentar("yo", async () => {
    await b.tocarTexto("Yo", 2500);
    await guardar("10-yo");
    await b.evaluar("window.scrollTo(0, 99999)");
    await b.esperar(600);
    await guardar("11-yo-abajo");
    await b.evaluar("window.scrollTo(0, 0)");
  });
  for (const [etq, arch] of [["Movimientos", "12-movimientos"], ["Mi actividad", "13-mi-actividad"], ["Ajustes", "14-ajustes"], ["Avisos", "15-avisos"]]) {
    await intentar(etq, async () => {
      await b.tocarTexto("Yo", 1800).catch(() => {});
      await b.tocarTexto(etq, 2200);
      await guardar(arch);
      await b.evaluar("window.scrollTo(0, 700)");
      await b.esperar(500);
      await guardar(`${arch}-abajo`);
    });
  }
  await intentar("subir", async () => {
    await volver();
    await b.tocarTexto("Subir letrero", 1800);
    await guardar("20-subir-letrero-hoja", "Solo se abre; no se publica");
    await b.evaluar("document.activeElement && document.activeElement.blur()");
  });
  await intentar("preguntar", async () => {
    await volver();
    await b.tocarTexto("¿Alguien sabe?", 2200);
    await b.tocarTexto("Preguntar", 1800);
    await guardar("21-preguntar-hoja", "Solo se abre; no se publica");
  });
  await intentar("pregunta detalle", async () => {
    await volver();
    await b.tocarTexto("¿Alguien sabe?", 2200);
    await b.tocarTexto("Urgente", 2500);
    await guardar("22-pregunta-detalle");
  });
  await intentar("letrero detalle", async () => {
    await volver();
    await b.evaluar(`document.querySelector('.tile__open').click()`);
    await b.esperar(2500);
    await guardar("23-letrero-detalle");
    await b.evaluar("window.scrollTo(0, 500)");
    await b.esperar(500);
    await guardar("24-letrero-detalle-abajo");
  });
} finally {
  writeFileSync(`${SAL}/textos.json`, JSON.stringify(textos, null, 2));
  b.cerrar();
}
