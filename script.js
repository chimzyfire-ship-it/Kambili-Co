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
  if (lightboxTag) lightboxTag.textContent = tag;
  if (lightboxTitle) lightboxTitle.textContent = title;

  lightbox.classList.add('is-open');
  lightbox.setAttribute('aria-hidden', 'false');
  document.body.classList.add('lightbox-open');

  const show = () => {
    lightboxImage.src = src;
  };

  if ('decode' in Image.prototype) {
    const preload = new Image();
    preload.src = src;
    preload.decode().then(show).catch(show);
  } else {
    show();
  }
};

const closeLightbox = () => {
  if (!lightbox) return;
  lightbox.classList.remove('is-open');
  lightbox.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('lightbox-open');
  if (lightboxImage) {
    lightboxImage.removeAttribute('src');
    lightboxImage.alt = '';
  }
};

initSplash();

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

if (year) year.textContent = String(new Date().getFullYear());

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
