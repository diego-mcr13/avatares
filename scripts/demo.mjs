// Recorrido de la demo en la página real, grabado con Chrome por script (sin celulares).
// Guarda clips mp4 en out/grabaciones/ y una lista de marcas de tiempo en out/grabaciones/marcas.json.
//
//   node scripts/demo.mjs 3-4  CORREO CLAVE_NUEVA            -> escena 3 (sin cuenta) y 4 (registro en vivo)
//   node scripts/demo.mjs 5-7  CORREO CLAVE_NUEVA CLAVE_ANA  -> escenas 5, 6 y 7 (preguntar, responder, Me sirvió, Stellar)
//
// ESCRIBE en la página real (crea una cuenta, publica una pregunta, una respuesta y da «Me sirvió»).
import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { abrir } from "./navegador.mjs";

const URL = "https://boliviasabe.vercel.app/";
const OUT = process.env.SALIDA || "out/grabaciones";
mkdirSync(OUT, { recursive: true });
const [fase, CORREO, CLAVE, CLAVE_ANA = process.env.CLAVE_DEMO] = process.argv.slice(2);
const PREGUNTA = "¿Quién arregla una tubería hoy en Queru Queru? Se está saliendo el agua.";
const RESPUESTA = "Don Remberto, plomero de la Av. América, atiende los domingos.";
const NOMBRE = "Camila Q.";

const marcasArch = `${OUT}/marcas.json`;
const marcas = existsSync(marcasArch) ? JSON.parse(readFileSync(marcasArch, "utf8")) : {};
const guardarMarcas = () => writeFileSync(marcasArch, JSON.stringify(marcas, null, 1));
const pausa = (ms) => new Promise((r) => setTimeout(r, ms));
const log = (...a) => console.log(new Date().toLocaleTimeString(), ...a);

// ---------- Utilidades ----------
const escribirLento = async (b, texto, ms = 55) => {
  for (const ch of texto) {
    await b.escribir(ch);
    await pausa(ms);
  }
};
// Toca el primer elemento visible que cumple `condicion` (código JS que devuelve el elemento)
const tocarEl = async (b, cuerpo, etiqueta) => {
  const c = await b.evaluar(`(() => { const e = (() => { ${cuerpo} })(); if (!e) return null; e.scrollIntoView({block:'center'}); const r = e.getBoundingClientRect(); return {x: r.x + r.width/2, y: r.y + r.height/2}; })()`);
  if (!c) throw new Error(`No encuentro ${etiqueta}`);
  await b.esperar(250);
  const c2 = await b.evaluar(`(() => { const e = (() => { ${cuerpo} })(); const r = e.getBoundingClientRect(); return {x: r.x + r.width/2, y: r.y + r.height/2}; })()`);
  await b.tocar(c2.x, c2.y);
  await b.esperar(500);
  return c2;
};
const porTexto = (texto, sel = "button,a,label,[role=button]") =>
  `const t=${JSON.stringify(texto)}.toLowerCase(); const l=[...document.querySelectorAll(${JSON.stringify(sel)})].filter(e=>e.getClientRects().length>0&&((e.innerText||'')+' '+(e.getAttribute('aria-label')||'')).toLowerCase().includes(t)); l.sort((a,b)=>a.getBoundingClientRect().width*a.getBoundingClientRect().height-b.getBoundingClientRect().width*b.getBoundingClientRect().height); return l[0];`;
const esperarTexto = async (b, re, tope = 60000, etiqueta = "") => {
  const ini = Date.now();
  while (Date.now() - ini < tope) {
    const t = await b.evaluar("document.body.innerText");
    if (new RegExp(re).test(t)) return true;
    await pausa(700);
  }
  throw new Error(`Se agotó la espera de ${etiqueta || re}`);
};
const texto = async (b) => (await b.evaluar("document.body.innerText")).split("\n").map((s) => s.trim()).filter(Boolean);

const entrar = async (b, correo, clave) => {
  await b.ir(URL, 4500);
  await tocarEl(b, porTexto("Iniciar sesión"), "Iniciar sesión");
  await b.esperar(900);
  await tocarEl(b, porTexto("Usar mi correo"), "Usar mi correo");
  await b.esperar(800);
  await b.evaluar(`document.querySelector('input[type=email]').focus()`);
  await b.escribir(correo);
  await b.evaluar(`document.querySelector('input[type=password]').focus()`);
  await b.escribir(clave);
  await tocarEl(b, porTexto("Continuar"), "Continuar");
  await b.esperar(5500);
};

