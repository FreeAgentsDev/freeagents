# 🧪 ANÁLISIS DE IMPLEMENTACIÓN PARA PRUEBAS AUTOMATIZADAS
## FreeAgents Website - Estrategia de Testing Completo

**Fecha:** Enero 2025  
**Objetivo:** Implementar suite completa de pruebas automatizadas para garantizar calidad y estabilidad

---

## 📋 RESUMEN EJECUTIVO

### Objetivo
Implementar una suite completa de pruebas automatizadas que cubra:
- **Testing E2E** (End-to-End): Flujos de usuario completos
- **Testing de Componentes**: Componentes individuales
- **Testing de Integración**: APIs y servicios
- **Testing de Performance**: Métricas de rendimiento
- **Testing de Accesibilidad**: WCAG compliance
- **Testing Visual**: Regresiones visuales

### Stack Tecnológico Recomendado
- **E2E Testing**: Playwright (recomendado) o Cypress
- **Component Testing**: Vitest + Testing Library
- **Performance**: Lighthouse CI + WebPageTest
- **Accesibilidad**: axe-core + Pa11y
- **Visual Regression**: Percy o Chromatic
- **CI/CD**: GitHub Actions

---

## ❶ TESTING END-TO-END (E2E)

### 1.1 Flujos Críticos a Probar

#### Flujo 1: Navegación y Hero Section
**Prioridad:** CRÍTICA

```javascript
// test/e2e/navigation.spec.js
test('Navegación móvil funciona correctamente', async ({ page }) => {
  // 1. Abrir página en móvil
  await page.setViewportSize({ width: 375, height: 667 });
  await page.goto('/');
  
  // 2. Verificar que el menú hamburger es visible
  const menuButton = page.locator('#mobile-menu-btn');
  await expect(menuButton).toBeVisible();
  
  // 3. Abrir menú móvil
  await menuButton.click();
  
  // 4. Verificar que el menú se abre
  const mobileMenu = page.locator('#mobile-menu');
  await expect(mobileMenu).toBeVisible();
  
  // 5. Verificar que todos los links son clickeables (min 44x44px)
  const links = mobileMenu.locator('a');
  const count = await links.count();
  for (let i = 0; i < count; i++) {
    const link = links.nth(i);
    const box = await link.boundingBox();
    expect(box.width).toBeGreaterThanOrEqual(44);
    expect(box.height).toBeGreaterThanOrEqual(44);
  }
  
  // 6. Cerrar menú
  await menuButton.click();
  await expect(mobileMenu).toBeHidden();
});
```

#### Flujo 2: Hero Section y CTAs
**Prioridad:** CRÍTICA

```javascript
test('Hero Section se muestra correctamente en móvil', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 667 });
  await page.goto('/');
  
  // 1. Verificar headline es visible y tiene tamaño correcto
  const headline = page.locator('h1');
  await expect(headline).toBeVisible();
  const fontSize = await headline.evaluate(el => 
    window.getComputedStyle(el).fontSize
  );
  expect(parseFloat(fontSize)).toBeLessThanOrEqual(30); // text-3xl = 30px
  
  // 2. Verificar subheadline está truncada (line-clamp-2)
  const subheadline = page.locator('p.line-clamp-2');
  await expect(subheadline).toBeVisible();
  
  // 3. Verificar CTAs son horizontales y tienen tamaño mínimo
  const ctaContainer = page.locator('.flex.flex-row').first();
  await expect(ctaContainer).toBeVisible();
  
  const ctas = ctaContainer.locator('a');
  const ctaCount = await ctas.count();
  for (let i = 0; i < ctaCount; i++) {
    const cta = ctas.nth(i);
    const box = await cta.boundingBox();
    expect(box.height).toBeGreaterThanOrEqual(44);
  }
  
  // 4. Verificar que el CTA flotante es visible en móvil
  const floatingCTA = page.locator('a[href="/contacto"].fixed.bottom-6');
  await expect(floatingCTA).toBeVisible();
});
```

#### Flujo 3: Trust Indicators Slider
**Prioridad:** ALTA

