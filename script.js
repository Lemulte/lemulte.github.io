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


const ESTADOS = { 'Pedido': 'st-pedido', 'En estudio': 'st-estudio', 'Próximamente': 'st-estudio', 'Traduciendo': 'st-traduciendo' };
document.querySelectorAll('.pending-grid').forEach(grid => {
  const lista = PENDIENTES[grid.dataset.list] || [];
  if (!lista.length) {
    grid.innerHTML = grid.dataset.list === 'comunidad'
      ? '<p class="pending-empty">Todavía no hay peticiones. ¡Sé el primero en pedir un juego!</p>'
      : '<p class="pending-empty">Muy pronto anunciaré aquí los juegos que tengo en mente.</p>';
    return;
  }
  lista.forEach(j => {
    const d = document.createElement('div');
    d.className = 'pending-card';
    d.innerHTML = (j.steam ? `<img class="pending-img" alt="" loading="lazy" src="https://shared.steamstatic.com/store_item_assets/steam/apps/${j.steam}/header.jpg">` : '') + `<span class="pending-platform"></span><b></b><span class="pending-status ${ESTADOS[j.estado] || 'st-pedido'}"></span>`;
    d.querySelector('.pending-platform').textContent = j.plataforma || '';
    d.querySelector('b').textContent = j.juego;
    d.querySelector('.pending-status').textContent = j.estado || 'Pedido';
    grid.appendChild(d);
  });
});

/* =========================================================
   CONTACTO — los mensajes llegan a tu Gmail a través de FormSubmit.
   La primera vez que alguien envíe el formulario te llegará un correo
   de FormSubmit para "Activar": púlsalo y desde entonces llegan solos.
   ========================================================= */
const CORREO = 'lemulte@gmail.com';
const form = document.getElementById('contact-form');
if (form) {
  const dl = document.getElementById('lista-juegos');
  document.querySelectorAll('.project-card h3').forEach(h => { const o = document.createElement('option'); o.value = h.textContent; dl.appendChild(o); });
  let a = 0, b = 0;
  const nuevaPregunta = () => { a = 2 + Math.floor(Math.random() * 8); b = 1 + Math.floor(Math.random() * 9); document.getElementById('captcha-q').textContent = `¿Cuánto es ${a} + ${b}?`; };
  nuevaPregunta();
  document.querySelectorAll('[data-pedir]').forEach(el => el.addEventListener('click', () => {
    form.motivo.value = 'Petición de un juego';
    form.juego.value = '';
    setTimeout(() => form.juego.focus(), 500);
  }));
  const status = form.querySelector('.form-status');
  form.addEventListener('submit', async e => {
    e.preventDefault();
    status.className = 'form-status';
    const email = form.email.value.trim(), juego = form.juego.value.trim(), mensaje = form.mensaje.value.trim();
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) { status.textContent = 'Escribe un correo válido para poder responderte.'; status.classList.add('err'); form.email.focus(); return; }
    if (!juego) { status.textContent = 'Indica el título del juego.'; status.classList.add('err'); form.juego.focus(); return; }
    if (mensaje.length < 5) { status.textContent = 'Escribe tu mensaje.'; status.classList.add('err'); form.mensaje.focus(); return; }
    if (parseInt(form.captcha.value, 10) !== a + b) { status.textContent = 'La respuesta anti-robots no es correcta.'; status.classList.add('err'); nuevaPregunta(); form.captcha.value = ''; form.captcha.focus(); return; }
    if (form._honey.value) return;
    const btn = form.querySelector('button'); btn.disabled = true; btn.textContent = 'Enviando…';
    try {
      const r = await fetch(`https://formsubmit.co/ajax/${CORREO}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          _subject: `[Lemulte] ${form.motivo.value} — ${juego}`,
          _replyto: email, _template: 'table', _captcha: 'false',
          Correo: email, Motivo: form.motivo.value, Juego: juego, Mensaje: mensaje
        })
      });
      const data = await r.json().catch(() => ({}));
      if (/activat/i.test(data.message || '')) { status.textContent = 'El formulario aún no está activado. Si eres Lemulte, revisa tu Gmail y pulsa «Activate Form».'; status.classList.add('err'); return; }
      if (!r.ok || data.success === 'false' || data.success === false) throw new Error(data.message || r.status);
      form.reset(); nuevaPregunta();
      status.textContent = '¡Mensaje enviado! Te responderé a tu correo lo antes posible.'; status.classList.add('ok');
    } catch (err) {
      status.innerHTML = 'No se ha podido enviar. Escríbeme directamente a <a href="mailto:' + CORREO + '">' + CORREO + '</a>.'; status.classList.add('err');
    } finally { btn.disabled = false; btn.textContent = 'Enviar mensaje'; }
  });
}

/* EN DESARROLLO — se pinta a partir de EN_DESARROLLO (proyectos.js) */
(() => {
  const cont = document.querySelector('.development-list');
  if (!cont || typeof EN_DESARROLLO === 'undefined' || !EN_DESARROLLO.length) return;
  document.querySelector('.development-empty')?.remove();
  const fmt = f => { const [y, m, d] = f.split('-'); return `${d}/${m}/${y}`; };
  EN_DESARROLLO.forEach(p => {
    const pct = Math.max(0, Math.min(100, Number(p.porcentaje) || 0));
    const card = document.createElement('article');
    card.className = 'dev-card';
    card.innerHTML = `
      ${p.steam ? `<img class="dev-img" alt="" src="https://shared.steamstatic.com/store_item_assets/steam/apps/${p.steam}/header.jpg">` : ''}
      <div class="dev-body">
        <div class="dev-top"><span class="dev-platform"></span><span class="dev-status"></span></div>
        <h3></h3>
        <div class="dev-progress"><div class="dev-bar"><span style="width:${pct}%"></span></div><b>${pct}%</b></div>
        <div class="dev-news"><p class="dev-news-title">Novedades</p><ul></ul></div>
      </div>`;
    card.querySelector('.dev-platform').textContent = p.plataforma || '';
    card.querySelector('.dev-status').textContent = p.estado || 'Traduciendo';
    card.querySelector('h3').textContent = p.juego;
    const ul = card.querySelector('ul');
    (p.novedades || []).forEach(n => {
      const li = document.createElement('li');
      li.innerHTML = '<time></time><span></span>';
      li.querySelector('time').textContent = fmt(n.fecha);
      li.querySelector('span').textContent = n.texto;
      ul.appendChild(li);
    });
    if (!ul.children.length) card.querySelector('.dev-news').remove();
    cont.appendChild(card);
  });
})();
