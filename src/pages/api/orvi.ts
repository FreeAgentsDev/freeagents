import type { APIRoute } from 'astro';
import { rateLimit } from '../../utils/rateLimit';

// Mark this route as server-side only (not prerendered)
export const prerender = false;

const API_KEY = import.meta.env.ORVI_API_KEY;
// Using v1 API with gemini-1.5-flash model (stable and available)
const GEMINI_ENDPOINT =
  'https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent';

// Rate limiting: 10 requests per minute per IP
const MAX_REQUESTS = 10;
const WINDOW_MS = 60000; // 1 minute

/**
 * Sanitize user input to prevent injection attacks
 */
function sanitizeInput(input: string): string {
  return input
    .trim()
    .slice(0, 1000) // Max length
    .replace(/[<>]/g, ''); // Remove potential HTML tags
}

// Endpoint de diagnóstico sencillo: GET /api/orvi
// Sirve solo para comprobar si el servidor ve ORVI_API_KEY
export const GET: APIRoute = async () => {
  return new Response(
    JSON.stringify({
      hasKey: Boolean(API_KEY),
      envName: 'ORVI_API_KEY',
    }),
    {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    }
  );
};

export const POST: APIRoute = async ({ request, clientAddress, ip }) => {
  // Security: Check API key
  if (!API_KEY) {
    return new Response(
      JSON.stringify({ error: 'ORVI_API_KEY is not configured on the server.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }

  // Security: Rate limiting
  // Get client identifier safely (works in both static and server modes)
  const forwardedFor = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  const identifier =
    clientAddress ||
    ip ||
    (forwardedFor ? forwardedFor.split(',')[0].trim() : null) ||
    realIp ||
    'unknown';
  
  if (!rateLimit(identifier, MAX_REQUESTS, WINDOW_MS)) {
    return new Response(
      JSON.stringify({
        error: 'Demasiadas solicitudes. Por favor, espera un momento antes de intentar de nuevo.',
      }),
      {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          'Retry-After': '60',
        },
      }
    );
  }

  try {
    const body = await request.json();
    const { message, pageUrl, language = 'es' } = body;

    // Security: Validate and sanitize inputs
    if (!message || typeof message !== 'string' || message.length === 0) {
      return new Response(
        JSON.stringify({ error: 'El mensaje es requerido y debe ser texto válido.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const sanitizedMessage = sanitizeInput(message);
    const sanitizedPageUrl = typeof pageUrl === 'string' ? pageUrl.slice(0, 500) : '';
    const validLanguage = language === 'en' ? 'en' : 'es';

    const siteDescription =
      'FreeAgents es una Software Factory que ofrece desarrollo de software a la medida, apps móviles, e-commerce, automatización con IA y planes de mantenimiento para emprendedores y empresas.';

    const pageContext = `URL actual: ${sanitizedPageUrl || 'desconocida'}.
Lenguaje preferido del usuario: ${validLanguage === 'en' ? 'inglés' : 'español'}.
Responde siempre de forma clara, breve y útil. Mantén un tono profesional pero cercano.`;

    const systemPrompt =
      'Eres Orvi, el asistente virtual oficial de FreeAgents. Tu objetivo es ayudar a los visitantes a entender los servicios, planes, precios y a guiarlos a tomar acción (por ejemplo, ir a la página de contacto o portafolio). Si el usuario pide algo que requiere un humano, sugiérele que agende una llamada o use el formulario de contacto.';

    const requestBody = {
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: [
                systemPrompt,
                '',
                `Contexto del sitio: ${siteDescription}`,
                pageContext,
                '',
                `Pregunta del usuario: ${sanitizedMessage}`,
              ].join('\n'),
            },
          ],
        },
      ],
    };

    const response = await fetch(`${GEMINI_ENDPOINT}?key=${API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Orvi API error:', errorText);
      return new Response(
        JSON.stringify({
          error: 'Error al conectar con la IA de Orvi.',
          providerMessage: errorText,
        }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    const text =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      'Lo siento, ahora mismo no puedo responder. Intenta de nuevo en unos segundos.';

    return new Response(JSON.stringify({ reply: text }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('Orvi API unexpected error:', err);
    return new Response(
      JSON.stringify({ error: 'Ocurrió un error procesando tu mensaje.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};


