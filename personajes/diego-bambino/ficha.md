# Diego · outfit CodeBambinos

Es Diego (ver `personajes/diego/ficha.md`: mismo cuerpo, cara, pelo, poses y animación) con el outfit del equipo: canguro negro con el logo de CodeBambinos, jeans negros y tenis blancos. Detalle del outfit en `personajes/equipo/outfit.md`.

El Diego original, con su polera de tokensinfinitos, sigue intacto en `src/personaje/`.

- `boceto-poses.png`: las 12 poses.
- `giro.png`: de frente, de tres cuartos, de perfil y de espalda.
- `estres.png`: poses de estrés y cómo queda después de una explosión.
- `prueba-animacion.mp4`: prueba de 17 s con la voz de ejemplo, las poses, la boca sincronizada, y la entrada y salida caminando.

## Dónde está el código

- Modelo (pelo, cara, colores y ropa): `src/diegoBambino/modelo.ts` (la ropa sale de `src/bambinos/ropa.ts`)
- Poses y animación: `src/diegoBambino/poses.ts`
- Componente 3D: `src/diegoBambino/DiegoVoxel.tsx`
- Composiciones de prueba: `src/PruebaDiegoBambino.tsx` (`PruebaDiegoBambino`, `DiegoBambinoPoses`, `DiegoBambinoGiro` y `DiegoBambinoEstres`)

Volver a exportar (desde la raíz del repo):

```bash
npx remotion still DiegoBambinoPoses personajes/diego-bambino/boceto-poses.png --gl=angle
npx remotion render PruebaDiegoBambino personajes/diego-bambino/prueba-animacion.mp4 --gl=angle
```
