import { abrir } from "./navegador.mjs";
const b = await abrir({ oscuro: true, puerto: 9374 });
try {
  await b.ir("https://boliviasabe.vercel.app/", 4500);
  for (const t of ["Iniciar sesión","Usar mi correo"]) { await b.tocarTexto(t, 1000); }
  await b.evaluar(`document.querySelector('input[type=email]').focus()`); await b.escribir("ana@example.com");
  await b.evaluar(`document.querySelector('input[type=password]').focus()`); await b.escribir(process.env.CLAVE_DEMO);
  await b.tocarTexto("Continuar", 6000);
  await b.ir("https://boliviasabe.vercel.app/yo", 5000);
  console.log(JSON.stringify(await b.evaluar(`[...document.querySelectorAll('a')].map(a=>({tx:a.innerText.trim().slice(0,40),href:a.href})).filter(x=>/stellar|Registro/i.test(x.href+x.tx)).slice(0,8)`)));
} finally { b.cerrar(); }