```javascript
test('Trust Indicators slider se mueve automáticamente', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 667 });
  await page.goto('/');
  
  // 1. Verificar que el slider existe
  const slider = page.locator('#trust-indicators-slider');
  await expect(slider).toBeVisible();
  
  // 2. Verificar que tiene animación
  const animation = await slider.evaluate(el => 
    window.getComputedStyle(el).animationName
  );
  expect(animation).toBe('trust-slide');
  
  // 3. Verificar posición inicial
  const initialTransform = await slider.evaluate(el => 
    window.getComputedStyle(el).transform
  );
  
  // 4. Esperar 2 segundos y verificar que se movió
  await page.waitForTimeout(2000);
  const afterTransform = await slider.evaluate(el => 
    window.getComputedStyle(el).transform
  );
  expect(afterTransform).not.toBe(initialTransform);
  
  // 5. Verificar que pausa en hover
  await slider.hover();
  await page.waitForTimeout(500);
  const pausedTransform = await slider.evaluate(el => 
    window.getComputedStyle(el).transform
  );
  // La transformación no debería cambiar después del hover
  await page.waitForTimeout(1000);
  const stillPaused = await slider.evaluate(el => 
    window.getComputedStyle(el).transform
  );
  expect(stillPaused).toBe(pausedTransform);
});
```

#### Flujo 4: Formulario de Contacto
**Prioridad:** CRÍTICA

```javascript
test('Formulario de contacto es accesible en móvil', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 667 });
  await page.goto('/contacto');
  
  // 1. Verificar que todos los inputs tienen min-height 48px
  const inputs = page.locator('input, textarea, select');
  const inputCount = await inputs.count();
  for (let i = 0; i < inputCount; i++) {
    const input = inputs.nth(i);
    const box = await input.boundingBox();
    expect(box.height).toBeGreaterThanOrEqual(48);
    
    // 2. Verificar font-size es 16px mínimo (previene zoom iOS)
    const fontSize = await input.evaluate(el => 
      window.getComputedStyle(el).fontSize
    );
    expect(parseFloat(fontSize)).toBeGreaterThanOrEqual(16);
  }
  
  // 3. Verificar autocomplete attributes
  const emailInput = page.locator('input[type="email"]');
  const autocomplete = await emailInput.getAttribute('autocomplete');
  expect(autocomplete).toBe('email');
  
  const inputmode = await emailInput.getAttribute('inputmode');
  expect(inputmode).toBe('email');
  
  // 4. Verificar que los botones tienen tamaño mínimo
  const buttons = page.locator('button[type="button"], button[type="submit"]');
  const buttonCount = await buttons.count();
  for (let i = 0; i < buttonCount; i++) {
    const button = buttons.nth(i);
    const box = await button.boundingBox();
    expect(box.height).toBeGreaterThanOrEqual(48);
  }
});
```

#### Flujo 5: Scroll y Navegación
**Prioridad:** MEDIA

```javascript
test('Scroll progress bar y back to top funcionan', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 667 });
  await page.goto('/');
  
  // 1. Verificar scroll progress bar existe
  const progressBar = page.locator('#scroll-progress');
  await expect(progressBar).toBeVisible();
  
  // 2. Verificar que el ancho cambia al hacer scroll
  const initialWidth = await progressBar.evaluate(el => 
    window.getComputedStyle(el).width
  );
  
  await page.evaluate(() => window.scrollTo(0, window.innerHeight * 2));
  await page.waitForTimeout(500);
  
  const afterScrollWidth = await progressBar.evaluate(el => 
    window.getComputedStyle(el).width
  );
  expect(afterScrollWidth).not.toBe(initialWidth);
  
  // 3. Verificar back to top aparece después de 2 viewports
  const backToTop = page.locator('#back-to-top');
  await expect(backToTop).toBeVisible();
  
  // 4. Hacer click y verificar que hace scroll al top
  await backToTop.click();
  await page.waitForTimeout(1000);
  
  const scrollPosition = await page.evaluate(() => window.pageYOffset);
  expect(scrollPosition).toBeLessThan(100);
});
```

### 1.2 Configuración Playwright

```javascript
// playwright.config.js
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './test/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  
  use: {
    baseURL: 'http://localhost:4321',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },

  projects: [
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },
    {
      name: 'Desktop Chrome',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:4321',
    reuseExistingServer: !process.env.CI,
  },
});
```

