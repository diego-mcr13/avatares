// Nueva toma de la demo para la animación (22 nov): capturas nítidas a 3× (1080 × 2400) en cada paso del recorrido,
// con la posición de cada botón que se toca (en px de la pantalla de 360 × 800) para animar los toques encima.
// Cuentas nuevas solo para esta toma: «Camila Q.» (pregunta) y «Ana R.» (responde), las dos en Queru Queru.
//
//   node scripts/tomas-nitidas.mjs        (lee CAMILA_CORREO, CAMILA_CLAVE, ANA_CORREO, ANA_CLAVE de .env)
//
// ESCRIBE en la página real: crea las dos cuentas, publica una pregunta urgente, una respuesta y da «Me sirvió».
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { abrir } from "./navegador.mjs";

const URL = "https://boliviasabe.vercel.app/";
const OUT = "public/video/tomas";
mkdirSync(OUT, { recursive: true });
const env = Object.fromEntries(
  readFileSync(".env", "utf8")
    .split("\n")
    .filter((l) => /^[A-Z_]+=/.test(l))
    .map((l) => [l.slice(0, l.indexOf("=")), l.slice(l.indexOf("=") + 1).trim()]),
);
const CAMILA = { correo: env.CAMILA_CORREO, clave: env.CAMILA_CLAVE, nombre: "Camila Quispe" };
const ANA = { correo: env.ANA_CORREO, clave: env.ANA_CLAVE, nombre: "Ana Ríos" };
const PREGUNTA = "¿Quién arregla una tubería hoy en Queru Queru? Se está saliendo el agua.";
const RESPUESTA = "Don Remberto, plomero de la Av. América, atiende los domingos.";

const tomas = {};
const pausa = (ms) => new Promise((r) => setTimeout(r, ms));
const log = (...a) => console.log(new Date().toLocaleTimeString(), ...a);

// Caja (en px de la pantalla) del primer elemento visible que cumple `cuerpo`
const caja = async (b, cuerpo) =>
  b.evaluar(
    `(() => { const e = (() => { ${cuerpo} })(); if (!e) return null; const r = e.getBoundingClientRect(); return {x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height)}; })()`,
  );
const porTexto = (texto, sel = "button,a,label,[role=button]") =>
  `const t=${JSON.stringify(texto)}.toLowerCase(); const l=[...document.querySelectorAll(${JSON.stringify(sel)})].filter(e=>e.getClientRects().length>0&&((e.innerText||'')+' '+(e.getAttribute('aria-label')||'')).toLowerCase().includes(t)); l.sort((a,b)=>a.getBoundingClientRect().width*a.getBoundingClientRect().height-b.getBoundingClientRect().width*b.getBoundingClientRect().height); return l[0];`;
const exacto = (texto, sel = "button") =>
  `return [...document.querySelectorAll(${JSON.stringify(sel)})].find(e=>e.getClientRects().length>0&&e.innerText.trim()===${JSON.stringify(texto)});`;
const empieza = (texto, sel = "button") =>
  `return [...document.querySelectorAll(${JSON.stringify(sel)})].find(e=>e.getClientRects().length>0&&e.innerText.trim().startsWith(${JSON.stringify(texto)}));`;

// Guarda la captura y las cajas de los elementos que importan en ese estado
const captura = async (b, nombre, elementos = {}) => {
  await b.esperar(700);
  const cajas = {};
  for (const [k, cuerpo] of Object.entries(elementos)) cajas[k] = await caja(b, cuerpo);
  await b.captura(`${OUT}/${nombre}.png`);
  tomas[nombre] = { archivo: `video/tomas/${nombre}.png`, cajas };
  writeFileSync(`${OUT}/tomas.json`, JSON.stringify(tomas, null, 1));
  log("captura", nombre, JSON.stringify(cajas));
};
const tocar = async (b, cuerpo, etiqueta) => {
  const c = await caja(b, `const e=(() => { ${cuerpo} })(); if (e) e.scrollIntoView({block:'center'}); return e;`);
  if (!c) throw new Error(`No encuentro ${etiqueta}`);
  await b.esperar(300);
  const d = await caja(b, cuerpo);
  await b.tocar(d.x + d.w / 2, d.y + d.h / 2);
  await b.esperar(600);
};
const escribir = async (b, texto, ms = 25) => {
  for (const ch of texto) {
    await b.escribir(ch);
    await pausa(ms);
  }
};
const esperarTexto = async (b, re, tope = 60000, etiqueta = "") => {
  const ini = Date.now();
  while (Date.now() - ini < tope) {
    if (new RegExp(re).test(await b.evaluar("document.body.innerText"))) return;
    await pausa(700);
  }
  throw new Error(`Se agotó la espera de ${etiqueta || re}`);
};
const esperarSaldo = async (b, n) => {
  const ini = Date.now();
  while (!(await b.evaluar(`!!document.querySelector('button[aria-label^="Tienes ${n} yapitas"]')`))) {
    if (Date.now() - ini > 120000) throw new Error(`El saldo de ${n} yapitas no apareció`);
    await pausa(1000);
  }
};
const ocultarCorreo = (b) =>
  b.evaluar(`(() => { const s=document.createElement('style'); s.textContent='input[type=email]{filter:blur(7px)!important}'; document.head.appendChild(s); })()`);

