"""Agrega a Yaeko, Aldrin y Diego (outfit CodeBambinos) las poses del video: caminar, correr,
señalar a los lados, tocar, deslizar, aplaudir y esperar. Se corre una sola vez: si la pose ya
existe, no hace nada."""
import sys
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
ARCHIVOS = ["src/yaeko/poses.ts", "src/aldrin/poses.ts", "src/diegoBambino/poses.ts"]

NOMBRES = """  | "ansioso"
  | "caminar"
  | "correr"
  | "senalarIzq"
  | "senalarArriba"
  | "senalarAbajo"
  | "tocar"
  | "deslizar"
  | "aplaudir"
  | "esperar";"""

POSES = """  // ---------- Poses del video (el avatar camina por la pantalla y señala la app) ----------
  // Paso al caminar: las piernas y los brazos se mueven solos (ver la capa "caminata" en estadoEn)
  caminar: {
    pose: { ...BASE, torso: [0.05, 0, 0] },
    expr: EXPR_BASE,
    etiqueta: "Caminar",
  },
  correr: {
    pose: {
      ...BASE,
      torso: [0.22, 0, 0],
      cabeza: [-0.1, 0, 0],
      brazoIzq: [0, 0, -0.2],
      antebrazoIzq: [-1.5, 0, 0],
      brazoDer: [0, 0, 0.2],
      antebrazoDer: [-1.5, 0, 0],
    },
    expr: { ...EXPR_BASE, ojos: "feliz", cejas: ["arriba", "arriba"], reposo: "sonrisaAbierta", feliz: true },
    etiqueta: "Correr",
  },
  // Señalar hacia la izquierda de la pantalla (el espejo de "senalar"): para cuando está a la derecha del celular
  senalarIzq: {
    pose: {
      ...BASE,
      torso: [0, -0.25, 0],
      cabeza: [0.04, -0.25, 0],
      brazoIzq: [-0.25, 0, -1.45],
      antebrazoIzq: [0, 0, -0.1],
      brazoDer: [0, 0, 0.2],
    },
    expr: { ...EXPR_BASE, cejas: ["normal", "arriba"] },
    etiqueta: "Señalar a la izquierda",
  },
  // Brazo estirado hacia arriba: la franja de aguayo, la barra de direcciones, el título
  senalarArriba: {
    pose: {
      ...BASE,
      cabeza: [-0.22, 0, 0.05],
      brazoIzq: [0, 0, -0.2],
      brazoDer: [0, 0, 2.7],
      antebrazoDer: [0, 0, 0.1],
    },
    expr: { ...EXPR_BASE, cejas: ["arriba", "arriba"] },
    etiqueta: "Señalar arriba",
  },
  // Brazo hacia abajo y afuera: el menú de abajo, el botón Publicar
  senalarAbajo: {
    pose: {
      ...BASE,
      torso: [0.1, 0.2, 0],
      cabeza: [0.2, 0.2, 0],
      brazoIzq: [0, 0, -0.2],
      brazoDer: [-0.2, 0, 0.75],
      antebrazoDer: [0, 0, 0.1],
    },
    expr: { ...EXPR_BASE, cejas: ["arriba", "normal"] },
    etiqueta: "Señalar abajo",
  },
  // Tocar la pantalla con el dedo: el antebrazo da toquecitos
  tocar: {
    pose: {
      ...BASE,
      torso: [0.06, 0.12, 0],
      cabeza: [0.06, 0.12, 0],
      brazoIzq: [0, 0, -0.2],
      brazoDer: [-1.15, 0, 0.2],
      antebrazoDer: [-0.55, 0, -0.1],
    },
    expr: { ...EXPR_BASE, cejas: ["arriba", "normal"] },
    etiqueta: "Tocar",
  },
  // Tirar hacia abajo para actualizar: el brazo baja una y otra vez
  deslizar: {
    pose: {
      ...BASE,
      torso: [0.05, 0.1, 0],
      brazoIzq: [0, 0, -0.2],
      brazoDer: [-1.0, 0, 0.2],
      antebrazoDer: [-0.35, 0, -0.1],
    },
    expr: EXPR_BASE,
    etiqueta: "Deslizar",
  },
  aplaudir: {
    pose: {
      ...BASE,
      brazoIzq: [-0.5, 0, -0.4],
      antebrazoIzq: [-1.5, 0, 0.5],
      brazoDer: [-0.5, 0, 0.4],
      antebrazoDer: [-1.5, 0, -0.5],
    },
    expr: { ...EXPR_BASE, ojos: "feliz", cejas: ["arriba", "arriba"], reposo: "sonrisaAbierta", feliz: true },
    etiqueta: "Aplaudir",
  },
  // Esperar su turno en la esquina: manos juntas adelante, atento
  esperar: {
    pose: {
      ...BASE,
      cabeza: [0, 0, 0.06],
      brazoIzq: [-0.3, 0, -0.1],
      antebrazoIzq: [-0.9, 0, 0.5],
      brazoDer: [-0.3, 0, 0.1],
      antebrazoDer: [-0.9, 0, -0.5],
    },
    expr: { ...EXPR_BASE, cejas: ["arriba", "normal"], reposo: "sonrisa" },
    etiqueta: "Esperar",
  },
};

const lerp ="""

