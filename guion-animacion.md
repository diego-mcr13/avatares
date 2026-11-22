# Guion de animación del video de BoliviaSabe · contrato

**Estado:** contrato (22 nov 2026). Lo que no está aquí no entra en el video; si algo cambia, se cambia primero aquí.
**Anima:** Diego (con Claude). **Entrega:** enlace de YouTube a Atlas **hasta las 10:45**; la entrega cierra a las **11:59** (hora de Bolivia, Atlas muestra 3:59 PM UTC).

Reemplaza al guion anterior de 9 escenas pensado para montar en un editor. Las voces ya grabadas se usan tal cual. **Yaeko no anima, pero sí puede volver a grabar** sus frases si hiciera falta (igual que Diego y Aldrin); toda frase nueva se cambia aquí primero.

---

## 1. Qué buscan los jueces y dónde se cumple

El campo **Video** de Atlas pide YouTube (público o no listado), de 2 a 3 minutos y **mostrando el producto funcionando**. La IA de Atlas no ve el video: lee el **título y la descripción** de YouTube; los jueces lo miran.

| Criterio de Atlas | Peso | Dónde lo prueba el video |
|---|---|---|
| Problema y usuario | 25 | Escena 2: grupo de 209 mil miembros; encuesta (14 de 24) |
| Producto | 20 | Escenas 3 a 7: el recorrido completo en la página real |
| Stellar | 20 | Escenas 4 (+5 de bienvenida), 7 (+5 al que ayudó) y 8 (pago con memo en stellar.expert) |
| Plan de 30 días | 20 | Escena 9: Sarco y el Centro, 1 semana, 30 cuentas, 5 negocios, Bs 20 como hipótesis |
| Equipo y compromiso | 15 | Escena 1: los tres en persona, con su rol |

El recorrido que pidió la IA en el primer análisis, **entero y en este orden**: abrir sin cuenta (3) → registrarse (4) → recibir +5 (4) → preguntar (5) → responder desde otra cuenta (6) → «Me sirvió» (7) → pago con memo en stellar.expert (8).

**Es para personas:** además de probar la app, tiene que entretener para que el juez lo vea hasta el final:

- **Algo cambia cada 2 a 3 s** (una lupa, un rótulo, un avatar que se mueve, una cifra que entra); ningún plano quieto más de 3 s.
- **Los avatares reaccionan, no solo señalan:** se desesperan con las burbujas, se sorprenden con la respuesta que llega sola, celebran cada +5. Sus caras (§5b) cuentan la historia aunque se vea sin sonido.
- **Momentos para recordar:** la transformación de personas a avatares (1), la pregunta que se hunde entre mensajes (2), el «+0» triste de quien ayuda (2, con `ding_roto`), las campanitas del +5 (4 y 7) y el memo que se traduce solo (8).
- **Cifras con movimiento:** 209 mil, 14 de 24, 5 yapitas, Bs 20, 30 cuentas y 5 negocios entran grandes y animadas, nunca como texto quieto.
- **Ritmo:** cortes en la voz, sin silencios largos; las esperas de la app (cargas, escritura) se aceleran o se cortan.

**Regla de oro:** las escenas 3 a 8 (la app funcionando) son la mayor parte del video; las escenas 1, 2 y 9 no se alargan más de lo que dura su voz.

## 2. Formato (YouTube)

| Dato | Valor |
|---|---|
| Lienzo | **1920 × 1080, 16:9 horizontal**, 30 fps |
| Salida | Un solo MP4: H.264 (yuv420p, CRF 18) + AAC 48 kHz 192 kbps |
| Duración | **2:30 a 2:50**; nunca más de 3:00 ni menos de 2:00 |
| Volumen | Voces normalizadas a −14 LUFS integrados (lo que usa YouTube), picos ≤ −1 dBTP |
| Música | **No.** Solo las voces (no hay pista con licencia; si Diego consigue una de la Biblioteca de audio de YouTube, va a −28 LUFS debajo de las voces) |
| Subtítulos | **Quemados** en todas las frases (mucha gente ve sin sonido) |
| Miniatura | 1280 × 720 (`Miniatura`, ver §8): la usa YouTube y la ve el juez antes de reproducir |

### Zonas del lienzo (en px de 1920 × 1080)

```
 0                     757          1163                  1920
 ┌──────────────────────┬─────────────┬──────────────────────┐ 0
 │                      │             │                      │
 │  ZONA IZQUIERDA      │   CELULAR   │   ZONA DERECHA       │
 │  avatares, rótulos,  │  405 × 900  │   avatares, rótulos, │
 │  gráficos chicos     │  tope 40    │   gráficos chicos    │
 │                      │             │                      │
 │  pies ≤ 930          │  fondo 940  │   pies ≤ 930         │
 ├──────────────────────┴─────────────┴──────────────────────┤ 950
 │            FRANJA DE SUBTÍTULOS (958 a 1040)              │
 └───────────────────────────────────────────────────────────┘ 1080
```

