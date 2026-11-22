import { loadFont as cargarBricolage } from "@remotion/google-fonts/BricolageGrotesque";
import { loadFont as cargarFigtree } from "@remotion/google-fonts/Figtree";
import { createContext, useContext } from "react";
import { interpolate } from "remotion";

// Piezas de pantalla que imitan la app real de BoliviaSabe (dirección «Letrero»: oscuro por defecto,
// Bricolage Grotesque + Figtree, líneas finas, un solo botón fucsia por pantalla, franja de aguayo arriba).
// Se dibujan en el marco de diseño de 360 × 800 px. Son SOLO para el ejemplo: en el video van las grabaciones reales.

export const TITULO = cargarBricolage("normal", { weights: ["500", "700"] }).fontFamily;
export const TEXTO = cargarFigtree("normal", { weights: ["400", "600", "700"] }).fontFamily;

export type Paleta = typeof OSCURO;
export const OSCURO = {
  nombre: "oscuro",
  fondo: "#151110",
  superficie: "#1F1A18",
  linea: "#332B27",
  texto: "#F5F2EF",
  suave: "#A89B93",
  fucsia: "#C2185B",
  rosado: "#F8A8C6",
  naranja: "#F28C28",
  verde: "#2E9E5B",
  azul: "#1E5AA8",
  azulTexto: "#8DB8F0",
  amarillo: "#F2C230",
  coral: "#E4572E",
};
export const CLARO: Paleta = {
  ...OSCURO,
  nombre: "claro",
  fondo: "#F5F2EF",
  superficie: "#FFFFFF",
  linea: "#E2DBD5",
  texto: "#1F1A18",
  suave: "#6F635B",
  rosado: "#9C1449",
  azulTexto: "#1E5AA8",
};
export const AGUAYO = ["#C2185B", "#F28C28", "#2E9E5B", "#1E5AA8", "#F2C230"];

export const TemaCtx = createContext<Paleta>(OSCURO);
export const useTema = () => useContext(TemaCtx);

// Escribe un texto letra por letra desde t0
export const escribir = (texto: string, T: number, t0: number, letrasPorSeg = 16) =>
  texto.slice(0, Math.max(0, Math.min(texto.length, Math.floor((T - t0) * letrasPorSeg))));

export const aparece = (T: number, t0: number, dur = 0.35) => interpolate(T, [t0, t0 + dur], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

// ---------- Estructura ----------

export const Pantalla: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const p = useTema();
  return (
    <div style={{ position: "relative", width: 360, height: 800, background: p.fondo, color: p.texto, fontFamily: TEXTO, overflow: "hidden" }}>
      {children}
    </div>
  );
};

export const Franja: React.FC = () => (
  <div style={{ display: "flex", height: 3 }}>
    {AGUAYO.map((c) => (
      <div key={c} style={{ flex: 1, background: c }} />
    ))}
  </div>
);

export const Estrella: React.FC<{ color?: string; tam?: number }> = ({ color, tam = 14 }) => {
  const p = useTema();
  return (
    <svg width={tam} height={tam} viewBox="0 0 24 24" fill={color ?? p.naranja}>
      <path d="M12 2l2.9 6.6 7.1.7-5.3 4.8 1.5 7-6.2-3.6-6.2 3.6 1.5-7L2 9.3l7.1-.7z" />
    </svg>
  );
};

export const Cabecera: React.FC<{ yapitas: number; destello?: number }> = ({ yapitas, destello = 0 }) => {
  const p = useTema();
  return (
    <div>
      <div style={{ height: 52, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 16px" }}>
        <div style={{ fontFamily: TITULO, fontWeight: 700, fontSize: 21, letterSpacing: -0.5 }}>
          Bolivia<span style={{ color: p.fucsia }}>Sabe</span>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 5,
            background: `rgba(242,140,40,${0.16 + destello * 0.5})`,
            color: p.naranja,
            fontWeight: 700,
            fontSize: 15,
            padding: "4px 11px",
            borderRadius: 999,
            transform: `scale(${1 + destello * 0.18})`,
          }}
        >
          <Estrella /> {yapitas}
        </div>
      </div>
      <Franja />
    </div>
  );
};

export type Pestana = "hoy" | "alguien" | "yo";
export const Nav: React.FC<{ activa: Pestana }> = ({ activa }) => {
  const p = useTema();
  const items: [Pestana, string][] = [
    ["hoy", "Hoy"],
    ["alguien", "¿Alguien sabe?"],
    ["yo", "Yo"],
  ];
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        height: 62,
        background: p.fondo,
        borderTop: `1px solid ${p.linea}`,
        display: "flex",
      }}
    >
      {items.map(([id, nombre]) => (
        <div
          key={id}
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 5,
            fontSize: 13,
            fontWeight: activa === id ? 700 : 600,
            color: activa === id ? p.texto : p.suave,
          }}
        >
          <div style={{ width: 22, height: 4, borderRadius: 4, background: activa === id ? p.fucsia : "transparent" }} />
          {nombre}
        </div>
      ))}
    </div>
  );
};

