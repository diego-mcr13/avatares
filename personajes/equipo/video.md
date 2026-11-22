# Avatares del video de BoliviaSabe

Diego, Yaeko y Aldrin (con el outfit de CodeBambinos) caminan por la pantalla encima de la grabación de la app, señalan lo que se muestra y mueven la boca cuando les toca hablar. Cada escena del guion es una composición de Remotion con **fondo transparente**: se exporta y se pone como pista de arriba en el editor.

**Guía para grabar y armar el video, con un ejemplo completo:** `guia-grabacion.md` (en esta misma carpeta).

Guion con las frases de cada uno: <https://claude.ai/artifact/1WfUPrarZX1AcNshLLLidQ>

## Las poses del video

Se agregaron a los tres personajes (`src/diegoBambino/`, `src/yaeko/`, `src/aldrin/`, en `poses.ts`), además de las que ya tenían. La hoja de cada uno está en `personajes/<nombre>/poses-video.png`.

| Pose | Para qué sirve en el video |
|---|---|
| `caminar` | Ir hasta el botón o la parte de la pantalla que se va a explicar. Al moverse por la escena camina solo, con el pie sin patinar. |
| `correr` | Cuando el recorrido es largo y hay poco tiempo (el recorrido corre solo si no llega caminando). |
| `senalar` | Señalar hacia la derecha de la pantalla: cuando el avatar está a la izquierda del celular. |
| `senalarIzq` | El espejo: señalar hacia la izquierda, cuando está a la derecha del celular. |
| `senalarArriba` | La franja de aguayo, el título, la barra de direcciones, las tarjetas del plan. |
| `senalarAbajo` | El menú de abajo, el botón Publicar. |
| `tocar` | Tocar la pantalla con el dedo (dar toquecitos): cada clic de la demo. |
| `deslizar` | Tirar hacia abajo para actualizar la lista. |
| `aplaudir` | Cuando otro termina o llega una yapita. |
| `esperar` | Esperar su turno en la esquina, atento, mientras habla otro. |

Y las que ya existían y se usan: `saludar`, `hablar`, `pensar`, `encoger`, `desesperar`, `escribir` (con la laptop), `celebrar` y `triunfo`.

## Cómo está armado

```
src/elenco/
├── layout.ts      # lienzo 1920×1080, posición de los celulares y puntos de la pantalla
├── escenas.ts     # el guion: frases y recorrido de cada avatar, escena por escena
├── Elenco.tsx     # las composiciones Escena1 … Escena8 (y Escena1Previa … Escena8Previa)
├── HojaVideo.tsx  # las hojas de poses (DiegoPosesVideo, YaekoPosesVideo, AldrinPosesVideo)
└── voces.ts       # volumen de la voz real de cada uno (para que la boca siga su grabación)
```

- **Lienzo:** 1920 × 1080. La app grabada va en un marco de celular (423 × 940 px) al centro: un solo celular en las escenas 2, 3, 6 y 7 (`U`) y dos celulares lado a lado en las escenas 4 y 5 (`A` y `B`). Los lados quedan libres para los avatares. Los avatares miden unos 300 px de alto.
- **Recorrido:** en `escenas.ts`, cada escena tiene líneas como `g.va("aldrin", 12.4, junto("A", "izq", 0.9), "senalar")`: «Aldrin llega a las 12,4 s al costado izquierdo del celular A, a la altura del 90 % de la pantalla (el botón de abajo), y señala». El avatar sale antes y camina (o corre) para llegar justo a esa hora. `junto(celular, lado, v)` calcula dónde pararse; `v` va de 0 (arriba) a 1 (abajo).
- **Frases:** `g.dice([[quien, "texto"], …], desde)` pone el texto y calcula cuánto dura (2,6 palabras por segundo). Las palabras entre `**dos asteriscos**` son las frases gancho. Aparecen en la vista previa como subtítulo.
- **Esquinas:** los que no hablan esperan en `ESPERA` (abajo a los costados), con la pose `esperar`.

## Ver y ajustar

```bash
npm run dev
```

En el Studio están `Escena1Previa` … `Escena8Previa`: muestran marcos de celular, el nombre de cada avatar y el subtítulo de lo que se dice. Las `Escena1` … `Escena8` son las transparentes, sin nada más.

Si cambia la posición de un botón en la grabación real, se cambia el `v` (y el lado) de esa llamada a `junto(...)` y listo.

## Exportar

```bash
node scripts/renderizar-elenco.mjs              # las 8 escenas, transparentes, .webm (livianas)
node scripts/renderizar-elenco.mjs mov          # transparentes en .mov ProRes 4444 (Premiere, DaVinci, Final Cut)
node scripts/renderizar-elenco.mjs previa       # vista previa con marcos de celular y subtítulos
node scripts/renderizar-elenco.mjs webm 5 6     # solo las escenas 5 y 6
```

Los archivos quedan en `out/elenco/` (`escena5.webm`, `escena5-previa.mp4`, …). Si el editor que usan no lee el transparente `.webm`, usen `mov`.

Las poses sueltas se ven con: `npx remotion still YaekoPosesVideo out/x.png --gl=angle` (y `DiegoPosesVideo`, `AldrinPosesVideo`).

## Con la voz de cada uno

Mientras no haya audio, la boca se mueve con un volumen inventado cuando a esa persona le toca hablar. Para que siga la grabación real, ver las instrucciones en `src/elenco/voces.ts` (se genera el volumen con `scripts/envolvente.py` y se registra con la clave `<escena>-<quien>`, por ejemplo `5-yaeko`).

## Tiempos

Las frases están calculadas a 2,6 palabras por segundo. Cuando graben las voces de verdad, los tiempos de `g.dice(...)` y de `g.va(...)` se ajustan a la duración real de cada frase; la duración de la escena se recalcula sola.
