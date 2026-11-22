import { AbsoluteFill, Audio, Composition, Sequence, Series, staticFile, useCurrentFrame } from "remotion";
import { CapaAvatares } from "../elenco/Elenco";
import { ESCENAS, NOMBRE, escenaPorId, type Escena } from "../elenco/escenas";
import { CEL_ALTO, CEL_ANCHO, CEL_TOPE, H, W, celDerecha, celIzquierda, type Celular } from "../elenco/layout";
import { CONTENIDO, type Contenido } from "./contenido";
import { interfazDe, type EscenaUI } from "./pantallas";
import { AGUAYO, OSCURO, TEXTO, TITULO } from "./ui";

const FPS = 30;
const COLOR_QUIEN = { diego: "#22D3EE", yaeko: "#8B5CFF", aldrin: "#C6F432", todos: "#F5F2EF" } as const;
const COLOR = { fucsia: OSCURO.fucsia, naranja: OSCURO.naranja, verde: OSCURO.verde, azul: "#3A7BD5", amarillo: OSCURO.amarillo, coral: OSCURO.coral };

// ---------- Fondo: tejido de aguayo en tonos oscuros, sin partes negras ----------
const Fondo: React.FC<{ claro?: boolean }> = () => {
  const bandas = AGUAYO.map((c, i) => `${c}${i % 2 ? "26" : "3A"} ${i * 56}px, ${c}${i % 2 ? "26" : "3A"} ${(i + 1) * 56}px`).join(", ");
  return (
    <AbsoluteFill style={{ background: "#1B1214" }}>
      <AbsoluteFill style={{ backgroundImage: `repeating-linear-gradient(90deg, ${bandas})`, opacity: 0.9 }} />
      <AbsoluteFill
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, rgba(0,0,0,0.18) 0px, rgba(0,0,0,0.18) 3px, transparent 3px, transparent 8px), repeating-linear-gradient(45deg, rgba(255,255,255,0.035) 0px, rgba(255,255,255,0.035) 2px, transparent 2px, transparent 28px), repeating-linear-gradient(-45deg, rgba(255,255,255,0.035) 0px, rgba(255,255,255,0.035) 2px, transparent 2px, transparent 28px)",
        }}
      />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at center, rgba(21,17,16,0) 35%, rgba(21,17,16,0.55) 100%)" }} />
    </AbsoluteFill>
  );
};

// ---------- Barra de arriba: avance de las 8 escenas ----------
const Barra: React.FC<{ escena: Escena; T: number; completo?: boolean }> = ({ escena, T }) => (
  <div style={{ position: "absolute", left: 30, right: 30, top: 14, height: 46, fontFamily: TEXTO }}>
    <div style={{ display: "flex", gap: 6 }}>
      {ESCENAS.map((e) => {
        const actual = e.id === escena.id;
        const pasada = Number(e.id) < Number(escena.id);
        return (
          <div key={e.id} style={{ flex: 1, height: 7, borderRadius: 4, background: "rgba(245,242,239,0.22)", overflow: "hidden" }}>
            <div style={{ width: `${pasada ? 100 : actual ? Math.min(100, (T / escena.dur) * 100) : 0}%`, height: "100%", background: OSCURO.fucsia }} />
          </div>
        );
      })}
    </div>
    <div style={{ marginTop: 8, display: "flex", justifyContent: "space-between", color: "#F5F2EF", fontWeight: 700, fontSize: 19, letterSpacing: 1 }}>
      <span>
        ESCENA {escena.numero} · {escena.titulo.toUpperCase()}
      </span>
      <span style={{ opacity: 0.8 }}>
        Bolivia<span style={{ color: OSCURO.rosado }}>Sabe</span> · CodeBambinos
      </span>
    </div>
  </div>
);

// ---------- Marco del celular ----------
const NOMBRE_CEL: Record<Celular, string> = { U: "", A: "Celular A · Ana", B: "Celular B · Luis" };

