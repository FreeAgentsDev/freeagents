# FreeAgents - Software Factory

Sitio web profesional de FreeAgents, una Software Factory especializada en desarrollo de software a la medida, aplicaciones móviles, e-commerce y automatización con IA.

## 🚀 Características

- **Diseño Moderno**: Interfaz cyberpunk/neon con efectos visuales avanzados
- **Multiidioma**: Soporte completo para español e inglés
- **Asistente IA**: Chatbot "Orvi" integrado con Gemini AI
- **SEO Optimizado**: Structured data, sitemap dinámico, meta tags completos
- **Seguridad**: Headers de seguridad, rate limiting, validación de inputs
- **Accesibilidad**: ARIA labels, semantic HTML, navegación por teclado
- **Performance**: Lazy loading, code splitting, optimización de imágenes

## 🛠️ Tecnologías

- **Astro 5.x**: Framework web moderno
- **Tailwind CSS**: Estilos utility-first
- **TypeScript**: Tipado estático
- **Gemini AI**: Asistente virtual inteligente

## 📦 Instalación

```bash
# Instalar dependencias
npm install

# Desarrollo
npm run dev

# Build para producción
npm run build

# Preview de producción
npm run preview
```

## 🔐 Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto:

```env
ORVI_API_KEY=tu_api_key_de_gemini_aqui
```

## 📁 Estructura del Proyecto

```
/
├── public/          # Archivos estáticos
├── src/
│   ├── components/ # Componentes reutilizables
│   ├── layouts/    # Layouts de página
│   ├── pages/      # Páginas y rutas
│   ├── utils/      # Utilidades
│   └── middleware.ts # Middleware de seguridad
└── astro.config.mjs
```

## 🔒 Seguridad

- **Headers de Seguridad**: CSP, HSTS, X-Frame-Options, etc.
- **Rate Limiting**: Protección contra abuso de API
- **Validación de Inputs**: Sanitización de datos de usuario
- **Variables de Entorno**: API keys protegidas

## 📈 SEO

- **Structured Data**: Schema.org (Organization, Service, WebSite)
- **Sitemap Dinámico**: Generado automáticamente
- **Meta Tags**: Open Graph, Twitter Cards completos
- **Robots.txt**: Optimizado para crawlers

## ♿ Accesibilidad

- **ARIA Labels**: Navegación accesible
- **Semantic HTML**: Estructura semántica correcta
- **Keyboard Navigation**: Navegación por teclado
- **Focus Management**: Indicadores de foco visibles

## 📝 Licencia

Privado - FreeAgents © 2024
