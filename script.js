/* =========================================================
   REDES SOCIALES — rellena aquí tus enlaces cuando crees las cuentas.
   Si un campo está vacío (""), ese botón no aparece en la web.
   Ejemplo: instagram: "https://www.instagram.com/lemulte_traducciones"
   ========================================================= */
const REDES = {
  instagram: "https://www.instagram.com/lemulte/",
  x: "",
  discord: "",
  youtube: ""
};

const NOMBRES = { instagram: "Instagram", x: "X / Twitter", discord: "Discord", youtube: "YouTube" };

// Pinta los enlaces de redes en "Sobre Lemulte" y en el pie de página
document.querySelectorAll('.social-slot').forEach(slot => {
  const plain = slot.classList.contains('social-slot-plain');
  Object.entries(REDES).forEach(([red, url]) => {
    if (!url) return;
    const a = document.createElement('a');
    a.href = url; a.target = '_blank'; a.rel = 'noopener';
    a.textContent = NOMBRES[red] + ' ↗';
    if (!plain) a.className = 'button button-quiet';
    slot.appendChild(a);
  });
});

// Añade las redes a los datos para Google (sameAs)
try {
  const ld = document.querySelector('script[type="application/ld+json"]');
  const data = JSON.parse(ld.textContent);
  Object.values(REDES).forEach(u => { if (u) data.sameAs.push(u); });
  ld.textContent = JSON.stringify(data);
} catch (e) {}

// Menú móvil
const toggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');
toggle?.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  toggle.setAttribute('aria-expanded', String(open));
});
document.querySelectorAll('.nav a').forEach(a => a.addEventListener('click', () => {
  nav.classList.remove('open');
  toggle?.setAttribute('aria-expanded', 'false');
}));

// Contadores automáticos: al añadir una traducción nueva no hay que tocar números
const cards = [...document.querySelectorAll('.project-card')];
const pad = n => String(n).padStart(2, '0');
document.querySelectorAll('.filter').forEach(button => {
  const f = button.dataset.filter;
  const n = f === 'todos' ? cards.length : cards.filter(c => c.dataset.platform === f).length;
  const span = button.querySelector('span');
  if (span) span.textContent = pad(n);
  button.addEventListener('click', () => {
    document.querySelectorAll('.filter').forEach(b => b.classList.remove('active'));
    button.classList.add('active');
    cards.forEach(card => { card.hidden = f !== 'todos' && card.dataset.platform !== f; });
  });
});
document.querySelectorAll('.count-total').forEach(el => el.textContent = cards.length);
document.querySelectorAll('.cover-number').forEach((el, i) => el.textContent = pad(i + 1));

document.getElementById('year').textContent = new Date().getFullYear();

// PORTADAS: sube una imagen a la carpeta "img" con el nombre que pone en data-img
// (por ejemplo img/caligula-effect-2.jpg) y aparece sola. Vale .jpg, .png o .webp.
// Si no hay imagen, se queda la portada de colores con el texto.
document.querySelectorAll('.cover[data-img]').forEach(cover => {
  const exts = ['jpg', 'png', 'webp', 'jpeg'];
  const intentar = i => {
    if (i >= exts.length) return;
    const url = `img/${cover.dataset.img}.${exts[i]}`;
    const im = new Image();
    im.onload = () => { cover.style.backgroundImage = `url("${url}")`; cover.classList.add('has-img'); };
    im.onerror = () => intentar(i + 1);
    im.src = url;
  };
  intentar(0);
});

// CAPTURAS: sube a la carpeta "img" archivos numerados con el nombre del juego:
//   img/caligula-effect-2-1.jpg, img/caligula-effect-2-2.jpg, img/caligula-effect-2-3.jpg ...
// Vale .jpg, .png o .webp. Se leen en orden hasta que falta un número.
// Si hay alguna, aparece el botón "Ver capturas" en ese juego.
const MAX_CAPTURAS = 20;
const probar = (base) => new Promise(res => {
  const exts = ['jpg', 'png', 'webp', 'jpeg'];
  const go = i => {
    if (i >= exts.length) return res(null);
    const im = new Image();
    im.onload = () => res(`${base}.${exts[i]}`);
    im.onerror = () => go(i + 1);
    im.src = `${base}.${exts[i]}`;
  };
  go(0);
});

// Galería (visor a pantalla completa)
const lb = document.createElement('div');
lb.className = 'lightbox'; lb.hidden = true;
lb.innerHTML = '<button class="lb-close" aria-label="Cerrar">✕</button><button class="lb-prev" aria-label="Anterior">‹</button><figure><img alt=""><figcaption></figcaption></figure><button class="lb-next" aria-label="Siguiente">›</button>';
document.body.appendChild(lb);
let galeria = [], idx = 0, titulo = '';
const mostrar = () => {
  lb.querySelector('img').src = galeria[idx];
  lb.querySelector('img').alt = `${titulo} — captura ${idx + 1}`;
  lb.querySelector('figcaption').textContent = `${titulo} · ${idx + 1} / ${galeria.length}`;
  lb.querySelector('.lb-prev').hidden = lb.querySelector('.lb-next').hidden = galeria.length < 2;
};
const abrir = (fotos, t) => { galeria = fotos; idx = 0; titulo = t; mostrar(); lb.hidden = false; document.body.style.overflow = 'hidden'; };
const cerrar = () => { lb.hidden = true; document.body.style.overflow = ''; };
const mover = d => { idx = (idx + d + galeria.length) % galeria.length; mostrar(); };
lb.querySelector('.lb-close').onclick = cerrar;
lb.querySelector('.lb-prev').onclick = e => { e.stopPropagation(); mover(-1); };
lb.querySelector('.lb-next').onclick = e => { e.stopPropagation(); mover(1); };
lb.addEventListener('click', e => { if (e.target === lb) cerrar(); });
document.addEventListener('keydown', e => {
  if (lb.hidden) return;
  if (e.key === 'Escape') cerrar();
  if (e.key === 'ArrowRight') mover(1);
  if (e.key === 'ArrowLeft') mover(-1);
});
let x0 = null;
lb.addEventListener('touchstart', e => { x0 = e.touches[0].clientX; }, { passive: true });
lb.addEventListener('touchend', e => {
  if (x0 === null) return;
  const dx = e.changedTouches[0].clientX - x0;
  if (Math.abs(dx) > 40) mover(dx < 0 ? 1 : -1);
  x0 = null;
});

document.querySelectorAll('.project-card').forEach(async card => {
  const cover = card.querySelector('.cover[data-img]');
  if (!cover) return;
  const slug = cover.dataset.img;
  const fotos = [];
  for (let n = 1; n <= MAX_CAPTURAS; n++) {
    const url = await probar(`img/${slug}-${n}`);
    if (!url) break;
    fotos.push(url);
  }
  if (!fotos.length) return;
  const t = card.querySelector('h3').textContent;
  const btn = document.createElement('button');
  btn.className = 'gallery-btn';
  btn.textContent = `Ver capturas (${fotos.length})`;
  btn.onclick = () => abrir(fotos, t);
  card.querySelector('.project-links').appendChild(btn);
  // también se abre al pulsar la portada
  cover.classList.add('clickable');
  cover.addEventListener('click', () => abrir(fotos, t));
});
