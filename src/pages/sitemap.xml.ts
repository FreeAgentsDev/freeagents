import type { APIRoute } from 'astro';
import { getAllServiceSlugs } from '../config/services.ts';

// Mark this route as server-side only (not prerendered)
// Temporarily enabled for static build - uncomment for server deployment
// export const prerender = false;
export const prerender = true;

const siteUrl = 'https://freeagents.dev';

const pages = [
  { url: '', priority: '1.0', changefreq: 'weekly' },
  { url: 'servicios', priority: '0.9', changefreq: 'monthly' },
  { url: 'portafolio', priority: '0.9', changefreq: 'weekly' },
  { url: 'precios', priority: '0.8', changefreq: 'monthly' },
  { url: 'nosotros', priority: '0.7', changefreq: 'monthly' },
  { url: 'fundacion', priority: '0.7', changefreq: 'monthly' },
  { url: 'contacto', priority: '0.8', changefreq: 'monthly' },
];

// Agregar páginas de servicios individuales
const serviceSlugs = getAllServiceSlugs();
const servicePages = serviceSlugs.map(slug => ({
  url: `servicios/${slug}`,
  priority: '0.85',
  changefreq: 'monthly'
}));

const allPages = [...pages, ...servicePages];

export const GET: APIRoute = () => {
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
${allPages
  .map(
    (page) => `  <url>
    <loc>${siteUrl}/${page.url}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`;

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};