const MarcoCelular: React.FC<{ cel: Celular; guia: boolean; children?: React.ReactNode; T: number; toques: EscenaUI["toques"] }> = ({ cel, guia, children, T, toques }) => (
  <>
    <div
      style={{
        position: "absolute",
        left: celIzquierda(cel) - 10,
        top: CEL_TOPE - 10,
        width: CEL_ANCHO + 20,
        height: CEL_ALTO + 20,
        borderRadius: 46,
        background: "#0B0908",
        border: "2px solid #4A3F38",
        boxShadow: "0 30px 80px rgba(0,0,0,0.55)",
      }}
    />
    <div
      style={{
        position: "absolute",
        left: celIzquierda(cel),
        top: CEL_TOPE,
        width: CEL_ANCHO,
        height: CEL_ALTO,
        borderRadius: 36,
        overflow: "hidden",
        background: OSCURO.fondo,
        outline: guia ? "4px dashed #C6F432" : "none",
        outlineOffset: 14,
      }}
    >
      <div style={{ position: "absolute", left: 0, top: 0, width: 360, height: 800, transform: `scale(${CEL_ANCHO / 360})`, transformOrigin: "0 0" }}>
        {children}
        {guia
          ? toques
              .filter((q) => q.cel === cel)
              .map((q, i) => <ToqueAnillo key={i} x={q.x} y={q.y} t={q.t} T={T} />)
          : null}
      </div>
    </div>
    {NOMBRE_CEL[cel] ? (
      <div style={{ position: "absolute", left: celIzquierda(cel), width: CEL_ANCHO, top: 28, textAlign: "center" }}>
        <span style={{ fontFamily: TEXTO, fontWeight: 700, fontSize: 20, color: "#151110", background: OSCURO.amarillo, padding: "3px 16px", borderRadius: 999 }}>{NOMBRE_CEL[cel]}</span>
      </div>
    ) : null}
  </>
);

const ToqueAnillo: React.FC<{ x: number; y: number; t: number; T: number }> = ({ x, y, t, T }) => {
  const q = (T - t) / 0.55;
  if (q < 0 || q > 1) return null;
  return (
    <div style={{ position: "absolute", left: x - 26, top: y - 26, width: 52, height: 52, borderRadius: 999, border: "3px solid #F2C230", background: "rgba(242,194,48,0.3)", transform: `scale(${0.55 + q * 0.75})`, opacity: 1 - q * 0.85 }} />
  );
};

// ---------- Paneles de los costados ----------
const Tarjeta: React.FC<{ children: React.ReactNode; estilo?: React.CSSProperties }> = ({ children, estilo }) => (
  <div style={{ background: "rgba(21,17,16,0.93)", border: "1px solid #3A322D", borderRadius: 26, padding: "26px 30px", ...estilo }}>{children}</div>
);

const PanelIzquierdo: React.FC<{ escena: Escena; c: Contenido; x: number; w: number; T: number; guia: boolean }> = ({ escena, c, x, w, T, guia }) => {
  const k = Math.max(0.55, Math.min(1, w / 640));
  const entra = Math.min(1, Math.max(0, T / 0.5));
  const fraseVisible = Math.min(1, Math.max(0, (T - 0.9) / 0.5));
  return (
    <div style={{ position: "absolute", left: x, top: 92, width: w, opacity: entra, transform: `translateX(${(1 - entra) * -40}px)`, fontFamily: TEXTO, color: "#F5F2EF" }}>
      <Tarjeta>
        <div style={{ fontSize: 22 * k + 4, fontWeight: 700, letterSpacing: 2, color: OSCURO.rosado }}>ESCENA {escena.numero}</div>
        <div style={{ fontFamily: TITULO, fontWeight: 700, fontSize: 64 * k, lineHeight: 1.02, margin: "8px 0 14px", letterSpacing: -1.5 }}>{c.titulo}</div>
        <div style={{ height: 4, width: 90, borderRadius: 4, background: OSCURO.fucsia, marginBottom: 16 }} />
        <div style={{ fontFamily: TITULO, fontWeight: 500, fontSize: 42 * k, lineHeight: 1.1, color: OSCURO.amarillo, opacity: fraseVisible, transform: `translateY(${(1 - fraseVisible) * 14}px)` }}>
          «{c.frase}»
        </div>
      </Tarjeta>
      {guia ? (
        <Tarjeta estilo={{ marginTop: 16, border: "2px dashed #C6F432", padding: "18px 22px" }}>
          <div style={{ fontSize: 20 * k + 2, fontWeight: 800, color: "#C6F432", letterSpacing: 1.5, marginBottom: 8 }}>🎥 CÓMO GRABAR ESTA ESCENA</div>
          {c.grabar.map((g, i) => (
            <div key={i} style={{ display: "flex", gap: 10, fontSize: 21 * k + 1, lineHeight: 1.25, marginBottom: 7 }}>
              <span style={{ color: "#C6F432", fontWeight: 800 }}>{i + 1}.</span>
              <span>{g}</span>
            </div>
          ))}
          <div style={{ fontSize: 19 * k + 1, color: "#A89B93", marginTop: 4 }}>📍 {c.con}</div>
        </Tarjeta>
      ) : null}
    </div>
  );
};

