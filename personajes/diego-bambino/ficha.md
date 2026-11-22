# Diego · outfit CodeBambinos

Es Diego (ver `personajes/diego/ficha.md`: mismo cuerpo, cara, pelo, poses y animación) con el outfit del equipo: canguro negro con el logo de CodeBambinos, jeans negros y tenis blancos. Detalle del outfit en `personajes/equipo/outfit.md`.

El Diego original, con su polera de tokensinfinitos, sigue intacto en `src/diegoBambino/`.

- `boceto-poses.png`: las 12 poses.
- `giro.png`: de frente, de tres cuartos, de perfil y de espalda.
- `estres.png`: poses de estrés y cómo queda después de una explosión.
- `prueba-animacion.mp4`: prueba de 17 s con la voz de ejemplo, las poses, la boca sincronizada, y la entrada y salida caminando.

## Dónde está el código

- Modelo (pelo, cara, colores y ropa): `src/diegoBambino/modelo.ts` (la ropa sale de `src/bambinos/ropa.ts`)
- Poses y animación: `src/diegoBambino/poses.ts`
- Componente 3D: `src/diegoBambino/DiegoVoxel.tsx`
- Composiciones de prueba: `src/PruebaDiegoBambino.tsx` (`PruebaDiego`, `DiegoPoses`, `DiegoGiro` y `DiegoEstres`)

Volver a exportar (desde la raíz del repo):

```bash
npx remotion still DiegoPoses personajes/diego-bambino/boceto-poses.png --gl=angle
npx remotion render PruebaDiegoBambino personajes/diego-bambino/prueba-animacion.mp4 --gl=angle
```

## Poses del video

También tiene las poses del video de BoliviaSabe (caminar, correr, señalar a los lados, arriba y abajo, tocar, deslizar, aplaudir y esperar). La hoja está en `poses-video.png` y la explicación en `../equipo/video.md`.
