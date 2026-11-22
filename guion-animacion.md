# Guion para animar el video de BoliviaSabe

Guía para pasar el guion nuevo (9 escenas, códigos 1-1 a 9-4) a `src/elenco/escenas.ts` y animar a los avatares sobre las grabaciones reales.

- Guion de voces (qué dice cada uno): <https://claude.ai/artifact/1WfUPrarZX1AcNshLLLidQ>
- Guion de edición (el mismo contenido, para el montaje): <https://claude.ai/artifact/EykfnkmEpbGyMJ1XjM6pdo>
- Cómo está armado el elenco (`g.va`, `g.dice`, `junto`, exportar): `personajes/equipo/video.md`

> **Ojo:** `src/elenco/escenas.ts` todavía tiene el guion viejo de 8 escenas. Hay que reescribirlo con estas 9 y agregar `Escena9` / `Escena9Previa` en `Elenco.tsx` y `src/Root.tsx`.

## Datos generales

| Dato | Valor |
| --- | --- |
| Lienzo | 1920 × 1080, 30 fps, fondo transparente |
| Duración total | unos 2:25 (entre 2:20 y 2:40; nunca más de 3:00) |
| Celular | marco de 423 × 940 px al centro (`U`). Dos celulares (`A` izquierda, `B` derecha) **solo en la escena 6** |
| Avatares | Diego, Yaeko y Aldrin, con el outfit de CodeBambinos, de unos 300 px de alto |
| Quien no habla | espera en `ESPERA` (esquinas de abajo) con la pose `esperar` |
| Tilcho | **no aparece** en ninguna escena |
| Clips de la app | `grabaciones/toma-final/` (360 × 800, tema oscuro, círculo amarillo en cada toque). Toques exactos en `grabaciones/toma-final/marcas.json` |
| Capturas | `grabaciones/toma-final/capturas/` (una por toque) |
| Audios | uno por frase, con el nombre del código (`4-1.m4a`, …). Cuando lleguen: volumen en `voces.ts` con `scripts/envolvente.py` |

**Cambio de guion (22 nov):** el 1-4 y el 9-4 los dice **solo Yaeko** (ya no los tres juntos). En esas frases solo se mueve la boca de Yaeko.

**Reparto de la demo (toma final):** Camila Q. es la cuenta nueva, en Queru Queru: crea la cuenta, pregunta y toca «Me sirvió». Ana es la vecina que responde y recibe las 5 yapitas.

**Poses disponibles:** `caminar`, `correr`, `saludar`, `hablar`, `senalar` (hacia la derecha), `senalarIzq`, `senalarArriba`, `senalarAbajo`, `tocar`, `deslizar`, `aplaudir`, `esperar`, `pensar`, `encoger`, `desesperar`, `escribir`, `sorpresa`, `celebrar`, `triunfo`, `apuntar`.

**Las horas** de cada tramo son relativas al inicio de la escena y están calculadas con la duración ideal de cada frase. Cuando lleguen los audios, se corren a su largo real. En las tablas, «clip» indica qué tramo de la grabación se ve en el celular, para que el avatar toque o señale en el momento justo.

---

## Escena 1 · Nos presentamos (≈ 17 s)

Los tres en cámara, de frente. Cada uno se pixela (0,5 s) y se vuelve su avatar. Al final quedan los tres juntos al centro con el logo de BoliviaSabe. **Sin celular.**