const PanelDerecho: React.FC<{ c: Contenido; x: number; w: number; T: number }> = ({ c, x, w, T }) => {
  const k = Math.max(0.55, Math.min(1, w / 640));
  return (
    <div style={{ position: "absolute", left: x, top: 92, width: w, fontFamily: TEXTO, color: "#F5F2EF" }}>
      {c.datos.map((d, i) => {
        const e = Math.min(1, Math.max(0, (T - (1.2 + i * 1.1)) / 0.45));
        return (
          <Tarjeta
            key={d.grande + i}
            estilo={{
              marginBottom: 14,
              padding: "16px 24px",
              opacity: e,
              transform: `translateX(${(1 - e) * 60}px)`,
              borderLeft: `8px solid ${COLOR[d.color]}`,
            }}
          >
            <div style={{ fontFamily: TITULO, fontWeight: 700, fontSize: 54 * k, lineHeight: 1, color: COLOR[d.color], letterSpacing: -1 }}>{d.grande}</div>
            <div style={{ fontSize: 25 * k + 2, lineHeight: 1.18, marginTop: 6, opacity: 0.92 }}>{d.texto}</div>
          </Tarjeta>
        );
      })}
    </div>
  );
};

// ---------- Subtítulos ----------
const Subtitulos: React.FC<{ escena: Escena; T: number }> = ({ escena, T }) => {
  const l = escena.lineas.find((x) => T >= x.t - 0.05 && T < x.t + x.dur + 0.25);
  if (!l) return null;
  const nombre = l.quien === "todos" ? "Los tres" : NOMBRE[l.quien];
  return (
    <div style={{ position: "absolute", left: 410, width: 1100, top: 1016, height: 58, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: TEXTO }}>
      <div style={{ background: "rgba(12,10,9,0.9)", border: "1px solid #3A322D", borderRadius: 14, padding: "6px 22px", fontSize: 25, lineHeight: 1.18, color: "#fff", textAlign: "center", maxWidth: 1100 }}>
        <span style={{ color: COLOR_QUIEN[l.quien], fontWeight: 800, marginRight: 10 }}>{nombre}</span>
        {l.texto.split("**").map((p, i) => (
          <span key={i} style={i % 2 ? { color: OSCURO.rosado, fontWeight: 800 } : undefined}>
            {p}
          </span>
        ))}
      </div>
    </div>
  );
};

