import { EquipoComposition } from "./Equipo";
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
    </>
  );
};