- **Margen seguro:** 96 px a los costados; nada importante debajo de 1040 (la barra de YouTube tapa el borde de abajo).
- **Un celular (`U`):** centro x = 960, 405 × 900, tope 40. **Dos celulares (escena 6):** `A` centro x = 650 y `B` centro x = 1270; los avatares solo en x < 420 o x > 1500.
- **Avatares:** unos 300 px de alto; los pies nunca bajo y = 930 (la franja de subtítulos es solo para los subtítulos).
- **Rótulos de cuenta** («Ana · cuenta de ejemplo»): al costado del celular, a la altura de su borde de arriba (y ≈ 70), nunca encima de la pantalla.
- **Escenas sin celular (1, 2 y 9):** el gráfico va al centro, en un área de 1500 × 820 (x 210 a 1710, y 60 a 880).

## 3. Estilo

- **Fondo:** `#151110` (el oscuro de la app) con la franja de aguayo de 6 px arriba (`#C2185B`, `#F28C28`, `#2E9E5B`, `#1E5AA8`, `#F2C230`) y un degradado radial muy suave detrás del celular.
- **Colores (los de la app, `src/styles/tokens.css`):** fucsia `#C2185B` solo para la acción; naranja `#F28C28` para las yapitas; coral `#E4572E` para Urgente; verde `#2E9E5B` para Confirmado y Solucionada; azul `#1E5AA8` para avisos (red de pruebas); texto `#F3EDE8` y apagado `#B0A59C`.
- **Letras:** Bricolage Grotesque peso 500 (títulos y cifras grandes, nunca negrita) y Figtree (todo lo demás), con `@remotion/google-fonts`.
- **Celular:** marco redondeado (radio 44 px), borde de 2 px `rgb(243 237 232 / 0.18)`, sombra suave. El video de la app llena la pantalla del marco.
- **Movimiento:** entradas con `spring` (damping 200, ~0,4 s); nada rebota de más; los cambios de escena son un corte limpio o un barrido de 0,3 s con la franja de aguayo.
- **Lupa (lo interactivo):** en cada toque importante el contenido del celular se acerca **dentro del marco** (1,0 → 1,7 en 0,5 s, centrado en el botón) y vuelve a 1,0. Así el botón se lee en un celular viendo YouTube. El círculo amarillo del toque ya viene en las grabaciones; la posición de cada botón se mide en su captura (`capturas/`, en fracción de 720 × 1600).
- **Burbujas de premio:** pastilla naranja «+5 yapitas» que sube desde el saldo y se desvanece (1,2 s).

## 4. Material

Todo vive en `/Users/diego/Documents/avatares/`. Se copia (o convierte) a `public/video/` para Remotion.

### Presentaciones en persona (se conservan)

| Archivo | Orientación real | Habla | Uso |
|---|---|---|---|
| `audios y videos/diego/1-1.MOV` | vertical 2160 × 3840, HEVC | 0,60 a 4,27 s | 1-1, con su propio audio |
| `audios y videos/yaeko/1-2 video_.mp4` | horizontal 1280 × 720 (rotación 90) | 0,65 a 5,52 s | 1-2, con su propio audio |
| `audios y videos/aldrin/1-3 video.MOV` | vertical 2160 × 3840 (rotación −90), HEVC | 0,00 a 4,75 s | 1-3, con su propio audio |

Se convierten a H.264 1080 × 1920 (vertical) con la rotación aplicada; el de Yaeko se recorta a 9:16 centrado en su cara.

### Voces (una por frase; «habla» = sin el silencio del principio y del final)

| Código | Quién | Habla (s) | Texto (subtítulo exacto) |
|---|---|---|---|
| 1-4 | Yaeko | 0,00–3,42 | Somos CodeBambinos. ¡Esto es BoliviaSabe! |
| 2-1 | Yaeko | 0,00–4,92 | En Cochabamba preguntamos todo en grupos: este tiene 209 mil miembros. |
| 2-2 | Diego | 0,29–6,27 | Pero la pregunta se pierde entre cientos de mensajes, nadie sabe si sigue vigente y a veces tarda. |
| 2-3 | Aldrin | 0,66–4,80 | Y quien ayuda no gana nada. Por eso muchos callan. |
| 2-4 | Yaeko | 0,00–6,22 | Le preguntamos a 24 personas: a 14 les molesta justo que la pregunta se pierda. |
| 3-1 | Aldrin | 1,02–6,86 | Abres boliviasabe.vercel.app y entras directo a Hoy, sin registrarte. |
| 3-2 | Yaeko | 0,00–5,99 | Letreros con foto, precio, zona y fecha. Buscas «almuerzo» y ahí está. |
| 4-1 | Diego | 0,31–5,38 | Para participar, creas tu cuenta con Google o con tu correo y eliges tu barrio. |
| 4-2 | Aldrin | 0,95–5,98 | Y al terminar ya tienes tu cuenta en Stellar y cinco yapitas de bienvenida. |
| 5-1 | Yaeko | 0,00–4,70 | Ahora preguntamos: ¿quién arregla una tubería hoy en Queru Queru? |
| 5-2 | Aldrin | 0,84–6,86 | La marcamos Urgente: cuesta cinco yapitas y sale primero por 24 horas. |
| 6-1 | Diego | 0,37–5,94 | En otra cuenta, Ana, que vive en Queru Queru, ve el aviso de la urgente y responde. |
| 6-2 | Yaeko | 0,00–4,61 | Y quien preguntó ve la respuesta aparecer sola, sin recargar. |
| 7-1 | Aldrin | 0,56–6,37 | Solo quien preguntó puede marcar Me sirvió, y la pregunta queda Solucionada. |
| 7-2 | Diego | 0,00–2,75 | Y Ana gana cinco yapitas por ayudar. |
| 8-1 | Diego | 0,00–6,26 | Cada premio es un pago en Stellar. En Movimientos se ve confirmado, y el enlace abre el registro público. |
| 8-2 | Aldrin | 0,59–5,06 | Ahí está el pago, con su memo: cualquiera puede verificarlo. |
| 8-3 | Yaeko | 0,00–5,21 | Todo corre en la red de pruebas, sin dinero real. Hoy la app custodia las cuentas. |
| 9-1 | Yaeko | 0,00–10,42 | Empezamos en Cochabamba, con estudiantes y negocios cerca de las universidades, en Sarco y el Centro: una semana, 30 cuentas y 5 negocios. |
| 9-2 | Diego | 0,00–5,71 | Los negocios de barrio pagarían Bs 20 al mes por aparecer primero en su zona. |
| 9-3 | Aldrin | 0,49–9,11 | Pruébala hoy en boliviasabe.vercel.app. Hoy una ciudad, mañana toda Bolivia. |
| 9-4 | Yaeko | 0,00–9,05 | ¿Viste algo útil? Súbelo. ¿Necesitas algo ya? Pregunta. En Bolivia, ayudar a tus vecinos tiene premio. |

