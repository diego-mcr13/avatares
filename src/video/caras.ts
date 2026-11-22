// Las 6 expresiones del contrato (§5b). Reemplazan ojos, cejas y boca en reposo de la pose; la boca sigue la voz igual.
import type { Expresion } from "../aldrin/poses";

export const CARA = {
  atento: { ojos: "normal", cejas: ["normal", "normal"], reposo: "sonrisa", feliz: false },
  feliz: { ojos: "feliz", cejas: ["arriba", "arriba"], reposo: "sonrisaAbierta", feliz: true },
  sorpresa: { ojos: "normal", cejas: ["arriba", "arriba"], reposo: "O", feliz: false },
  preocupado: { ojos: "chicos", cejas: ["triste", "triste"], reposo: "apretada", feliz: false },
  orgullo: { ojos: "feliz", cejas: ["normal", "normal"], reposo: "sonrisa", feliz: true },
  pensativo: { ojos: "normal", cejas: ["arriba", "normal"], reposo: "cerrada", feliz: false },
  // Tirado en el piso después de caer
  mareado: { ojos: "cerrados", cejas: ["triste", "triste"], reposo: "O", feliz: false },
} satisfies Record<string, Partial<Expresion>>;
