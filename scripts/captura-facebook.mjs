import { abrir } from "./navegador.mjs";
const b = await abrir({ ancho: 1280, alto: 900, escala: 1, oscuro: false, movil: false, puerto: 9380 });
try {
  await b.ir("https://www.facebook.com/groups/alguien.sabe.cbba/", 8000);
  await b.tocar(848, 231);
  await b.esperar(1500);
  await b.captura("grabaciones/toma-final/e2-grupo-facebook.png");
  await b.captura("grabaciones/toma-final/e2-grupo-facebook-cabecera.png", { recorte: { x: 170, y: 0, width: 940, height: 450 } });
  console.log((await b.evaluar("document.body.innerText")).slice(0, 500).replace(/\n+/g, " | "));
} finally { b.cerrar(); }
