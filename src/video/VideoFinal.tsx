// Video final de BoliviaSabe (contrato §8): cada escena es su composición (V1 … V9) y «BoliviaSabe» las encadena.
import React from "react";
import { Audio } from "@remotion/media";
import { AbsoluteFill, Composition, Sequence, Series, Still, staticFile } from "remotion";
import { Escena3, Escena4, Escena5, Escena6, Escena7, Escena8 } from "./EscenasApp";
import { CORTE, Escena1, Escena2, Escena9, PUENTE } from "./EscenasHistoria";
import { ESCENAS_VIDEO, VOCES, finHabla, type IdEscena } from "./datos";
import { C, FPS, LETRA_TITULO } from "./estilo";

const COMPONENTE: Record<IdEscena, React.FC> = {
  "1": Escena1,
  "2": Escena2,
  "3": Escena3,
  "4": Escena4,
  "5": Escena5,
  "6": Escena6,
  "7": Escena7,
  "8": Escena8,
  "9": Escena9,
};

// Cuándo habla alguien en el video completo (para bajar la música debajo de las voces)
const HABLA: [number, number][] = (() => {
  const out: [number, number][] = [];
  let inicio = 0;
  for (const e of ESCENAS_VIDEO) {
    for (const f of e.frases) {
      // En la escena 9, lo que va después del corte se corre lo que dura el tramo del canje
      const corre = e.id === "9" && f.t >= CORTE ? PUENTE : 0;
      out.push([inicio + f.t + corre, inicio + finHabla(f) + corre]);
    }
    if (e.id === "9") out.push([inicio + CORTE + 0.35, inicio + CORTE + 0.35 + (VOCES["9-5"].hasta - VOCES["9-5"].desde)]);
    inicio += e.dur;
  }
  return out;
})();

// Música de fondo: baja siempre, más baja mientras alguien habla, con subidas y bajadas suaves
const VOL_LIBRE = 0.14;
const VOL_VOZ = 0.06;
const volumenMusica = (frame: number) => {
  const t = frame / FPS;
  // Distancia (en s) a la voz más cercana: 0 si alguien habla
  let d = Infinity;
  for (const [a, b] of HABLA) d = Math.min(d, t < a ? a - t : t > b ? t - b : 0);
  const sube = Math.min(1, Math.max(0, (d - 0.15) / 0.5));
  const v = VOL_VOZ + (VOL_LIBRE - VOL_VOZ) * sube;
  const entra = Math.min(1, t / 1.5);
  const sale = Math.min(1, Math.max(0, (168.5 - t) / 2.5));
  return v * entra * sale;
};

const Completo: React.FC = () => (
  <AbsoluteFill style={{ background: C.fondo }}>
    <Audio src={staticFile("video/musica/fondo.mp3")} volume={volumenMusica} />
    <Series>
      {ESCENAS_VIDEO.map((e) => {
        const Comp = COMPONENTE[e.id];
        return (
          <Series.Sequence key={e.id} durationInFrames={Math.round(e.dur * FPS)}>
            <AbsoluteFill>
              <Comp />
            </AbsoluteFill>
          </Series.Sequence>
        );
      })}
    </Series>
  </AbsoluteFill>
);

// Miniatura de YouTube: el cierre de la escena 1 (logo y los tres avatares) y la frase del lema
const Miniatura: React.FC = () => (
  <AbsoluteFill style={{ background: C.fondo }}>
    <Sequence from={-Math.round(22.2 * FPS)} layout="none">
      <AbsoluteFill>
        <Escena1 />
      </AbsoluteFill>
    </Sequence>
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: 520,
        textAlign: "center",
        fontFamily: LETRA_TITULO,
        fontWeight: 500,
        fontSize: 92,
        color: C.tinta,
        lineHeight: 1.08,
        textShadow: "0 4px 24px rgba(0,0,0,0.6)",
      }}
    >
      Ayudar a tus vecinos <span style={{ color: C.naranja }}>tiene premio</span>
    </div>
  </AbsoluteFill>
);

export const VideoFinalComposition = () => (
  <>
    <Composition id="BoliviaSabe" component={Completo} durationInFrames={Math.round(ESCENAS_VIDEO.reduce((s, e) => s + e.dur, 0) * FPS)} fps={FPS} width={1920} height={1080} />
    {ESCENAS_VIDEO.map((e) => (
      <Composition key={e.id} id={`V${e.id}`} component={COMPONENTE[e.id]} durationInFrames={Math.round(e.dur * FPS)} fps={FPS} width={1920} height={1080} />
    ))}
    <Still id="Miniatura" component={Miniatura} width={1920} height={1080} />
  </>
);