// ---------- Elementos ----------

export const Boton: React.FC<{ children: React.ReactNode; tipo?: "lleno" | "linea" | "suave"; ancho?: number | string; apagado?: boolean; presionado?: number }> = ({
  children,
  tipo = "lleno",
  ancho,
  apagado,
  presionado = 0,
}) => {
  const p = useTema();
  const estilos = {
    lleno: { background: p.fucsia, color: "#fff", border: "1px solid transparent" },
    linea: { background: "transparent", color: p.texto, border: `1px solid ${p.linea}` },
    suave: { background: p.superficie, color: p.texto, border: `1px solid ${p.linea}` },
  }[tipo];
  return (
    <div
      style={{
        ...estilos,
        width: ancho,
        height: 44,
        borderRadius: 999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: 700,
        fontSize: 15,
        opacity: apagado ? 0.35 : 1,
        transform: `scale(${1 - presionado * 0.05})`,
      }}
    >
      {children}
    </div>
  );
};

export const FAB: React.FC<{ children: string }> = ({ children }) => {
  const p = useTema();
  return (
    <div
      style={{
        position: "absolute",
        right: 16,
        bottom: 76,
        background: p.fucsia,
        color: "#fff",
        fontWeight: 700,
        fontSize: 15,
        padding: "12px 20px",
        borderRadius: 999,
        boxShadow: "0 6px 20px rgba(194,24,91,0.35)",
      }}
    >
      {children}
    </div>
  );
};

export const Chip: React.FC<{ children: React.ReactNode; color?: string; relleno?: boolean }> = ({ children, color, relleno }) => {
  const p = useTema();
  const c = color ?? p.suave;
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        fontSize: 12,
        fontWeight: 700,
        color: relleno ? "#fff" : c,
        background: relleno ? c : "transparent",
        border: `1px solid ${relleno ? c : c}`,
        borderRadius: 999,
        padding: "2px 9px",
      }}
    >
      {children}
    </span>
  );
};

const FOTOS: Record<string, [string, string, string]> = {
  almuerzo: ["#F28C28", "#C2185B", "🍲"],
  papa: ["#2E9E5B", "#1E5AA8", "🥔"],
  celulares: ["#1E5AA8", "#151110", "📱"],
  pelo: ["#C2185B", "#F2C230", "✂️"],
  plomero: ["#1E5AA8", "#2E9E5B", "🔧"],
};

export const Foto: React.FC<{ tipo: string; alto?: number }> = ({ tipo, alto = 112 }) => {
  const [a, b, emoji] = FOTOS[tipo] ?? FOTOS.almuerzo;
  return (
    <div
      style={{
        height: alto,
        background: `linear-gradient(135deg, ${a}, ${b})`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: alto * 0.5,
      }}
    >
      {emoji}
    </div>
  );
};

export const Letrero: React.FC<{
  titulo: string;
  zona: string;
  hace: string;
  foto: string;
  precio?: string;
  sirvio?: boolean;
  gracias?: number;
  alto?: number;
  nuevo?: number;
}> = ({ titulo, zona, hace, foto, precio, sirvio, gracias = 0, alto = 112, nuevo = 1 }) => {
  const p = useTema();
  return (
    <div
      style={{
        margin: "0 16px 14px",
        background: p.superficie,
        border: `1px solid ${p.linea}`,
        borderRadius: 16,
        overflow: "hidden",
        opacity: nuevo,
        transform: `translateY(${(1 - nuevo) * -18}px)`,
      }}
    >
      <div style={{ position: "relative" }}>
        <Foto tipo={foto} alto={alto} />
        {precio ? (
          <div
            style={{
              position: "absolute",
              left: 10,
              bottom: 10,
              background: p.amarillo,
              color: "#1F1A18",
              fontFamily: TITULO,
              fontWeight: 700,
              fontSize: 17,
              padding: "3px 10px 5px",
              borderRadius: 6,
              borderBottom: "3px solid #1F1A18",
            }}
          >
            {precio}
          </div>
        ) : null}
      </div>
      <div style={{ padding: "11px 13px 12px" }}>
        <div style={{ fontFamily: TITULO, fontWeight: 500, fontSize: 17, lineHeight: 1.2 }}>{titulo}</div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 9 }}>
          <div style={{ fontSize: 12.5, color: p.suave }}>
            {zona} · {hace}
          </div>
          <div
            style={{
              fontSize: 13,
              fontWeight: 700,
              padding: "6px 13px",
              borderRadius: 999,
              border: `1px solid ${sirvio ? p.verde : p.linea}`,
              color: sirvio ? p.verde : p.texto,
              background: sirvio ? "rgba(46,158,91,0.14)" : "transparent",
              transform: `scale(${1 + gracias * 0.08})`,
            }}
          >
            {sirvio ? "✓ Me sirvió" : "Me sirvió"}
          </div>
        </div>
      </div>
    </div>
  );
};

