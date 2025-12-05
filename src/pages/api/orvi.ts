import type { APIRoute } from 'astro';
import { rateLimit } from '../../utils/rateLimit';
import { services, quickProducts, maintenancePlans } from '../../config/services.ts';

// Mark this route as server-side only (not prerendered)
export const prerender = false;

const API_KEY = import.meta.env.ORVI_API_KEY;
// Using v1 API with gemini-2.5-flash model (stable, supports up to 1M tokens)
const GEMINI_ENDPOINT =
  'https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent';

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

    // Validar que los datos estén disponibles
    if (!services || !Array.isArray(services)) {
      console.error('Error: services no está disponible o no es un array');
      return new Response(
        JSON.stringify({ error: 'Error de configuración del servidor.' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Construir información detallada de servicios (con validación)
    let servicesInfo = '';
    try {
      servicesInfo = services.map(service => {
        const plansInfo = service.plans && service.plans.length > 0
          ? service.plans.map(plan => 
              `  - ${plan.name}: $${(plan.priceUSD || 0).toLocaleString()} USD (${(plan.priceCOP || 0).toLocaleString('es-CO')} COP) - ${(plan.features || []).slice(0, 2).join(', ')}`
            ).join('\n')
          : `  - Precio desde: $${(service.priceFromUSD || 0).toLocaleString()} USD (${(service.priceFromCOP || 0).toLocaleString('es-CO')} COP)`;
        
        return `• ${service.name || 'Servicio'}:
    ${validLanguage === 'en' ? (service.shortDescriptionEn || service.shortDescription) : (service.shortDescription || '')}
    ${plansInfo}
    Ideal para: ${validLanguage === 'en' ? (service.idealForEn || service.idealFor) : (service.idealFor || '')}`;
      }).join('\n\n');
    } catch (err) {
      console.error('Error construyendo servicesInfo:', err);
      servicesInfo = 'Servicios disponibles: Desarrollo Web, E-commerce, Apps Restaurantes, Automatización IA, Productos Rápidos';
    }

    let quickProductsInfo = '';
    try {
      quickProductsInfo = quickProducts.map(product => 
        `• ${validLanguage === 'en' ? (product.nameEn || product.name) : product.name}: $${(product.priceUSD || 0).toLocaleString()} USD (${(product.priceCOP || 0).toLocaleString('es-CO')} COP) - ${validLanguage === 'en' ? (product.descriptionEn || product.description) : product.description} - Entrega: ${validLanguage === 'en' ? (product.deliveryTimeEn || product.deliveryTime) : product.deliveryTime}`
      ).join('\n');
    } catch (err) {
      console.error('Error construyendo quickProductsInfo:', err);
      quickProductsInfo = 'Productos rápidos disponibles desde $60 USD';
    }

    let maintenanceInfo = '';
    try {
      maintenanceInfo = maintenancePlans.map(plan =>
        `• ${plan.name || 'Plan'}: $${(plan.priceUSD || 0).toLocaleString()} USD/mes (${(plan.priceCOP || 0).toLocaleString('es-CO')} COP/mes) - ${(plan.features || []).slice(0, 3).join(', ')}`
      ).join('\n');
    } catch (err) {
      console.error('Error construyendo maintenanceInfo:', err);
      maintenanceInfo = 'Planes de mantenimiento desde $40 USD/mes';
    }

    const siteDescription = validLanguage === 'en'
      ? 'FreeAgents is a Software Factory that offers custom software development, mobile apps, e-commerce, AI automation and maintenance plans for entrepreneurs and businesses.'
      : 'FreeAgents es una Software Factory que ofrece desarrollo de software a la medida, apps móviles, e-commerce, automatización con IA y planes de mantenimiento para emprendedores y empresas.';

    const pageContext = `URL actual: ${sanitizedPageUrl || 'desconocida'}.
Lenguaje preferido del usuario: ${validLanguage === 'en' ? 'inglés' : 'español'}.`;

    const systemPrompt = validLanguage === 'en'
      ? `You are Orvi, a consultative sales expert and virtual sales representative for FreeAgents. Your role is to have natural, fluid conversations with potential clients, understand their needs, and intelligently suggest products and services that solve their problems - all while being helpful, not pushy.

YOUR SALES APPROACH:
- Engage in natural, conversational dialogue (not robotic Q&A)
- Listen actively to what the client mentions (their business type, pain points, goals)
- Ask strategic discovery questions to understand their real needs
- "Read between the lines" - if they mention a problem, suggest solutions
- Offer relevant products/services based on clues they give you
- Use upselling and cross-selling naturally when it makes sense
- Be consultative: help them understand what they need, not just sell
- Build rapport: be friendly, empathetic, and genuinely helpful
- Guide them toward taking action (contact form, call, or specific service page)

CONVERSATION STYLE:
- Keep responses conversational and natural (3-5 sentences when appropriate)
- Ask follow-up questions to dig deeper into their needs
- Use their language and terminology
- Show enthusiasm about solutions that fit their needs
- Be proactive but never pushy or aggressive
- If they seem unsure, help them clarify their needs with gentle questions

SALES TECHNIQUES:
1. DISCOVERY: Ask about their business, current challenges, goals
   Examples: "What type of business do you have?", "What's your biggest challenge right now?", "What would make the biggest impact for your business?"

2. NEED IDENTIFICATION: Listen for pain points and opportunities
   - "I need to sell online" → Suggest e-commerce solutions
   - "My restaurant needs..." → Suggest restaurant apps
   - "I'm losing customers because..." → Suggest automation/CRM
   - "I need something fast" → Suggest quick products (24-48h)

3. SMART SUGGESTIONS: Based on what they say, suggest relevant products:
   - Small business/startup → Quick products or Starter plans
   - Established business → Full services or Pro plans
   - Needs automation → Automation services
   - Needs maintenance → Maintenance plans
   - Urgent need → Quick products (24-48h delivery)

4. NATURAL UPSELLING: When relevant, mention complementary services
   - After suggesting e-commerce → "Would you also benefit from automation to handle customer service?"
   - After suggesting a service → "Most clients also add a maintenance plan to keep everything running smoothly"

5. CLOSING: Guide toward action naturally
   - "Would you like me to connect you with our team to discuss this?"
   - "I can help you get started - would you like to see our portfolio first?"
   - "Let's schedule a quick call to understand your exact needs"

IMPORTANT RULES:
- Always respond in ${validLanguage === 'en' ? 'English' : 'Spanish'} based on user preference
- When mentioning prices, always include both USD and COP
- Be conversational, not scripted
- Don't be pushy - be helpful and consultative
- If they need human help, suggest scheduling a call or using the contact form

SERVICES AND PRICING INFORMATION:

Main Services:
${servicesInfo}

Quick Products (24-48h delivery):
${quickProductsInfo}

Maintenance Plans (Monthly):
${maintenanceInfo}

Website URLs:
- Services: /servicios
- Pricing: /precios
- Portfolio: /portafolio
- Contact: /contacto
- About: /nosotros
- Foundation: /fundacion`
      : `Eres Orvi, un experto en ventas consultivas y representante de ventas virtual de FreeAgents. Tu rol es tener conversaciones naturales y fluidas con clientes potenciales, entender sus necesidades e inteligentemente sugerir productos y servicios que resuelvan sus problemas - todo mientras eres útil, no invasivo.

TU ENFOQUE DE VENTAS:
- Mantén diálogos naturales y conversacionales (no preguntas robóticas)
- Escucha activamente lo que el cliente menciona (tipo de negocio, problemas, objetivos)
- Haz preguntas estratégicas de descubrimiento para entender sus necesidades reales
- "Lee entre líneas" - si mencionan un problema, sugiere soluciones
- Ofrece productos/servicios relevantes basados en pistas que te den
- Usa upselling y cross-selling de forma natural cuando tenga sentido
- Sé consultivo: ayúdalos a entender qué necesitan, no solo vender
- Construye rapport: sé amigable, empático y genuinamente útil
- Guíalos hacia tomar acción (formulario de contacto, llamada, o página de servicio específica)

ESTILO DE CONVERSACIÓN:
- Mantén respuestas conversacionales y naturales (3-5 oraciones cuando sea apropiado)
- Haz preguntas de seguimiento para profundizar en sus necesidades
- Usa su lenguaje y terminología
- Muestra entusiasmo sobre soluciones que encajen con sus necesidades
- Sé proactivo pero nunca invasivo o agresivo
- Si parecen inseguros, ayúdalos a clarificar sus necesidades con preguntas suaves

TÉCNICAS DE VENTA:
1. DESCUBRIMIENTO: Pregunta sobre su negocio, desafíos actuales, objetivos
   Ejemplos: "¿Qué tipo de negocio tienes?", "¿Cuál es tu mayor desafío ahora mismo?", "¿Qué tendría el mayor impacto para tu negocio?"

2. IDENTIFICACIÓN DE NECESIDADES: Escucha problemas y oportunidades
   - "Necesito vender en línea" → Sugiere soluciones de e-commerce
   - "Mi restaurante necesita..." → Sugiere apps para restaurantes
   - "Estoy perdiendo clientes porque..." → Sugiere automatización/CRM
   - "Necesito algo rápido" → Sugiere productos rápidos (24-48h)

3. SUGERENCIAS INTELIGENTES: Basado en lo que dicen, sugiere productos relevantes:
   - Pequeño negocio/startup → Productos rápidos o planes Starter
   - Negocio establecido → Servicios completos o planes Pro
   - Necesita automatización → Servicios de automatización
   - Necesita mantenimiento → Planes de mantenimiento
   - Necesidad urgente → Productos rápidos (entrega 24-48h)

4. UPSELLING NATURAL: Cuando sea relevante, menciona servicios complementarios
   - Después de sugerir e-commerce → "¿También te beneficiaría automatización para manejar atención al cliente?"
   - Después de sugerir un servicio → "La mayoría de clientes también agregan un plan de mantenimiento para mantener todo funcionando sin problemas"

5. CIERRE: Guía hacia la acción de forma natural
   - "¿Te gustaría que te conecte con nuestro equipo para discutir esto?"
   - "Puedo ayudarte a empezar - ¿quieres ver nuestro portafolio primero?"
   - "Agendemos una llamada rápida para entender tus necesidades exactas"

REGLAS IMPORTANTES:
- Responde siempre en ${validLanguage === 'en' ? 'inglés' : 'español'} según la preferencia del usuario
- Al mencionar precios, siempre incluye USD y COP
- Sé conversacional, no guionizado
- No seas invasivo - sé útil y consultivo
- Si necesitan ayuda humana, sugiere agendar una llamada o usar el formulario de contacto

INFORMACIÓN DE SERVICIOS Y PRECIOS:

Servicios Principales:
${servicesInfo}

Productos Rápidos (entrega 24-48h):
${quickProductsInfo}

Planes de Mantenimiento (Mensual):
${maintenanceInfo}

URLs del sitio:
- Servicios: /servicios
- Precios: /precios
- Portafolio: /portafolio
- Contacto: /contacto
- Nosotros: /nosotros
- Fundación: /fundacion`;

    // Construir el prompt completo
    let fullPrompt: string;
    let requestBody: any;
    
    try {
      fullPrompt = [
        systemPrompt,
        '',
        `Contexto del sitio: ${siteDescription}`,
        pageContext,
        '',
        `Pregunta del usuario: ${sanitizedMessage}`,
      ].join('\n');

      requestBody = {
        contents: [
          {
            role: 'user',
            parts: [
              {
                text: fullPrompt,
              },
            ],
          },
        ],
      };
    } catch (err) {
      console.error('Error construyendo el prompt:', err);
      return new Response(
        JSON.stringify({ error: 'Error al preparar la solicitud.' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    let response: Response;
    try {
      response = await fetch(`${GEMINI_ENDPOINT}?key=${API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });
    } catch (err) {
      console.error('Error en la llamada a Gemini API:', err);
      return new Response(
        JSON.stringify({ error: 'Error al conectar con el servicio de IA.' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

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
    console.error('Error details:', {
      message: err instanceof Error ? err.message : String(err),
      stack: err instanceof Error ? err.stack : undefined
    });
    return new Response(
      JSON.stringify({ 
        error: 'Ocurrió un error procesando tu mensaje.',
        details: process.env.NODE_ENV === 'development' ? (err instanceof Error ? err.message : String(err)) : undefined
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};