OPCIONES_VIEJA = """  movimientos?: Movimiento[];
  giro?: number;
};"""
OPCIONES_NUEVA = """  movimientos?: Movimiento[];
  giro?: number;
  // Caminata por la pantalla: la fase sale de la distancia recorrida (el pie no patina)
  caminata?: Caminata;
};

// Se usa en el video: el avatar se mueve por la pantalla y camina o corre mientras avanza.
// fase = distancia recorrida / largo del paso; w = 0..1 cuánto camina; dir = hacia dónde mira (-1 izquierda, 1 derecha)
export type Caminata = { fase: number; w: number; dir: -1 | 1; correr?: boolean };"""

FIRMA_VIEJA = "export const estadoEn = ({ frame, fps, claves, volumen, movimientos = [], giro = 0 }: Opciones): Estado => {"
FIRMA_NUEVA = "export const estadoEn = ({ frame, fps, claves, volumen, movimientos = [], giro = 0, caminata }: Opciones): Estado => {"

CAPAS_ANCLA = "  // ---------- Entradas y salidas ----------\n  let x = 0;"
CAPAS_NUEVAS = """  // Aplaudir: las manos se juntan y se separan
  const palmada = (Math.sin(T * 2 * Math.PI * 3.4) + 1) / 2;
  pose.antebrazoIzq = sumar(pose.antebrazoIzq, [0, 0, -0.5 * palmada * peso("aplaudir")]);
  pose.antebrazoDer = sumar(pose.antebrazoDer, [0, 0, 0.5 * palmada * peso("aplaudir")]);
  pose.altura += Math.abs(Math.sin(T * 2 * Math.PI * 1.7)) * 0.35 * peso("aplaudir");
  // Tocar: toquecitos con el dedo
  pose.antebrazoDer = sumar(pose.antebrazoDer, [Math.max(0, Math.sin(T * 2 * Math.PI * 2.4)) * 0.28 * peso("tocar"), 0, 0]);
  // Deslizar: el brazo baja de golpe, vuelve a subir y repite
  const bajada = (T * 1.1) % 1;
  const diente = bajada < 0.7 ? bajada / 0.7 : (1 - bajada) / 0.3;
  pose.brazoDer = sumar(pose.brazoDer, [diente * 0.6 * peso("deslizar"), 0, 0]);
  // Señalar: el dedo da un golpecito hacia donde apunta
  const picoteo = Math.max(0, Math.sin(T * 2 * Math.PI * 1.5)) * 0.12;
  pose.brazoDer = sumar(pose.brazoDer, [0, 0, picoteo * (peso("senalar") + peso("senalarAbajo") + peso("senalarArriba") * 0.5)]);
  pose.brazoIzq = sumar(pose.brazoIzq, [0, 0, -picoteo * peso("senalarIzq")]);

  // Caminar y correr: si no viene una caminata del video, la pose las anima sola (para el Studio)
  const cam: Caminata | null =
    caminata ??
    (peso("caminar") + peso("correr") > 0.01
      ? { fase: T * 2.2, w: Math.min(1, peso("caminar") + peso("correr")), dir: 1, correr: peso("correr") > 0.5 }
      : null);
  let giroCamina = 0;
  if (cam && cam.w > 0.001) {
    const k = cam.correr ? 1.5 : 1;
    const swing = Math.sin(cam.fase * Math.PI);
    pose.piernaIzq = sumar(pose.piernaIzq, [swing * 0.55 * k * cam.w, 0, 0]);
    pose.piernaDer = sumar(pose.piernaDer, [-swing * 0.55 * k * cam.w, 0, 0]);
    pose.brazoIzq = sumar(pose.brazoIzq, [-swing * 0.45 * k * cam.w, 0, 0]);
    pose.brazoDer = sumar(pose.brazoDer, [swing * 0.45 * k * cam.w, 0, 0]);
    pose.altura += Math.abs(Math.cos(cam.fase * Math.PI)) * 0.45 * k * cam.w;
    giroCamina = cam.dir * 0.9 * cam.w;
    pose.torso = sumar(pose.torso, [0.05 * cam.w, 0, -cam.dir * 0.06 * cam.w]);
  }

  // ---------- Entradas y salidas ----------
  let x = 0;"""

