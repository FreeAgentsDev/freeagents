// Configuración centralizada de servicios y precios
// Tasa de conversión: 1 USD = 4,100 COP

export const USD_TO_COP = 4100;

export interface ServicePlan {
  name: string;
  nameEn: string;
  priceUSD: number;
  priceCOP: number;
  features: string[];
  featuresEn: string[];
  recommended?: boolean;
}

export interface QuickProduct {
  id: string;
  name: string;
  nameEn: string;
  description: string;
  descriptionEn: string;
  priceUSD: number;
  priceCOP: number;
  deliveryTime: string;
  deliveryTimeEn: string;
}

export interface Service {
  id: string;
  slug: string;
  name: string;
  nameEn: string;
  shortDescription: string;
  shortDescriptionEn: string;
  fullDescription: string;
  fullDescriptionEn: string;
  idealFor: string;
  idealForEn: string;
  icon: string;
  color: string;
  gradientFrom: string;
  gradientTo: string;
  priceFromUSD: number;
  priceFromCOP: number;
  plans?: ServicePlan[];
  features: string[];
  featuresEn: string[];
  seo: {
    title: string;
    titleEn: string;
    description: string;
    descriptionEn: string;
    keywords: string;
    keywordsEn: string;
  };
}

export const services: Service[] = [
  {
    id: 'desarrollo-web',
    slug: 'desarrollo-web',
    name: 'Desarrollo Web y Software a la Medida',
    nameEn: 'Custom Web and Software Development',
    shortDescription: 'Sistemas únicos diseñados exclusivamente para tu negocio. Más eficiente, más competitivo y más rentable.',
    shortDescriptionEn: 'Unique systems designed exclusively for your business. More efficient, more competitive and more profitable.',
    fullDescription: 'Soluciones hechas desde cero, adaptadas exactamente a las necesidades del negocio. Creamos sistemas administrativos, plataformas SaaS, MVPs y más, todo diseñado para escalar con tu empresa.',
    fullDescriptionEn: 'Solutions made from scratch, adapted exactly to your business needs. We create administrative systems, SaaS platforms, MVPs and more, all designed to scale with your company.',
    idealFor: 'Negocios que necesitan digitalizar sus procesos, modernizar sistemas internos o lanzar un producto digital.',
    idealForEn: 'Businesses that need to digitize their processes, modernize internal systems or launch a digital product.',
    icon: 'code',
    color: 'neon-blue',
    gradientFrom: 'neon-blue',
    gradientTo: 'neon-purple',
    priceFromUSD: 1200,
    priceFromCOP: 5000000,
    features: [
      'Sitios web corporativos y landing pages optimizadas',
      'Sistemas administrativos (inventarios, facturación, reservas)',
      'Plataformas SaaS',
      'MVPs para startups',
      'Integración con bases de datos y APIs',
      'Paneles administrativos y dashboards'
    ],
    featuresEn: [
      'Corporate websites and optimized landing pages',
      'Administrative systems (inventory, billing, reservations)',
      'SaaS platforms',
      'MVPs for startups',
      'Database and API integration',
      'Administrative panels and dashboards'
    ],
    seo: {
      title: 'Desarrollo Web a la Medida | FreeAgents',
      titleEn: 'Custom Web Development | FreeAgents',
      description: 'Desarrollo de software y sistemas web personalizados para tu negocio. Soluciones escalables desde $1,200 USD. Transforma tu empresa con tecnología a la medida.',
      descriptionEn: 'Custom software and web systems development for your business. Scalable solutions from $1,200 USD. Transform your company with custom technology.',
      keywords: 'desarrollo web, desarrollo de software, software a la medida, sistemas personalizados, desarrollo de aplicaciones web',
      keywordsEn: 'web development, software development, custom software, custom systems, web application development'
    }
  },
  {
    id: 'ecommerce',
    slug: 'ecommerce',
    name: 'E-commerce Profesional',
    nameEn: 'Professional E-commerce',
    shortDescription: 'Tu máquina de ventas 24/7. Convierte visitantes en clientes y escala sin límites.',
    shortDescriptionEn: 'Your 24/7 sales machine. Converts visitors into customers and scales without limits.',
    fullDescription: 'Tiendas online optimizadas para vender más. Integración con métodos de pago, gestión de inventario automatizada, optimización de velocidad y estrategias de conversión.',
    fullDescriptionEn: 'Online stores optimized to sell more. Payment method integration, automated inventory management, speed optimization and conversion strategies.',
    idealFor: 'Tiendas virtuales nuevas o que necesiten migrar, mejorar rendimiento o automatizar ventas.',
    idealForEn: 'New online stores or those that need to migrate, improve performance or automate sales.',
    icon: 'shopping',
    color: 'neon-green',
    gradientFrom: 'neon-green',
    gradientTo: 'neon-blue',
    priceFromUSD: 800,
    priceFromCOP: 3300000,
    plans: [
      {
        name: 'Starter',
        nameEn: 'Starter',
        priceUSD: 800,
        priceCOP: 3300000,
        features: [
          'E-commerce básico',
          'Integración de pagos',
          'Gestión de inventario'
        ],
        featuresEn: [
          'Basic e-commerce',
          'Payment integration',
          'Inventory management'
        ]
      },
      {
        name: 'Pro',
        nameEn: 'Pro',
        priceUSD: 1300,
        priceCOP: 5400000,
        recommended: true,
        features: [
          'Todo lo de Starter',
          'Optimización avanzada',
          'Estrategias de conversión',
          'Integración ERP'
        ],
        featuresEn: [
          'Everything from Starter',
          'Advanced optimization',
          'Conversion strategies',
          'ERP integration'
        ]
      },
      {
        name: 'Full + Automatizaciones',
        nameEn: 'Full + Automations',
        priceUSD: 2400,
        priceCOP: 9900000,
        features: [
          'Todo lo de Pro',
          'Automatizaciones completas',
          'IA integrada',
          'Soporte prioritario'
        ],
        featuresEn: [
          'Everything from Pro',
          'Complete automations',
          'Integrated AI',
          'Priority support'
        ]
      }
    ],
    features: [
      'E-commerce en Shopify, WooCommerce o a la medida',
      'Integración con métodos de pago (Wompi, ePayco, MercadoPago)',
      'Gestión de inventario automatizada',
      'Optimización de velocidad, UX y conversión',
      'Implementación de estrategias de upsell y cross-sell',
      'Conexiones con facturación electrónica y ERP'
    ],
    featuresEn: [
      'E-commerce on Shopify, WooCommerce or custom',
      'Payment method integration (Wompi, ePayco, MercadoPago)',
      'Automated inventory management',
      'Speed, UX and conversion optimization',
      'Upsell and cross-sell strategy implementation',
      'Electronic billing and ERP connections'
    ],
    seo: {
      title: 'E-commerce Profesional | Desarrollo de Tiendas Online | FreeAgents',
      titleEn: 'Professional E-commerce | Online Store Development | FreeAgents',
      description: 'Desarrollo de tiendas online profesionales desde $800 USD. E-commerce optimizado para conversión con integración de pagos, inventario y más.',
      descriptionEn: 'Professional online store development from $800 USD. Conversion-optimized e-commerce with payment integration, inventory and more.',
      keywords: 'e-commerce, tienda online, desarrollo de tienda virtual, shopify, woocommerce, tienda en línea',
      keywordsEn: 'e-commerce, online store, virtual store development, shopify, woocommerce, online shop'
    }
  },
  {
    id: 'apps-restaurantes',
    slug: 'apps-restaurantes',
    name: 'Apps para Restaurantes',
    nameEn: 'Restaurant Apps',
    shortDescription: 'Digitalización completa: menús QR, pedidos sin intermediarios, cocina organizada. Aumenta ventas y reduce costos.',
    shortDescriptionEn: 'Complete digitization: QR menus, orders without intermediaries, organized kitchen. Increase sales and reduce costs.',
    fullDescription: 'Digitalización total de la operación del restaurante. Menús digitales con QR, sistema de pedidos internos, catálogo de domicilios sin intermediarios y dashboard para la cocina.',
    fullDescriptionEn: 'Complete digitization of restaurant operations. Digital menus with QR, internal ordering system, delivery catalog without intermediaries and kitchen dashboard.',
    idealFor: 'Restaurantes grandes o pequeños que quieran mejorar su operación y aumentar ventas.',
    idealForEn: 'Large or small restaurants that want to improve their operations and increase sales.',
    icon: 'restaurant',
    color: 'neon-teal',
    gradientFrom: 'neon-teal',
    gradientTo: 'neon-green',
    priceFromUSD: 350,
    priceFromCOP: 1400000,
    plans: [
      {
        name: 'Menú + Pedidos Básico',
        nameEn: 'Menu + Basic Orders',
        priceUSD: 350,
        priceCOP: 1400000,
        features: [
          'Menú digital con QR',
          'Sistema de pedidos básico',
          'Integración con WhatsApp'
        ],
        featuresEn: [
          'Digital menu with QR',
          'Basic ordering system',
          'WhatsApp integration'
        ]
      },
      {
        name: 'Sistema Completo Restaurante',
        nameEn: 'Complete Restaurant System',
        priceUSD: 900,
        priceCOP: 3700000,
        recommended: true,
        features: [
          'Todo lo del plan Básico',
          'Catálogo de domicilios sin intermediarios',
          'Dashboard para la cocina',
          'Integración con pagos electrónicos',
          'Notificaciones automáticas'
        ],
        featuresEn: [
          'Everything from Basic plan',
          'Delivery catalog without intermediaries',
          'Kitchen dashboard',
          'Electronic payment integration',
          'Automatic notifications'
        ]
      },
      {
        name: 'App Móvil + Panel Admin',
        nameEn: 'Mobile App + Admin Panel',
        priceUSD: 1800,
        priceCOP: 7500000,
        features: [
          'Todo lo del plan Completo',
          'App móvil personalizada (Android/iOS)',
          'Panel administrativo avanzado',
          'Integración con Rappi',
          'Analytics y reportes'
        ],
        featuresEn: [
          'Everything from Complete plan',
          'Custom mobile app (Android/iOS)',
          'Advanced administrative panel',
          'Rappi integration',
          'Analytics and reports'
        ]
      }
    ],
    features: [
      'Menú digital con QR',
      'Sistema de pedidos internos',
      'Catálogo de domicilios sin intermediarios',
      'Dashboard para la cocina',
      'Integración con WhatsApp, Rappi y pagos electrónicos',
      'Notificaciones automáticas',
      'Opcional: app móvil personalizada (Android/iOS)'
    ],
    featuresEn: [
      'Digital menu with QR',
      'Internal ordering system',
      'Delivery catalog without intermediaries',
      'Kitchen dashboard',
      'WhatsApp, Rappi and electronic payment integration',
      'Automatic notifications',
      'Optional: custom mobile app (Android/iOS)'
    ],
    seo: {
      title: 'Apps para Restaurantes | Digitalización de Restaurantes | FreeAgents',
      titleEn: 'Restaurant Apps | Restaurant Digitization | FreeAgents',
      description: 'Digitalización completa de restaurantes desde $350 USD. Menús QR, pedidos sin intermediarios, sistema de cocina y más.',
      descriptionEn: 'Complete restaurant digitization from $350 USD. QR menus, orders without intermediaries, kitchen system and more.',
      keywords: 'app restaurante, menú digital QR, sistema restaurante, digitalización restaurante, pedidos restaurante',
      keywordsEn: 'restaurant app, digital QR menu, restaurant system, restaurant digitization, restaurant orders'
    }
  },
  {
    id: 'automatizacion-ia',
    slug: 'automatizacion-ia',
    name: 'Automatización e Integraciones con IA',
    nameEn: 'AI Automation and Integrations',
    shortDescription: 'Asistente que nunca duerme. Automatiza lo repetitivo para que te enfoques en hacer crecer tu negocio.',
    shortDescriptionEn: 'Assistant that never sleeps. Automates repetitive tasks so you can focus on growing your business.',
    fullDescription: 'Flujos automáticos que ahorran tiempo, costos y eliminan trabajo repetitivo. Agentes inteligentes, chatbots, automatización de CRM y procesos empresariales.',
    fullDescriptionEn: 'Automatic flows that save time, costs and eliminate repetitive work. Intelligent agents, chatbots, CRM automation and business processes.',
    idealFor: 'Cualquier empresa que quiera optimizar su operación sin contratar más personal.',
    idealForEn: 'Any company that wants to optimize its operations without hiring more staff.',
    icon: 'ai',
    color: 'neon-pink',
    gradientFrom: 'neon-pink',
    gradientTo: 'neon-purple',
    priceFromUSD: 150,
    priceCOP: 600000,
    plans: [
      {
        name: 'Automatización Simple',
        nameEn: 'Simple Automation',
        priceUSD: 150,
        priceCOP: 600000,
        features: [
          'Chatbot básico',
          'Automatización de respuestas',
          'Integración con WhatsApp'
        ],
        featuresEn: [
          'Basic chatbot',
          'Response automation',
          'WhatsApp integration'
        ]
      },
      {
        name: 'Sistema Inteligente Completo',
        nameEn: 'Complete Intelligent System',
        priceUSD: 550,
        priceCOP: 2200000,
        recommended: true,
        features: [
          'Todo lo de Simple',
          'CRM + WhatsApp + Email',
          'Automatización de inventarios',
          'Procesos de seguimiento automáticos'
        ],
        featuresEn: [
          'Everything from Simple',
          'CRM + WhatsApp + Email',
          'Inventory automation',
          'Automatic follow-up processes'
        ]
      },
      {
        name: 'Agente de IA Personalizado',
        nameEn: 'Custom AI Agent',
        priceUSD: 900,
        priceCOP: 3500000,
        features: [
          'Todo lo del plan Completo',
          'Agente inteligente personalizado',
          'Integración con múltiples sistemas',
          'Análisis predictivo',
          'Soporte 24/7'
        ],
        featuresEn: [
          'Everything from Complete plan',
          'Custom intelligent agent',
          'Multiple system integration',
          'Predictive analysis',
          '24/7 support'
        ]
      }
    ],
    features: [
      'Agentes inteligentes (recepcionistas, soporte, ventas)',
      'Chatbots de atención a clientes',
      'CRM + WhatsApp + Email',
      'Inventarios y facturación',
      'Procesos de seguimiento y recordatorios',
      'Formularios y sistemas conectados a bases de datos'
    ],
    featuresEn: [
      'Intelligent agents (receptionists, support, sales)',
      'Customer service chatbots',
      'CRM + WhatsApp + Email',
      'Inventory and billing',
      'Follow-up processes and reminders',
      'Forms and systems connected to databases'
    ],
    seo: {
      title: 'Automatización con IA | Chatbots y Agentes Inteligentes | FreeAgents',
      titleEn: 'AI Automation | Chatbots and Intelligent Agents | FreeAgents',
      description: 'Automatización empresarial con IA desde $150 USD. Chatbots, agentes inteligentes, CRM automatizado y más.',
      descriptionEn: 'Business automation with AI from $150 USD. Chatbots, intelligent agents, automated CRM and more.',
      keywords: 'automatización IA, chatbot, agente inteligente, automatización empresarial, IA para negocios',
      keywordsEn: 'AI automation, chatbot, intelligent agent, business automation, AI for business'
    }
  },
  {
    id: 'productos-rapidos',
    slug: 'productos-rapidos',
    name: 'Productos Digitales Pre-Construidos',
    nameEn: 'Pre-Built Digital Products',
    shortDescription: 'Soluciones listas en 24h. Landing pages, mini-ecommerce y más. Rápidos, económicos y listos para usar.',
    shortDescriptionEn: 'Ready solutions in 24h. Landing pages, mini-ecommerce and more. Fast, affordable and ready to use.',
    fullDescription: 'Ideal para negocios pequeños o emprendedores que necesitan algo rápido y económico. Productos digitales pre-construidos listos para usar en 24 horas.',
    fullDescriptionEn: 'Ideal for small businesses or entrepreneurs who need something fast and affordable. Pre-built digital products ready to use in 24 hours.',
    idealFor: 'Negocios pequeños o emprendedores que necesitan algo rápido y económico.',
    idealForEn: 'Small businesses or entrepreneurs who need something fast and affordable.',
    icon: 'lightning',
    color: 'neon-cyan',
    gradientFrom: 'neon-cyan',
    gradientTo: 'neon-teal',
    priceFromUSD: 60,
    priceCOP: 250000,
    features: [
      'Entrega en 24 horas',
      'Productos listos para usar',
      'Precios accesibles',
      'Soporte básico incluido'
    ],
    featuresEn: [
      '24-hour delivery',
      'Ready-to-use products',
      'Affordable prices',
      'Basic support included'
    ],
    seo: {
      title: 'Productos Digitales Rápidos | Soluciones en 24h | FreeAgents',
      titleEn: 'Fast Digital Products | 24h Solutions | FreeAgents',
      description: 'Productos digitales pre-construidos desde $60 USD. Landing pages, mini-ecommerce y más, listos en 24 horas.',
      descriptionEn: 'Pre-built digital products from $60 USD. Landing pages, mini-ecommerce and more, ready in 24 hours.',
      keywords: 'landing page rápida, productos digitales, soluciones rápidas, mini ecommerce',
      keywordsEn: 'fast landing page, digital products, quick solutions, mini ecommerce'
    }
  }
];

