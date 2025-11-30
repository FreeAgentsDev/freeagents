/**
 * Utilidades para optimización de imágenes
 * Mejora performance y accesibilidad
 */

export interface ImageOptimizationOptions {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  loading?: 'lazy' | 'eager';
  decoding?: 'async' | 'auto' | 'sync';
  sizes?: string;
  class?: string;
}

/**
 * Genera atributos optimizados para imágenes
 */
export function getOptimizedImageAttributes(options: ImageOptimizationOptions) {
  const {
    src,
    alt,
    width,
    height,
    loading = 'lazy',
    decoding = 'async',
    sizes,
    class: className = '',
  } = options;

  return {
    src,
    alt,
    width: width?.toString(),
    height: height?.toString(),
    loading,
    decoding,
    sizes,
    class: className,
    fetchpriority: loading === 'eager' ? 'high' : undefined,
  };
}

/**
 * Valida que una URL de imagen sea válida
 */
export function isValidImageUrl(url: string): boolean {
  if (!url || typeof url !== 'string') return false;
  
  // Verificar que sea una URL relativa o absoluta válida
  const urlPattern = /^(\/|https?:\/\/)/;
  return urlPattern.test(url);
}