GIRAR_VIEJO = "  let girar = giro;"
GIRAR_NUEVO = "  let girar = giro + giroCamina;"

FIJO_VIEJO = "export const estadoFijo = (nombre: PoseNombre, giro = 0): Estado => {\n  const { pose, expr } = POSES[nombre];"
FIJO_NUEVO = """export const estadoFijo = (nombre: PoseNombre, giro = 0): Estado => {
  const { expr } = POSES[nombre];
  // Caminar y correr se ven a medio paso en la hoja de poses
  const pose: Pose = { ...POSES[nombre].pose };
  if (nombre === "caminar" || nombre === "correr") {
    const k = nombre === "correr" ? 1.5 : 1;
    pose.piernaIzq = [0.5 * k, 0, 0];
    pose.piernaDer = [-0.5 * k, 0, 0];
    pose.brazoIzq = [pose.brazoIzq[0] - 0.4 * k, pose.brazoIzq[1], pose.brazoIzq[2]];
    pose.brazoDer = [pose.brazoDer[0] + 0.4 * k, pose.brazoDer[1], pose.brazoDer[2]];
    pose.altura += 0.3;
    giro = giro || 0.9;
  }"""


def reemplazar(texto, viejo, nuevo, ruta):
    if texto.count(viejo) != 1:
        sys.exit(f"{ruta}: no encuentro (o hay más de uno): {viejo[:60]!r}")
    return texto.replace(viejo, nuevo)


for ruta in ARCHIVOS:
    p = RAIZ / ruta
    t = p.read_text(encoding="utf-8")
    if '"caminar"' in t:
        print(f"{ruta}: ya tiene las poses nuevas")
        continue
    t = reemplazar(t, '  | "ansioso";', NOMBRES, ruta)
    t = reemplazar(t, "};\n\nconst lerp =", POSES, ruta)
    t = reemplazar(t, OPCIONES_VIEJA, OPCIONES_NUEVA, ruta)
    t = reemplazar(t, FIRMA_VIEJA, FIRMA_NUEVA, ruta)
    t = reemplazar(t, CAPAS_ANCLA, CAPAS_NUEVAS, ruta)
    t = reemplazar(t, GIRAR_VIEJO, GIRAR_NUEVO, ruta)
    t = reemplazar(t, FIJO_VIEJO, FIJO_NUEVO, ruta)
    p.write_text(t, encoding="utf-8")
    print(f"{ruta}: poses agregadas")
