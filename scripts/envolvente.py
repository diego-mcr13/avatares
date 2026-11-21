"""Calcula la envolvente de volumen de la voz: un valor entre 0 y 1 por fotograma.

El personaje de la composición usa estos valores para abrir la boca al hablar.

Uso (desde la raíz del repo, con el entorno virtual activado):
    python scripts/envolvente.py <voz.wav> <salida.json> [fps]
"""

import json
import math
import subprocess
import sys

import numpy as np

SAMPLE_RATE = 16000


def load_audio(path: str) -> np.ndarray:
    result = subprocess.run(
        ["ffmpeg", "-v", "error", "-i", path, "-f", "f32le", "-ac", "1", "-ar", str(SAMPLE_RATE), "-"],
        check=True,
        capture_output=True,
    )
    return np.frombuffer(result.stdout, dtype=np.float32)


def main() -> None:
    if len(sys.argv) < 3:
        print(__doc__)
        sys.exit(1)

    voz, salida = sys.argv[1], sys.argv[2]
    fps = float(sys.argv[3]) if len(sys.argv) > 3 else 30.0

    audio = load_audio(voz)
    paso = int(SAMPLE_RATE / fps)
    n = math.ceil(len(audio) / paso)

    valores = []
    suavizado = 0.0
    for i in range(n):
        bloque = audio[i * paso : (i + 1) * paso]
        rms = float(np.sqrt(np.mean(bloque**2))) if len(bloque) else 0.0
        db = 20 * math.log10(rms + 1e-9)
        amp = min(1.0, max(0.0, (db + 40) / 30))  # -40 dB -> 0, -10 dB -> 1
        # Subida rápida y bajada suave: la boca responde a cada sílaba sin temblar
        factor = 0.7 if amp > suavizado else 0.3
        suavizado += (amp - suavizado) * factor
        valores.append(round(suavizado, 3))

    with open(salida, "w", encoding="utf-8") as f:
        json.dump(valores, f)
    print(f"{len(valores)} fotogramas a {fps} fps")


if __name__ == "__main__":
    main()