const aMp4 = (carpeta, salida) => {
  const r = spawnSync("npx", ["remotion", "ffmpeg", "-y", "-f", "concat", "-safe", "0", "-i", `${carpeta}/lista.txt`, "-vf", "scale=720:-2", "-r", "30", "-pix_fmt", "yuv420p", salida], { shell: true, stdio: "ignore" });
  return r.status === 0;
};
const cerrarClip = async (b, nombre) => {
  const r = await b.terminarGrabacion(`${OUT}/${nombre}.mp4`);
  const ok = aMp4(r.carpeta, `${OUT}/${nombre}.mp4`);
  marcas[nombre] = { ...(marcas[nombre] || {}), duracion: Number(r.duracion.toFixed(2)), cuadros: r.cuadros };
  guardarMarcas();
  log(`clip ${nombre}: ${r.duracion.toFixed(1)} s ${ok ? "ok" : "FALLÓ el mp4"}`);
};
const marca = (nombre, evento, t0) => {
  marcas[nombre] = marcas[nombre] || {};
  marcas[nombre].eventos = marcas[nombre].eventos || [];
  marcas[nombre].eventos.push({ t: Number(((Date.now() - t0) / 1000).toFixed(2)), evento });
  log(`[${nombre}] ${evento}`);
};


const movimientosAna = async (a) => {
    await a.empezarGrabacion();
    const t0 = Date.now();
    await a.esperar(1500);
    marca("e7-ana", "toca su saldo (abre Movimientos)", t0);
    await tocarEl(a, `return document.querySelector('button[aria-label^="Tienes"]');`, "el saldo");
    await a.esperar(2500);
    await esperarTexto(a, "Tu respuesta sirvió", 30000, "el movimiento +5");
    await a.evaluar(`(() => { const e=[...document.querySelectorAll('*')].find(x=>x.getClientRects().length>0&&(x.innerText||'').trim()==='Tu respuesta sirvió'); if(e) e.scrollIntoView({block:'center'}); })()`);
    await a.esperar(2500);
    marca("e7-ana", "se ve Tu respuesta sirvió +5 Confirmado", t0);
    await a.captura(`${OUT}/e7-movimientos.png`);
    let enlace = null;
    for (let i = 0; i < 60 && !enlace; i++) {
      enlace = await a.evaluar(`(() => { const l=[...document.querySelectorAll('a')].find(x=>/^Registro/.test((x.innerText||'').trim())); return l ? l.href : null; })()`);
      if (!enlace) await a.esperar(1000);
    }
    if (!enlace) throw new Error("No encontré el enlace Registro del +5");
    marcas["e7-ana"].enlace = enlace;
    marca("e7-ana", "toca Registro", t0);
    await tocarEl(a, `const e=[...document.querySelectorAll('a')].find(x=>x.href===${JSON.stringify(enlace)}); return e;`, "el enlace Registro");
    await a.esperar(800);
    await a.ir(enlace, 8000);
    marca("e7-ana", "se abre stellar.expert", t0);
    await a.esperar(4000);
    await a.captura(`${OUT}/e7-explorador.png`);
    await a.evaluar("window.scrollTo(0, 500)");
    await a.esperar(2500);
    await a.captura(`${OUT}/e7-explorador-abajo.png`);
    await cerrarClip(a, "e7-ana");
};

