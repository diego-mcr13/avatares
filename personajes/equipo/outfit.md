# Outfit CodeBambinos

Los tres personajes (Diego, Yaeko y Aldrin) comparten el mismo outfit del equipo:

- **Canguro negro** oversize (`#1B1A1E`) con capucha, bolsillo canguro, puños y cordones.
- **Logo de CodeBambinos** en el pecho, en pixeles: las dos llaves `{ }` en papel (`#F2F0EA`) y los tres puntos con carita en violeta (`#8B5CFF`), cian (`#22D3EE`) y lima (`#C6F432`). Es la versión `oscuro` del logo (`codebambinos-simbolo-oscuro.svg`), la que la marca indica para fondos negros.
- **Jeans negros** rectos (`#2B2C33`, un negro un poco más frío que el del canguro para que se separen) con el dobladillo más claro (`#44454E`).
- **Tenis blancos** con la suela gris clara.
- **Yaeko:** en lugar de los jeans, falda negra con vuelo (mismos negros) y piernas al aire.

## Dónde está

- La ropa compartida: `src/bambinos/ropa.ts` (`canguroTorso`, `mangaBrazo`, `mangaAntebrazo`, `jeansPierna`, `faldaNegra`, `piernaConTenis` y `logoBambinos`). Si se cambia el outfit, se cambia ahí y se actualizan los tres.
- Diego con este outfit: `src/diegoBambino/` (copia de `src/personaje/` con la ropa cambiada; el Diego original con su polera de tokensinfinitos no se tocó).
- Yaeko: `src/yaeko/`. Su outfit anterior (top fucsia y falda negra) queda en `modelo.ts` como `torsoFucsia`, `brazoFucsia`, `antebrazoFucsia` y `piernaFucsia`.
- Aldrin: `src/aldrin/`.

## Imágenes y composiciones

- `equipo.png`: foto del equipo (composición `EquipoCodeBambinos`).
- Diego con este outfit: `personajes/diego-bambino/` (composiciones `DiegoBambinoPoses`, `DiegoBambinoGiro`, `DiegoBambinoEstres` y `PruebaDiegoBambino`).
- Yaeko: `personajes/yaeko/`. Aldrin: `personajes/aldrin/`.

```bash
npx remotion still EquipoCodeBambinos personajes/equipo/equipo.png --gl=angle
```