| Hora | Qué se ve | Avatares | Audio |
| --- | --- | --- | --- |
| 0:00–0:05 | Video de Diego; en «versión avatar» se pixela y queda el avatar. Rótulo «Diego · líder técnico» | Diego: `saludar` y luego `hablar` | **1-1 Diego:** «¡Hola! Soy Diego, líder técnico. Ahora me verán en mi versión avatar.» |
| 0:05–0:10 | Video de Yaeko; se pixela al final. Rótulo «Yaeko · product owner» | Yaeko: `saludar`; en «me vuelvo avatar», `senalarIzq` hacia Diego. Diego: `esperar` | **1-2 Yaeko:** «¡Hola! Soy Yaeko, product owner. Yo también me vuelvo avatar.» |
| 0:10–0:14 | Video de Aldrin; se pixela en «¡Ahora nos ven así!». Rótulo «Aldrin · desarrollador» | Aldrin: `saludar` y luego `celebrar`. Los otros: `esperar` | **1-3 Aldrin:** «Y yo soy Aldrin, desarrollador. ¡Ahora nos ven así!» |
| 0:14–0:17 | Fondo de la marca, logo de BoliviaSabe y «por CodeBambinos» | Los tres caminan al centro; Yaeko habla y los tres hacen `triunfo` juntos al final | **1-4 Yaeko** (sola): «Somos CodeBambinos. ¡Esto es BoliviaSabe!» |

**Falta:** un video de 5 s de cada uno en cámara (horizontal, de frente, de la cintura para arriba). Si no hay tiempo, se usa una foto con un acercamiento lento antes de pixelarla.

## Escena 2 · El problema (≈ 22 s)

Cabecera del grupo de Facebook, después mensajes que tapan la pregunta y al final la cifra de la encuesta. **Sin celular:** la imagen y los gráficos van al centro.

| Hora | Qué se ve | Avatares | Audio |
| --- | --- | --- | --- |
| 0:00–0:05 | `e2-grupo-facebook-cabecera.png` con un acercamiento lento a «209,0 mil miembros» (resaltado en amarillo) | Yaeko a la izquierda: `senalar` hacia la cifra | **2-1 Yaeko:** «En Cochabamba preguntamos todo en grupos: este tiene 209 mil miembros.» |
| 0:05–0:12 | Burbujas grises de mensajes que se apilan; una amarilla «¿Alguien sabe quién arregla tuberías?» se hunde entre ellas | Diego entra por la derecha: `desesperar` en «se pierde», `encoger` al final | **2-2 Diego:** «Pero la pregunta se pierde entre cientos de mensajes, nadie sabe si sigue vigente y a veces tarda.» |
| 0:12–0:16 | Las burbujas se ponen grises; una mano con un «0» | Aldrin: `pensar` y luego `encoger` en «muchos callan» | **2-3 Aldrin:** «Y quien ayuda no gana nada. Por eso muchos callan.» |
| 0:16–0:22 | 24 figuritas; 14 se pintan de amarillo una tras otra. Texto «14 de 24 personas» y «se quejan de que la pregunta se pierde» | Yaeko vuelve al centro: `apuntar` hacia las figuritas | **2-4 Yaeko:** «Le preguntamos a 24 personas: a 14 les molesta justo que la pregunta se pierda.» |

Las burbujas y las figuritas se dibujan, no se capturan de Facebook. En la imagen del grupo no pueden verse nombres ni caras.

## Escena 3 · Abrimos la app sin cuenta (≈ 11 s)

Celular `U` con `e3-hoy.mp4` (13,3 s). Toques: buscador a los **4,23 s**; «almuerzo» escrito a los **8,85 s**.

| Hora | Clip | Avatares | Audio |
| --- | --- | --- | --- |
| 0:00–0:05 | 0 a 4,2 s: Hoy con los letreros, sin sesión. Rótulo fijo «boliviasabe.vercel.app» arriba | Aldrin, a la izquierda del celular: `senalarArriba` hacia la barra de direcciones y luego `senalar` | **3-1 Aldrin:** «Abres boliviasabe punto vercel punto app y entras directo a Hoy, sin registrarte.» |
| 0:05–0:11 | 4,2 a 13,3 s (escritura a 1,5×) | Yaeko, a la derecha (buscador, arriba): `tocar` en 4,2 s, `sorpresa` en «ahí está». Aldrin: `esperar` | **3-2 Yaeko:** «Letreros con foto, precio, zona y fecha. Buscas «almuerzo» y ahí está.» |

## Escena 4 · Creamos una cuenta (≈ 14 s)