// ---------- Escenas 3 y 4 ----------
const escenas34 = async () => {
  const b = await abrir({ oscuro: true, puerto: 9370 });
  try {
    await b.ir(URL, 4500);
    // Escena 3: sin cuenta, buscar «almuerzo»
    await b.empezarGrabacion();
    let t0 = Date.now();
    await b.esperar(1800);
    for (let y = 0; y <= 500; y += 50) { await b.evaluar(`window.scrollTo(0, ${y})`); await b.esperar(80); }
    await b.esperar(500);
    await b.evaluar("window.scrollTo(0, 0)");
    await b.esperar(900);
    marca("e3-hoy", "toca el buscador", t0);
    await tocarEl(b, `return document.querySelector('input[type=search]');`, "el buscador");
    await escribirLento(b, "almuerzo", 110);
    marca("e3-hoy", "escribió almuerzo", t0);
    await b.esperar(3000);
    await b.evaluar("window.scrollTo(0, 420)");
    await b.esperar(1800);
    await cerrarClip(b, "e3-hoy");

    // Escena 4: crear la cuenta en vivo
    await b.ir(URL, 4000);
    await b.evaluar(`(() => { const s=document.createElement('style'); s.textContent='input[type=email]{filter:blur(6px)!important}'; document.head.appendChild(s); })()`);
    await b.empezarGrabacion();
    t0 = Date.now();
    await b.esperar(1200);
    marca("e4-registro", "toca Iniciar sesión", t0);
    await tocarEl(b, porTexto("Iniciar sesión"), "Iniciar sesión");
    await b.esperar(1100);
    await tocarEl(b, porTexto("Usar mi correo"), "Usar mi correo");
    await b.esperar(1000);
    await b.evaluar(`document.querySelector('input[type=email]').focus()`);
    await escribirLento(b, CORREO, 45);
    await b.evaluar(`document.querySelector('input[type=password]').focus()`);
    await escribirLento(b, CLAVE, 60);
    await b.esperar(500);
    marca("e4-registro", "toca Continuar", t0);
    await tocarEl(b, porTexto("Continuar"), "Continuar");
    await esperarTexto(b, "Tu barrio", 20000, "Tu barrio");
    await b.esperar(1200);
    marca("e4-registro", "Tu barrio: nombre", t0);
    await tocarEl(b, `return document.querySelector('input:not([type=search])');`, "el nombre");
    await escribirLento(b, NOMBRE, 90);
    await b.esperar(500);
    marca("e4-registro", "Tu barrio: zona", t0);
    await tocarEl(b, `return [...document.querySelectorAll('button')].find(e=>e.getClientRects().length>0&&e.innerText.trim()==='Queru Queru');`, "la zona Queru Queru");
    await b.esperar(900);
    const valores = await b.evaluar(`[...document.querySelectorAll('input')].map(i=>i.value)`);
    if (!valores.some((v) => /queru/i.test(v))) throw new Error("La zona no quedó en Queru Queru: " + JSON.stringify(valores));
    marca("e4-registro", "toca Listo", t0);
    await tocarEl(b, `return [...document.querySelectorAll('button')].find(e=>e.getClientRects().length>0&&e.innerText.trim()==='Listo');`, "Listo");
    await b.esperar(3000);
    marca("e4-registro", "espera el saldo", t0);
    // Esperar a que aparezca el saldo de 5 yapitas (la cuenta de Stellar se crea en segundo plano)
    const ini = Date.now();
    for (;;) {
      const ok = await b.evaluar(`!!document.querySelector('button[aria-label^="Tienes 5 yapitas"]')`);
      if (ok) break;
      if (Date.now() - ini > 120000) throw new Error("El saldo de 5 yapitas no apareció en 2 minutos");
      await pausa(1000);
    }
    marca("e4-registro", "aparece el saldo de 5", t0);
    await b.esperar(2500);
    await cerrarClip(b, "e4-registro");
    await b.captura(`${OUT}/e4-saldo.png`);
  } finally {
    b.cerrar();
  }
};