---

## ❷ TESTING DE COMPONENTES

### 2.1 Componentes a Probar

#### Componente: Header
**Archivo:** `test/components/Header.test.ts`

```typescript
import { test, expect } from 'vitest';
import { render, screen } from '@testing-library/astro';
import Header from '../../src/components/Header.astro';

test('Header tiene sticky positioning', () => {
  const { container } = render(Header);
  const header = container.querySelector('header');
  expect(header?.classList.contains('sticky')).toBe(true);
});

test('Menú móvil se abre y cierra correctamente', async () => {
  const { container } = render(Header);
  const menuButton = container.querySelector('#mobile-menu-btn');
  const mobileMenu = container.querySelector('#mobile-menu');
  
  // Verificar que el menú está oculto inicialmente
  expect(mobileMenu?.classList.contains('hidden')).toBe(true);
  
  // Simular click (requiere interacción real en E2E)
  // Este test verifica la estructura HTML
  expect(menuButton).toBeTruthy();
  expect(mobileMenu).toBeTruthy();
});

test('Todos los links tienen área táctil mínima', () => {
  const { container } = render(Header);
  const links = container.querySelectorAll('.mobile-link');
  
  links.forEach(link => {
    expect(link.classList.contains('min-h-[44px]')).toBe(true);
  });
});
```

#### Componente: ScrollProgress
**Archivo:** `test/components/ScrollProgress.test.ts`

```typescript
import { test, expect } from 'vitest';
import { render } from '@testing-library/astro';
import ScrollProgress from '../../src/components/ui/ScrollProgress.astro';

test('ScrollProgress tiene progressbar role', () => {
  const { container } = render(ScrollProgress);
  const progressBar = container.querySelector('#scroll-progress');
  
  expect(progressBar?.getAttribute('role')).toBe('progressbar');
  expect(progressBar?.getAttribute('aria-valuemin')).toBe('0');
  expect(progressBar?.getAttribute('aria-valuemax')).toBe('100');
});

test('Back to top button tiene aria-label', () => {
  const { container } = render(ScrollProgress);
  const backToTop = container.querySelector('#back-to-top');
  
  expect(backToTop?.getAttribute('aria-label')).toBeTruthy();
  expect(backToTop?.getAttribute('aria-label')).toBe('Volver arriba');
});
```

### 2.2 Configuración Vitest

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config';
import astro from '@astrojs/vite-plugin-astro';

export default defineConfig({
  plugins: [astro()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './test/setup.ts',
  },
});
```

---

## ❸ TESTING DE PERFORMANCE

### 3.1 Lighthouse CI

**Archivo:** `.lighthouserc.js`

```javascript
module.exports = {
  ci: {
    collect: {
      url: ['http://localhost:4321/'],
      numberOfRuns: 3,
      settings: {
        emulatedFormFactor: 'mobile',
        throttling: {
          rttMs: 150,
          throughputKbps: 1638.4,
          cpuSlowdownMultiplier: 4,
        },
      },
    },
    assert: {
      assertions: {
        'categories:performance': ['error', { minScore: 0.9 }],
        'categories:accessibility': ['error', { minScore: 0.9 }],
        'categories:best-practices': ['error', { minScore: 0.9 }],
        'categories:seo': ['error', { minScore: 0.9 }],
        'first-contentful-paint': ['error', { maxNumericValue: 1500 }],
        'largest-contentful-paint': ['error', { maxNumericValue: 2500 }],
        'total-blocking-time': ['error', { maxNumericValue: 300 }],
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }],
      },
    },
    upload: {
      target: 'temporary-public-storage',
    },
  },
};
```

### 3.2 WebPageTest Integration

```javascript
// test/performance/webpagetest.js
const webPageTest = require('webpagetest');

