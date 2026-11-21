# Avatares

Personajes voxel 3D animados con Remotion (React + three.js). Diego (`src/personaje/`) es el ejemplo; los personajes nuevos siguen su misma estructura. Lee el `README.md` para el detalle.

## Comandos

- `npm run dev`: Remotion Studio.
- `npx remotion still <IdComposicion> out/x.png --gl=angle` / `npx remotion render <Id> out/x.mp4 --gl=angle`: exportar (siempre `--gl=angle`).
- `npm run lint`: eslint + tsc. Ejecútalo antes de dar algo por terminado.
- Python (audios): `source .venv/bin/activate`; scripts en `scripts/`.

## Convenciones

- Idioma: español en código (nombres de poses, comentarios), fichas y README.
- Un personaje = `src/<nombre>/` (modelo, poses, componente) + `personajes/<nombre>/ficha.md` y bocetos. No modificar `src/personaje/` (Diego) al crear otro personaje: copiarlo.
- Unidades: 1 = un voxel. Izquierda/derecha = lado de la pantalla.
- Cámara con `near: 10` (no 0 ni 1) o los rasgos de la cara parpadean al girar la cabeza.
- Cada `<Composition>` necesita un `id` único y se registra en `src/Root.tsx`.
- Las skills de Remotion están en `.claude/skills/`; úsalas para dudas de la API de Remotion.
- Los renders van a `out/` (ignorado por git). Solo se versionan los bocetos y videos de prueba en `personajes/<nombre>/`.
