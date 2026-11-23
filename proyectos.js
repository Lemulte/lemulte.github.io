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
      { fecha: "2026-11-23", texto: "¡Ya están en español la exploración de los laberintos, los avisos de los 12 jefes y las fiestas de cada estación!" },
      { fecha: "2026-11-23", texto: "¡La trama principal ya puede jugarse en español de principio a fin, combate final y desenlace incluidos!" },
      { fecha: "2026-11-23", texto: "¡Ya están en español los cinco primeros capítulos de la historia, hasta la entrada al Laberinto de Ofiuco!" },
      { fecha: "2026-11-23", texto: "¡Ya están en español los tres primeros capítulos de la historia, con el banquete, la fiesta sorpresa y el primer ataque a la ciudad!" },
      { fecha: "2026-11-23", texto: "¡Prólogo y capítulo 1 en español! Ya se puede conocer a las 12 Doncellas Estelares traducidas." },
      { fecha: "2026-11-23", texto: "¡El prólogo ya está en español! La historia empieza a poder jugarse traducida." },
      { fecha: "2026-11-23", texto: "¡Terminados todos los menús, objetos, técnicas y laberintos! El siguiente paso es la historia." },
      { fecha: "2026-11-23", texto: "¡Casi todos los menús, objetos y laberintos ya están en español; quedan solo tres bloques para empezar con la historia!" },
      { fecha: "2026-11-23", texto: "¡Ya está traducida la mitad de los menús y objetos, y las Doncellas Estelares ya hablan en español en sus encargos!" },
      { fecha: "2026-11-23", texto: "¡Ya están en español los menús principales, la tienda, las misiones y cientos de objetos del juego!" },
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