Celular `U` con `e4-registro.mp4` (55,2 s). Se cortan la escritura del correo y la espera del saldo. Toques: Iniciar sesión **1,2 s**, Continuar **20,8 s**, nombre **24,2 s**, zona **29,4 s**, Listo **31,8 s**, saldo de 5 **al final**.

| Hora | Clip | Avatares | Audio |
| --- | --- | --- | --- |
| 0:00–0:02 | 0,5 a 3 s: toca «Iniciar sesión» | Diego a la izquierda: `tocar` | **4-1 Diego** (empieza) |
| 0:02–0:04 | **Corte** de 3 a 18,5 s. Luego 18,5 a 21 s a 2×: Continuar | Diego: `hablar` | 4-1 sigue |
| 0:04–0:08 | 24,2 a 32,5 s a 2×: «Tu barrio», Camila Q., Queru Queru, Listo. Rótulo «Queru Queru» | Diego: `senalar` hacia el campo de zona | 4-1 termina: «Para participar, creas tu cuenta con Google o con tu correo y eliges tu barrio.» |
| 0:08–0:14 | **Corte** de 32,5 a 54,5 s. Final del clip y se congela 4 s (o `e4-saldo.png`). Burbuja «+5 yapitas» | Aldrin entra por la derecha: `senalarIzq` hacia el saldo y `aplaudir` en «cinco yapitas». Diego: `aplaudir` | **4-2 Aldrin:** «Y al terminar ya tienes tu cuenta en Stellar y cinco yapitas de bienvenida.» |

El correo queda borroso y la contraseña oculta en todos los cuadros.

## Escena 5 · Preguntamos (≈ 14 s)

Celular `U` con `e5-pregunta.mp4` (48,9 s). Rótulo «Camila (cuenta nueva)» arriba. Toques: ¿Alguien sabe? **1,2 s**, Preguntar **4,9 s**, escribe **8 s**, Urgente **33,8 s**, Publicar **36,5 s**, publicada **49,3 s**.

| Hora | Clip | Avatares | Audio |
| --- | --- | --- | --- |
| 0:00–0:04 | 0,5 a 6 s: «¿Alguien sabe?» (menú de abajo) y Preguntar | Yaeko a la izquierda: `senalarAbajo` y `tocar` en cada toque | **5-1 Yaeko** (empieza) |
| 0:04–0:07 | 8 a 33,8 s a 8× (≈ 3 s): escribe la pregunta | Yaeko: `escribir` | 5-1 termina: «Ahora preguntamos: ¿quién arregla una tubería hoy en Queru Queru?» |
| 0:07–0:11 | 33,8 a 37 s normal: Urgente y «Publicar y pagar 5 yapitas» (`e5-urgente.png`). Texto «−5 yapitas · primera por 24 h» | Aldrin a la derecha: `senalarIzq` hacia Urgente y `tocar` en Publicar | **5-2 Aldrin:** «La marcamos Urgente: cuesta cinco yapitas y sale primero por 24 horas.» |
| 0:11–0:14 | **Corte** de 37 a 48 s. Final del clip, se congela 2 s: detalle con «Pregúntale a tus grupos» | Los dos: `esperar` | silencio |

## Escena 6 · Otro vecino responde (≈ 13 s)

**Dos celulares:** `A` = Ana (`e6-ana.mp4`, 34,4 s), `B` = Camila (`e6-camila.mp4`, 34,4 s). Se grabaron a la misma hora: **mismos cortes en los dos**. Rótulos «Ana» y «Camila» arriba de cada uno. Toques de Ana: campana **2,5 s**, abre el aviso **6,4 s**, escribe **10,4 s**, Enviar **32,8 s**. En Camila la respuesta aparece al final del clip.

