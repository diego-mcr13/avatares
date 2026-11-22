# Cómo se arma el video (guía para el equipo)

El video es horizontal (1920 × 1080) y se arma con **cuatro capas**. Ya hay un ejemplo completo hecho con una app simulada y voces de computadora, para ver exactamente cómo queda: `out/ejemplo/ejemplo-completo.mp4` (y `ejemplo1.mp4` … `ejemplo8.mp4`, una por escena).

```
 arriba   3. Avatares caminando        out/elenco/escenaN.webm   (transparente)
          2. Grabación de pantalla     la que hacen ustedes      (se coloca sobre el marco del celular)
 abajo    1. Fondo de la escena        out/ejemplo/fondoN.mp4    (aguayo, títulos, datos, marcos vacíos, subtítulos)
 + las voces de cada uno, y música baja
```

## Qué hace cada persona

| Quién | Hace | Entrega |
|---|---|---|
| **Cada uno** | Graba la pantalla de su celular (y su cámara en la escena 1) | Videos de pantalla, uno por tramo |
| **Cada uno** | Graba su voz leyendo sus frases (ver el guion) | Un audio por frase, `1-0.wav`, `1-1.wav`… |
| **Quien edita** | Pone el fondo, coloca las grabaciones, el avatar y las voces | El video final |

La lista de frases con su nombre de archivo (`<escena>-<número>`) sale al correr `python -I -X utf8 scripts/voces_ejemplo.py`.

## Dónde va cada grabación (lienzo 1920 × 1080)

Se coloca la grabación del celular **con esta posición y tamaño** (la proporción es 360 × 800, sin deformar):

| Escena | Qué | Posición X, Y | Tamaño |
|---|---|---|---|
| 2, 3, 6, 7 | Un celular al centro | 748, 70 | 423 × 940 |
| 4 y 5 | Celular A (Ana), izquierda | 408, 70 | 423 × 940 |
| 4 y 5 | Celular B (Luis), derecha | 1088, 70 | 423 × 940 |
| 7 (final) | Computador, ventana al centro | 610, 120 | 700 × 440 |
| 1 | Cámara de cada uno, centrada | 660, 92 | 600 × 800 (o a pantalla completa) |

El fondo ya trae el marco redondeado del celular: la grabación va encima, recortada con esquinas redondeadas de unos 36 px (o dejen que el marco la tape).

## Cómo grabar la pantalla del celular

1. **Android:** deslizar desde arriba › «Grabar pantalla». Activar **«Mostrar toques»** (Ajustes › Opciones de desarrollador › Mostrar toques) para que se vea el círculo en cada clic; así el avatar puede señalar el mismo toque.
2. **iPhone:** Centro de control › grabar pantalla. Activar «AssistiveTouch» no es necesario; el avatar señala igual.
3. Grabar **en vertical**, con el modo oscuro (la app abre así) salvo en la escena 7.
4. Notificaciones apagadas (modo «No molestar») y batería arriba del 50 %.
5. Dos celulares en las escenas 4 y 5: darle «grabar» a los dos y dar una palmada o decir «¡ya!» para sincronizarlos al editar.
6. Dos tomas por tramo, por si una respuesta tarda en aparecer. Esperen 1 o 2 segundos antes de tocar y después de cada toque: se puede acelerar al editar.
7. Tamaño recomendado: 1080 × 2400 (cualquier celular sirve; se reduce a 423 × 940).

## Escena por escena: qué se graba

Cada escena del ejemplo trae una tarjeta «Cómo grabar» con estos mismos pasos. Resumen:

| # | Escena | Se graba | Con qué |
|---|---|---|---|
| 1 | Nosotros en cámara | Cada uno de frente, fondo liso, luz de frente. Sonrían un segundo al terminar (ahí se pixela). | Cámara o celular |
| 2 | El problema | Un chat de grupo lleno de mensajes sin importancia, con una pregunta que se hunde. Nombres inventados. | Celular |
| 3 | Entras directo a Hoy | Ventana privada › boliviasabe.vercel.app › bajar por Hoy, Esta semana y Antes › «Me sirvió» sin cuenta › se cierra el muro. | Celular o Chrome a 360 × 800 |
| 4 | Subir un letrero | A: Hoy › «+ Subir» › foto › título › precio › Publicar. B: actualizar › abrir el letrero › «Me sirvió». | Dos celulares |
| 5 | ¿Alguien sabe? | A: preguntar › Urgente › Publicar › «Pregúntale a tus grupos». B: actualizar › abrir › responder. A: respuesta llega sola › comentar › Pedir contacto. B: Aceptar. A: Me sirvió › Solucionada. B: +5. | Dos celulares |
| 6 | Registrado en Stellar | B: Yo › Movimientos › enlace al explorador › volver › Mi cuenta de prueba. | Celular + pestaña del explorador |
| 7 | Para todo público | Yo › Ajustes › Tema Claro, letra al 130 %, «Instalar la app». Luego computador con Hoy en 4 columnas. | Celular + laptop 1440 × 900 |
| 8 | Dónde empezamos | Nada de la app: mapa, tarjetas del plan y cierre. Ya está en el fondo. | Solo edición |

Antes de grabar: Ana con al menos 5 yapitas (Urgente cuesta 5), Luis con su cuenta lista, y 8 letreros de Cochabamba con fotos reales en Hoy.

## Reglas que se ven en pantalla

- No mostrar números de teléfono: en «Pedir contacto» usen solo el correo de prueba.
- Palabras: yapitas, ¿Alguien sabe?, Hoy, Me sirvió, letrero, red de pruebas, sin dinero real. Nada de cripto, blockchain, tokens, XLM ni «estelares».
- Chats de la escena 2 con nombres inventados, sin datos de nadie.

## Armar el video de verdad

1. Grabar las voces y copiarlas a `public/voz/` con los nombres de la lista (`1-0.wav`, `2-0.wav`…). WAV de 16 bits.
2. Correr `python -I -X utf8 scripts/voces_ejemplo.py --reales`: lee la duración y el volumen de cada voz.
3. Ajustar en `src/elenco/escenas.ts` lo que cambie (los textos y el recorrido salen de ahí). Se ven con `npm run dev` (`Ejemplo1` … `Ejemplo8`).
4. Exportar los avatares: `node scripts/renderizar-elenco.mjs` (transparentes) y los fondos: `node scripts/renderizar-ejemplo.mjs fondos`.
5. En el editor: fondo abajo, grabaciones encima (según la tabla), avatares arriba, voces y música baja. Revisar que dure entre 2:00 y 3:00.

Las voces de ejemplo duran lo que dura la lectura de la computadora; las de ustedes pueden ser más lentas o más rápidas, por eso el paso 3.
