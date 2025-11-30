/**
 * Constantes centralizadas para la aplicación
 * Mantiene configuración consistente en todo el proyecto
 */

// URLs y configuración del sitio
export const SITE_CONFIG = {
  url: 'https://freeagents.dev',
  name: 'FreeAgents',
  alternateName: 'FreeAgents Software Factory',
  description: 'Software Factory especializada en desarrollo de software a la medida, páginas web, aplicaciones móviles y e-commerce para empresas y emprendedores.',
  foundingDate: '2024',
  social: {
    github: 'https://github.com/FreeAgentsDev',
    linkedin: 'https://www.linkedin.com/company/freeagentsdev/',
    instagram: 'https://www.instagram.com/freeagentsdev/',
    facebook: 'https://www.facebook.com/profile.php?id=61577490723653',
    twitter: '@freeagentsdev',
  },
  contact: {
    email: 'contacto@freeagents.dev',
    languages: ['Spanish', 'English'] as const,
  },
  location: {
    country: 'CO',
    areaServed: ['Colombia', 'Latinoamérica'] as const,
  },
} as const;

// Paleta de colores neon
export const NEON_COLORS = {
  cyan: { primary: '#00d4ff', secondary: '#14b8a6' },
  purple: { primary: '#8b5cf6', secondary: '#a855f7' },
  pink: { primary: '#ec4899', secondary: '#f472b6' },
  blue: { primary: '#0ea5e9', secondary: '#3b82f6' },
  green: { primary: '#10b981', secondary: '#22c55e' },
  teal: { primary: '#14b8a6', secondary: '#0d9488' },
} as const;

// Rutas de navegación
export const NAV_ROUTES = [
  { href: '/', label: { es: 'Inicio', en: 'Home' }, activeColor: 'neon-cyan' },
  { href: '/servicios', label: { es: 'Servicios', en: 'Services' }, activeColor: 'neon-teal' },
  { href: '/portafolio', label: { es: 'Portafolio', en: 'Portfolio' }, activeColor: 'neon-blue' },
  { href: '/precios', label: { es: 'Precios', en: 'Pricing' }, activeColor: 'neon-green' },
  { href: '/nosotros', label: { es: 'Nosotros', en: 'About' }, activeColor: 'neon-purple' },
  { href: '/fundacion', label: { es: 'Fundación', en: 'Foundation' }, activeColor: 'neon-pink' },
] as const;

// Keywords SEO principales
export const SEO_KEYWORDS = {
  primary: [
    'desarrollo de software',
    'desarrollo de páginas web',
    'desarrollo web',
    'desarrollo de aplicaciones',
    'desarrollo de apps',
    'software a la medida',
    'desarrollo de software para empresas',
    'desarrollo de software personalizado',
    'software factory',
  ],
  secondary: [
    'desarrollo de páginas web profesionales',
    'creación de páginas web',
    'desarrollo de sitios web',
    'programación de software',
    'desarrollo de software empresarial',
    'desarrollo de software a medida',
    'desarrollo de aplicaciones web',
    'desarrollo de aplicaciones móviles',
    'e-commerce',
    'tiendas online',
  ],
  location: [
    'desarrollo de software Colombia',
    'desarrollo de software Latinoamérica',
  ],
} as const;

// Configuración de animaciones
export const ANIMATION_CONFIG = {
  durations: {
    fast: '300ms',
    normal: '500ms',
    slow: '800ms',
  },
  delays: {
    short: '0.1s',
    medium: '0.3s',
    long: '0.5s',
  },
} as const;

// Breakpoints responsivos (alineados con Tailwind)
export const BREAKPOINTS = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const;