| Hora | Clip (A y B iguales) | Avatares | Audio |
| --- | --- | --- | --- |
| 0:00–0:05 | 1,5 a 10,4 s a 2×: campana, aviso «Pregunta urgente en Queru Queru», abre la pregunta | Diego a la izquierda de `A`: `tocar` en la campana (arriba) y luego `senalar` | **6-1 Diego** (empieza) |
| 0:05–0:08 | 10,4 a 32,8 s a 8× (≈ 3 s): Ana escribe | Diego: `hablar` | 6-1 termina: «En otra cuenta, Ana, que vive en Queru Queru, ve el aviso de la urgente y responde.» |
| 0:08–0:13 | 32,8 s al final: Enviar en `A`; la respuesta aparece en `B`. Se congelan los dos 3 s. Texto «sin recargar» junto a la respuesta | Yaeko a la derecha de `B`: `sorpresa` y luego `senalarIzq` hacia la respuesta. Diego: `aplaudir` | **6-2 Yaeko:** «Y quien preguntó ve la respuesta aparecer sola, sin recargar.» |

Captura de apoyo: `e6-avisos.png`.

## Escena 7 · «Me sirvió» (≈ 9 s)

Celular `U` con `e7-camila.mp4` (3,6 s). Toques: Me sirvió **1,5 s**, Solucionada **3 s**.

| Hora | Clip | Avatares | Audio |
| --- | --- | --- | --- |
| 0:00–0:02 | 0 a 1,5 s, con un acercamiento al botón «Me sirvió» | Aldrin a la izquierda: `senalar` hacia el botón | **7-1 Aldrin** (empieza) |
| 0:02–0:05 | 1,5 a 3,6 s: toca y queda Solucionada (sello) | Aldrin: `tocar` en 1,5 s y luego `hablar` | 7-1 termina: «Solo quien preguntó puede marcar Me sirvió, y la pregunta queda Solucionada.» |
| 0:05–0:09 | Se congela 4 s (`capturas/e7-camila_final.png`): «¡Gracias, pues! Ana recibe +5 yapitas…». Texto «+5 yapitas para Ana» | Diego entra por la derecha: `celebrar`. Aldrin: `aplaudir` | **7-2 Diego:** «Y Ana gana cinco yapitas por ayudar.» |

## Escena 8 · El pago en Stellar (≈ 19 s)

Celular `U` con `e7-ana.mp4` (25,6 s). Rótulo «Ana». Toques: saldo **1,5 s**, Confirmado visible **8 s**, Registro **8,1 s**, stellar.expert **18,6 s**.

| Hora | Clip | Avatares | Audio |
| --- | --- | --- | --- |
| 0:00–0:05 | 0,5 a 8,1 s: toca su saldo y se abre Movimientos con «Tu respuesta sirvió +5 yapitas · Confirmado» (`e7-movimientos.png`) | Diego a la izquierda: `tocar` y luego `senalar` hacia «Confirmado» | **8-1 Diego** (empieza) |
| 0:05–0:08 | Toca Registro. **Corte** de 9 a 18 s. Desde 18 s: se abre stellar.expert. Texto «registro público: stellar.expert» | Diego: `senalarArriba` hacia la barra de direcciones | 8-1 termina: «Cada premio es un pago en Stellar. En Movimientos se ve confirmado, y el enlace abre el registro público.» |
| 0:08–0:13 | Imagen fija `e7-explorador.png` **recortada** (solo «sent 5 YAPITA to…» y el memo, sin XLM) con acercamiento al memo. Rótulo **«Memo: ayuda:55 → premio por la respuesta n.º 55»** | Aldrin a la derecha: `sorpresa` y luego `senalarIzq` hacia el memo | **8-2 Aldrin:** «Ahí está el pago, con su memo: cualquiera puede verificarlo.» |
| 0:13–0:19 | La misma imagen con una franja abajo: «Red de pruebas · sin dinero real · la app custodia las cuentas» | Yaeko al centro abajo: `hablar`. Los otros: `esperar` | **8-3 Yaeko:** «Todo corre en la red de pruebas, sin dinero real. Hoy la app custodia las cuentas.» |

