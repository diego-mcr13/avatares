import { EquipoComposition } from "./Equipo";
import { ElencoComposition } from "./elenco/Elenco";
import { VideoFinalComposition } from "./video/VideoFinal";
import { EjemploComposition } from "./ejemplo/Ejemplo";
import { PoseAvatarComposition } from "./ejemplo/PoseAvatar";
import { HojaVideoComposition } from "./elenco/HojaVideo";
import { PruebaAldrinComposition } from "./PruebaAldrin";
import { PruebaDiegoBambinoComposition } from "./PruebaDiegoBambino";
import { PruebaPersonajeComposition } from "./PruebaPersonaje";
import { PruebaYaekoComposition } from "./PruebaYaeko";

// Aquí se registran todas las composiciones. Al crear un personaje nuevo, agrega la suya.
export const RemotionRoot: React.FC = () => {
  return (
    <>
      <PruebaPersonajeComposition />
      <PruebaYaekoComposition />
      <PruebaDiegoBambinoComposition />
      <PruebaAldrinComposition />
      <EquipoComposition />
      <ElencoComposition />
      <VideoFinalComposition />
      <HojaVideoComposition />
      <EjemploComposition />
      <PoseAvatarComposition />
    </>
  );
};
