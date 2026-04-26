/* ============================================================
   Plus Soluciones — main.js
   Vanilla JS: navbar, menu, smooth scroll, counters,
   radio player, fade-in animations
   ============================================================ */

'use strict';

// ── 1. Navbar scroll behavior ─────────────────────────────────
const navbar = document.getElementById('navbar');

function handleNavbarScroll() {
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
}

window.addEventListener('scroll', handleNavbarScroll, { passive: true });
handleNavbarScroll(); // run on load

// ── 2. Hamburger / Mobile menu ────────────────────────────────
const hamburger  = document.getElementById('hamburger');
const navMenu    = document.getElementById('navMenu');

hamburger.addEventListener('click', () => {
  const isOpen = navMenu.classList.toggle('open');
  hamburger.classList.toggle('open', isOpen);
  hamburger.setAttribute('aria-expanded', isOpen.toString());
});

// Close menu when a nav link is clicked
navMenu.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    navMenu.classList.remove('open');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
  });
});

// ── 3. Smooth scroll ─────────────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = parseInt(getComputedStyle(document.documentElement)
      .getPropertyValue('--nav-height') || '70', 10);
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

// ── 4. Counter animation ──────────────────────────────────────
function animateCounter(el) {
  const target   = parseFloat(el.dataset.target);
  const suffix   = el.dataset.suffix || '';
  const duration = 1800; // ms
  const step     = 16;   // ~60fps
  const steps    = duration / step;
  const increment = target / steps;
  let current = 0;

  const isDecimal = !Number.isInteger(target);

  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      current = target;
      clearInterval(timer);
    }
    el.textContent = isDecimal
      ? current.toFixed(1) + suffix
      : Math.floor(current) + suffix;
  }, step);
}

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !entry.target.dataset.counted) {
      entry.target.dataset.counted = 'true';
      animateCounter(entry.target);
    }
  });
}, { threshold: 0.4 });

document.querySelectorAll('.stat-number[data-target]').forEach(el => {
  statsObserver.observe(el);
});

// ── 5. Fade-in on scroll ──────────────────────────────────────
const fadeObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      // Stagger siblings in the same parent grid
      const siblings = Array.from(entry.target.parentElement.children)
        .filter(c => c.classList.contains('fade-in'));
      const idx = siblings.indexOf(entry.target);
      entry.target.style.transitionDelay = `${idx * 80}ms`;
      entry.target.classList.add('visible');
      fadeObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.fade-in').forEach(el => {
  fadeObserver.observe(el);
});

// ── 6. Radio Player ───────────────────────────────────────────
const radioSection = document.getElementById('radioPlayer');
const audioEl      = document.getElementById('radioAudio');
const playBtn      = document.getElementById('playBtn');
const volumeSlider = document.getElementById('volumeSlider');
const radioStatus  = document.getElementById('radioStatus');

let isPlaying = false;

function setStatus(msg) {
  if (radioStatus) radioStatus.textContent = msg;
}

function startPlayback() {
  audioEl.src = audioEl.dataset.src;
  audioEl.load();
  const promise = audioEl.play();
  if (promise !== undefined) {
    promise
      .then(() => {
        isPlaying = true;
        if (playBtn) playBtn.setAttribute('aria-pressed', 'true');
        radioSection.classList.add('playing');
        setStatus('Conectando al stream…');
      })
      .catch(() => {
        setStatus('Error al conectar. Intenta de nuevo.');
      });
  }
}

function stopPlayback() {
  audioEl.pause();
  audioEl.src = '';
  isPlaying = false;
  if (playBtn) playBtn.setAttribute('aria-pressed', 'false');
  radioSection.classList.remove('playing');
  setStatus('Reproducción detenida');
}

if (playBtn) {
  playBtn.addEventListener('click', () => {
    if (!isPlaying) {
      startPlayback();
    } else {
      stopPlayback();
    }
  });
}

// Audio events
if (audioEl) {
  audioEl.addEventListener('playing', () => {
    setStatus('▶ Transmisión en vivo');
    radioSection.classList.add('playing');
  });
  audioEl.addEventListener('waiting', () => setStatus('Buffering…'));
  audioEl.addEventListener('error',   () => {
    setStatus('No se pudo conectar al stream.');
    radioSection.classList.remove('playing');
    isPlaying = false;
  });
}

// Volume control
if (volumeSlider && audioEl) {
  volumeSlider.addEventListener('input', () => {
    audioEl.volume = volumeSlider.value / 100;
  });
  audioEl.volume = 0.75;
  volumeSlider.value = 75;
}

// ── 7. Back-to-top button ─────────────────────────────────────
const backTop = document.getElementById('backTop');

window.addEventListener('scroll', () => {
  if (backTop) {
    backTop.classList.toggle('show', window.scrollY > 500);
  }
}, { passive: true });

if (backTop) {
  backTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// ── 8. Particles (hero decorative) ───────────────────────────
(function spawnParticles() {
  const container = document.getElementById('heroParticles');
  if (!container) return;
  const count = 18;
  for (let i = 0; i < count; i++) {
    const p = document.createElement('span');
    p.classList.add('particle');
    const size = Math.random() * 6 + 3;
    p.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      left: ${Math.random() * 100}%;
      top: ${Math.random() * 100}%;
      animation-duration: ${Math.random() * 8 + 6}s;
      animation-delay: ${Math.random() * 5}s;
    `;
    container.appendChild(p);
  }
})();
