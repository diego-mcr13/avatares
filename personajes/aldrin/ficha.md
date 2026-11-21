# Aldrin · versión 1

Aldrin es un personaje chibi hecho de voxels (cubitos), en 3D real dentro de Remotion. Está basado en fotos de referencia de la persona real (las fotos no se suben al repo). Tiene el mismo cuerpo, las mismas poses y la misma animación que Diego.

- `boceto-poses.png`: las 12 poses.
- `giro.png`: de frente, de tres cuartos, de perfil y de espalda, para compararlo con las fotos.

## Aspecto

- **Pelo:** negro (`#15110E`), corto y despeinado, con mechones que sobresalen arriba y reflejos un poco más claros. Flequillo largo y de punta que cae sobre la frente; algunos mechones bajan hasta las cejas. Los costados se abultan sobre la oreja y la nuca tiene un poco de volumen.
- **Piel:** morena (`#C58B64`), con mejillas apenas rosadas.
- **Cejas:** gruesas y rectas.
- **Ojos:** oscuros y almendrados, con un brillo chico arriba a la izquierda.
- **Boca:** labios llenos.
- **Orejas:** a la vista, debajo del pelo.
- **Ropa:** el outfit de CodeBambinos (ver `personajes/equipo/outfit.md`): canguro negro con el logo, jeans negros y tenis blancos.
- Mide unos 35 voxels con el pelo.

## Diferencias con Diego en el código

- `cabeza()` y `pelo()` son propios (pelo corto despeinado, flequillo largo, orejas a la vista).
- La paleta de piel y de pelo es distinta (`PAL` en `modelo.ts`).
- La ropa sale de `src/bambinos/ropa.ts`, igual que Diego y Yaeko.

## Poses

Usa las mismas poses que Diego (ver `personajes/diego/ficha.md`).

## Dónde está el código

- Modelo (pelo, cara, colores): `src/aldrin/modelo.ts`
- Poses y animación: `src/aldrin/poses.ts`
- Componente 3D: `src/aldrin/AldrinVoxel.tsx`
- Composiciones de prueba: `src/PruebaAldrin.tsx` (`PruebaAldrin`, `AldrinPoses`, `AldrinGiro` y `AldrinEstres`)

Volver a exportar (desde la raíz del repo):

```bash
npx remotion still AldrinPoses personajes/aldrin/boceto-poses.png --gl=angle
npx remotion still AldrinGiro personajes/aldrin/giro.png --gl=angle
npx remotion render PruebaAldrin out/prueba-aldrin.mp4 --gl=angle
```

## Pendiente

- El video `PruebaAldrin` todavía usa la voz de ejemplo de Diego (`voz_corta.wav`). Falta grabar la voz de Aldrin y generar su envolvente y sus palabras.