export const quickProducts: QuickProduct[] = [
  {
    id: 'landing-page',
    name: 'Landing Page Ultra Rápida',
    nameEn: 'Ultra Fast Landing Page',
    description: 'Landing page profesional optimizada para conversión, lista en 24 horas.',
    descriptionEn: 'Professional conversion-optimized landing page, ready in 24 hours.',
    priceUSD: 70,
    priceCOP: 280000,
    deliveryTime: '24 horas',
    deliveryTimeEn: '24 hours'
  },
  {
    id: 'mini-ecommerce',
    name: 'Mini-Ecommerce 1 día',
    nameEn: 'Mini-Ecommerce 1 Day',
    description: 'Tienda online básica con catálogo y pagos, lista en 1 día.',
    descriptionEn: 'Basic online store with catalog and payments, ready in 1 day.',
    priceUSD: 150,
    priceCOP: 600000,
    deliveryTime: '24 horas',
    deliveryTimeEn: '24 hours'
  },
  {
    id: 'sistema-reservas',
    name: 'Sistema de Reservas',
    nameEn: 'Reservation System',
    description: 'Sistema completo de reservas con calendario y notificaciones.',
    descriptionEn: 'Complete reservation system with calendar and notifications.',
    priceUSD: 90,
    priceCOP: 360000,
    deliveryTime: '24-48 horas',
    deliveryTimeEn: '24-48 hours'
  },
  {
    id: 'catalogo-productos',
    name: 'Catálogo de Productos',
    nameEn: 'Product Catalog',
    description: 'Catálogo digital interactivo para mostrar tus productos.',
    descriptionEn: 'Interactive digital catalog to showcase your products.',
    priceUSD: 60,
    priceCOP: 250000,
    deliveryTime: '24 horas',
    deliveryTimeEn: '24 hours'
  },
  {
    id: 'mini-crm',
    name: 'Mini-CRM para PYMES',
    nameEn: 'Mini-CRM for SMEs',
    description: 'Sistema básico de gestión de clientes y contactos.',
    descriptionEn: 'Basic customer and contact management system.',
    priceUSD: 120,
    priceCOP: 480000,
    deliveryTime: '48 horas',
    deliveryTimeEn: '48 hours'
  }
];

