// Volumen de la voz real de cada persona, por escena, para que la boca del avatar siga su grabación.
//
// Mientras no haya archivo, el avatar mueve la boca solo cuando le toca hablar (con un volumen inventado).
// Para usar tu voz:
//   1. Graba la escena de esa persona y déjala en `public/voz/escena5-yaeko.wav`. Debe durar lo mismo que la escena
//      (con silencio cuando no habla; en el editor se exporta una pista por persona).
//   2. python scripts/envolvente.py public/voz/escena5-yaeko.wav src/data/voz/escena5-yaeko.json 30
//   3. Impórtalo aquí abajo y agrégalo a VOCES con la clave `<escena>-<quien>`: "5-yaeko".
//
// import escena5Yaeko from "../data/voz/escena5-yaeko.json";
// export const VOCES: Record<string, number[]> = { "5-yaeko": escena5Yaeko as number[] };

export const VOCES: Record<string, number[]> = {};