// ---------- Escena 8: mapa y cierre ----------
const Mapa: React.FC<{ escena: Escena; T: number }> = ({ escena, T }) => {
  const cierre = escena.lineas[escena.lineas.length - 1];
  const verCierre = Math.min(1, Math.max(0, (T - (cierre.t - 0.4)) / 0.5));
  const pines: [string, number, number, number][] = [
    ["Cala Cala", 250, 250, 0.4],
    ["Sarco", 420, 330, 2.6],
    ["Centro", 340, 450, 4.4],
  ];
  return (
    <>
      <div style={{ position: "absolute", left: 470, top: 92, width: 980, height: 800, opacity: 1 - verCierre }}>
        <Tarjeta estilo={{ height: 800, padding: 0, overflow: "hidden", position: "relative" }}>
          <div style={{ position: "absolute", left: 30, top: 24, fontFamily: TITULO, fontSize: 40, fontWeight: 700, color: "#F5F2EF" }}>Cochabamba</div>
          <svg viewBox="0 0 980 800" width={980} height={800} style={{ position: "absolute", inset: 0 }}>
            <path d="M120 300 C 200 120, 420 90, 560 160 C 720 190, 870 300, 840 470 C 810 640, 600 720, 430 700 C 250 690, 90 520, 120 300 Z" fill="#2A211D" stroke="#4A3F38" strokeWidth={3} />
            <path d="M260 250 C 360 190, 520 220, 600 300 C 660 400, 560 520, 430 520 C 320 520, 220 400, 260 250 Z" fill="#33271F" stroke="#5A4A3F" strokeWidth={2} strokeDasharray="8 8" />
            {pines.map(([n, px, py, t0]) => {
              const e = Math.min(1, Math.max(0, (T - t0) / 0.4));
              return (
                <g key={n} transform={`translate(${px + 120} ${py + 80}) scale(${e})`}>
                  <circle r={20} fill={OSCURO.fucsia} />
                  <circle r={8} fill="#fff" />
                  <text x={30} y={8} fontFamily={TEXTO} fontWeight={700} fontSize={28} fill="#F5F2EF">
                    {n}
                  </text>
                </g>
              );
            })}
          </svg>
          <div style={{ position: "absolute", right: 28, bottom: 24, textAlign: "right", fontFamily: TEXTO }}>
            <div style={{ fontFamily: TITULO, fontWeight: 700, fontSize: 64, color: OSCURO.amarillo, lineHeight: 1 }}>2.005.373</div>
            <div style={{ fontSize: 24, color: "#F5F2EF" }}>habitantes en el departamento</div>
          </div>
        </Tarjeta>
      </div>
      <div style={{ position: "absolute", left: 470, top: 130, width: 980, opacity: verCierre, textAlign: "center", fontFamily: TEXTO, color: "#F5F2EF" }}>
        <Tarjeta estilo={{ padding: "50px 40px" }}>
          <div style={{ fontFamily: TITULO, fontWeight: 700, fontSize: 110, letterSpacing: -3 }}>
            Bolivia<span style={{ color: OSCURO.fucsia }}>Sabe</span>
          </div>
          <div style={{ display: "flex", height: 8, margin: "18px auto 26px", width: 520, borderRadius: 4, overflow: "hidden" }}>
            {AGUAYO.map((c) => (
              <div key={c} style={{ flex: 1, background: c }} />
            ))}
          </div>
          <div style={{ fontFamily: TITULO, fontSize: 50, fontWeight: 500, color: OSCURO.amarillo }}>Entre bolivianos nos ayudamos</div>
          <div style={{ fontSize: 34, marginTop: 28, fontWeight: 600 }}>boliviasabe.vercel.app</div>
          <div style={{ fontSize: 28, marginTop: 8, opacity: 0.75 }}>github.com/codebambinos/boliviasabe</div>
        </Tarjeta>
      </div>
    </>
  );
};

// ---------- La escena completa ----------
export type OpcionesEjemplo = { idEscena: string; guia: boolean; contenido: boolean; avatares: boolean; audio: boolean };

const dosCel0 = (e: Escena) => e.celulares.length > 1;

