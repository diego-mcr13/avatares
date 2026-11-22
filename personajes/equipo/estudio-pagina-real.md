# Estudio de la página real (21 nov 2026, ~18:00)

Fuentes que usé: la página en vivo <https://boliviasabe.vercel.app>, el repo `codebambinos/boliviasabe` (último commit #54, 17:19) y la wiki `codebambinos/boliviasabe-docs` (último commit 17:28). Están descargados en `fuentes/` (se actualizan con `git pull`).

Capturas de referencia (celular 360 × 800 a doble resolución, y computador 1440 × 900) en `avatares/public/referencia/` y, completas con sus textos, en `avatares/out/capturas/`. Se vuelven a sacar con:

```bash
node scripts/capturar-app.mjs                 # sin cuenta: Hoy, ¿Alguien sabe?, Yo invitado, «Entrar», claro y computador
node scripts/capturar-sesion.mjs ana@example.com   # con una cuenta de la demo: Yo, Movimientos, formularios, detalles
```

Las capturas con cuenta **solo miran**: no publican, no responden, no dan «Me sirvió» ni gastan yapitas. Entré con las cuentas de la demo que dice la wiki (pitch › Explicarlo).

## Cómo se ve la página hoy (lo que el video debe imitar)

| Pantalla | Qué hay de verdad |
|---|---|
| **Hoy** | Franja de aguayo de 3 px arriba. Cabecera: ícono de BoliviaSabe, ciudad con flecha («Cochabamba ⌄», abre el selector de ciudades), lupa al bajar y botón «Entrar» (sin sesión) o campana (con sesión). Tarjeta de consejo naranja con ★ que se puede cerrar. Buscador («Buscar: almuerzo, trufi, feria…»). Chips de temas (Comida, Almuerzos, Ofertas, Precios…). Título «Hoy» y grilla de **2 columnas** con la foto, el precio como pastilla sobre la foto («Bs 20»), el título, zona y hora y «A 2 les sirvió». Corazón de guardar sobre cada foto. Botón rosa **«+ Subir letrero»** que al bajar se pliega a un «+». Barra de abajo con íconos: Hoy · ¿Alguien sabe? · Yo (la activa con un óvalo). |
| **¿Alguien sabe?** | Título, consejo, buscador («plomero, farmacia, agua…»), chips y una **lista** (no tarjetas): pregunta, zona y hora, etiqueta coral «Urgente» y «1 respuesta» o «Sin respuestas». Botón rosa «+ Preguntar». |
| **Detalle de letrero** | Foto grande a ancho completo, título, zona, «Subido por …· hace 21 min», «A 2 les sirvió». Barra fija abajo: **«Me sirvió»** (el único botón relleno) y «Cómo llegar». Arriba: volver, compartir, guardar, ⋯. |
| **Detalle de pregunta** | «Urgente · Sarco, Cochabamba», la pregunta, quién la hizo («De confianza · ★ 5,0»), Guardar · Compartir · ⋯. Cada respuesta en una tarjeta con sus comentarios y «Comentar». Quien preguntó ve en cada respuesta **«Me sirvió»** y **«Pedir contacto»**, y abajo «Ninguna me sirvió». |
| **Sin cuenta, al actuar** | Hoja «**Entra a BoliviaSabe**» · «Entra para dar «Me sirvió», guardar y ganar yapitas.» · «Continuar con Google» · «Usar mi correo» · «Al entrar aceptas cómo cuidamos tus datos». |
| **Subir letrero** | Pantalla completa: Foto (Tomar foto / Elegir de la galería), Título (0/80), «Más detalles», aviso «Falta la foto y el título» y «Publicar» apagado hasta que estén. |
| **Preguntar** | Pantalla completa: «¿Qué necesitas?» (0/300), Foto (opcional), interruptor «**Urgente (−5 yapitas)** · Tu pregunta queda arriba durante 24 horas.», Más detalles, «Falta lo que necesitas» y «Publicar». |
| **Yo** | Tarjeta con franja de aguayo: nombre («Ana R.»), ciudad y zona, «Vecino nuevo», **18 yapitas** con barra «18 de 100 · Canje con negocios, próximamente». Debajo **Movimientos** (dentro de Yo): «Tu respuesta sirvió +5», «Tu letrero sirvió +1», «Cerraste tu pregunta +1», cada uno con «Confirmado» en verde y «Ver registro ↗»; aviso azul «Red de pruebas, sin dinero real»; luego «Mi cuenta de prueba». |
| **Computador** | Riel de íconos a la izquierda (Hoy, ¿Alguien sabe?, Yo y «+ Subir»), el feed en una grilla de 4 columnas y los letreros se abren en una ventana encima. |

