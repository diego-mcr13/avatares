import { PruebaPersonajeComposition } from "./PruebaPersonaje";
import { PruebaDiegoBambinoComposition } from "./PruebaDiegoBambino";

// Aquí se registran todas las composiciones. Al crear un personaje nuevo, agrega la suya.
export const RemotionRoot: React.FC = () => {
  return (
    <>
      <PruebaPersonajeComposition />
      <PruebaDiegoBambinoComposition />
    </>
  );
};