test('Performance en conexión 3G', async () => {
  const wpt = new webPageTest('YOUR_API_KEY');
  
  const result = await wpt.runTest('http://localhost:4321/', {
    location: 'Dulles:Chrome',
    connectivity: '3G',
    runs: 3,
    firstViewOnly: false,
  });
  
  expect(result.data.average.firstView.loadTime).toBeLessThan(3000);
  expect(result.data.average.firstView.SpeedIndex).toBeLessThan(3000);
});
```

---

## ❹ TESTING DE ACCESIBILIDAD

### 4.1 Axe-core Integration

**Archivo:** `test/accessibility/axe.test.js`

```javascript
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('Página principal es accesible', async ({ page }) => {
  await page.goto('/');
  
  const accessibilityScanResults = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
    .analyze();
  
  expect(accessibilityScanResults.violations).toEqual([]);
});

test('Todos los elementos interactivos tienen focus visible', async ({ page }) => {
  await page.goto('/');
  
  const interactiveElements = await page.locator(
    'a, button, input, select, textarea'
  ).all();
  
  for (const element of interactiveElements) {
    await element.focus();
    const outline = await element.evaluate(el => 
      window.getComputedStyle(el).outline
    );
    expect(outline).not.toBe('none');
  }
});

test('Touch targets cumplen Apple HIG (44x44px)', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 667 });
  await page.goto('/');
  
  const interactiveElements = await page.locator(
    'a, button'
  ).all();
  
  for (const element of interactiveElements) {
    const box = await element.boundingBox();
    expect(box.width).toBeGreaterThanOrEqual(44);
    expect(box.height).toBeGreaterThanOrEqual(44);
  }
});
```

### 4.2 Pa11y CLI

**Archivo:** `.pa11yci.json`

```json
{
  "defaults": {
    "timeout": 10000,
    "wait": 1000,
    "standard": "WCAG2AA",
    "viewport": {
      "width": 375,
      "height": 667
    }
  },
  "urls": [
    "http://localhost:4321/",
    "http://localhost:4321/contacto",
    "http://localhost:4321/servicios",
    "http://localhost:4321/precios"
  ]
}
```

---

## ❺ TESTING VISUAL (REGRESIÓN)

### 5.1 Percy Integration

**Archivo:** `test/visual/percy.spec.js`

```javascript
import { test } from '@playwright/test';
import percySnapshot from '@percy/playwright';

test('Homepage visual regression', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 667 });
  await page.goto('/');
  await percySnapshot(page, 'Homepage Mobile');
  
  await page.setViewportSize({ width: 1920, height: 1080 });
  await page.goto('/');
  await percySnapshot(page, 'Homepage Desktop');
});

test('Formulario de contacto visual regression', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 667 });
  await page.goto('/contacto');
  await percySnapshot(page, 'Contact Form Mobile');
});
```

### 5.2 Chromatic (Alternativa)

```javascript
// .storybook/main.js (si usas Storybook)
export default {
  stories: ['../src/**/*.stories.@(js|jsx|ts|tsx|astro)'],
  addons: ['@storybook/addon-a11y'],
};
```

---

## ❻ CI/CD INTEGRATION

### 6.1 GitHub Actions Workflow

**Archivo:** `.github/workflows/test.yml`

```yaml
name: Test Suite

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    
    strategy:
      matrix:
        node-version: [18.x, 20.x]
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: ${{ matrix.node-version }}
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build
        run: npm run build
      
      - name: Run E2E tests
        run: npm run test:e2e
      
      - name: Run component tests
        run: npm run test:component
      
      - name: Run accessibility tests
        run: npm run test:a11y
      
      - name: Run Lighthouse CI
        run: npm run test:lighthouse
      
      - name: Upload test results
        uses: actions/upload-artifact@v3
        if: always()
        with:
          name: test-results
          path: test-results/
