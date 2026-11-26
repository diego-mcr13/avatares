# BoliviaSabe · Demo Day (27 nov 2026)

Los tres avatares de CodeBambinos con la **polera negra del evento**: logo horizontal de BoliviaSabe y franja de aguayo, como en la ficha del estampador.

- `equipo-demoday.png`: foto del equipo (Diego, Yaeko y Aldrin).
- `poses/`: cada avatar en seis poses (`saludar`, `celebrar`, `triunfo`, `pensar`, `hablar`, `senalar`), PNG de 800 × 1000 con fondo transparente.

## Cómo se generaron

```bash
npx remotion still EquipoCodeBambinos out/equipo-demoday.png --gl=angle
node scripts/exportar-poses.mjs diego yaeko aldrin saludar celebrar triunfo pensar hablar senalar
```

La polera sale de `estampadoFrente()` en `src/bambinos/ropa.ts` (cuadrícula de 120 × 31 puntos sacada de `frente-talla-L.png`).
`DEMODAY` en ese archivo elige el outfit: `true` = polera del evento; `false` = el del video final (Diego polera verde, Aldrin canguro café, Yaeko polera negra con el logo chico).
