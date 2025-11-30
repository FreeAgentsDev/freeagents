/**
 * Utilidades de optimización de rendimiento
 * Prefetching, lazy loading, y optimizaciones de recursos
 */

/**
 * Prefetcha una ruta cuando el usuario está cerca de hacer clic
 */
export function prefetchRoute(url: string): void {
  if (typeof window === 'undefined') return;
  
  // Verificar si ya se prefetchó
  const existing = document.querySelector(`link[rel="prefetch"][href="${url}"]`);
  if (existing) return;
  
  const link = document.createElement('link');
  link.rel = 'prefetch';
  link.href = url;
  link.as = 'document';
  document.head.appendChild(link);
}

/**
 * Preload una imagen crítica
 */
export function preloadImage(src: string): void {
  if (typeof window === 'undefined') return;
  
  const existing = document.querySelector(`link[rel="preload"][href="${src}"]`);
  if (existing) return;
  
  const link = document.createElement('link');
  link.rel = 'preload';
  link.href = src;
  link.as = 'image';
  document.head.appendChild(link);
}

/**
 * Lazy load imágenes con Intersection Observer
 */
export function lazyLoadImages(): void {
  if (typeof window === 'undefined' || !('IntersectionObserver' in window)) return;
  
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target as HTMLImageElement;
        const src = img.dataset.src;
        
        if (src) {
          img.src = src;
          img.removeAttribute('data-src');
          img.classList.add('loaded');
          observer.unobserve(img);
        }
      }
    });
  }, {
    rootMargin: '50px'
  });
  
  document.querySelectorAll('img[data-src]').forEach(img => {
    imageObserver.observe(img);
  });
}

/**
 * Inicializa todas las optimizaciones de rendimiento
 */
export function initPerformanceOptimizations(): void {
  if (typeof window === 'undefined') return;
  
  // Prefetch en hover de links
  document.addEventListener('mouseenter', (e) => {
    const target = e.target as HTMLElement;
    const link = target.closest('a[href]') as HTMLAnchorElement;
    
    if (link && link.href && link.href.startsWith(window.location.origin)) {
      const url = new URL(link.href);
      if (url.pathname !== window.location.pathname) {
        prefetchRoute(url.pathname);
      }
    }
  }, true);
  
  // Lazy load imágenes
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', lazyLoadImages);
  } else {
    lazyLoadImages();
  }
  
  // Prefetch links visibles
  if ('IntersectionObserver' in window) {
    const linkObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const link = entry.target as HTMLAnchorElement;
          if (link.href && link.href.startsWith(window.location.origin)) {
            const url = new URL(link.href);
            if (url.pathname !== window.location.pathname) {
              prefetchRoute(url.pathname);
            }
            linkObserver.unobserve(link);
          }
        }
      });
    }, { rootMargin: '100px' });
    
    document.querySelectorAll('a[href]').forEach(link => {
      const anchor = link as HTMLAnchorElement;
      if (anchor.href && anchor.href.startsWith(window.location.origin)) {
        linkObserver.observe(link);
      }
    });
  }
}