Archivos: `audios y videos/<quien>/<código>.m4a`. Los tiempos se midieron con `silencedetect` (−35 dB). **Antes de quemar los subtítulos** se transcribe cada audio (`scripts/transcribir.py`) y, si alguien dijo otra cosa, el subtítulo copia lo que se dijo (o se pide de nuevo la frase).

### Toma final de la app (se reutiliza: no se vuelve a grabar)

`grabaciones/toma-final/`: página real, 720 × 1600 (= 360 × 800 a 2×), tema oscuro, círculo amarillo en cada toque, correo borroso y contraseña oculta. Toques exactos en `marcas.json`; una captura por toque en `capturas/`. Es la misma pregunta (#62), respuesta (#55) y pago (`ayuda:55`) que siguen en producción y en Stellar: el video coincide con lo que un juez puede abrir.

**¿Sirve para mostrar el flujo? Sí.** Se revisaron los 7 clips y sus 27 capturas: cubren los 7 pasos que pidió la IA, sin huecos, con la cuenta nueva, la urgente, la respuesta en vivo, «Me sirvió» y el pago. Tres detalles y cómo se resuelven:

| Detalle | Solución |
|---|---|
| Fluidez: las transiciones van a 8–16 cuadros distintos por segundo y `e7-ana` (Movimientos) a ~3 | Preprocesado con fundido entre cuadros (`mpdecimate,framerate=30`): los saltos se vuelven fundidos suaves. Los tramos lentos se aceleran o se congelan |
| El encabezado de Ana muestra su saldo (23) en la escena 6 | Pastilla encima |
| El final de `e7-ana` muestra filas con XLM | No se usa ese tramo; en la escena 8 va el recorte del explorador |

**Por qué no se vuelve a grabar:** el material cubre todo el recorrido sin huecos, y grabar de nuevo crea otra cuenta y otros pagos en Stellar y obliga a limpiar producción. Lo «más interactivo» se logra en la animación: lupa en cada toque, avatares que tocan y señalan, burbujas de premio y el memo que se traduce en pantalla. **Solo se vuelve a grabar** si al montar un tramo resulta ilegible o falta; en ese caso se graba ese clip con el mismo script y cuentas nuevas, y se limpia después.

| Clip | Duración | Toques (s) |
|---|---|---|
| `e3-hoy.mp4` | 13,3 | buscador 4,23 · «almuerzo» escrito 8,85 |
| `e4-registro.mp4` | 55,2 | Iniciar sesión 1,20 · Continuar 20,79 · nombre 24,20 · zona 29,44 · Listo 31,84 · espera 36,32 · saldo 5 al final |
| `e5-pregunta.mp4` | 48,9 | ¿Alguien sabe? 1,20 · Preguntar 4,92 · escribe 8,00 · Urgente 33,80 · Publicar 36,49 · publicada ~48,5 |
| `e6-ana.mp4` | 34,4 | campana 2,51 · abre el aviso 6,36 · escribe 10,36 · Enviar 32,77 |
| `e6-camila.mp4` | 34,4 | misma hora que Ana: la respuesta aparece 0,7 s después de Enviar (final del clip) |
| `e7-camila.mp4` | 3,6 | Me sirvió 1,51 · Solucionada 3,00 |
| `e7-ana.mp4` | 25,6 | saldo 1,51 · Movimientos «Confirmado» 8,02 · Registro 8,13 · stellar.expert 18,63 |
| `e2-grupo-facebook-cabecera.png` | imagen | grupo «¿Alguien Sabe? - Cochabamba», 209,0 mil miembros, sin personas |
| `e7-explorador.png` | imagen | stellar.expert: pago de 5 YAPITA y memo `YXl1ZGE6NTU=` |

Enlace del pago: <https://stellar.expert/explorer/testnet/tx/acce574fd925033d79a87bc03e3c9b6766ecd43d0be4bc58b102d8309ce89a47>

## 5. Escenas

Las horas son relativas al inicio de cada escena y salen de la duración real de las voces (§4), con **0,35 s** entre frases. Si una voz cambia, se corren solas (se calculan en `datos.ts`). «Clip a–b ×v» = tramo del clip, a velocidad v. Duración total ≈ **2:45**.

### Escena 1 · Somos CodeBambinos y la transformación (≈ 22,5 s) · *Equipo*

Tres tarjetas verticales 9:16 (360 × 640; centros x = 520, 960 y 1400) sobre el fondo, cada una con un borde del color de su avatar. La de quien habla se agranda; las otras quedan apagadas en un cuadro fijo (el del principio antes de hablar y el del final después). Debajo, el rol de cada uno. **Sin celular.**

| Hora | Pantalla | Avatares | Audio |
|---|---|---|---|
| 0,0–4,1 | Habla Diego | — | 1-1 (del video) |
| 4,4–9,5 | Habla Yaeko | — | 1-2 (del video) |
| 9,8–14,75 | Habla Aldrin, **completo hasta «¡Y ahora nos ven así!»** | — | 1-3 (del video) |
| 14,8–16,4 | **Transformación:** las tres tarjetas se pixelan a la vez (desde el último cuadro de cada uno), se deshacen en voxels que suben girando y salen por arriba; destello suave | — | `chispitas`, `giro` |
| 16,0–17,8 | **Caen al suelo** (idea de Diego): los tres caen desde arriba uno tras otro, chocan (se aplastan un poco), se caen de lado y quedan tirados con cara **mareado**; después se levantan de un saltito con cara de sorpresa y saludan **felices** | Diego (x 720), Yaeko (960) y Aldrin (1200), en el piso | `golpe` en cada caída, `pop` al levantarse |
| 18,4–22,0 | Logo de BoliviaSabe y «por CodeBambinos» | Se juntan; Yaeko habla con **orgullo**, Diego y Aldrin celebran; `triunfo` en «¡Esto es BoliviaSabe!» | 1-4 Yaeko + `titulo` |

### Escena 2 · El problema (≈ 23 s) · *Problema y usuario*

**Sin celular.** El gráfico ocupa el área central.

| Hora | Pantalla | Avatares | Audio |
|---|---|---|---|
| 0,0–4,9 | `e2-grupo-facebook-cabecera.png` en una tarjeta de navegador; acercamiento lento a «209,0 mil miembros», que se resalta con un subrayado amarillo | Yaeko a la izquierda: `senalar` hacia la cifra | 2-1 |
| 5,3–11,2 | Burbujas grises de chat que suben y se apilan; una amarilla «¿Alguien sabe quién arregla tuberías?» se hunde entre ellas. En «vigente», una etiqueta «¿sigue vigente?» sobre una burbuja vieja | Diego entra por la derecha: `desesperar` en «se pierde», `encoger` al final | 2-2 |
| 11,6–15,7 | Una burbuja de respuesta con «+0» en gris | Aldrin: `pensar` y `encoger` en «muchos callan» | 2-3 |
| 16,1–22,3 | 24 figuritas en 3 filas de 8; 14 se pintan de fucsia una tras otra. Cifras grandes «14 de 24» y debajo «les molesta que la pregunta se pierda» | Yaeko al centro abajo: `apuntar` hacia las figuritas | 2-4 |

Las burbujas y figuritas se dibujan (no se copian de Facebook). No se ven nombres ni caras.

### Escena 3 · Sin cuenta (≈ 13 s) · *Producto*

Celular `U` con `e3-hoy.mp4`. Rótulo fijo arriba a la izquierda: «boliviasabe.vercel.app».

| Hora | Clip | Lupa | Avatares | Audio |
|---|---|---|---|---|
| 0,0–5,8 | 0–4,2 ×0,75 (Hoy con letreros, sin sesión, botón «Iniciar sesión») | ninguna | Aldrin a la izquierda: `senalarArriba` hacia el rótulo y luego `senalar` a los letreros | 3-1 |
| 6,2–12,2 | 4,2–13,3 ×1,5 (toca el buscador, escribe «almuerzo», «2 letreros») | 1,7 al buscador en 4,2; vuelve a 1,0 y se acerca a 1,4 sobre los 2 resultados al final | Yaeko a la derecha: `tocar` en el buscador; `sorpresa` en «ahí está». Aldrin: `esperar` | 3-2 |

### Escena 4 · Crear la cuenta y +5 (≈ 15 s) · *Producto + Stellar*

Celular `U` con `e4-registro.mp4`. Rótulo: «Camila · cuenta nueva de demo».

| Hora | Clip | Lupa | Avatares | Audio |
|---|---|---|---|---|
| 0,0–1,6 | 0,5–3,0 ×1,5 (toca «Iniciar sesión», se abre «Entra a BoliviaSabe») | 1,5 a la hoja | Diego a la izquierda: `tocar` | 4-1 empieza |
| 1,6–2,9 | **Corte** a 18,5–21,0 ×2 (Continuar) | — | Diego: `hablar` | 4-1 |
| 2,9–7,0 | 24,2–32,5 ×2 («Tu barrio»: Camila Q., Queru Queru, Listo) | 1,6 al campo de zona en 29,4 | Diego: `senalar` hacia la zona; rótulo «Queru Queru» | 4-1 termina |
| 7,0–15,0 | **Corte** a 54,4–55,2 y se congela el último cuadro (saldo «★ 5») | 1,9 al saldo, arriba a la derecha | Aldrin entra por la derecha: `senalarIzq` hacia el saldo y `aplaudir` en «cinco yapitas». Diego: `aplaudir`. Burbuja «+5 yapitas · bienvenida» | 4-2 desde 7,3 |

### Escena 5 · Preguntar urgente (≈ 14 s) · *Producto + Stellar*

Celular `U` con `e5-pregunta.mp4`. Rótulo: «Camila · cuenta nueva de demo».

| Hora | Clip | Lupa | Avatares | Audio |
|---|---|---|---|---|
| 0,0–2,0 | 0,5–6,0 ×2,75 (¿Alguien sabe? y Preguntar) | — | Yaeko a la izquierda: `senalarAbajo` y `tocar` | 5-1 empieza |
| 2,0–5,1 | 8,0–33,8 ×8,3 (escribe la pregunta) | 1,5 a la caja de texto | Yaeko: `escribir` | 5-1 termina |
| 5,1–8,6 | 33,8–37,0 ×0,9 (enciende Urgente y toca «Publicar y pagar 5 yapitas») | 1,7 al interruptor «Urgente (−5 yapitas)»; luego al botón Publicar | Aldrin a la derecha: `senalarIzq` hacia Urgente y `tocar` en Publicar. Burbuja «−5 yapitas · sale primero 24 h» | 5-2 desde 5,4 |
| 8,6–14,0 | **Corte** a 47,5–48,9 y se congela (detalle con «Urgente · Queru Queru») | 1,4 a la etiqueta «Urgente» | Los dos: `esperar` | 5-2 termina |

### Escena 6 · Otra cuenta responde (≈ 13 s) · *Producto*

**Dos celulares:** `A` = Ana (`e6-ana.mp4`), `B` = Camila (`e6-camila.mp4`), grabados a la misma hora: **mismos cortes en los dos**. Rótulos: «Ana · cuenta de ejemplo» (a la izquierda de A) y «Camila · cuenta nueva de demo» (a la derecha de B). El saldo de Ana en su encabezado se tapa con una pastilla «★ yapitas».

| Hora | Clip (A y B) | Lupa | Avatares | Audio |
|---|---|---|---|---|
| 0,0–3,9 | 1,5–10,4 ×2,3 (campana, Avisos «Pregunta urgente en Queru Queru», abre la pregunta) | Con dos celulares no hay lupa: un anillo fucsia marca la campana y el aviso | Diego a la izquierda de A: `tocar` en la campana y `senalar` | 6-1 empieza |
| 3,9–6,3 | 10,4–32,8 ×9,3 (Ana escribe) | — | Diego: `hablar` | 6-1 termina |
| 6,3–13,0 | 32,8–34,4 ×1 y se congelan los dos (Enviar en A; la respuesta aparece en B) | Anillo verde sobre la respuesta en B y etiqueta «sin recargar · 0,7 s» | Yaeko a la derecha de B: `sorpresa` y `senalarIzq` hacia la respuesta. Diego: `aplaudir` | 6-2 desde 6,3 |

### Escena 7 · «Me sirvió» (≈ 10 s) · *Producto + Stellar*

Celular `U` con `e7-camila.mp4`. Rótulo: «Camila · cuenta nueva de demo».

| Hora | Clip | Lupa | Avatares | Audio |
|---|---|---|---|---|
| 0,0–4,5 | 0–3,6 ×0,8 (toca «Me sirvió», queda «Solucionada») | 1,7 al botón «Me sirvió»; luego 1,4 a la etiqueta «Solucionada» | Aldrin a la izquierda: `senalar` y `tocar` en 1,9 s | 7-1 |
| 4,5–9,8 | Se congela el último cuadro («¡Gracias, pues! Ana recibe +5 yapitas…») | 1,5 a la tarjeta naranja | Diego entra por la derecha: `celebrar`. Aldrin: `aplaudir`. Burbuja «+5 yapitas para Ana» | 7-1 termina; 7-2 desde 6,6 |

### Escena 8 · El pago en Stellar (≈ 18 s) · *Stellar*

Celular `U` con `e7-ana.mp4`. Rótulo: «Ana · cuenta de ejemplo».

| Hora | Pantalla | Avatares | Audio |
|---|---|---|---|
| 0,0–3,6 | Clip 0,5–8,1 ×2,1: toca su saldo y se abre Movimientos. Lupa 1,6 a la fila «Tu respuesta sirvió · +5 yapitas · Confirmado · Registro acce…9a47» | Diego a la izquierda: `tocar` y `senalar` hacia «Confirmado» | 8-1 empieza |
| 3,6–6,3 | Clip 8,1–9,0 (toca Registro); **corte** a 18,6–20,4 (se abre stellar.expert). Rótulo «registro público: stellar.expert» | Diego: `senalarArriba` | 8-1 termina |
| 6,6–11,5 | El celular se corre a la izquierda (centro x = 620) y a la derecha entra la **tarjeta del explorador** (recorte de `e7-explorador.png`: solo «sent 5 YAPITA to GBMD…526K» y la fila del memo, **sin las filas de XLM**). El memo `YXl1ZGE6NTU=` se transforma letra a letra en **`ayuda:55`** y debajo aparece «= premio por la respuesta n.º 55». Abajo, chico: «stellar.expert muestra el memo codificado» | Aldrin a la derecha: `sorpresa` y `senalarIzq` hacia el memo | 8-2 |
| 11,9–18,0 | Franja azul abajo de la tarjeta: «Red de pruebas · sin dinero real · hoy la app custodia las cuentas» | Yaeko entra al centro abajo: `hablar`. Los otros: `esperar` | 8-3 |

### Escena 9 · Plan y cierre (≈ 37 s) · *Plan de 30 días*

| Hora | Pantalla | Avatares | Audio |
|---|---|---|---|
| 0,0–10,4 | **Sin celular.** Título «Plan de 30 días». Mapa simple de Cochabamba (contorno y la laguna Alalay como referencia) con dos puntos que se encienden, **Sarco** y **el Centro**, y la etiqueta «cerca de las universidades». Entran tres tarjetas en orden con la voz: «1 semana», «30 cuentas», «5 negocios» | Yaeko a la izquierda: `senalarArriba` hacia cada tarjeta | 9-1 |
| 10,8–16,5 | Celular `U` con la captura de Hoy (`capturas/e4-registro_07…png`). Un letrero sube al primer lugar con una pastilla «Destacado · próximo». A la derecha: «**Bs 20 al mes** · aparecer primero en su zona» y debajo, chico, «hipótesis por validar · aún no está en la app» | Diego a la derecha: `apuntar` hacia el precio | 9-2 |
| 16,9–25,5 | **boliviasabe.vercel.app** grande a la izquierda, con un código QR a la app; a la derecha el celular con Hoy | Aldrin: `senalarArriba` hacia la dirección y `triunfo` en «toda Bolivia» | 9-3 |
| 25,9–35,0 | Logo de BoliviaSabe y el lema en tres líneas que entran con cada frase | Los tres al centro; Yaeko `hablar`, Diego y Aldrin `celebrar`; al final los tres `saludar` | 9-4 |
| 35,0–37,0 | Cierre en silencio: logo, «boliviasabe.vercel.app», «github.com/codebambinos/boliviasabe» y «CodeBambinos · National Startups Hackathon by Stellar» | — | silencio |

## 5a. Vestuario de los avatares

Cada avatar viste como su persona en el video de presentación, para que la transformación (escena 1) se lea al instante:

| Avatar | Ropa |
|---|---|
| Diego | Polera oversize verde militar, jean negro, tenis blancos y **lentes cuadrados de marco fino** |
| Aldrin | Canguro café claro, jean negro, tenis negros |
| Yaeko | Polera negra, falda negra, tenis blancos |

En los tres, el logo de CodeBambinos **chico en el pecho derecho**. Código: `src/bambinos/ropa.ts` (`TELA`, `TENIS`, `poleraTorso`, `canguroColor`, `logoPecho`) y los lentes en `src/diegoBambino/modelo.ts` (`lentes`).

## 5b. Expresiones de los avatares

Nada de personajes planos. Tres reglas:

1. **La expresión es independiente de la pose.** Cada `va(...)` acepta una expresión que reemplaza la de la pose (señalar preocupado en el problema, señalar feliz en el premio). Sin expresión, queda la de la pose.
2. **Parpadeo automático** cada 2,8 a 4,8 s (distinto en cada uno), de 0,12 s, salvo con ojos «feliz».
3. **Mientras habla,** la boca sigue el volumen de su voz real; la expresión manda en ojos y cejas, y en la boca cuando calla.

| Expresión | Ojos | Cejas | Boca en reposo | Cuándo |
|---|---|---|---|---|
| `atento` | normal | normal | sonrisa | Por defecto: explica, espera su turno |
| `mareado` | cerrados | triste | O | Tirados en el piso después de caer (1) |
| `feliz` | feliz | arriba | sonrisa abierta | Cada +5, la transformación, el cierre |
| `sorpresa` | normal | arriba | O | «ahí está», la respuesta que aparece sola, el memo |
| `preocupado` | chicos | triste | apretada | El problema, la pregunta urgente |
| `orgullo` | feliz | normal | sonrisa | «Esto es BoliviaSabe», el plan, «toda Bolivia» |
| `pensativo` | normal | arriba / normal | cerrada | «quien ayuda no gana nada» |

| Escena | Diego | Yaeko | Aldrin |
|---|---|---|---|
| 1 | feliz → orgullo | feliz → orgullo | feliz → orgullo |
| 2 | preocupado (2-2) | atento (2-1), atento firme (2-4) | pensativo → preocupado (2-3) |
| 3 | — | atento → sorpresa en «ahí está» → feliz | atento |
| 4 | atento → feliz en el +5 | — | feliz (4-2) |
| 5 | — | preocupado (vecina con apuro) | atento → feliz al publicar |
| 6 | atento | sorpresa → feliz | — |
| 7 | feliz (7-2) | — | atento → feliz |
| 8 | atento | atento, tranquila (8-3) | sorpresa → orgullo |
| 9 | atento seguro (9-2) → feliz | orgullo (9-1) → feliz | orgullo → feliz; los tres feliz al despedirse |

## 5c. Sonidos

Efectos propios, sintetizados con `videos-cc/scripts/sketch_sonidos.py` (sin licencias), muy bajos: nunca tapan una voz (−22 dB respecto de la voz). Sin música.

| Sonido | Dónde |
|---|---|
| `blip` | Cada toque con lupa (escenas 3 a 8) |
| `pop` | Rótulos, burbujas de chat y tarjetas que entran |
| `campanitas` | Cada «+5 yapitas» (escenas 4 y 7) |
| `ding_roto` | El «+0» de quien ayuda (2) |
| `ding` | «Solucionada» (7), memo traducido a `ayuda:55` (8), cada figurita pintada en grupo (2: un solo ding al terminar) |
| `chispitas` + `giro` | La transformación (1) |
| `golpe` | Cada avatar que cae al suelo (1) |
| `titulo` | El logo (1) y el lema (9) |

## 6. Subtítulos

- El texto exacto de §4 (o el de la transcripción, si difiere), por frase, en la franja de 958 a 1040.
- Figtree 600, 36 px, blanco sobre una pastilla `rgba(12,10,9,0.82)` con radio 16; ancho máximo 1400 px. Con más de 64 caracteres se parte en dos subtítulos, por la coma o el punto más cercano a la mitad.
- Sin el nombre de quien habla (la boca del avatar lo dice). Entra con la voz y sale 0,2 s después.
- En la escena 1 también hay subtítulos, con lo que se dijo en cada video: «Hola, soy Diego, el líder técnico, y ahora me verán en mi versión avatar.» · «Hola, soy Yaeko, product owner, y también me vuelvo avatar.» · «Y yo soy Aldrin, desarrollador. ¡Y ahora nos ven así!»

## 7. Reglas que no se rompen

- **Palabras:** en pantalla y en voz, «yapitas». Nunca cripto, blockchain, tokens, estelares ni «puntos»; «XLM» no se ve en ningún cuadro.
- **Honestidad:** red de pruebas, sin dinero real (8-3); Ana es una cuenta de ejemplo (rótulo); el «Destacado» de la escena 9 está marcado como próximo y la tarifa como hipótesis.
- **Privacidad:** no se ven correos, contraseñas, teléfonos ni caras o nombres de Facebook; el saldo de Ana se tapa en la escena 6.
- **Sin Tilcho.**

## 8. Cómo se arma (Remotion, en este repo)

**Decisión: se construye por partes y se exporta de una sola vez.**

- **Por partes:** cada escena es su propia composición (`V1` … `V9`, 1920 × 1080). Se revisa en el Studio y se exporta sola a media resolución (`--scale=0.5`, ~30 s) para verla entera; se corrige sin tocar las demás.
- **De una sola vez:** el video final es la composición `BoliviaSabe`, que encadena esos mismos componentes con `<Series>`, y se exporta en un único render. Voces, subtítulos y cortes no se desfasan, y no hay montaje a mano.
- **Siempre hay un video entero exportable:** desde el paso 2 existe `BoliviaSabe` completo (aunque sea el esqueleto); cada paso lo mejora.
- **Masterizado:** el audio se exporta aparte (`--codec=wav`), se normaliza en dos pasadas a −14 LUFS y −1,5 dBTP (como `videos-cc/scripts/sketch_master.py`) y se une al video sin volver a comprimirlo.

```
src/video/
├── VideoFinal.tsx     # Composition "BoliviaSabe" (1920×1080, 30 fps): las 9 escenas en <Series>
├── Miniatura.tsx      # Still "Miniatura" (1280×720) para YouTube
├── datos.ts           # voces (archivo, desde, hasta, texto, quién), tramos de clips, lupas, horas de cada escena
├── layout.ts          # zonas del §2 (celular 405×900, tope 40; A/B; franja de subtítulos)
├── estilo.ts          # colores y letras del §3
├── Telefono.tsx       # marco + tramos de clip (OffthreadVideo con startFrom/playbackRate) + lupa + congelar
├── Subtitulos.tsx     # §6
├── Burbuja.tsx, Rotulo.tsx, Anillo.tsx
├── escenas/Escena1.tsx … Escena9.tsx
└── graficos/ Burbujas.tsx, Figuritas.tsx, Mapa.tsx, TarjetasPlan.tsx, Memo.tsx, Lema.tsx, Qr.tsx
public/video/          # clips, voces e imágenes copiados o convertidos
```

- Los avatares usan el sistema de `src/elenco/` (`Guion`, `va`, `CapaAvatares`): cada escena define su recorrido con las horas de `datos.ts` y el `layout.ts` nuevo.
- La boca sigue la voz real: `scripts/envolvente.py` genera el volumen de cada frase; si no hay entorno de Python, queda la boca de ejemplo.

### Pasos

1. **Material** *(hecho)*: presentaciones en 1080 × 1920 con la rotación aplicada; clips, voces e imágenes en `public/video/`; voces normalizadas; transcripción con tiempos por palabra (`public/video/palabras.json`); volumen por cuadro de cada voz (`src/video/voces-datos.json`); cuadros congelados (`img/f-*.png`), QR (`img/qr.svg`) y recorte del explorador (`img/explorador-pago.png`). Falta: clips con fundido entre cuadros y los efectos de sonido.
2. **Esqueleto:** `VideoFinal` con fondo, celular, tramos de clip, voces y subtítulos de las 9 escenas (sin avatares ni gráficos). Exportar y revisar los tiempos.
3. **Gráficos:** escenas 1, 2, 8 (memo) y 9.
4. **Lupas, rótulos, burbujas y anillos** de las escenas 3 a 8.
5. **Avatares** en las 9 escenas, con expresiones (§5b) y parpadeo.
6. **Exportar:** `npx remotion render BoliviaSabe out/boliviasabe.mp4 --gl=angle --crf=18`, el audio con `--codec=wav`, masterizar y unir; la miniatura con `npx remotion still Miniatura out/miniatura.png --gl=angle`. Revisar la lista del §9.

**Plan B por tiempo:** si a las **9:45** los avatares no están listos en las escenas 3 a 8, se exporta sin ellos ahí (quedan en las escenas 1, 2 y 9). Si a las **10:15** no hay video exportado, se sube el esqueleto del paso 2 con subtítulos.

## 9. Antes de subir

- [ ] Dura entre 2:30 y 2:50; 1920 × 1080; MP4 H.264 + AAC
- [ ] El recorrido de la IA, completo y en orden (§1)
- [ ] Subtítulos en todas las frases, iguales a lo que se dice
- [ ] Ningún cuadro con XLM, correos, contraseñas, teléfonos, el saldo de Ana o caras/nombres de Facebook
- [ ] Rótulos «cuenta de ejemplo» (Ana) y «cuenta nueva de demo» (Camila); memo traducido a `ayuda:55`
- [ ] Nada tapado por la franja de subtítulos ni fuera del margen seguro
- [ ] Visto completo en el celular y en el computador

## 10. YouTube

- **No listado.** Título: «BoliviaSabe · Demo · National Startups Hackathon by Stellar». Miniatura: `out/miniatura.png` (logo, «Ayudar a tus vecinos tiene premio» y los tres avatares).
- **Descripción** (la lee la IA de Atlas; las horas se copian del video final):

```
BoliviaSabe: los vecinos de Bolivia comparten precios del barrio y responden preguntas, y quien ayuda gana yapitas en Stellar (red de pruebas, sin dinero real).

0:00 Quiénes somos (CodeBambinos)
0:22 El problema: 209 mil personas en un grupo «¿Alguien sabe?»; a 14 de 24 encuestados les molesta que la pregunta se pierda
0:45 Abrir la app sin cuenta: Hoy y búsqueda
0:58 Crear la cuenta y recibir 5 yapitas de bienvenida
1:13 Preguntar (urgente, 5 yapitas)
1:27 Otra cuenta responde; la respuesta aparece sin recargar
1:40 «Me sirvió»: quien ayudó gana 5 yapitas
1:50 El pago en Stellar con su memo (ayuda:55)
2:08 Plan de 30 días y cierre

App: https://boliviasabe.vercel.app
Código: https://github.com/codebambinos/boliviasabe
El pago del video en Stellar: https://stellar.expert/explorer/testnet/tx/acce574fd925033d79a87bc03e3c9b6766ecd43d0be4bc58b102d8309ce89a47
```

- Abrir el enlace en una ventana de incógnito; pasarlo a Atlas (campo Video) y al README; después, el segundo análisis de la IA.

## 11. Huecos

| Hueco | Cómo se cierra | Estado |
|---|---|---|
| Orientación distinta de las presentaciones | Convertir a 9:16 con la rotación aplicada (paso 1) | Cerrado en el contrato |
| Tiempos inventados del guion anterior | Medidos en las voces reales (§4) | Cerrado |
| 1-4 y 9-4 los dice solo Yaeko | Así quedan; los tres hacen el gesto | Cerrado |
| Subtítulos distintos a lo que se dijo | Transcrito con Whisper: coincide con el guion salvo las presentaciones, que copian lo dicho (§6) | Cerrado |
| Fluidez baja de algunos clips | Fundido entre cuadros en el preprocesado (§4) | Cerrado en el contrato |
| Personajes planos | Expresiones independientes de la pose y parpadeo (§5b) | Cerrado en el contrato |
| Frases nuevas | Cualquiera de los tres puede regrabar; Yaeko no anima | Cerrado |
| Memo codificado en stellar.expert | Se traduce en pantalla (escena 8) | Cerrado |
| XLM y saldo de Ana visibles | Recorte del explorador; pastilla sobre el saldo en la escena 6 | Cerrado |
| «Destacado» no existe en la app | Marcado «próximo» e «hipótesis» (escena 9) | Cerrado |
| Música | Sin música | Cerrado |
| Volver a grabar la app | No hace falta; solo si un tramo no se lee | Cerrado |