// Registro con correo y «Tu barrio» en Queru Queru (con capturas si `fotos`)
const registrar = async (b, cuenta, fotos) => {
  await b.ir(URL, 4500);
  await ocultarCorreo(b);
  if (fotos) await captura(b, "c03-hoy-sin-sesion", { iniciar: porTexto("Iniciar sesión") });
  await tocar(b, porTexto("Iniciar sesión"), "Iniciar sesión");
  await b.esperar(900);
  if (fotos) await captura(b, "c04-hoja-entrar", { correo: porTexto("Usar mi correo"), google: porTexto("Continuar con Google") });
  await tocar(b, porTexto("Usar mi correo"), "Usar mi correo");
  await b.esperar(800);
  await b.evaluar(`document.querySelector('input[type=email]').focus()`);
  await escribir(b, cuenta.correo, 15);
  await b.evaluar(`document.querySelector('input[type=password]').focus()`);
  await escribir(b, cuenta.clave, 15);
  if (fotos) await captura(b, "c05-correo", { continuar: exacto("Continuar") });
  await tocar(b, exacto("Continuar"), "Continuar");
  await esperarTexto(b, "Tu barrio", 25000, "Tu barrio");
  await b.esperar(1000);
  await tocar(b, `return document.querySelector('input:not([type=search])');`, "el nombre");
  await escribir(b, cuenta.nombre, 30);
  await tocar(b, exacto("Queru Queru"), "Queru Queru");
  await b.esperar(800);
  if (fotos) await captura(b, "c06-tu-barrio", { zona: exacto("Queru Queru"), listo: exacto("Listo") });
  await tocar(b, exacto("Listo"), "Listo");
  await b.esperar(2500);
  await esperarSaldo(b, 5);
  await b.evaluar("window.scrollTo(0,0)");
  if (fotos) await captura(b, "c07-hoy-saldo-5", { saldo: `return document.querySelector('button[aria-label^="Tienes"]');` });
};

