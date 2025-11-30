/**
 * Utilidad para animaciones de scroll reveal
 * Revela elementos cuando entran en el viewport
 */

export interface ScrollRevealOptions {
  threshold?: number;
  rootMargin?: string;
  once?: boolean;
}

/**
 * Inicializa el efecto de scroll reveal en elementos con la clase 'scroll-reveal'
 */
export function initScrollReveal(options: ScrollRevealOptions = {}): void {
  if (typeof window === 'undefined') return;

  const {
    threshold = 0.1,
    rootMargin = '0px 0px -100px 0px',
    once = true,
  } = options;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          if (once) {
            observer.unobserve(entry.target);
          }
        } else if (!once) {
          entry.target.classList.remove('revealed');
        }
      });
    },
    {
      threshold,
      rootMargin,
    }
  );

  // Observar todos los elementos con la clase scroll-reveal
  const elements = document.querySelectorAll('.scroll-reveal');
  elements.forEach((el) => observer.observe(el));
}

/**
 * Agrega la clase scroll-reveal a elementos dinámicamente
 */
export function addScrollReveal(selector: string): void {
  if (typeof window === 'undefined') return;

  const elements = document.querySelectorAll(selector);
  elements.forEach((el) => {
    if (!el.classList.contains('scroll-reveal')) {
      el.classList.add('scroll-reveal');
    }
  });
}

