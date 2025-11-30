/**
 * Utilidades para mejorar accesibilidad
 * ARIA labels, navegación por teclado, etc.
 */

/**
 * Genera un ID único para elementos que necesitan aria-labelledby
 */
export function generateUniqueId(prefix: string = 'id'): string {
  return `${prefix}-${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Valida y sanitiza texto para ARIA labels
 */
export function sanitizeAriaLabel(text: string): string {
  if (!text || typeof text !== 'string') return '';
  return text.trim().replace(/\s+/g, ' ');
}

/**
 * Genera un aria-label descriptivo para botones de acción
 */
export function generateActionAriaLabel(action: string, target?: string): string {
  const sanitizedAction = sanitizeAriaLabel(action);
  const sanitizedTarget = target ? sanitizeAriaLabel(target) : '';
  
  if (sanitizedTarget) {
    return `${sanitizedAction} ${sanitizedTarget}`;
  }
  return sanitizedAction;
}