const EjemploEscena: React.FC<OpcionesEjemplo> = ({ idEscena, guia, contenido, avatares, audio }) => {
  const frame = useCurrentFrame();
  const T = frame / FPS;
  const escena = escenaPorId(idEscena);
  const c = CONTENIDO[idEscena];
  const ui = interfazDe(escena);
  const vista = ui.vista(T);

  const hayCel = escena.celulares.length > 0;
  const hayPc = Boolean(vista.pc);
  const primero = escena.celulares[0];
  const ultimo = escena.celulares[escena.celulares.length - 1];
  const esOcho = escena.id === "8";
  const izqX = dosCel0(escena) ? 20 : 30;
  // Los avatares caminan en los costados del celular: los paneles dejan un pasillo libre para ellos
  const dosCel = escena.celulares.length > 1;
  const pasillo = dosCel ? 0 : 150;
  const izqW = esOcho ? 420 : hayCel ? (dosCel ? 300 : celIzquierda(primero) - 30 - pasillo) : 620;
  const derX = esOcho ? 1470 : hayCel ? (dosCel ? 1585 : celDerecha(ultimo) + pasillo) : 1270;
  const derW = esOcho ? 420 : hayCel ? 1890 - derX : 620;
  const pcSobre = hayPc && T >= 0;

  return (
    <AbsoluteFill>
      <Fondo />
      <Barra escena={escena} T={T} />
      <PanelIzquierdo escena={escena} c={c} x={izqX} w={izqW} T={T} guia={guia && !pcSobre} />
      <PanelDerecho c={c} x={derX} w={derW} T={T} />
      {esOcho ? <Mapa escena={escena} T={T} /> : null}
      {escena.id === "1" && contenido ? (
        <div style={{ position: "absolute", left: 660, top: 92, width: 600, height: 800 }}>{vista.camara}</div>
      ) : null}
      {escena.celulares.map((cel) => (
        <MarcoCelular key={cel} cel={cel} guia={guia} T={T} toques={ui.toques}>
          {contenido && !pcSobre ? vista[cel] : null}
        </MarcoCelular>
      ))}
      {pcSobre ? (
        <div style={{ position: "absolute", left: 610, top: 120, width: 700, height: 440, borderRadius: 16, overflow: "hidden", border: "2px solid #4A3F38", boxShadow: "0 30px 80px rgba(0,0,0,0.6)", background: "#F5F2EF" }}>
          {contenido ? (
            <div style={{ position: "absolute", left: 0, top: 0, width: 1120, height: 704, transform: "scale(0.625)", transformOrigin: "0 0" }}>{vista.pc}</div>
          ) : null}
        </div>
      ) : null}
      {avatares ? <CapaAvatares escena={escena} frame={frame} /> : null}
      <Subtitulos escena={escena} T={T} />
      {audio
        ? escena.lineas.map((l) => (
            <Sequence key={l.clave} from={Math.round(l.t * FPS)} layout="none">
              <Audio src={staticFile(`ejemplo/voz/${l.clave}.wav`)} />
            </Sequence>
          ))
        : null}
    </AbsoluteFill>
  );
};

// ---------- Composiciones ----------
const COMPLETO: Omit<OpcionesEjemplo, "idEscena"> = { guia: true, contenido: true, avatares: true, audio: true };
const SOLO_FONDO: Omit<OpcionesEjemplo, "idEscena"> = { guia: false, contenido: false, avatares: false, audio: false };

const EjemploCompleto: React.FC = () => (
  <Series>
    {ESCENAS.map((e) => (
      <Series.Sequence key={e.id} durationInFrames={Math.round(e.dur * FPS)}>
        <EjemploEscena idEscena={e.id} {...COMPLETO} />
      </Series.Sequence>
    ))}
  </Series>
);

export const EjemploComposition = () => (
  <>
    <Composition
      id="EjemploCompleto"
      component={EjemploCompleto}
      durationInFrames={ESCENAS.reduce((s, e) => s + Math.round(e.dur * FPS), 0)}
      fps={FPS}
      width={W}
      height={H}
    />
    {ESCENAS.map((e) => (
      <Composition
        key={`e${e.id}`}
        id={`Ejemplo${e.id}`}
        component={EjemploEscena}
        durationInFrames={Math.round(e.dur * FPS)}
        fps={FPS}
        width={W}
        height={H}
        defaultProps={{ idEscena: e.id, ...COMPLETO }}
      />
    ))}
    {ESCENAS.map((e) => (
      <Composition
        key={`f${e.id}`}
        id={`Fondo${e.id}`}
        component={EjemploEscena}
        durationInFrames={Math.round(e.dur * FPS)}
        fps={FPS}
        width={W}
        height={H}
        defaultProps={{ idEscena: e.id, ...SOLO_FONDO }}
      />
    ))}
  </>
);
