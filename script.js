'use strict';

/* ═══════════════════════════════════
   PERFORMANCE UTILS
=================================== */
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Shared mouse state
let mouseX = window.innerWidth / 2, mouseY = window.innerHeight / 2;
window.addEventListener('mousemove', e => { mouseX = e.clientX; mouseY = e.clientY; }, { passive: true });

/* ═══════════════════════════════════
   CURSOR — only update when mouse moved
=================================== */
const dot  = document.getElementById('cur-dot');
const ring = document.getElementById('cur-ring');
dot.style.cssText  += ';will-change:transform;left:0;top:0';
ring.style.cssText += ';will-change:transform;left:0;top:0';

let rx = mouseX, ry = mouseY;
let cursorMoved = false;
window.addEventListener('mousemove', () => { cursorMoved = true; }, { passive: true });

(function cursorLoop() {
  if (cursorMoved || Math.abs(rx - mouseX) > 0.5 || Math.abs(ry - mouseY) > 0.5) {
    rx += (mouseX - rx) * 0.13;
    ry += (mouseY - ry) * 0.13;
    dot.style.transform  = `translate3d(${mouseX}px,${mouseY}px,0) translate(-50%,-50%)`;
    ring.style.transform = `translate3d(${rx}px,${ry}px,0) translate(-50%,-50%)`;
    cursorMoved = false;
  }
  requestAnimationFrame(cursorLoop);
})();

document.querySelectorAll('a,button,.pill,.stag').forEach(el => {
  el.addEventListener('mouseenter', () => document.body.classList.add('cursor-grow'),    { passive: true });
  el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-grow'), { passive: true });
});

/* ═══════════════════════════════════
   SCROLL UI — passive listener only
   progress bar uses scaleX (no layout)
=================================== */
const progEl = document.getElementById('prog');
const navEl  = document.getElementById('nav');

// Set once — never changes
progEl.style.transformOrigin = 'left';
progEl.style.width = '100%';

window.addEventListener('scroll', () => {
  const p = window.scrollY / (document.body.scrollHeight - window.innerHeight);
  progEl.style.transform = `scaleX(${p})`;
  navEl.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

/* ═══════════════════════════════════
   THEME — CSS blobs update automatically
=================================== */
function toggleTheme() {
  const h = document.documentElement;
  h.setAttribute('data-theme', h.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
}

/* ═══════════════════════════════════
   MOBILE MENU
=================================== */
function tMob() { document.getElementById('mob').classList.toggle('open'); }
function cMob() { document.getElementById('mob').classList.remove('open'); }

/* ═══════════════════════════════════
   GSAP — ScrollTrigger.batch() + transform-only
=================================== */
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

// FIX 17: Set will-change on all animated elements before animations start
document.querySelectorAll('.gsap-fade,.gsap-title,.gsap-fade-up,.gsap-slide-l,.gsap-slide-r')
  .forEach(el => { el.style.willChange = 'transform, opacity'; });

// FIX 18: Use gsap.set to pre-hide (avoids FOUC flash)
gsap.set('.gsap-fade, .gsap-title, .gsap-fade-up, .gsap-slide-l, .gsap-slide-r', { visibility: 'visible' });

/* ── Hero entrance ── */
if (!prefersReducedMotion) {
  const heroTL = gsap.timeline({ delay: 0.15, defaults: { ease: 'power3.out' } });
  heroTL
    .to('#eyebrow-line',      { scaleX: 1, duration: 0.7 })
    .from('#hero-eyebrow span', { opacity: 0, y: 8, duration: 0.45 }, '-=0.35')
    .from(['#hw-1','#hw-2','#hw-3'], { yPercent: 105, duration: 0.95, ease: 'power4.out', stagger: 0.1 }, '-=0.2')
    .from('#hero-right',      { opacity: 0, x: 36, duration: 0.8 }, '-=0.65')
    .from('.hero-stat',       { opacity: 0, y: 18, duration: 0.45, stagger: 0.07 }, '-=0.45')
    .from('#hero-cta',        { opacity: 0, y: 14, duration: 0.4 }, '-=0.25')
    .from('#hero-bottom',     { opacity: 0, duration: 0.4 }, '-=0.2');
}

/* ── FIX 19: ScrollTrigger.batch() — ONE IntersectionObserver for all fade elements ── */
ScrollTrigger.batch('.gsap-fade', {
  start: 'top 90%',
  onEnter: els => gsap.from(els, { opacity: 0, y: 18, duration: 0.65, ease: 'power2.out', stagger: 0.05 }),
  once: true
});

ScrollTrigger.batch('.gsap-title', {
  start: 'top 87%',
  onEnter: els => gsap.from(els, { opacity: 0, y: 28, duration: 0.9, ease: 'power4.out', stagger: 0.08 }),
  once: true
});

ScrollTrigger.batch('.gsap-fade-up', {
  start: 'top 88%',
  onEnter: els => gsap.from(els, { opacity: 0, y: 40, duration: 0.8, ease: 'power3.out', stagger: 0.07 }),
  once: true
});

ScrollTrigger.batch('.gsap-slide-l', {
  start: 'top 86%',
  onEnter: els => gsap.from(els, { opacity: 0, x: -50, duration: 0.9, ease: 'power3.out', stagger: 0.06 }),
  once: true
});

ScrollTrigger.batch('.gsap-slide-r', {
  start: 'top 86%',
  onEnter: els => gsap.from(els, { opacity: 0, x: 50, duration: 0.9, ease: 'power3.out', stagger: 0.06 }),
  once: true
});

/* ── Skill bars ── */
ScrollTrigger.batch('.skill-bar', {
  start: 'top 92%',
  onEnter: els => {
    els.forEach(bar => gsap.to(bar, { width: bar.dataset.w + '%', duration: 1.5, ease: 'power3.out' }));
  },
  once: true
});

/* ── Skill cats stagger ── */
if (window.innerWidth > 900) {
  ScrollTrigger.batch('.skill-cat', {
    start: 'top 82%',
    onEnter: els => gsap.from(els, { opacity: 0, y: 32, duration: 0.75, ease: 'power3.out', stagger: 0.1 }),
    once: true
  });
}

/* ── KPI count-up ── */
document.querySelectorAll('.kpi-n').forEach(el => {
  const raw    = el.textContent.trim();
  const num    = parseFloat(raw);
  const suffix = raw.replace(/[0-9.]/g, '');
  el.textContent = '0' + suffix;
  ScrollTrigger.create({
    trigger: el, start: 'top 90%', once: true,
    onEnter: () => {
      const obj = { v: 0 };
      gsap.to(obj, {
        v: num, duration: 1.5, ease: 'power2.out',
        onUpdate() { el.textContent = Math.round(obj.v) + suffix; }
      });
    }
  });
});

/* ── Pills stagger ── */
ScrollTrigger.batch('.pill-wrap', {
  start: 'top 92%',
  onEnter: wraps => {
    wraps.forEach(w => gsap.from(w.querySelectorAll('.pill'), { opacity: 0, y: 6, stagger: 0.035, duration: 0.35, ease: 'power2.out' }));
  },
  once: true
});

/* ── Smooth anchor scroll ── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const t = document.querySelector(a.getAttribute('href'));
    if (t) { e.preventDefault(); gsap.to(window, { scrollTo: { y: t, offsetY: 72 }, duration: 1.1, ease: 'power3.inOut' }); }
  });
});

/* ── FIX 20: Refresh ScrollTrigger after fonts load ── */
document.fonts.ready.then(() => ScrollTrigger.refresh());