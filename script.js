const year = document.querySelector('[data-year]');
const form = document.querySelector('[data-enquiry-form]');
const splash = document.querySelector('[data-splash]');
const studioOverlay = document.querySelector('[data-studio-overlay]');
const studioOpeners = document.querySelectorAll('[data-studio-open]');
const studioClosers = document.querySelectorAll('[data-studio-close]');
const lightbox = document.querySelector('[data-lightbox]');
const lightboxImage = document.querySelector('[data-lightbox-image]');
const lightboxTag = document.querySelector('[data-lightbox-tag]');
const lightboxTitle = document.querySelector('[data-lightbox-title]');
const lightboxClosers = document.querySelectorAll('[data-lightbox-close]');
const lightboxOpeners = document.querySelectorAll('[data-lightbox-open]');

const dismissSplash = () => {
  if (!splash || splash.classList.contains('is-done')) return;
  splash.classList.add('is-done');
  splash.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('is-loading');
  window.setTimeout(() => {
    splash.remove();
  }, 850);
};

const initSplash = () => {
  if (!splash) {
    document.body.classList.remove('is-loading');
    return;
  }

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hold = reduceMotion ? 450 : 2600;
  const start = performance.now();
  let finished = false;

  const finish = () => {
    if (finished) return;
    finished = true;
    const elapsed = performance.now() - start;
    window.setTimeout(dismissSplash, Math.max(0, hold - elapsed));
  };

  const splashImg = splash.querySelector('.splash-bg img');
  if (splashImg) {
    if (splashImg.complete) finish();
    else {
      splashImg.addEventListener('load', finish, { once: true });
      splashImg.addEventListener('error', finish, { once: true });
    }
  } else if (document.readyState === 'complete') {
    finish();
  } else {
    window.addEventListener('load', finish, { once: true });
  }

  window.setTimeout(dismissSplash, reduceMotion ? 900 : 4200);
};

const openStudios = () => {
  if (!studioOverlay) return;
  studioOverlay.classList.add('is-open');
  studioOverlay.setAttribute('aria-hidden', 'false');
  document.body.classList.add('menu-open');
  studioOpeners.forEach((btn) => btn.setAttribute('aria-expanded', 'true'));
};

const closeStudios = () => {
  if (!studioOverlay) return;
  studioOverlay.classList.remove('is-open');
  studioOverlay.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('menu-open');
  studioOpeners.forEach((btn) => btn.setAttribute('aria-expanded', 'false'));
};

const openLightbox = (trigger) => {
  if (!lightbox || !lightboxImage) return;
  const src = trigger.getAttribute('data-src') || '';
  const alt = trigger.getAttribute('data-alt') || '';
  const tag = trigger.getAttribute('data-tag') || '';
  const title = trigger.getAttribute('data-title') || '';

  lightboxImage.alt = alt;
  lightboxImage.src = src;
  if (lightboxTag) lightboxTag.textContent = tag;
  if (lightboxTitle) lightboxTitle.textContent = title;

  lightbox.classList.add('is-open');
  lightbox.setAttribute('aria-hidden', 'false');
  document.body.classList.add('lightbox-open');
};

const closeLightbox = () => {
  if (!lightbox) return;
  lightbox.classList.remove('is-open');
  lightbox.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('lightbox-open');
  window.setTimeout(() => {
    if (!lightbox.classList.contains('is-open') && lightboxImage) {
      lightboxImage.removeAttribute('src');
      lightboxImage.alt = '';
    }
  }, 400);
};

initSplash();

/* Lightweight dual-layer rose parallax (GPU only, rAF throttled) */
const initRoseParallax = () => {
  const field = document.querySelector('[data-rose-field]');
  if (!field) return;

  const petals = field.querySelector('[data-rose-layer="petals"]');
  const border = field.querySelector('[data-rose-layer="border"]');
  if (!petals || !border) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion) return;

  let ticking = false;
  let latestY = window.scrollY || 0;

  const paint = () => {
    const y = latestY;
    // Subtle depth only — impressive without jank
    petals.style.transform = `translate3d(0, ${y * 0.11}px, 0)`;
    border.style.transform = `translate3d(0, ${y * 0.05}px, 0)`;
    ticking = false;
  };

  const onScroll = () => {
    latestY = window.scrollY || 0;
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(paint);
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  paint();
};

initRoseParallax();

studioOpeners.forEach((btn) => {
  btn.setAttribute('aria-expanded', 'false');
  btn.addEventListener('click', (event) => {
    event.stopPropagation();
    if (studioOverlay?.classList.contains('is-open')) closeStudios();
    else openStudios();
  });
});

studioClosers.forEach((btn) => btn.addEventListener('click', closeStudios));

lightboxOpeners.forEach((btn) => {
  btn.addEventListener('click', () => openLightbox(btn));
});

lightboxClosers.forEach((btn) => btn.addEventListener('click', closeLightbox));

document.addEventListener('keydown', (event) => {
  if (event.key !== 'Escape') return;
  if (lightbox?.classList.contains('is-open')) closeLightbox();
  else closeStudios();
});

/* High-performance video viewport autoplay/pause observer */
const initMomentVideo = () => {
  const video = document.querySelector('.moment-cinematic-video');
  if (!video) return;

  video.muted = true;
  video.defaultMuted = true;

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const playPromise = video.play();
            if (playPromise !== undefined) {
              playPromise.catch(() => {});
            }
          } else {
            video.pause();
          }
        });
      },
      { threshold: 0.1, rootMargin: '80px 0px' }
    );
    observer.observe(video);
  }
};

initMomentVideo();

// Dynamic Copyright Years on all pages
const allYearEls = document.querySelectorAll('[data-year]');
allYearEls.forEach((el) => {
  el.textContent = String(new Date().getFullYear());
});

// Interactive Newsletter Subscriptions
const newsletterForms = document.querySelectorAll('[data-newsletter-form]');
newsletterForms.forEach((nForm) => {
  nForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const input = nForm.querySelector('input[type="email"]');
    const feedback = nForm.querySelector('[data-newsletter-feedback]');
    const submitBtn = nForm.querySelector('button[type="submit"]');
    if (!input || !input.value.trim()) return;

    if (feedback) {
      feedback.textContent = 'Thank you for joining our private circle.';
      feedback.classList.add('is-visible');
    }
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span>Joined</span> ✓';
    }
    input.value = '';

    window.setTimeout(() => {
      if (feedback) {
        feedback.classList.remove('is-visible');
      }
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<span>Join</span> <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>';
      }
    }, 4500);
  });
});

// Smooth Back to Top
const backToTopBtns = document.querySelectorAll('.back-to-top');
backToTopBtns.forEach((btn) => {
  btn.addEventListener('click', (event) => {
    event.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
});

form?.addEventListener('submit', (event) => {
  event.preventDefault();
  const data = new FormData(form);
  const subject = `New ${data.get('interest')} enquiry — ${data.get('name')}`;
  const body = [
    `Name: ${data.get('name')}`,
    `Email: ${data.get('email')}`,
    `Interest: ${data.get('interest')}`,
    '',
    'Project details:',
    data.get('message'),
  ].join('\n');
  window.location.href = `mailto:kambiliandco@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
});
