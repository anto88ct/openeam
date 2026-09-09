/** Fade+rise elements with class `.reveal` into view on scroll (see .reveal in global.css). */
export function initReveal() {
  const els = document.querySelectorAll<HTMLElement>('.reveal:not([data-reveal-inited])');
  if (!els.length) return;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    els.forEach((el) => {
      el.dataset.revealInited = 'true';
      el.classList.add('is-visible');
    });
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 },
  );

  els.forEach((el) => {
    el.dataset.revealInited = 'true';
    observer.observe(el);
  });
}
