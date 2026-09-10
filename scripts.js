// Header shadow on scroll + back-to-top
const header = document.getElementById('site-header');
const backToTop = document.getElementById('back-to-top');
let ticking = false;
function onScroll() {
  if (!ticking) {
    requestAnimationFrame(() => {
      if (header) header.classList.toggle('scrolled', window.scrollY > 12);
      if (backToTop) backToTop.classList.toggle('visible', window.scrollY > 600);
      ticking = false;
    });
    ticking = true;
  }
}
window.addEventListener('scroll', onScroll, { passive: true });
if (backToTop) backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

// Scroll reveal
const io = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

// Drawers (cart + search + mobile menu)
const backdrop = document.getElementById('backdrop');
const drawers = {
  cart: document.getElementById('drawer-cart'),
  search: document.getElementById('drawer-search'),
  menu: document.getElementById('mobile-nav'),
};
function openDrawer(name) {
  Object.values(drawers).forEach(d => { if (d) { d.classList.remove('open'); d.setAttribute('aria-hidden', 'true'); } });
  const target = drawers[name];
  if (!target) return;
  target.classList.add('open');
  target.setAttribute('aria-hidden', 'false');
  if (backdrop) backdrop.classList.add('open');
  document.body.classList.add('no-scroll');
  const focusable = target.querySelector('input, button, a');
  if (focusable) setTimeout(() => focusable.focus(), 300);
}
function closeDrawers() {
  Object.values(drawers).forEach(d => { if (d) { d.classList.remove('open'); d.setAttribute('aria-hidden', 'true'); } });
  if (backdrop) backdrop.classList.remove('open');
  document.body.classList.remove('no-scroll');
}
document.querySelectorAll('[data-open]').forEach(btn => {
  btn.addEventListener('click', e => { e.preventDefault(); openDrawer(btn.dataset.open); });
});
document.querySelectorAll('.drawer-close').forEach(btn => btn.addEventListener('click', closeDrawers));
if (backdrop) backdrop.addEventListener('click', closeDrawers);
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeDrawers(); });

// Product filter tabs
const tabs = document.querySelectorAll('.filter-tabs button');
const productEls = document.querySelectorAll('#products .product');
tabs.forEach(tab => tab.addEventListener('click', () => {
  tabs.forEach(t => t.classList.remove('active'));
  tab.classList.add('active');
  const f = tab.dataset.filter;
  productEls.forEach(p => {
    p.style.display = (f === 'all' || p.dataset.category === f) ? '' : 'none';
  });
}));

// Quick add → cart count (persisted per-session via sessionStorage)
const cartCount = document.getElementById('cart-count');
let count = parseInt(sessionStorage.getItem('cart-count') || '0', 10);
if (cartCount) cartCount.textContent = count;
document.querySelectorAll('.quick-add').forEach(btn => {
  // Inquiry links (wearables / puzzles) navigate to mailto — skip cart logic.
  if (btn.tagName === 'A') return;
  btn.dataset.original = btn.textContent.replace(/^Quick Add · /, '');
  btn.addEventListener('click', e => {
    e.stopPropagation();
    count += 1;
    sessionStorage.setItem('cart-count', String(count));
    if (cartCount) {
      cartCount.textContent = count;
      cartCount.animate([{ transform: 'scale(1.6)' }, { transform: 'scale(1)' }], { duration: 300, easing: 'cubic-bezier(.34,1.56,.64,1)' });
    }
    btn.textContent = 'Added ✓';
    setTimeout(() => { btn.textContent = 'Quick Add · ' + btn.dataset.original; }, 1400);
  });
});

// Newsletter form
const nf = document.getElementById('newsletter-form');
if (nf) {
  nf.addEventListener('submit', e => {
    e.preventDefault();
    const input = nf.querySelector('input');
    if (!input.value.includes('@')) { input.focus(); return; }
    nf.classList.add('success');
    nf.querySelector('button').textContent = 'Thank You ✓';
    input.value = '';
    setTimeout(() => { nf.classList.remove('success'); nf.querySelector('button').textContent = 'Subscribe'; }, 3200);
  });
}

// Contact form
const cf = document.getElementById('contact-form');
if (cf) {
  cf.addEventListener('submit', e => {
    e.preventDefault();
    const btn = cf.querySelector('button[type="submit"]');
    btn.textContent = 'Sending…';
    setTimeout(() => {
      btn.textContent = 'Message Sent ✓';
      cf.reset();
      setTimeout(() => { btn.textContent = 'Send Message'; }, 2800);
    }, 600);
  });
}

// Cookie banner
const cookie = document.getElementById('cookie');
if (cookie && !localStorage.getItem('cookie-choice')) {
  setTimeout(() => cookie.classList.add('visible'), 1200);
}
['cookie-accept', 'cookie-decline'].forEach(id => {
  const el = document.getElementById(id);
  if (el) el.addEventListener('click', () => {
    localStorage.setItem('cookie-choice', id === 'cookie-accept' ? 'accepted' : 'declined');
    cookie.classList.remove('visible');
  });
});
