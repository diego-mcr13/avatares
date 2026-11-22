// Datos del video final (contrato §4 y §5): voces, horas de cada frase y duración de cada escena.
import vocesDatos from "./voces-datos.json";
import type { Quien } from "../elenco/escenas";

const DATOS = vocesDatos as { env: Record<string, number[]>; dur: Record<string, number> };

export type Voz = {
  codigo: string;
  quien: Quien;
  // Dónde empieza y termina el habla dentro del archivo (sin silencios)
  desde: number;
  hasta: number;
  texto: string;
  // Archivo en public/video/ (las voces de la escena 1 vienen en el video de cada uno)
  archivo: string;
};

const v = (codigo: string, quien: Quien, desde: number, hasta: number, texto: string): Voz => ({
  codigo,
  quien,
  desde,
  hasta,
  texto,
  archivo: `video/voces/${codigo}.wav`,
});

export const VOCES: Record<string, Voz> = Object.fromEntries(
  [
    { codigo: "diego", quien: "diego", desde: 0.4, hasta: 4.3, texto: "Hola, soy Diego, el líder técnico, y ahora me verán en mi versión avatar.", archivo: "video/personas/diego.mp4" },
    { codigo: "yaeko", quien: "yaeko", desde: 0.5, hasta: 5.47, texto: "Hola, soy Yaeko, product owner, y también me vuelvo avatar.", archivo: "video/personas/yaeko.mp4" },
    { codigo: "aldrin", quien: "aldrin", desde: 0.0, hasta: 4.95, texto: "Y yo soy Aldrin, desarrollador. ¡Y ahora nos ven así!", archivo: "video/personas/aldrin.mp4" },
    v("1-4", "yaeko", 0.0, 3.42, "Somos CodeBambinos. ¡Esto es BoliviaSabe!"),
    v("2-1", "yaeko", 0.0, 4.92, "En Cochabamba preguntamos todo en grupos: este tiene 209 mil miembros."),
    v("2-2", "diego", 0.29, 6.27, "Pero la pregunta se pierde entre cientos de mensajes, nadie sabe si sigue vigente y a veces tarda."),
    v("2-3", "aldrin", 0.66, 4.8, "Y quien ayuda no gana nada. Por eso muchos callan."),
    v("2-4", "yaeko", 0.0, 6.22, "Le preguntamos a 24 personas: a 14 les molesta justo que la pregunta se pierda."),
    v("3-1", "aldrin", 1.02, 6.86, "Abres boliviasabe.vercel.app y entras directo a Hoy, sin registrarte."),
    v("3-2", "yaeko", 0.0, 5.99, "Letreros con foto, precio, zona y fecha. Buscas «almuerzo» y ahí está."),
    v("4-1", "diego", 0.31, 5.38, "Para participar, creas tu cuenta con Google o con tu correo y eliges tu barrio."),
    v("4-2", "aldrin", 0.95, 5.98, "Y al terminar ya tienes tu cuenta en Stellar y cinco yapitas de bienvenida."),
    v("5-1", "yaeko", 0.0, 4.7, "Ahora preguntamos: ¿quién arregla una tubería hoy en Queru Queru?"),
    v("5-2", "aldrin", 0.84, 6.86, "La marcamos Urgente: cuesta cinco yapitas y sale primero por 24 horas."),
    v("6-1", "diego", 0.37, 5.94, "En otra cuenta, Ana, que vive en Queru Queru, ve el aviso de la urgente y responde."),
    v("6-2", "yaeko", 0.0, 4.61, "Y quien preguntó ve la respuesta aparecer sola, sin recargar."),
    v("7-1", "aldrin", 0.56, 6.37, "Solo quien preguntó puede marcar Me sirvió, y la pregunta queda Solucionada."),
    v("7-2", "diego", 0.0, 2.75, "Y Ana gana cinco yapitas por ayudar."),
    v("8-1", "diego", 0.0, 6.26, "Cada premio es un pago en Stellar. En Movimientos se ve confirmado, y el enlace abre el registro público."),
    v("8-2", "aldrin", 0.59, 5.06, "Ahí está el pago, con su memo: cualquiera puede verificarlo."),
    v("8-3", "yaeko", 0.0, 5.21, "Todo corre en la red de pruebas, sin dinero real. Hoy la app custodia las cuentas."),
    v("9-1", "yaeko", 0.0, 10.42, "Empezamos en Cochabamba, con estudiantes y negocios cerca de las universidades, en Sarco y el Centro: una semana, 30 cuentas y 5 negocios."),
    v("9-2", "diego", 0.0, 5.71, "Los negocios de barrio pagarían Bs 20 al mes por aparecer primero en su zona."),
    v("9-3", "aldrin", 0.49, 9.11, "Pruébala hoy en boliviasabe.vercel.app. Hoy una ciudad, mañana toda Bolivia."),
    v("9-4", "yaeko", 0.0, 9.05, "¿Viste algo útil? Súbelo. ¿Necesitas algo ya? Pregunta. En Bolivia, ayudar a tus vecinos tiene premio."),
  ].map((x) => [x.codigo, x as Voz]),
);

