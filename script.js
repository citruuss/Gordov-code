// Всегда возвращаться наверх при обновлении страницы
history.scrollRestoration = 'manual';

/* ============================================================
   HEADER — scroll effect
   ============================================================ */
const header = document.getElementById('header');

window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

/* ============================================================
   BURGER MENU
   ============================================================ */
const burger = document.getElementById('burger');
const mobileMenu = document.getElementById('mobileMenu');

burger.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
  const isOpen = mobileMenu.classList.contains('open');
  burger.setAttribute('aria-expanded', isOpen);
});

// Close on link click
mobileMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
  });
});

/* ============================================================
   SMOOTH SCROLL
   ============================================================ */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = 80;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

/* ============================================================
   REVEAL ON SCROLL
   ============================================================ */
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ============================================================
   FUNNEL BARS ANIMATION
   ============================================================ */
const funnelObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.funnel__bar').forEach(bar => {
        const targetWidth = bar.style.width;
        bar.style.width = '0';
        requestAnimationFrame(() => {
          setTimeout(() => { bar.style.width = targetWidth; }, 100);
        });
      });
      funnelObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

const funnel = document.querySelector('.funnel');
if (funnel) funnelObserver.observe(funnel);

/* ============================================================
   METRIC BARS ANIMATION
   ============================================================ */
const metricObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.metric__fill').forEach(fill => {
        const step1  = fill.dataset.step1;   // +30–70%: two-step grow
        const shrink = fill.dataset.shrink;  // −70%: fill then shrink
        const w      = parseFloat(fill.dataset.width || '0');

        if (step1 !== undefined) {
          // +30–70%: appear at 30% instantly, then animate to 70%
          const s1 = parseFloat(step1);
          const s2 = parseFloat(fill.dataset.step2 || s1);
          fill.style.transition = 'none';
          fill.style.width = s1 + '%';
          requestAnimationFrame(() => requestAnimationFrame(() => {
            fill.style.transition = 'width 1s cubic-bezier(0.4, 0, 0.2, 1) 0.4s';
            fill.style.width = s2 + '%';
          }));

        } else if (shrink !== undefined) {
          // −70%: appear at 100% instantly, then shrink to 30%
          const finalW = parseFloat(shrink);
          fill.style.transition = 'none';
          fill.style.width = w + '%';
          requestAnimationFrame(() => requestAnimationFrame(() => {
            fill.style.transition = 'width 1s cubic-bezier(0.4, 0, 0.2, 1) 0.4s';
            fill.style.width = finalW + '%';
          }));

        } else {
          // ×5: simple fill 0→100%
          fill.style.transition = 'width 1.4s cubic-bezier(0.4, 0, 0.2, 1) 0.3s';
          fill.style.width = w + '%';
        }
      });
      metricObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

const metricsSection = document.querySelector('.money__metrics');
if (metricsSection) metricObserver.observe(metricsSection);

/* ============================================================
   COUNTER ANIMATION FOR METRIC NUMBERS
   ============================================================ */
function animateCounter(el, from, to, suffix, duration) {
  const start = performance.now();
  const update = now => {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.round(from + (to - from) * eased);
    el.textContent = (current >= 0 ? (suffix.startsWith('+') ? '+' : '') : '-') + Math.abs(current) + (suffix.includes('%') ? '%' : '');
    if (progress < 1) requestAnimationFrame(update);
  };
  requestAnimationFrame(update);
}

/* ============================================================
   FORM VALIDATION & SUBMIT
   ============================================================ */
const form = document.getElementById('mainForm');
const formSuccess = document.getElementById('formSuccess');

if (form) {
  form.addEventListener('submit', e => {
    e.preventDefault();
    let valid = true;

    const fields = [
      { id: 'name', errId: 'nameError' },
      { id: 'niche', errId: 'nicheError' },
      { id: 'contact', errId: 'contactError' },
    ];

    fields.forEach(({ id, errId }) => {
      const input = document.getElementById(id);
      const err = document.getElementById(errId);
      const isEmpty = !input.value.trim();
      input.classList.toggle('error', isEmpty);
      err.classList.toggle('visible', isEmpty);
      if (isEmpty) valid = false;
    });

    if (!valid) return;

    // Simulate submission
    const btnText = form.querySelector('.btn-text');
    const btnLoader = form.querySelector('.btn-loader');
    const submitBtn = form.querySelector('[type="submit"]');

    submitBtn.disabled = true;
    btnText.classList.add('hidden');
    btnLoader.classList.remove('hidden');

    setTimeout(() => {
      form.classList.add('hidden');
      formSuccess.classList.remove('hidden');
    }, 1200);
  });

  // Clear error on input
  form.querySelectorAll('.form__input').forEach(input => {
    input.addEventListener('input', () => {
      input.classList.remove('error');
      const errEl = document.getElementById(input.id + 'Error');
      if (errEl) errEl.classList.remove('visible');
    });
  });
}

/* ============================================================
   HERO PARALLAX (subtle)
   ============================================================ */
const heroGlow1 = document.querySelector('.hero__glow--1');
const heroGlow2 = document.querySelector('.hero__glow--2');

if (heroGlow1 && heroGlow2) {
  window.addEventListener('mousemove', e => {
    const x = (e.clientX / window.innerWidth - 0.5) * 30;
    const y = (e.clientY / window.innerHeight - 0.5) * 20;
    heroGlow1.style.transform = `translate(${x}px, ${y}px)`;
    heroGlow2.style.transform = `translate(${-x * 0.5}px, ${-y * 0.5}px)`;
  }, { passive: true });
}

/* ============================================================
   ACTIVE NAV LINK on scroll
   ============================================================ */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

const navObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(link => {
        link.classList.toggle(
          'active',
          link.getAttribute('href') === '#' + entry.target.id
        );
      });
    }
  });
}, { threshold: 0.5, rootMargin: '-80px 0px 0px 0px' });

sections.forEach(s => navObserver.observe(s));