Tipografía y color: Bricolage Grotesque a peso 500 (nunca negrita) para títulos y Figtree para el resto; fondo cálido `#151110` en oscuro; fucsia solo para la acción; naranja para yapitas; coral para Urgente; verde para Confirmado/Solucionada; azul para avisos. Esquinas muy redondeadas y una línea fina como borde. Los botones son píldoras.

## Qué cambia en el guion y en el ejemplo (por revisar con el equipo)

1. **El tema por defecto es el del celular** (wiki #201 reemplaza a #143). El guion decía «abre en oscuro». Para grabar en oscuro: poner el celular en modo oscuro, o Yo › Ajustes › Tema › Oscuro. En la escena 7 se cambia a claro.
2. **La hoja para entrar dice «Entra a BoliviaSabe»**, no «Crea tu cuenta para seguir» (que es lo que dice `flujo-final` en la wiki). Hay que decidir cuál queda y alinear la wiki o la página. El guion y el ejemplo usaban el texto de la wiki.
3. **Tilcho sigue en Yo** en la página y en el código (`YoPage.tsx`), aunque la wiki dice que salió de la app (#191). Si de verdad sale, en el video no aparece; si queda, hay que decirlo en el guion.
4. **Los vecinos de la demo ya existen** (la contraseña está en la wiki, pitch › Explicarlo): Lucía Mamani (Cala Cala), Jorge Rojas (Sarco), **Ana Rivera (Queru Queru)**, Marco Vargas (Centro) y Rosa Quispe (La Paz). El guion usaba «Ana en Sarco» y «Luis»: hay que cambiarlo por cuentas reales. Propuesta: Ana Rivera pregunta y Lucía Mamani responde, y la pregunta pasa a **Queru Queru** (o Marco, de Centro). Jorge no sirve para preguntar urgente porque ya tiene una urgente abierta y **una segunda urgente no se publica** (#190).
5. **Los saldos del guion y del ejemplo son inventados.** Ana ya tiene 18 yapitas, no 5. Las cifras que se ven en pantalla serán las de la cuenta el día que se grabe; al grabar, la voz no debe decir un número que no coincida.
6. **Subir letrero exige foto**: preparen en el celular la foto del cartel (almuerzo con precio) antes de grabar.
7. **«Pedir contacto» y «Me sirvió»** los ve quien preguntó dentro de cada respuesta, no en la pregunta. El contacto que se muestra es el correo (el celular es opcional, wiki #182).
8. **Hoy tiene datos de prueba** (letreros «Prueba 2 usuarios», fotos repetidas, «Prueba desde celular notificaciónes»). Antes de grabar hay que dejar solo los 9 letreros de comida del seed (T09). Pregunta para Diego: ¿se vuelve a correr `npm run seed`?
9. **La wiki habla de un video de 7 escenas** (pitch › Explicarlo); el guion tiene 8. Hay que alinear: o se agrega una línea en la wiki, o se fusiona una escena.
10. **Mi mock del ejemplo se parece al diseño real pero no es igual**: usa tarjetas en una columna, negritas y una barra de abajo sin íconos. Para el video final se rehace con la grilla de 2 columnas, el botón «+ Subir letrero», los íconos, los textos reales y, mejor aún, con **capturas reales** de la página.

## Qué falta para hacer el video final

- Guion aprobado (voces, textos y orden).
- Página final: sin datos de prueba, con las fotos del seed, y decidido lo de Tilcho y el texto de la hoja de entrada.
- Con eso: rehago las pantallas (con las capturas y los textos reales) y vuelvo a exportar escenas, avatares y fondos; ustedes graban las voces y las incorporo (`--reales`).