export const maintenancePlans: ServicePlan[] = [
  {
    name: 'Essentials',
    nameEn: 'Essentials',
    priceUSD: 40,
    priceCOP: 160000,
    features: [
      'Actualizaciones básicas',
      'Correcciones',
      'Soporte WhatsApp'
    ],
    featuresEn: [
      'Basic updates',
      'Fixes',
      'WhatsApp support'
    ]
  },
  {
    name: 'Pro',
    nameEn: 'Pro',
    priceUSD: 80,
    priceCOP: 320000,
    recommended: true,
    features: [
      'Todo lo de Essentials',
      'Nuevas funcionalidades mensuales',
      'Optimizaciones',
      'Soporte prioritario'
    ],
    featuresEn: [
      'Everything from Essentials',
      'New monthly features',
      'Optimizations',
      'Priority support'
    ]
  },
  {
    name: 'Business',
    nameEn: 'Business',
    priceUSD: 160,
    priceCOP: 650000,
    features: [
      'Todo lo de Pro',
      'Desarrollo personalizado mensual',
      'Soporte 24/7',
      'Consultoría incluida'
    ],
    featuresEn: [
      'Everything from Pro',
      'Monthly custom development',
      '24/7 support',
      'Consulting included'
    ]
  }
];

// Helper para obtener un servicio por slug
export function getServiceBySlug(slug: string): Service | undefined {
  return services.find(service => service.slug === slug);
}

// Helper para obtener todos los slugs de servicios
export function getAllServiceSlugs(): string[] {
  return services.map(service => service.slug);
}

