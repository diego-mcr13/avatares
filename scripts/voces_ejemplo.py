"""Voces de ejemplo para el video: lee las frases de src/elenco/escenas.ts, las lee con la voz sintética
de Windows (una voz distinta de tono para cada persona), y guarda:

  public/ejemplo/voz/<escena>-<n>.wav      el audio de cada frase
  src/data/voz_ejemplo.json                duración y volumen por fotograma de cada frase (mueve la boca)

Uso (desde la raíz del repo):
    python -I -X utf8 scripts/voces_ejemplo.py             # voces de ejemplo (voz de Windows)
    python -I -X utf8 scripts/voces_ejemplo.py --reales    # sus grabaciones: public/voz/<escena>-<n>.wav (mismo nombre)

Se vuelve a correr cada vez que se cambia el texto de una frase en escenas.ts.
Las voces reales de ustedes reemplazan a estas (ver src/elenco/voces.ts).
"""
import array
import json
import math
import re
import subprocess
import sys
import wave
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
FPS = 30
# Tono y velocidad de cada persona (es la misma voz de Windows, cambiada de tono, solo para el ejemplo)
VOCES = {
    "diego": ("-28%", "+2%"),
    "yaeko": ("+4%", "+4%"),
    "aldrin": ("-12%", "+8%"),
    "todos": ("-4%", "+2%"),
}


def frases():
    codigo = (RAIZ / "src/elenco/escenas.ts").read_text(encoding="utf-8")
    partes = re.split(r"const escena(\d)\s*=\s*\(\)\s*=>\s*\{", codigo)
    resultado = []
    for i in range(1, len(partes), 2):
        escena = partes[i]
        cuerpo = partes[i + 1].split("\n};\n")[0]
        n = 0
        for quien, texto in re.findall(r'\["(diego|yaeko|aldrin|todos)",\s*"((?:[^"\\]|\\.)*)"\]', cuerpo):
            resultado.append((f"{escena}-{n}", quien, texto.replace("**", "").replace('\\"', '"')))
            n += 1
    return resultado


def envolvente(ruta):
    with wave.open(str(ruta), "rb") as w:
        ritmo, canales, ancho = w.getframerate(), w.getnchannels(), w.getsampwidth()
        datos = w.readframes(w.getnframes())
    if ancho != 2:
        sys.exit(f"{ruta}: se esperaba audio de 16 bits")
    muestras = array.array("h", datos)
    if canales > 1:
        muestras = muestras[::canales]
    por_cuadro = ritmo // FPS
    valores = []
    for i in range(0, len(muestras), por_cuadro):
        bloque = muestras[i : i + por_cuadro]
        if not bloque:
            break
        rms = math.sqrt(sum(m * m for m in bloque) / len(bloque)) / 32768
        valores.append(rms)
    pico = max(valores) or 1
    # Normaliza a 0..1 con un poco de suavizado y piso de ruido
    suave = []
    previo = 0.0
    for v in valores:
        x = min(1.0, (v / pico) ** 0.8)
        x = 0 if x < 0.06 else x
        previo = max(x, previo * 0.55)
        suave.append(round(previo, 3))
    duracion = len(muestras) / ritmo
    return duracion, suave


def main():
    lista = frases()
    reales = "--reales" in sys.argv
    salida = RAIZ / ("public/voz" if reales else "public/ejemplo/voz")
    salida.mkdir(parents=True, exist_ok=True)
    if reales:
        faltan = [c for c, _, _ in lista if not (salida / f"{c}.wav").exists()]
        if faltan:
            sys.exit(f"Faltan grabaciones en {salida}: " + ", ".join(f"{c}.wav" for c in faltan))
    else:
        pedidos = []
        for clave, quien, texto in lista:
            pitch, rate = VOCES[quien]
            pedidos.append({"salida": str(salida / f"{clave}.wav"), "texto": texto, "pitch": pitch, "rate": rate})
        temporal = RAIZ / "out" / "voces_ejemplo.json"
        temporal.parent.mkdir(exist_ok=True)
        temporal.write_text(json.dumps(pedidos, ensure_ascii=False), encoding="utf-8")
        subprocess.run(
            ["powershell", "-NoProfile", "-ExecutionPolicy", "Bypass", "-File", str(RAIZ / "scripts/tts.ps1"), str(temporal)],
            check=True,
        )
    datos = {}
    for clave, quien, texto in lista:
        dur, env = envolvente(salida / f"{clave}.wav")
        datos[clave] = {"quien": quien, "dur": round(dur, 2), "env": env}
        print(f"{clave:5} {quien:7} {dur:5.1f} s  {texto[:60]}")
    (RAIZ / "src/data/voz_ejemplo.json").write_text(json.dumps(datos), encoding="utf-8")
    print(f"\n{len(datos)} frases, {sum(d['dur'] for d in datos.values()):.0f} s de voz")


if __name__ == "__main__":
    main()