stellar.expert muestra el memo codificado (`YXl1ZGE6NTU=` = «ayuda:55»), por eso va el rótulo. No pueden verse ni la palabra XLM ni el saldo de Ana. Si el texto queda chico, usar `e7-explorador-abajo.png`.

## Escena 9 · Plan y cierre (≈ 28 s)

**Sin celular.** Gráficos sobre el fondo de la marca.

| Hora | Qué se ve | Avatares | Audio |
| --- | --- | --- | --- |
| 0:00–0:09 | Título «Plan de 30 días». Mapa simple de Cochabamba con dos puntos que se encienden, Sarco y el Centro. Después entran tres tarjetas: «1 semana», «30 cuentas», «5 negocios» | Yaeko: `senalarArriba` hacia cada tarjeta cuando aparece | **9-1 Yaeko:** «Empezamos en Cochabamba, con estudiantes y negocios cerca de las universidades, en Sarco y el Centro: una semana, 30 cuentas y 5 negocios.» |
| 0:09–0:15 | Tarjeta de un negocio de barrio que sube al primer lugar. «Bs 20/mes · aparecer primero en su zona» + nota chica «hipótesis por validar» | Diego: `apuntar` hacia el precio | **9-2 Diego:** «Los negocios de barrio pagarían Bs 20 al mes por aparecer primero en su zona.» |
| 0:15–0:21 | **boliviasabe.vercel.app** grande al centro, con un código QR que lleva a la app | Aldrin: `senalarArriba` hacia la dirección y `triunfo` en «toda Bolivia» | **9-3 Aldrin:** «Pruébala hoy en boliviasabe punto vercel punto app. Hoy una ciudad, mañana toda Bolivia.» |
| 0:21–0:28 | Logo de BoliviaSabe y el lema en tres líneas, una por frase; «CodeBambinos» chico abajo | Los tres juntos al centro; Yaeko adelante con `hablar`, Diego y Aldrin `celebrar`; al final los tres `saludar` para despedirse | **9-4 Yaeko** (sola): «¿Viste algo útil? Súbelo. ¿Necesitas algo ya? Pregunta. En Bolivia, ayudar a tus vecinos tiene premio.» |

Los últimos 2 s quedan en silencio con el logo y la dirección.

---

## Pasos para Diego

1. Reescribir `src/elenco/escenas.ts` con estas 9 escenas: una llamada `g.va(...)` por cada movimiento de las tablas y `g.dice(...)` con el texto exacto de cada frase.
2. Mirar en la captura de cada toque (`grabaciones/toma-final/capturas/`) a qué altura está el botón y usar ese `v` en `junto(celular, lado, v)` (0 = arriba, 1 = abajo).
3. Agregar `Escena9` y `Escena9Previa`, y en la escena 6 usar los celulares `A` y `B`. Las escenas 1, 2 y 9 no llevan celular.
4. Revisar en Studio (`npm run dev`) con las `EscenaNPrevia`.
5. Cuando lleguen los audios: correr las horas al largo real, generar el volumen con `scripts/envolvente.py` y registrarlo en `voces.ts` (clave `<escena>-<quien>`, por ejemplo `5-yaeko`).
6. `npm run lint` y después exportar con `node scripts/renderizar-elenco.mjs mov` (transparentes en `out/elenco/`).

## Antes de entregar

- [ ] Subtítulos en todo el video, quemados abajo al centro, con el texto exacto
- [ ] Escena 4: el correo borroso y la contraseña oculta en todos los cuadros
- [ ] Escena 8: sin líneas de XLM y con el rótulo del memo
- [ ] No pueden verse correos, teléfonos, contraseñas, datos de prueba ni caras o nombres de Facebook
- [ ] Sin Tilcho
- [ ] No se dice ni se escribe cripto, blockchain, tokens, XLM ni puntos
- [ ] Duración entre 2:20 y 2:40
- [ ] MP4 H.264, 1920 × 1080, 30 fps; verlo completo en un celular antes de subirlo

**Hora límite:** domingo 22 a las 11:59, hora de Bolivia (por confirmar).