export const SeccionTitulo: React.FC<{ children: string }> = ({ children }) => {
  const p = useTema();
  return (
    <div style={{ padding: "12px 16px 9px", fontFamily: TITULO, fontWeight: 700, fontSize: 14, letterSpacing: 1.2, textTransform: "uppercase", color: p.suave }}>
      {children}
    </div>
  );
};

export const Pregunta: React.FC<{
  texto: string;
  zona: string;
  hace: string;
  urgente?: boolean;
  solucionada?: number;
  respuestas?: number;
  nuevo?: number;
}> = ({ texto, zona, hace, urgente, solucionada = 0, respuestas = 0, nuevo = 1 }) => {
  const p = useTema();
  const ok = solucionada > 0.5;
  return (
    <div
      style={{
        margin: "0 16px 12px",
        background: p.superficie,
        border: `1px solid ${ok ? p.verde : urgente ? p.coral : p.linea}`,
        borderRadius: 16,
        padding: "13px 14px",
        opacity: nuevo,
        transform: `translateY(${(1 - nuevo) * -18}px)`,
      }}
    >
      <div style={{ display: "flex", gap: 6, marginBottom: 9, alignItems: "center" }}>
        {ok ? <Chip color={p.verde} relleno>✓ Solucionada</Chip> : null}
        {urgente && !ok ? <Chip color={p.coral} relleno>Urgente</Chip> : null}
        <Chip>Servicios</Chip>
      </div>
      <div style={{ fontFamily: TITULO, fontWeight: 500, fontSize: 17, lineHeight: 1.25 }}>{texto}</div>
      <div style={{ marginTop: 9, fontSize: 12.5, color: p.suave }}>
        {zona} · {hace} · {respuestas === 1 ? "1 respuesta" : `${respuestas} respuestas`}
      </div>
    </div>
  );
};

export const Hoja: React.FC<{ alto: number; progreso?: number; children: React.ReactNode }> = ({ alto, progreso = 1, children }) => {
  const p = useTema();
  return (
    <>
      <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.55)", opacity: progreso }} />
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: alto,
          background: p.superficie,
          borderRadius: "24px 24px 0 0",
          borderTop: `1px solid ${p.linea}`,
          padding: "12px 20px 20px",
          transform: `translateY(${(1 - progreso) * alto}px)`,
        }}
      >
        <div style={{ width: 40, height: 4, borderRadius: 4, background: p.linea, margin: "0 auto 16px" }} />
        {children}
      </div>
    </>
  );
};

export const Aviso: React.FC<{ children: React.ReactNode; progreso: number; color?: string }> = ({ children, progreso, color }) => {
  const p = useTema();
  return (
    <div
      style={{
        position: "absolute",
        left: 16,
        right: 16,
        bottom: 84,
        background: color ?? p.texto,
        color: color ? "#fff" : p.fondo,
        borderRadius: 14,
        padding: "12px 16px",
        fontWeight: 700,
        fontSize: 15,
        opacity: progreso,
        transform: `translateY(${(1 - progreso) * 18}px)`,
      }}
    >
      {children}
    </div>
  );
};

export const Campo: React.FC<{ etiqueta: string; valor: string; cursor?: boolean; alto?: number }> = ({ etiqueta, valor, cursor, alto = 46 }) => {
  const p = useTema();
  return (
    <div style={{ marginBottom: 13 }}>
      <div style={{ fontSize: 12.5, fontWeight: 700, color: p.suave, marginBottom: 6 }}>{etiqueta}</div>
      <div
        style={{
          minHeight: alto,
          background: p.fondo,
          border: `1px solid ${cursor ? p.fucsia : p.linea}`,
          borderRadius: 12,
          padding: "11px 13px",
          fontSize: 15.5,
          lineHeight: 1.3,
        }}
      >
        {valor}
        {cursor ? <span style={{ color: p.fucsia }}>|</span> : null}
      </div>
    </div>
  );
};

export const Fila: React.FC<{ titulo: string; detalle?: string; derecha?: React.ReactNode }> = ({ titulo, detalle, derecha }) => {
  const p = useTema();
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 16px", borderBottom: `1px solid ${p.linea}` }}>
      <div>
        <div style={{ fontWeight: 600, fontSize: 16 }}>{titulo}</div>
        {detalle ? <div style={{ fontSize: 12.5, color: p.suave, marginTop: 2 }}>{detalle}</div> : null}
      </div>
      <div style={{ color: p.suave, fontSize: 18 }}>{derecha ?? "›"}</div>
    </div>
  );
};

// Círculo de toque: se ve dónde se toca (en la grabación real se activa «Mostrar toques»)
export const Toque: React.FC<{ x: number; y: number; t: number; T: number }> = ({ x, y, t, T }) => {
  const q = (T - t) / 0.55;
  if (q < 0 || q > 1) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: x - 26,
        top: y - 26,
        width: 52,
        height: 52,
        borderRadius: 999,
        border: "3px solid #F2C230",
        background: "rgba(242,194,48,0.28)",
        transform: `scale(${0.55 + q * 0.75})`,
        opacity: 1 - q * 0.85,
      }}
    />
  );
};