export const durArchivo = (codigo: string) => DATOS.dur[codigo] ?? 0;
export const envDe = (codigo: string) => DATOS.env[codigo] ?? [];

// Una frase colocada en una escena: `t` = hora (en la escena) en que empieza el habla
export type Frase = { codigo: string; t: number };

// Hora en que empieza a sonar el archivo para que el habla caiga en `t`
export const inicioArchivo = (f: Frase) => f.t - VOCES[f.codigo].desde;
export const finHabla = (f: Frase) => f.t + (VOCES[f.codigo].hasta - VOCES[f.codigo].desde);

// ---------- Escenas: duración y frases (contrato §5) ----------

export type IdEscena = "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9";

export const ESCENAS_VIDEO: { id: IdEscena; titulo: string; dur: number; frases: Frase[] }[] = [
  {
    id: "1",
    titulo: "Somos CodeBambinos",
    dur: 22.5,
    frases: [
      { codigo: "diego", t: 0.15 },
      { codigo: "yaeko", t: 4.4 },
      { codigo: "aldrin", t: 9.8 },
      { codigo: "1-4", t: 18.4 },
    ],
  },
  {
    id: "2",
    titulo: "El problema",
    dur: 23,
    frases: [
      { codigo: "2-1", t: 0.3 },
      { codigo: "2-2", t: 5.6 },
      { codigo: "2-3", t: 11.9 },
      { codigo: "2-4", t: 16.4 },
    ],
  },
  {
    id: "3",
    titulo: "Sin cuenta",
    dur: 13,
    frases: [
      { codigo: "3-1", t: 0.2 },
      { codigo: "3-2", t: 6.4 },
    ],
  },
  {
    id: "4",
    titulo: "Crear la cuenta",
    dur: 15,
    frases: [
      { codigo: "4-1", t: 0.2 },
      { codigo: "4-2", t: 7.3 },
    ],
  },
  {
    id: "5",
    titulo: "Preguntar urgente",
    dur: 14,
    frases: [
      { codigo: "5-1", t: 0.2 },
      { codigo: "5-2", t: 5.4 },
    ],
  },
  {
    id: "6",
    titulo: "Otra cuenta responde",
    dur: 13,
    frases: [
      { codigo: "6-1", t: 0.2 },
      { codigo: "6-2", t: 6.6 },
    ],
  },
  {
    id: "7",
    titulo: "Me sirvió",
    dur: 10,
    frases: [
      { codigo: "7-1", t: 0.2 },
      { codigo: "7-2", t: 6.6 },
    ],
  },
  {
    id: "8",
    titulo: "El pago en Stellar",
    dur: 18,
    frases: [
      { codigo: "8-1", t: 0.2 },
      { codigo: "8-2", t: 6.8 },
      { codigo: "8-3", t: 11.9 },
    ],
  },
  {
    id: "9",
    titulo: "Plan y cierre",
    dur: 37,
    frases: [
      { codigo: "9-1", t: 0.3 },
      { codigo: "9-2", t: 11.1 },
      { codigo: "9-3", t: 17.2 },
      { codigo: "9-4", t: 26.2 },
    ],
  },
];

export const escenaVideo = (id: IdEscena) => ESCENAS_VIDEO.find((e) => e.id === id)!;
export const DURACION_TOTAL = ESCENAS_VIDEO.reduce((s, e) => s + e.dur, 0);
