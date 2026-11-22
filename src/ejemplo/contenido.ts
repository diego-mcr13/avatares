// Lo que se escribe en los costados de cada escena (títulos, frase gancho y datos) y la guía de grabación
// para el equipo. La guía solo sale en el ejemplo (`Ejemplo1` … `Ejemplo8`), no en el video final.

export type Dato = { grande: string; texto: string; color: "fucsia" | "naranja" | "verde" | "azul" | "amarillo" | "coral" };

export type Contenido = {
  titulo: string;
  frase: string;
  datos: Dato[];
  // Qué se graba (para el equipo)
  grabar: string[];
  // Dónde: quién graba con qué
  con: string;
};

export const CONTENIDO: Record<string, Contenido> = {
  "1": {
    titulo: "Somos CodeBambinos",
    frase: "Esto es BoliviaSabe",
    datos: [
      { grande: "Diego", texto: "Líder técnico · base de datos y Stellar", color: "azul" },
      { grande: "Yaeko", texto: "La idea, el producto y la marca", color: "fucsia" },
      { grande: "Aldrin", texto: "Toda la interfaz", color: "verde" },
    ],
    grabar: [
      "Cada uno se graba de frente, uno por uno, con fondo liso y luz de frente.",
      "Dice su frase y mantiene la sonrisa un segundo al terminar (ahí se pixela y aparece su avatar).",
      "Después los tres, juntos o por separado, dicen «Somos CodeBambinos. Esto es BoliviaSabe».",
    ],
    con: "Celular en vertical o cámara. Cada uno su propia toma.",
  },
  "2": {
    titulo: "El problema",
    frase: "Se hunde entre cientos de mensajes",
    datos: [
      { grande: "5", texto: "grupos de WhatsApp para una sola pregunta", color: "naranja" },
      { grande: "99+", texto: "mensajes que tapan la respuesta", color: "coral" },
      { grande: "0", texto: "yapitas para quien ayuda… hoy", color: "azul" },
    ],
    grabar: [
      "Capturen la pantalla de un celular con un chat de grupo lleno de mensajes sin importancia.",
      "Pongan nombres inventados y no muestren chats ni números de otras personas.",
      "Primero se ve la pregunta «¿Alguien sabe de un plomero para hoy?»; luego llegan mensajes y la tapan.",
    ],
    con: "Celular con grabador de pantalla (Android: deslizar y tocar «Grabar pantalla»).",
  },
  "3": {
    titulo: "Entras directo a Hoy",
    frase: "Mirar es gratis",
    datos: [
      { grande: "0", texto: "descargas y registros para mirar", color: "verde" },
      { grande: "3", texto: "secciones: Hoy, Esta semana y Antes", color: "fucsia" },
      { grande: "1 toque", texto: "para entrar con Google o con tu correo", color: "azul" },
    ],
    grabar: [
      "Ventana privada del navegador (sin sesión). Escriban boliviasabe.vercel.app.",
      "La app abre directo en Hoy, en oscuro. Bajen despacio por Hoy, Esta semana y Antes.",
      "Toquen «Me sirvió» sin cuenta: sube «Crea tu cuenta para seguir». Ciérrenla.",
    ],
    con: "Celular real o Chrome en modo dispositivo a 360 × 800 (el marco de diseño).",
  },
  "4": {
    titulo: "Subir un letrero",
    frase: "La foto es la prueba",
    datos: [
      { grande: "+1", texto: "yapita al publicar un letrero", color: "naranja" },
      { grande: "+1", texto: "cada vez que a un vecino le sirve", color: "verde" },
      { grande: "Foto", texto: "obligatoria: cada dato es real, con su hora", color: "fucsia" },
    ],
    grabar: [
      "Celular A (Ana): Hoy › «+ Subir» › foto del cartel › título «Almuerzo con sopa y segundo» › Más detalles › Bs 15 › Publicar.",
      "Celular B (Luis): bajar para actualizar, abrir el letrero nuevo y tocar «Me sirvió».",
      "Graben los dos celulares al mismo tiempo, con los toques visibles.",
    ],
    con: "Dos celulares con grabador de pantalla. Ana con 5 yapitas o más.",
  },
  "5": {
    titulo: "¿Alguien sabe?",
    frase: "Preguntar sale rápido. Ayudar se premia.",
    datos: [
      { grande: "−5", texto: "Urgente: la pregunta sube arriba 24 horas", color: "coral" },
      { grande: "1–2 s", texto: "la respuesta llega sola, sin recargar", color: "azul" },
      { grande: "Tú decides", texto: "el contacto solo se comparte si aceptan", color: "verde" },
      { grande: "+5", texto: "yapitas para quien ayudó", color: "naranja" },
    ],
    grabar: [
      "Celular A (Ana): ¿Alguien sabe? › «+ Preguntar» › la tubería en Sarco › Urgente › Publicar › se ve «Pregúntale a tus grupos».",
      "Celular B (Luis): bajar para actualizar › abrir la pregunta urgente › responder › Publicar.",
      "Celular A: la respuesta aparece sola › comentar › «Pedir contacto». Celular B: «Aceptar». Celular A: se ve el contacto (solo el correo de prueba).",
      "Celular A: «Me sirvió» › queda ✓ Solucionada. Celular B: el saldo sube +5.",
    ],
    con: "Los dos celulares a la vez. Es la escena más larga: tomas cortas por tramo.",
  },
  "6": {
    titulo: "Registrado en Stellar",
    frase: "Cada premio tiene su confirmación",
    datos: [
      { grande: "Tu cuenta", texto: "de prueba, creada al armar tu perfil", color: "azul" },
      { grande: "Confirmado", texto: "con enlace público para verificarlo", color: "verde" },
      { grande: "Sin dinero real", texto: "red de pruebas", color: "amarillo" },
    ],
    grabar: [
      "Celular B (Luis): Yo › Movimientos. Se ve «Tu respuesta le sirvió a Ana», +5, «Confirmado» y el aviso azul.",
      "Toquen el enlace «Ver en el explorador»: se abre el pago de YAPITA con su memo. Vuelvan a la app.",
      "Yo › «Mi cuenta de prueba» con la dirección corta y Copiar.",
    ],
    con: "Un celular (el de Luis) y una pestaña del explorador lista.",
  },
  "7": {
    titulo: "Para todo público",
    frase: "Si saben tocar, pueden usarla",
    datos: [
      { grande: "Instalable", texto: "se abre en el navegador y se instala como app", color: "fucsia" },
      { grande: "Claro u oscuro", texto: "tú eliges el tema", color: "amarillo" },
      { grande: "130 %", texto: "la letra sigue el tamaño de tu celular", color: "naranja" },
      { grande: "4 columnas", texto: "en computador", color: "azul" },
    ],
    grabar: [
      "Celular: Yo › Ajustes › Tema › Claro (la pantalla cambia). Subir la letra del celular al 130 %. Mostrar «Instalar la app».",
      "Computador (1440 × 900): Hoy en cuatro columnas y un letrero que se abre encima.",
    ],
    con: "Un celular y una laptop (Chrome a 1440 × 900).",
  },
  "8": {
    titulo: "Dónde empezamos",
    frase: "Entre bolivianos nos ayudamos",
    datos: [
      { grande: "30", texto: "personas en el piloto", color: "fucsia" },
      { grande: "8", texto: "negocios", color: "naranja" },
      { grande: "+", texto: "verificación y más ciudades", color: "verde" },
    ],
    grabar: [
      "No se graba nada de la app: es el mapa y las tarjetas del plan (se arman en el editor o con esta plantilla).",
      "Al final: logo, franja de aguayo, el lema y las direcciones boliviasabe.vercel.app y github.com/codebambinos/boliviasabe.",
    ],
    con: "Solo edición.",
  },
};
