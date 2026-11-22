// Video final de BoliviaSabe (contrato §8): cada escena es su composición (V1 … V9) y «BoliviaSabe» las encadena.
import React from "react";
import { AbsoluteFill, Composition, Sequence, Series, Still } from "remotion";
import { Escena3, Escena4, Escena5, Escena6, Escena7, Escena8 } from "./EscenasApp";
import { Escena1, Escena2, Escena9 } from "./EscenasHistoria";
import { ESCENAS_VIDEO, type IdEscena } from "./datos";
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

const Completo: React.FC = () => (
  <AbsoluteFill style={{ background: C.fondo }}>
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
    <Sequence from={-Math.round(20.6 * FPS)} layout="none">
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
