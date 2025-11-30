# Guía de Calidad de Código - FreeAgents

Este documento describe los estándares y mejores prácticas implementadas en el proyecto para garantizar código de calidad A.

## 📋 Estructura del Proyecto

```
src/
├── components/        # Componentes reutilizables
│   ├── ui/           # Componentes UI base (Button, Card, Section, etc.)
│   └── ...           # Componentes específicos
├── config/           # Configuraciones centralizadas
│   └── constants.ts  # Constantes y configuraciones globales
├── layouts/          # Layouts de página
├── pages/            # Páginas de la aplicación
└── utils/            # Utilidades y helpers
    ├── image.ts      # Utilidades para optimización de imágenes
    └── accessibility.ts # Utilidades para accesibilidad
```

## 🎯 Principios de Calidad

### 1. **Reutilización y DRY (Don't Repeat Yourself)**

- ✅ Componentes reutilizables en `src/components/ui/`
- ✅ Constantes centralizadas en `src/config/constants.ts`
- ✅ Utilidades compartidas en `src/utils/`

**Ejemplo:**
```astro
// ❌ Antes: Código duplicado
<div class="bg-gray-800/60 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
  ...
</div>

// ✅ Después: Componente reutilizable
<Card padding="lg" borderColor="cyan">
  ...
</Card>
```

### 2. **TypeScript y Type Safety**

- ✅ Interfaces TypeScript para todos los props de componentes
- ✅ Validación de tipos en tiempo de compilación
- ✅ Tipos explícitos para funciones y variables

**Ejemplo:**
```typescript
export interface ButtonProps {
  href?: string;
  variant?: 'primary' | 'secondary' | 'outline';
  color?: 'cyan' | 'teal' | 'blue' | 'green' | 'purple' | 'pink';
  // ...
}
```

### 3. **Accesibilidad (A11y)**

- ✅ ARIA labels en elementos interactivos
- ✅ Navegación por teclado funcional
- ✅ Semantic HTML (`<nav>`, `<main>`, `<section>`, etc.)
- ✅ `aria-current="page"` para páginas activas
- ✅ `aria-expanded` para menús desplegables

**Ejemplo:**
```astro
<nav aria-label="Navegación principal">
  <a href="/" aria-current={currentPath === '/' ? 'page' : undefined}>
    Inicio
  </a>
</nav>
```

### 4. **Performance**

- ✅ Lazy loading de imágenes
- ✅ Throttling de eventos resize
- ✅ RequestAnimationFrame para animaciones
- ✅ Cleanup de event listeners
- ✅ Optimización de Canvas animations

**Ejemplo:**
```typescript
// Throttle para optimizar resize
const handleResize = throttle(() => {
  resizeCanvas();
}, 250);

// Cleanup al desmontar
window.addEventListener('beforeunload', () => {
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
  }
  window.removeEventListener('resize', handleResize);
});
```

### 5. **Manejo de Errores**

- ✅ Try-catch en funciones críticas
- ✅ Validación de inputs
- ✅ Fallbacks para elementos opcionales
- ✅ Console warnings para desarrollo

**Ejemplo:**
```typescript
function drawMatrix() {
  try {
    // Código de animación
  } catch (error) {
    console.error('Error in matrix animation:', error);
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
    }
  }
}
```

### 6. **SEO y Meta Tags**

- ✅ Meta tags completos (Open Graph, Twitter Cards)
- ✅ Structured Data (JSON-LD)
- ✅ Alt texts descriptivos en imágenes
- ✅ Canonical URLs
- ✅ Sitemap y robots.txt

### 7. **Documentación**

- ✅ Comentarios JSDoc en funciones complejas
- ✅ Descripción de props en interfaces
- ✅ README con instrucciones claras

## 🔧 Componentes UI Base

### Button Component
Componente de botón reutilizable con múltiples variantes.

```astro
<Button 
  href="/contacto"
  variant="primary"
  color="cyan"
  size="lg"
  ariaLabel="Ir a contacto"
>
  Contacto
</Button>
```

### Card Component
Tarjeta con glassmorphism y efectos hover.

```astro
<Card 
  hover={true}
  borderColor="cyan"
  padding="lg"
>
  Contenido de la tarjeta
</Card>
```

### Section Component
Sección semántica con padding configurable.

```astro
<Section 
  id="servicios"
  padding="lg"
  ariaLabel="Sección de servicios"
>
  Contenido
</Section>
```

### OptimizedImage Component
Imagen optimizada con lazy loading.

```astro
<OptimizedImage 
  src="/image.png"
  alt="Descripción"
  width={800}
  height={600}
  loading="lazy"
  priority={false}
/>
```

## 📦 Utilidades

### image.ts
- `getOptimizedImageAttributes()`: Genera atributos optimizados
- `isValidImageUrl()`: Valida URLs de imágenes

### accessibility.ts
- `generateUniqueId()`: Genera IDs únicos
- `sanitizeAriaLabel()`: Sanitiza texto para ARIA
- `generateActionAriaLabel()`: Genera labels descriptivos

## 🎨 Constantes

### SITE_CONFIG
Configuración centralizada del sitio (URLs, redes sociales, etc.)

### NEON_COLORS
Paleta de colores neon consistente

### NAV_ROUTES
Rutas de navegación con labels multiidioma

### SEO_KEYWORDS
Keywords SEO organizadas por categorías

## ✅ Checklist de Calidad

Antes de hacer commit, verifica:

- [ ] Código sin duplicación innecesaria
- [ ] TypeScript types definidos
- [ ] ARIA labels en elementos interactivos
- [ ] Semantic HTML apropiado
- [ ] Imágenes con lazy loading y alt text
- [ ] Manejo de errores en funciones críticas
- [ ] Cleanup de event listeners
- [ ] Performance optimizado (throttling, RAF)
- [ ] Comentarios en código complejo
- [ ] Sin console.log en producción

## 🚀 Mejores Prácticas

1. **Usa componentes reutilizables** en lugar de duplicar código
2. **Centraliza configuraciones** en `constants.ts`
3. **Valida inputs** antes de procesarlos
4. **Optimiza animaciones** con requestAnimationFrame
5. **Limpia recursos** al desmontar componentes
6. **Documenta código complejo** con comentarios claros
7. **Prueba accesibilidad** con lectores de pantalla
8. **Optimiza imágenes** con lazy loading y tamaños apropiados

## 📚 Recursos

- [Astro Documentation](https://docs.astro.build)
- [Web Accessibility Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Web Performance Best Practices](https://web.dev/performance/)

---

**Última actualización:** Enero 2025

