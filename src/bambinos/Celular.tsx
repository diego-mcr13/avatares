// Celular en la mano (video final): aparece con el gesto de la laptop, inclinado hacia la cara del personaje.
// La pantalla brilla (no recibe sombras) para que se lea como un celular encendido.
import React from "react";

export const Celular: React.FC<{ tam: number; position: [number, number, number] }> = ({ tam, position }) => (
  <group position={position} scale={tam} visible={tam > 0.01} rotation={[-0.75, 0, 0]}>
    {/* Cuerpo */}
    <mesh castShadow>
      <boxGeometry args={[4.2, 7.4, 0.7]} />
      <meshStandardMaterial color="#1B1A1E" roughness={0.6} />
    </mesh>
    {/* Pantalla encendida, con la franja de aguayo arriba y un botón fucsia abajo */}
    <mesh position={[0, 0, 0.36]}>
      <planeGeometry args={[3.6, 6.6]} />
      <meshBasicMaterial color="#2a2421" />
    </mesh>
    {["#C2185B", "#F28C28", "#2E9E5B", "#1E5AA8", "#F2C230"].map((c, i) => (
      <mesh key={c} position={[-1.44 + i * 0.72, 3.15, 0.37]}>
        <planeGeometry args={[0.72, 0.18]} />
        <meshBasicMaterial color={c} />
      </mesh>
    ))}
    <mesh position={[0, 1.4, 0.37]}>
      <planeGeometry args={[3.0, 1.4]} />
      <meshBasicMaterial color="#3a1a27" />
    </mesh>
    <mesh position={[0, -0.6, 0.37]}>
      <planeGeometry args={[3.0, 1.6]} />
      <meshBasicMaterial color="#3a322d" />
    </mesh>
    <mesh position={[0, -2.5, 0.37]}>
      <planeGeometry args={[2.4, 0.7]} />
      <meshBasicMaterial color="#C2185B" />
    </mesh>
  </group>
);
