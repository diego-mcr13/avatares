import { PruebaPersonajeComposition } from "./PruebaPersonaje";
import { PruebaAldrinComposition } from "./PruebaAldrin";

// Aquí se registran todas las composiciones. Al crear un personaje nuevo, agrega la suya.
export const RemotionRoot: React.FC = () => {
  return (
    <>
      <PruebaPersonajeComposition />
      <PruebaAldrinComposition />
    </>
  );
};
