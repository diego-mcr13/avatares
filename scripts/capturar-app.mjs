// Capturas de la página REAL (solo lectura, sin cuenta): sirven de referencia para las pantallas del video.
//   node scripts/capturar-app.mjs            -> out/capturas/real/*.png + out/capturas/real/textos.json
import { writeFileSync } from "node:fs";
import { abrir } from "./navegador.mjs";

const URL = "https://boliviasabe.vercel.app/";
const SAL = "out/capturas/real";
const textos = {};
const guardar = async (b, nombre, nota = "") => {
  await b.captura(`${SAL}/${nombre}.png`);
  textos[nombre] = {
    nota,
    ruta: await b.evaluar("location.pathname + location.search"),
    texto: (await b.evaluar("document.body.innerText")).split("\n").map((s) => s.trim()).filter(Boolean).slice(0, 80),
  };
  console.log("✓", nombre, textos[nombre].ruta);
};
const intentar = async (nombre, f) => {
  try {
    await f();
  } catch (e) {
    console.log("✗", nombre, String(e.message).slice(0, 120));
  }
};

// ---------- Celular, oscuro ----------
let b = await abrir({ oscuro: true });
try {
  await b.ir(URL, 6000);
  await guardar(b, "01-hoy-oscuro", "Hoy, arriba");
  await b.evaluar("window.scrollTo(0, 700)");
  await b.esperar(800);
  await guardar(b, "02-hoy-scroll1");
  await b.evaluar("window.scrollTo(0, 1500)");
  await b.esperar(800);
  await guardar(b, "03-hoy-scroll2");
  await b.evaluar("window.scrollTo(0, 99999)");
  await b.esperar(800);
  await guardar(b, "04-hoy-final");
  await b.evaluar("window.scrollTo(0, 0)");
  await b.esperar(500);

  await intentar("ciudad", async () => {
    await b.tocarTexto("Cochabamba", 900);
    await guardar(b, "05-selector-ciudad");
    await b.ir(URL, 4000);
  });

  await intentar("detalle", async () => {
    await b.evaluar("window.scrollTo(0, 0)");
    const c = await b.evaluar(`(() => { const a=[...document.querySelectorAll('a[href*="/l/"]')].find(e=>e.offsetParent); if(!a) return null; const r=a.getBoundingClientRect(); return {x:r.x+r.width/2,y:r.y+r.height/2, href:a.getAttribute('href')} })()`);
    if (!c) throw new Error("no hay enlaces /l/");
    await b.tocar(c.x, c.y);
    await b.esperar(2500);
    await guardar(b, "06-detalle-letrero", c.href);
    await b.evaluar("window.scrollTo(0, 600)");
    await b.esperar(600);
    await guardar(b, "07-detalle-letrero-abajo");
    await b.evaluar("window.scrollTo(0, 0)");
    await intentar("me sirvio", async () => {
      await b.tocarTexto("Me sirvió", 1500);
      await guardar(b, "08-muro-me-sirvio", "Sin cuenta, al tocar Me sirvió");
    });
  });

  await b.ir(URL, 4000);
  await intentar("alguien sabe", async () => {
    await b.tocarTexto("¿Alguien sabe?", 2500);
    await guardar(b, "09-alguien-sabe-lista");
    await b.evaluar("window.scrollTo(0, 900)");
    await b.esperar(600);
    await guardar(b, "10-alguien-sabe-scroll");
    await b.evaluar("window.scrollTo(0, 0)");
    const c = await b.evaluar(`(() => { const a=[...document.querySelectorAll('a[href*="/p/"]')].find(e=>e.offsetParent); if(!a) return null; const r=a.getBoundingClientRect(); return {x:r.x+r.width/2,y:r.y+r.height/2, href:a.getAttribute('href')} })()`);
    if (c) {
      await b.tocar(c.x, c.y);
      await b.esperar(2500);
      await guardar(b, "11-pregunta-detalle", c.href);
    }
  });

  await b.ir(URL, 4000);
  await intentar("yo", async () => {
    await b.tocarTexto("Yo", 2000);
    await guardar(b, "12-yo-invitado");
  });
  await b.ir(URL, 3000);
  await intentar("entrar", async () => {
    await b.tocarTexto("Iniciar sesión", 1500);
    await guardar(b, "13-entrar-hoja");
  });
} finally {
  b.cerrar();
}

// ---------- Celular, claro ----------
b = await abrir({ oscuro: false, puerto: 9334 });
try {
  await b.ir(URL, 6000);
  await guardar(b, "20-hoy-claro");
  await b.tocarTexto("¿Alguien sabe?", 2500).catch(() => {});
  await guardar(b, "21-alguien-sabe-claro");
} finally {
  b.cerrar();
}

// ---------- Computador ----------
b = await abrir({ ancho: 1440, alto: 900, escala: 1, oscuro: true, movil: false, puerto: 9335 });
try {
  await b.ir(URL, 6000);
  await guardar(b, "30-pc-hoy");
  await intentar("pc detalle", async () => {
    const c = await b.evaluar(`(() => { const a=[...document.querySelectorAll('a[href*="/l/"]')].find(e=>e.offsetParent); if(!a) return null; const r=a.getBoundingClientRect(); return {x:r.x+r.width/2,y:r.y+r.height/2} })()`);
    if (c) {
      await b.tocar(c.x, c.y);
      await b.esperar(2500);
      await guardar(b, "31-pc-letrero-ventana");
    }
  });
  await b.ir(URL, 3500);
  await intentar("pc alguien", async () => {
    await b.tocarTexto("¿Alguien sabe?", 2500);
    await guardar(b, "32-pc-alguien-sabe");
  });
} finally {
  b.cerrar();
}

writeFileSync(`${SAL}/textos.json`, JSON.stringify(textos, null, 2));
console.log("Listo:", SAL);
