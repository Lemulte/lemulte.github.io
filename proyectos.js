/* =========================================================
   PROYECTOS DE LEMULTE — lo único que hay que tocar para
   actualizar "En desarrollo" y "Pendientes".
   ========================================================= */

/* EN DESARROLLO
   porcentaje: número de 0 a 100
   estado: "Empezando", "Traduciendo", "Revisando", "Probando" o "Casi listo"
   novedades: la más reciente arriba. fecha en formato "AAAA-MM-DD" */
const EN_DESARROLLO = [
  {
    juego: "Conception PLUS: Maidens of the Twelve Stars",
    plataforma: "PC · STEAM",
    steam: 906510,
    porcentaje: 43,
    estado: "Traduciendo",
    novedades: [
      { fecha: "2026-11-23", texto: "Ya está en castellano la ruta completa de Tarua, la cartera más rápida (y más torpe) de Granvania." },
      { fecha: "2026-11-23", texto: "¡Ya están en castellano los menús principales, la tienda, las misiones y cientos de objetos del juego!" },
      { fecha: "2026-11-23", texto: "¡Proyecto anunciado! Empieza la traducción al castellano." }
    ]
  }
];

/* PENDIENTES
   estado: "Pedido", "En estudio", "Próximamente" o "Traduciendo" */
const PENDIENTES = {
  comunidad: [],
  mios: [
    { juego: "Conception II: Children of the Seven Stars", plataforma: "PC · STEAM", estado: "Próximamente", steam: 458730 }
  ]
};
