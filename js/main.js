'use strict';

// ── Check reduced motion preference ────────────────────────
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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
handleNavbarScroll();

// ── 2. Hamburger / Mobile menu ────────────────────────────────
const hamburger  = document.getElementById('hamburger');
const navMenu    = document.getElementById('navMenu');

hamburger.addEventListener('click', () => {
  const isOpen = navMenu.classList.toggle('open');
  hamburger.classList.toggle('open', isOpen);
  hamburger.setAttribute('aria-expanded', isOpen.toString());
});

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
      .getPropertyValue('--nav-height') || '72', 10);
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

// ── 4. Pricing carousel ───────────────────────────────────────
const pricingViewport = document.querySelector('.pricing-viewport');
const pricingSlider = document.querySelector('[data-pricing-slider]');
const pricingPrev = document.querySelector('[data-slider-prev]');
const pricingNext = document.querySelector('[data-slider-next]');

function getPricingStep() {
  const firstCard = pricingSlider?.querySelector('.pricing-card');
  if (!firstCard || !pricingViewport) return 320;
  const styles = getComputedStyle(pricingSlider);
  const gap = parseFloat(styles.columnGap || styles.gap || '16');
  return firstCard.getBoundingClientRect().width + gap;
}

function updatePricingButtons() {
  if (!pricingViewport || !pricingPrev || !pricingNext) return;
  const maxScroll = pricingViewport.scrollWidth - pricingViewport.clientWidth - 2;
  pricingPrev.disabled = pricingViewport.scrollLeft <= 2;
  pricingNext.disabled = pricingViewport.scrollLeft >= maxScroll;
}

function scrollPricing(direction) {
  if (!pricingViewport) return;
  pricingViewport.scrollBy({
    left: getPricingStep() * direction,
    behavior: prefersReducedMotion ? 'auto' : 'smooth'
  });
}

if (pricingViewport && pricingSlider) {
  pricingPrev?.addEventListener('click', () => scrollPricing(-1));
  pricingNext?.addEventListener('click', () => scrollPricing(1));
  pricingViewport.addEventListener('scroll', updatePricingButtons, { passive: true });
  window.addEventListener('resize', updatePricingButtons, { passive: true });
  updatePricingButtons();
}

// ── 5. Counter animation (with easing) ────────────────────────
function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }

function animateCounter(el) {
  const target   = parseFloat(el.dataset.target);
  const suffix   = el.dataset.suffix || '';
  const duration = prefersReducedMotion ? 100 : 1800;
  const start    = performance.now();
  const isDecimal = !Number.isInteger(target);

  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const easedProgress = easeOutCubic(progress);
    const current = easedProgress * target;

    el.textContent = isDecimal
      ? current.toFixed(1) + suffix
      : Math.floor(current) + suffix;

    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      el.textContent = isDecimal
        ? target.toFixed(1) + suffix
        : Math.floor(target) + suffix;
    }
  }

  requestAnimationFrame(update);
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

// ── 6. Fade-in on scroll ──────────────────────────────────────
const fadeObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      const siblings = Array.from(entry.target.parentElement.children)
        .filter(c => c.classList.contains('fade-in'));
      const idx = siblings.indexOf(entry.target);
      if (!prefersReducedMotion) {
        entry.target.style.transitionDelay = `${idx * 80}ms`;
      }
      entry.target.classList.add('visible');
      fadeObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.fade-in').forEach(el => {
  if (prefersReducedMotion) el.classList.add('visible');
  else fadeObserver.observe(el);
});

// ── 7. Radio Player ───────────────────────────────────────────
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

if (volumeSlider && audioEl) {
  volumeSlider.addEventListener('input', () => {
    audioEl.volume = volumeSlider.value / 100;
  });
  audioEl.volume = 0.75;
  volumeSlider.value = 75;
}

// ── 8. Back-to-top button ─────────────────────────────────────
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

// ── 9. Particles (hero decorative) ───────────────────────────
(function spawnParticles() {
  if (prefersReducedMotion) return;
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

// ── 10. Floating WhatsApp ──────────────────────────────────
const WHATSAPP_NUMBER = '573012151887';
const DEFAULT_WHATSAPP_MSG = '¡Hola! Me gustaría recibir más información sobre sus servicios. Vengo desde la web plussoluciones.com';

function openWhatsApp(message) {
  const text = encodeURIComponent(message);
  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${text}`, '_blank', 'noopener,noreferrer');
}

const whatsappBtn = document.getElementById('whatsappBtn');

if (whatsappBtn) {
  whatsappBtn.addEventListener('click', () => {
    openWhatsApp(DEFAULT_WHATSAPP_MSG);
  });
}

// ── 11. WhatsApp data-attribute links ──────────────────────
document.querySelectorAll('[data-whatsapp]').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    openWhatsApp(link.dataset.whatsapp);
  });
});