```

### 6.2 Package.json Scripts

```json
{
  "scripts": {
    "test": "npm run test:component && npm run test:e2e",
    "test:component": "vitest",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "test:a11y": "pa11y-ci",
    "test:lighthouse": "lhci autorun",
    "test:visual": "percy exec -- playwright test",
    "test:all": "npm run test:component && npm run test:e2e && npm run test:a11y && npm run test:lighthouse"
  }
}
```

---

## ❼ MÉTRICAS Y REPORTING

### 7.1 Dashboard de Métricas

**Implementar:**
- **Test Coverage**: Objetivo 80%+
- **Performance Budget**: 
  - FCP < 1.5s
  - LCP < 2.5s
  - TBT < 300ms
  - CLS < 0.1
- **Accessibility Score**: 100% (0 violaciones)
- **Visual Regression**: 0 cambios no aprobados

### 7.2 Reporting Tools

1. **Playwright HTML Report**: Automático con `--reporter=html`
2. **Lighthouse CI**: Reportes en GitHub PRs
3. **Percy Dashboard**: Visual diffs en PRs
4. **Coverage Reports**: `vitest --coverage`

---

## ❽ PLAN DE IMPLEMENTACIÓN

### Fase 1: Setup Básico (Semana 1)
- [ ] Instalar Playwright
- [ ] Instalar Vitest
- [ ] Configurar scripts en package.json
- [ ] Crear estructura de carpetas `test/`

### Fase 2: E2E Tests Críticos (Semana 2)
- [ ] Test de navegación móvil
- [ ] Test de Hero Section
- [ ] Test de formulario de contacto
- [ ] Test de Trust Indicators slider

### Fase 3: Component Tests (Semana 3)
- [ ] Test de Header
- [ ] Test de ScrollProgress
- [ ] Test de OrviChat
- [ ] Test de Footer

### Fase 4: Performance & A11y (Semana 4)
- [ ] Lighthouse CI setup
- [ ] Axe-core integration
- [ ] Pa11y CLI setup
- [ ] Performance budgets

### Fase 5: Visual Regression (Semana 5)
- [ ] Percy/Chromatic setup
- [ ] Baseline screenshots
- [ ] Visual diff tests

### Fase 6: CI/CD Integration (Semana 6)
- [ ] GitHub Actions workflow
- [ ] Automated PR comments
- [ ] Test result reporting

---

## ❾ CHECKLIST DE IMPLEMENTACIÓN

### Dependencias a Instalar

```bash
# E2E Testing
npm install -D @playwright/test
npx playwright install

# Component Testing
npm install -D vitest @testing-library/astro @testing-library/jest-dom jsdom

# Accessibility
npm install -D @axe-core/playwright pa11y pa11y-ci

# Performance
npm install -D @lhci/cli

# Visual Regression
npm install -D @percy/playwright
# o
npm install -D chromatic
```

### Estructura de Carpetas

```
freeagents/
├── test/
│   ├── e2e/
│   │   ├── navigation.spec.js
│   │   ├── hero.spec.js
│   │   ├── form.spec.js
│   │   └── scroll.spec.js
│   ├── components/
│   │   ├── Header.test.ts
│   │   ├── ScrollProgress.test.ts
│   │   └── OrviChat.test.ts
│   ├── accessibility/
│   │   ├── axe.test.js
│   │   └── touch-targets.test.js
│   ├── performance/
│   │   └── lighthouse.test.js
│   └── visual/
│       └── percy.spec.js
├── playwright.config.js
├── vitest.config.ts
├── .lighthouserc.js
└── .pa11yci.json
```

---

## ❿ MÉTRICAS DE ÉXITO

### Coverage Goals
- **E2E Coverage**: 80%+ de flujos críticos
- **Component Coverage**: 70%+ de componentes
- **Accessibility**: 100% (0 violaciones WCAG AA)
- **Performance**: 90+ Lighthouse score
- **Visual Regression**: 0 cambios no aprobados

### KPIs de Testing
- **Test Execution Time**: < 10 minutos (CI)
- **Flaky Test Rate**: < 2%
- **Test Failure Rate**: < 5%
- **Time to Detect Issues**: < 5 minutos

---

## 📝 NOTAS TÉCNICAS

### Mejores Prácticas
1. **Test Isolation**: Cada test debe ser independiente
2. **Data Attributes**: Usar `data-testid` para selectores estables
3. **Wait Strategies**: Usar `waitFor` en lugar de `setTimeout`
4. **Screenshots**: Capturar en fallos automáticamente
5. **Parallel Execution**: Ejecutar tests en paralelo cuando sea posible

### Anti-patterns a Evitar
- ❌ Selectores frágiles (`.class-name-123`)
- ❌ Tests que dependen de otros tests
- ❌ Timeouts arbitrarios sin esperar elementos
- ❌ Tests que no limpian estado después

---

**Documento generado:** Enero 2025  
**Próxima revisión:** Después de implementación inicial
