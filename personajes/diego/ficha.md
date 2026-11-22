# Diego · versión 2

Diego es el personaje principal de tokensinfinitos: un dev chibi hecho de voxels (cubitos), en 3D real dentro de Remotion. Está basado en fotos de referencia de la persona real.

- `boceto-poses.png`: las 12 poses.
- `giro.png`: el dev de frente, de tres cuartos, de perfil y de espalda, para compararlo con las fotos.
- `prueba-animacion.mp4`: prueba de 17 s con la voz, las poses, la boca sincronizada, y la entrada y salida caminando.


## Detalles de diseño que se corrigieron durante la creación

- **Pelo:** lleno y peinado de costado. La raya está a la izquierda de la pantalla y el pelo se peina desde ahí hacia la derecha. Del lado de la raya se ve toda la frente; del otro lado, el flequillo corto tapa la parte de arriba. Los costados van en degradado: pelo corto pero oscuro hasta arriba de la oreja, y más claro hacia el cuello.
- **Cejas:** gruesas y rectas, de 4 voxels de ancho.
- **Ojos:** almendrados, más anchos que altos, con un brillo chico arriba a la izquierda.
- **Piel:** más clara (`#E6B898`), con las mejillas más rosadas.
- **Orejas:** un poco más grandes y salidas, con la parte de adentro más oscura.
- **Boca:** la boca cerrada tiene el labio de abajo marcado (labios gruesos).
- **Cabeza:** un voxel más alta (cara más ovalada), con las esquinas de abajo redondeadas. La fila extra de frente deja lugar al flequillo sin tapar las cejas cuando suben.
- **Ropa:** polera negra oversize, más larga (tapa la cintura) y con mangas sueltas hasta el codo; mom jean negro (`#26272C`, un negro más frío que la polera) con la basta doblada; tenis blancos con la suela gris clara.
- **Piernas:** un voxel más largas, para que se vea el jean debajo de la polera larga.
- **Arreglo:** en las poses con la cabeza girada (pensar, encoger, sorpresa, rascar), los ojos y la boca parpadeaban o desaparecían. Era un problema de precisión de la cámara y ya está corregido.

## Aspecto

- Pelo oscuro, lleno, peinado de costado (raya a la izquierda de la pantalla); costados en degradado.
- Cejas gruesas, ojos almendrados oscuros, mejillas rosadas y labios gruesos.
- Polera (camiseta) negra oversize, larga y con mangas sueltas hasta el codo. El símbolo de tokensinfinitos va en lima, chico, a la altura del bolsillo (lado derecho de la pantalla). La ficha del centro es redonda.
- Mom jean negro con la basta doblada y tenis blancos.
- Colores de marca: Tinta `#14110F`, Papel `#F6F3EE`, Lima `#C6FF3D`, Magenta `#FF3D8B`.
- Mide unos 35 voxels con el pelo.

## Poses para el guion

| Pose | Para qué sirve |
|---|---|
| `neutral` | Esperar, escuchar |
| `hablar` | Explicar; las manos acompañan la voz |
| `saludar` | Inicio y despedida |
| `celebrar` | Logros, resultados ("¡listo!") |
| `triunfo` | Puño arriba ("¡sí!", "100 %") |
| `senalar` | Mostrar algo a la derecha de la pantalla (una app, un texto) |
| `apuntar` | Hablarle directo a quien mira ("tú", "te voy a enseñar") |
| `pensar` | Preguntas, "primero...", dudas |
| `encoger` | "No sé", "depende", "así de fácil" |
| `sorpresa` | Revelaciones, datos llamativos |
| `escribir` | Trabajar en la laptop (aparece sola con la pose) |
| `rascar` | "Ups", errores, momentos graciosos |
| `desesperar` | Las dos manos en la cabeza, temblando: "¡no puede ser!" |
| `facepalm` | La mano tapando la cara: "no lo puedo creer" |
| `ansioso` | Manos juntas en la boca, hombros arriba, temblando: algo está por salir mal |

Además, sin pedirlo: parpadea, respira, abre la boca según la voz, levanta las cejas cuando la voz sube de golpe y cambia el peso de pie.

Caras extra: pupilas chiquitas (`chicos`, para ansiedad o cara de póker) y dientes apretados (`apretada`, estrés). Con `explotado`, `DiegoVoxel` le pone el pelo esponjado y chamuscado y hollín en la cara.

## Entradas y salidas

- `entrarCaminando` / `salirCaminando`, por la izquierda o por la derecha.
- `aparecer` / `desaparecer`: también funcionan con el dev.

## Dónde está el código

- Modelo (pelo, cara, colores): `src/diegoBambino/modelo.ts`
- Poses y animación: `src/diegoBambino/poses.ts`
- Componente 3D: `src/diegoBambino/DiegoVoxel.tsx`
- Laptop y efectos: `src/diegoBambino/efectos.tsx`
- Composiciones de prueba: `src/PruebaDiegoBambino.tsx` (`PruebaDiego`, `DiegoPoses` y `DiegoGiro`)

Volver a exportar (desde la raíz del repo):

```bash
npx remotion render PruebaDiego out/prueba-personaje.mp4 --gl=angle
```

```bash
npx remotion still DiegoPoses out/personaje-poses.png --gl=angle
```

```bash
npx remotion still DiegoGiro out/personaje-giro.png --gl=angle
```