const camila = await abrir({ oscuro: true, puerto: 9381, escala: 3 });
const ana = await abrir({ oscuro: true, puerto: 9382, escala: 3 });
try {
  // 1. Ana se registra primero (sin capturas) para recibir el aviso de la urgente de su zona
  log("Ana se registra");
  await registrar(ana, ANA, false);

  // 2. Hoy sin cuenta y búsqueda (Camila, todavía sin sesión)
  await camila.ir(URL, 4500);
  await captura(camila, "c01-hoy", { buscador: `return document.querySelector('input[type=search]');`, iniciar: porTexto("Iniciar sesión") });
  await tocar(camila, `return document.querySelector('input[type=search]');`, "el buscador");
  await escribir(camila, "almuerzo", 60);
  await camila.esperar(2500);
  await captura(camila, "c02-busqueda", { buscador: `return document.querySelector('input[type=search]');` });
  await camila.evaluar("window.scrollTo(0, 360)");
  await captura(camila, "c02b-resultados", {});

  // 3. Camila crea su cuenta en vivo
  log("Camila se registra");
  await registrar(camila, CAMILA, true);

  // 4. Camila pregunta urgente
  await tocar(camila, porTexto("¿Alguien sabe?"), "¿Alguien sabe?");
  await camila.esperar(2000);
  await captura(camila, "c08-alguien-sabe", { preguntar: porTexto("Preguntar") });
  await tocar(camila, porTexto("Preguntar"), "Preguntar");
  await camila.esperar(1200);
  await tocar(camila, `return document.querySelector('textarea');`, "el cuadro de pregunta");
  await escribir(camila, PREGUNTA, 20);
  await camila.esperar(1200);
  await esperarTexto(camila, "Urgente \\(−5 yapitas\\)", 10000, "Urgente");
  await captura(camila, "c09-pregunta-escrita", {
    texto: `return document.querySelector('textarea');`,
    urgente: porTexto("Urgente (−5 yapitas)", "label,button,[role=switch],div"),
  });
  await tocar(camila, porTexto("Urgente (−5 yapitas)", "label,button,[role=switch],div"), "Urgente");
  await camila.esperar(900);
  await captura(camila, "c10-urgente", {
    urgente: porTexto("Urgente (−5 yapitas)", "label,button,[role=switch],div"),
    publicar: empieza("Publicar"),
  });
  await tocar(camila, empieza("Publicar"), "Publicar");
  await esperarTexto(camila, "Pregúntale a tus grupos|Compartir", 25000, "la pregunta publicada");
  await camila.esperar(1500);
  await captura(camila, "c11-publicada", { urgente: exacto("Urgente", "span,div,p") });

  // 5. Ana ve el aviso y responde; a Camila le aparece sola
  await ana.ir(URL, 4500);
  await ana.evaluar("window.scrollTo(0,0)");
  await captura(ana, "a01-hoy-aviso", { campana: porTexto("Avisos") });
  await tocar(ana, porTexto("Avisos"), "la campana");
  await ana.esperar(2000);
  await captura(ana, "a02-avisos", {
    aviso: `const l=[...document.querySelectorAll('li,button,a,[role=button]')].filter(e=>e.getClientRects().length>0&&/urgente/i.test(e.innerText||'')&&e.getBoundingClientRect().height<200); l.sort((x,y)=>x.getBoundingClientRect().height-y.getBoundingClientRect().height); return l[0];`,
  });
  await tocar(
    ana,
    `const l=[...document.querySelectorAll('li,button,a,[role=button],div')].filter(e=>e.getClientRects().length>0&&/tubería|urgente/i.test(e.innerText||'')&&e.getBoundingClientRect().height<300); l.sort((x,y)=>x.getBoundingClientRect().height-y.getBoundingClientRect().height); return l[0];`,
    "el aviso",
  );
  await ana.esperar(2200);
  await captura(ana, "a03-pregunta", { cuadro: `return document.querySelector('textarea');` });
  await tocar(ana, `return document.querySelector('textarea');`, "el cuadro de respuesta");
  await escribir(ana, RESPUESTA, 20);
  await ana.esperar(600);
  await captura(ana, "a04-respuesta-escrita", { enviar: exacto("Enviar") });
  await captura(camila, "c11b-sin-respuesta", {});
  await tocar(ana, exacto("Enviar"), "Enviar");
  const enviado = Date.now();
  await esperarTexto(camila, "Don Remberto", 30000, "la respuesta en la pantalla de Camila");
  tomas.llegada = { segundos: Number(((Date.now() - enviado) / 1000).toFixed(1)) };
  await captura(camila, "c12-llega-respuesta", {
    respuesta: `const l=[...document.querySelectorAll('article,li,section,div')].filter(e=>e.getClientRects().length>0&&(e.innerText||'').includes('Don Remberto')&&e.getBoundingClientRect().height<320); l.sort((x,y)=>x.getBoundingClientRect().height-y.getBoundingClientRect().height); return l[l.length-1];`,
    sirvio: empieza("Me sirvió"),
  });
  await captura(ana, "a05-respondida", {});

  // 6. «Me sirvió»: Camila premia a Ana
  await tocar(camila, empieza("Me sirvió"), "Me sirvió");
  await esperarTexto(camila, "Solucionada", 25000, "Solucionada");
  await camila.esperar(1500);
  await captura(camila, "c13-solucionada", {
    gracias: `const l=[...document.querySelectorAll('div,section,p')].filter(e=>e.getClientRects().length>0&&/Gracias, pues/.test(e.innerText||'')&&e.getBoundingClientRect().height<220); l.sort((x,y)=>x.getBoundingClientRect().height-y.getBoundingClientRect().height); return l[l.length-1];`,
    solucionada: exacto("Solucionada", "span,div,p"),
  });
  await camila.evaluar("window.scrollTo(0,0)");
  await captura(camila, "c13b-solucionada-arriba", { solucionada: exacto("Solucionada", "span,div,p") });

  // 7. Ana ve su +5 en Movimientos y abre el registro en Stellar
  await ana.ir(URL, 4500);
  await tocar(ana, `return document.querySelector('button[aria-label^="Tienes"]');`, "el saldo");
  await esperarTexto(ana, "Tu respuesta sirvió", 40000, "el +5 en Movimientos");
  await ana.evaluar(`(() => { const e=[...document.querySelectorAll('*')].find(x=>x.getClientRects().length>0&&(x.innerText||'').trim()==='Tu respuesta sirvió'); if(e) e.scrollIntoView({block:'center'}); })()`);
  let enlace = null;
  for (let i = 0; i < 60 && !enlace; i++) {
    enlace = await ana.evaluar(`(() => { const l=[...document.querySelectorAll('a')].find(x=>/^Registro/.test((x.innerText||'').trim())); return l ? l.href : null; })()`);
    if (!enlace) await ana.esperar(1000);
  }
  if (!enlace) throw new Error("No apareció el enlace Registro del +5");
  await ana.esperar(1500);
  await captura(ana, "a06-movimientos", {
    fila: `const e=[...document.querySelectorAll('*')].find(x=>x.getClientRects().length>0&&(x.innerText||'').trim()==='Tu respuesta sirvió'); return e && e.closest('li,div');`,
    registro: `return [...document.querySelectorAll('a')].find(x=>/^Registro/.test((x.innerText||'').trim()));`,
  });
  tomas.enlace = enlace;
  await ana.ir(enlace, 9000);
  await captura(ana, "a07-explorador", {});
  writeFileSync(`${OUT}/tomas.json`, JSON.stringify(tomas, null, 1));
  log("Listo. Enlace del pago:", enlace);
} finally {
  camila.cerrar();
  ana.cerrar();
}
