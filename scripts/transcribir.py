"""Transcribe a voice track with faster-whisper and save word-level timestamps.

El audio se decodifica con el ffmpeg de Homebrew (no con PyAV), porque la
versión de PyAV instalada no es compatible con faster-whisper 1.2.1.

Uso (desde la raíz del repo, con el entorno virtual activado):
    python scripts/transcribir.py <audio> <salida.json> [modelo]

Ejemplo:
    python scripts/transcribir.py public/voz.wav src/data/palabras.json small
"""

import json
import subprocess
import sys

import numpy as np
from faster_whisper import WhisperModel

SAMPLE_RATE = 16000

# Vocabulario que Whisper debe escribir igual que en pantalla.
INITIAL_PROMPT = "Nombres propios y términos que Whisper suele equivocar, por ejemplo: Claude, Remotion."


def load_audio(path: str) -> np.ndarray:
    """Decodifica el audio a mono, 16 kHz, float32, usando ffmpeg."""
    result = subprocess.run(
        [
            "ffmpeg",
            "-v",
            "error",
            "-i",
            path,
            "-f",
            "f32le",
            "-ac",
            "1",
            "-ar",
            str(SAMPLE_RATE),
            "-",
        ],
        check=True,
        capture_output=True,
    )
    return np.frombuffer(result.stdout, dtype=np.float32)


def main() -> None:
    if len(sys.argv) < 3:
        print(__doc__)
        sys.exit(1)

    audio_path = sys.argv[1]
    out_path = sys.argv[2]
    model_size = sys.argv[3] if len(sys.argv) > 3 else "small"
    # Cuarto argumento opcional "sin_vad": no filtra voz suave (útil si Whisper omite frases bajas)
    usar_vad = not (len(sys.argv) > 4 and sys.argv[4] == "sin_vad")

    audio = load_audio(audio_path)
    model = WhisperModel(model_size, device="cpu", compute_type="int8")
    segments, info = model.transcribe(
        audio,
        language="es",
        word_timestamps=True,
        vad_filter=usar_vad,
        initial_prompt=INITIAL_PROMPT,
    )

    words = []
    for segment in segments:
        for word in segment.words or []:
            words.append(
                {
                    "start": round(word.start, 3),
                    "end": round(word.end, 3),
                    "word": word.word.strip(),
                }
            )

    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(
            {
                "language": info.language,
                "duration": round(info.duration, 3),
                "model": model_size,
                "words": words,
            },
            f,
            ensure_ascii=False,
            indent=1,
        )

    print(f"{len(words)} palabras, idioma {info.language}, duración {info.duration:.2f} s")


if __name__ == "__main__":
    main()
