# Yaeko · versión 1

Yaeko es un personaje chibi hecho de voxels (cubitos), en 3D real dentro de Remotion. Está basado en fotos de referencia de la persona real (las fotos no se suben al repo).

- `boceto-poses.png`: las 12 poses.
- `giro.png`: de frente, de tres cuartos, de perfil y de espalda, para compararlo con las fotos.
- `estres.png`: poses de estrés y cómo queda después de una explosión.

## Aspecto

- **Pelo:** largo y rizado, castaño oscuro (`#3B2016`) con mechas caramelo (`#8E5530`) y miel (`#B5733F`) que aparecen hacia las puntas. Flequillo cortina con raya al medio, que enmarca la cara sin tapar las cejas. Llega a la cintura por la espalda y dos mechones caen por delante de los hombros. Los rizos se notan en el borde ondulado y en los mechones de color.
- **Estrellitas doradas** (`#E8B53A`) en el pelo, arriba a la izquierda de la pantalla.
- **Ojos:** oscuros y almendrados, con delineado (la punta de afuera sube y se queda incluso con los ojos cerrados).
- **Cejas:** finas y arqueadas.
- **Piel:** `#E8B08C`, con mejillas rosadas.
- **Boca:** labios llenos (`#D9877E`); su sonrisa abierta muestra los dientes.
- **Ropa:** el outfit de CodeBambinos (ver `personajes/equipo/outfit.md`): canguro negro con el logo del equipo, falda negra con vuelo (en lugar de los jeans), piernas al aire y tenis blancos. El outfit anterior (top fucsia y falda negra) queda en `modelo.ts` como `*Fucsia`.
- **Pulsera de perlas** en la muñeca del brazo derecho de la pantalla.
- Mide unos 37 voxels con el pelo (las piernas son un voxel más largas que las de Diego para que se vean debajo de la falda).

## Diferencias con Diego en el código

- El pelo largo va en dos piezas: `peloCabeza()` gira con la cabeza y `peloEspalda()` va con el torso. Así la melena no atraviesa los brazos ni los hombros.
- `antebrazo(pulsera)` recibe si lleva la pulsera.
- La ropa sale de `src/bambinos/ropa.ts`, igual que Diego y Aldrin. Como el pelo largo tapa el cuello, el canguro no lleva la capucha caída.
- `ESQUELETO.cadera` es 7 (Diego: 6) por las piernas más largas.
- Sin orejas ni logo en la polera.

## Poses

Usa las mismas poses que Diego (ver `personajes/diego/ficha.md`). En `celebrar`, `desesperar` y `rascar` las manos quedan dentro del pelo, porque el pelo es voluminoso.

## Dónde está el código

- Modelo (pelo, cara, colores): `src/yaeko/modelo.ts`
- Poses y animación: `src/yaeko/poses.ts`
- Componente 3D: `src/yaeko/YaekoVoxel.tsx`
- Composiciones de prueba: `src/PruebaYaeko.tsx` (`PruebaYaeko`, `YaekoPoses`, `YaekoGiro` y `YaekoEstres`)

Volver a exportar (desde la raíz del repo):

```bash
npx remotion still YaekoPoses personajes/yaeko/boceto-poses.png --gl=angle
npx remotion still YaekoGiro personajes/yaeko/giro.png --gl=angle
npx remotion render PruebaYaeko out/prueba-yaeko.mp4 --gl=angle
```

## Pendiente

- El video `PruebaYaeko` todavía usa la voz de ejemplo de Diego (`voz_corta.wav`). Falta grabar la voz de Yaeko y generar su envolvente y sus palabras.
