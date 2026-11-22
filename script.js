/* =========================================================
   REDES SOCIALES — rellena aquí tus enlaces cuando crees las cuentas.
   Si un campo está vacío (""), ese botón no aparece en la web.
   Ejemplo: instagram: "https://www.instagram.com/lemulte_traducciones"
   ========================================================= */
const REDES = {
  instagram: "",
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