// ---------- Escenas 5, 6 y 7 ----------
const escenas567 = async () => {
  const c = await abrir({ oscuro: true, puerto: 9371 });
  const a = await abrir({ oscuro: true, puerto: 9372 });
  try {
    log("entrando con las dos cuentas (sin grabar)");
    await entrar(c, CORREO, CLAVE);
    await entrar(a, "ana@example.com", CLAVE_ANA);
    const saldoC = await c.evaluar(`document.querySelector('button[aria-label^="Tienes"]')?.getAttribute('aria-label')`);
    const saldoA = await a.evaluar(`document.querySelector('button[aria-label^="Tienes"]')?.getAttribute('aria-label')`);
    log("saldo de la cuenta nueva:", saldoC, "| Ana:", saldoA);
    if (!/Tienes 5 yapitas/.test(saldoC || "")) throw new Error("La cuenta nueva no tiene exactamente 5 yapitas: " + saldoC);

    // Escena 5: Camila pregunta
    await c.evaluar("window.scrollTo(0,0)");
    await c.empezarGrabacion();
    let t0 = Date.now();
    await c.esperar(1200);
    marca("e5-pregunta", "toca ¿Alguien sabe?", t0);
    await tocarEl(c, porTexto("¿Alguien sabe?"), "¿Alguien sabe?");
    await c.esperar(2200);
    marca("e5-pregunta", "toca Preguntar", t0);
    await tocarEl(c, porTexto("Preguntar"), "Preguntar");
    await c.esperar(1500);
    marca("e5-pregunta", "escribe la pregunta", t0);
    await tocarEl(c, `return document.querySelector('textarea');`, "el cuadro de pregunta");
    await escribirLento(c, PREGUNTA, 50);
    await c.esperar(900);
    await esperarTexto(c, "Urgente \\(−5 yapitas\\)", 10000, "Urgente");
    const preparando = await c.evaluar(`document.body.innerText.includes('Tu cuenta se está preparando')`);
    if (preparando) throw new Error("La cuenta todavía se está preparando: Urgente está apagado");
    marca("e5-pregunta", "enciende Urgente", t0);
    await tocarEl(c, porTexto("Urgente (−5 yapitas)", "label,button,[role=switch],div"), "Urgente");
    await c.esperar(1100);
    await c.captura(`${OUT}/e5-urgente.png`);
    marca("e5-pregunta", "toca Publicar", t0);
    await tocarEl(c, `return [...document.querySelectorAll('button')].find(e=>e.getClientRects().length>0&&e.innerText.trim().startsWith('Publicar'));`, "Publicar");
    await esperarTexto(c, "Pregúntale a tus grupos|Compartir", 25000, "el detalle de la pregunta");
    marca("e5-pregunta", "pregunta publicada", t0);
    await c.esperar(2500);
    await cerrarClip(c, "e5-pregunta");

    // Escena 6: Ana ve el aviso y responde; Camila ve llegar la respuesta
    await c.empezarGrabacion();
    await a.empezarGrabacion();
    t0 = Date.now();
    await c.esperar(2500);
    marca("e6-ana", "toca la campana", t0);
    await tocarEl(a, porTexto("Avisos"), "la campana");
    await a.esperar(2200);
    await a.captura(`${OUT}/e6-avisos.png`);
    marca("e6-ana", "abre el aviso", t0);
    await tocarEl(a, `const l=[...document.querySelectorAll('li,button,a,[role=button],div')].filter(e=>e.getClientRects().length>0&&/tubería|urgente/i.test(e.innerText||'')&&e.getBoundingClientRect().height<300); l.sort((x,y)=>x.getBoundingClientRect().height-y.getBoundingClientRect().height); return l[0];`, "el aviso de la urgente");
    await a.esperar(2500);
    marca("e6-ana", "escribe la respuesta", t0);
    await tocarEl(a, `return document.querySelector('textarea');`, "el cuadro de respuesta");
    await escribirLento(a, RESPUESTA, 50);
    await a.esperar(700);
    marca("e6-ana", "toca Enviar", t0);
    await tocarEl(a, `return [...document.querySelectorAll('button')].find(e=>e.getClientRects().length>0&&e.innerText.trim()==='Enviar');`, "Enviar");
    const enviado = Date.now();
    await esperarTexto(c, "Don Remberto", 30000, "la respuesta en la pantalla de Camila");
    marcas["e6-camila"] = marcas["e6-camila"] || {};
    marca("e6-camila", `aparece la respuesta (${((Date.now() - enviado) / 1000).toFixed(1)} s después de Enviar)`, t0);
    await c.esperar(3000);
    await a.esperar(500);
    await cerrarClip(a, "e6-ana");
    await cerrarClip(c, "e6-camila");

    // Escena 7: Camila toca «Me sirvió»; Ana ve su +5 y abre el registro en Stellar
    await c.empezarGrabacion();
    await a.empezarGrabacion();
    t0 = Date.now();
    await c.esperar(1500);
    marca("e7-camila", "toca Me sirvió", t0);
    await tocarEl(c, `return [...document.querySelectorAll('button')].find(e=>e.getClientRects().length>0&&e.innerText.trim().startsWith('Me sirvió'));`, "Me sirvió");
    await esperarTexto(c, "Solucionada", 25000, "Solucionada");
    marca("e7-camila", "pregunta Solucionada", t0);
    await c.esperar(3000);
    await cerrarClip(c, "e7-camila");

    await cerrarClip(a, "e7-ana-espera");
    await a.ir(URL, 4500);
    await a.evaluar("window.scrollTo(0,0)");
    await movimientosAna(a);
  } finally {
    c.cerrar();
    a.cerrar();
  }
};


// ---------- Escena 7 (parte de Ana): Movimientos y registro en Stellar (solo mira) ----------
const escena7b = async () => {
  const a = await abrir({ oscuro: true, puerto: 9373 });
  try {
    await entrar(a, "ana@example.com", CLAVE_ANA);
    await movimientosAna(a);
  } finally {
    a.cerrar();
  }
};

if (fase === "3-4") await escenas34();
else if (fase === "7b") await escena7b();
else if (fase === "5-7") await escenas567();
else console.log("Uso: node scripts/demo.mjs 3-4|5-7 CORREO CLAVE [CLAVE_ANA]");
