// Mini control del navegador (Chrome sin ventana de Remotion) para sacar capturas de la página real.
// Lo usan los scripts de captura; no hace falta correrlo solo.
import { spawn } from "node:child_process";
import { mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

// El Chrome sin ventana que trae Remotion, según el sistema
const CHROME =
  process.platform === "win32"
    ? "node_modules/.remotion/chrome-headless-shell/win64/chrome-headless-shell-win64/chrome-headless-shell.exe"
    : `node_modules/.remotion/chrome-headless-shell/mac-${process.arch === "arm64" ? "arm64" : "x64"}/chrome-headless-shell-mac-${process.arch === "arm64" ? "arm64" : "x64"}/chrome-headless-shell`;
const dormir = (ms) => new Promise((r) => setTimeout(r, ms));

export const abrir = async ({ ancho = 360, alto = 800, escala = 2, oscuro = true, movil = true, puerto = 9333 } = {}) => {
  const datos = mkdtempSync(join(tmpdir(), "bs-chrome-"));
  const proceso = spawn(CHROME, [`--remote-debugging-port=${puerto}`, `--user-data-dir=${datos}`, "--no-first-run", "--hide-scrollbars", "--disable-gpu", "about:blank"], { stdio: "ignore" });
  let ws;
  for (let i = 0; i < 60; i++) {
    try {
      const lista = await (await fetch(`http://127.0.0.1:${puerto}/json`)).json();
      const pag = lista.find((p) => p.type === "page");
      if (pag) {
        ws = new WebSocket(pag.webSocketDebuggerUrl);
        await new Promise((ok, no) => {
          ws.onopen = ok;
          ws.onerror = no;
        });
        break;
      }
    } catch {
      /* todavía no abre */
    }
    await dormir(250);
  }
  if (!ws) throw new Error("No se pudo abrir el navegador");
  let n = 0;
  let grabacion = null;
  const pend = new Map();
  const eventos = [];
  ws.onmessage = (m) => {
    const d = JSON.parse(m.data);
    if (d.id && pend.has(d.id)) {
      const { ok, no } = pend.get(d.id);
      pend.delete(d.id);
      d.error ? no(new Error(JSON.stringify(d.error))) : ok(d.result);
    } else if (d.method === "Page.screencastFrame") {
      if (grabacion) grabacion.cuadros.push({ t: d.params.metadata.timestamp, datos: d.params.data });
      ws.send(JSON.stringify({ id: ++n, method: "Page.screencastFrameAck", params: { sessionId: d.params.sessionId } }));
    } else if (d.method) eventos.push(d);
  };
  const enviar = (method, params = {}) =>
    new Promise((ok, no) => {
      const id = ++n;
      pend.set(id, { ok, no });
      ws.send(JSON.stringify({ id, method, params }));
    });

  await enviar("Page.enable");
  await enviar("Runtime.enable");
  const fijarVista = async (o) => {
    await enviar("Emulation.setDeviceMetricsOverride", { width: o.ancho, height: o.alto, deviceScaleFactor: o.escala, mobile: o.movil });
    await enviar("Emulation.setTouchEmulationEnabled", { enabled: o.movil });
    await enviar("Emulation.setEmulatedMedia", { features: [{ name: "prefers-color-scheme", value: o.oscuro ? "dark" : "light" }] });
  };
  await fijarVista({ ancho, alto, escala, oscuro, movil });

  const api = {
    enviar,
    fijarVista,
    ir: async (url, espera = 3500) => {
      await enviar("Page.navigate", { url });
      await dormir(espera);
    },
    esperar: dormir,
    // Círculo amarillo en el punto de toque (como «Mostrar toques» del celular)
    anillo: async (x, y) => {
      await api.evaluar(`(() => {
        if (!document.getElementById('bs-toque-css')) {
          const s = document.createElement('style'); s.id = 'bs-toque-css';
          s.textContent = '@keyframes bsToque{from{transform:translate(-50%,-50%) scale(.55);opacity:1}to{transform:translate(-50%,-50%) scale(1.35);opacity:0}}';
          document.head.appendChild(s);
        }
        const d = document.createElement('div');
        d.style.cssText = 'position:fixed;z-index:2147483647;pointer-events:none;width:52px;height:52px;border-radius:50%;border:3px solid #F2C230;background:rgba(242,194,48,.3);left:${x}px;top:${y}px;animation:bsToque .6s ease-out forwards';
        document.body.appendChild(d); setTimeout(() => d.remove(), 700);
      })()`);
    },
    // Grabar la pantalla: cuadros con su hora; al terminar se arma un mp4 con la duración real
    empezarGrabacion: async () => {
      grabacion = { cuadros: [] };
      await enviar("Page.startScreencast", { format: "jpeg", quality: 82, everyNthFrame: 1 });
    },
    terminarGrabacion: async (salida) => {
      await enviar("Page.stopScreencast");
      const cuadros = grabacion.cuadros;
      grabacion = null;
      if (cuadros.length < 2) throw new Error("No llegaron cuadros de la pantalla");
      const carpeta = salida.replace(/\.mp4$/, "") + "_cuadros";
      mkdirSync(carpeta, { recursive: true });
      const lineas = [];
      cuadros.forEach((c, i) => {
        const nombre = `f${String(i).padStart(5, "0")}.jpg`;
        writeFileSync(join(carpeta, nombre), Buffer.from(c.datos, "base64"));
        const dur = i + 1 < cuadros.length ? Math.max(0.01, cuadros[i + 1].t - c.t) : 0.5;
        lineas.push(`file '${nombre}'`, `duration ${dur.toFixed(4)}`);
      });
      lineas.push(`file 'f${String(cuadros.length - 1).padStart(5, "0")}.jpg'`);
      writeFileSync(join(carpeta, "lista.txt"), lineas.join(String.fromCharCode(10)));
      return { carpeta, cuadros: cuadros.length, duracion: cuadros[cuadros.length - 1].t - cuadros[0].t };
    },
    evaluar: async (js) => {
      const r = await enviar("Runtime.evaluate", { expression: js, awaitPromise: true, returnByValue: true });
      return r.result?.value;
    },
    captura: async (ruta, { recorte } = {}) => {
      const r = await enviar("Page.captureScreenshot", { format: "png", ...(recorte ? { clip: { ...recorte, scale: 1 } } : {}) });
      mkdirSync(join(ruta, ".."), { recursive: true });
      writeFileSync(ruta, Buffer.from(r.data, "base64"));
      return ruta;
    },
    tocar: async (x, y) => {
      await api.anillo(x, y);
      for (const tipo of ["mousePressed", "mouseReleased"]) {
        await enviar("Input.dispatchMouseEvent", { type: tipo, x, y, button: "left", clickCount: 1 });
      }
      await dormir(700);
    },
    // Toca el elemento visible que contiene ese texto (el más pequeño)
    tocarTexto: async (texto, espera = 900) => {
      const c = await api.evaluar(`(() => {
        const t = ${JSON.stringify(texto)}.toLowerCase();
        const els = [...document.querySelectorAll('button,a,[role=button],[role=tab],label,input,div,span')]
          .filter((e) => e.offsetParent !== null && ((e.innerText || e.value || e.placeholder || '') + ' ' + (e.getAttribute('aria-label') || '')).toLowerCase().includes(t));
        els.sort((a, b) => a.getBoundingClientRect().width * a.getBoundingClientRect().height - b.getBoundingClientRect().width * b.getBoundingClientRect().height);
        const e = els[0]; if (!e) return null; e.scrollIntoView({ block: 'center' });
        const r = e.getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
      })()`);
      if (!c) throw new Error(`No encuentro «${texto}»`);
      await api.tocar(c.x, c.y);
      await dormir(espera);
      return c;
    },
    escribir: async (texto) => {
      await enviar("Input.insertText", { text: texto });
      await dormir(250);
    },
    cerrar: () => {
      try {
        ws.close();
      } catch {
        /* ya cerrado */
      }
      proceso.kill();
    },
    eventos,
  };
  return api;
};
