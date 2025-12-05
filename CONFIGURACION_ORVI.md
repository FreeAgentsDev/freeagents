# 🚀 Guía de Configuración de Orvi - Asistente IA

Esta guía te ayudará a configurar Orvi, el asistente virtual de FreeAgents, usando Google Gemini AI Studio.

## 📋 Requisitos Previos

- Cuenta de Google (freeagentsdev@gmail.com)
- Acceso a [Google AI Studio](https://aistudio.google.com/)
- Proyecto de FreeAgents configurado

## 🔑 Paso 1: Obtener API Key desde AI Studio

### 1.1 Acceder a AI Studio
1. Ve a [https://aistudio.google.com/](https://aistudio.google.com/)
2. Inicia sesión con la cuenta: **freeagentsdev@gmail.com**

### 1.2 Navegar a API Keys
1. En el menú lateral izquierdo, busca **"Get API Key"** o haz clic en el ícono de llave 🔑
2. Si no ves el menú, haz clic en el ícono de menú (☰) en la esquina superior izquierda

### 1.3 Crear API Key
1. Haz clic en **"Create API Key"** o **"Crear clave de API"**
2. Se abrirá una ventana modal con opciones:
   - **Opción 1**: Crear API key en un proyecto nuevo (recomendado para empezar)
   - **Opción 2**: Crear API key en un proyecto existente de Google Cloud
3. Selecciona la opción que prefieras
4. Si creas un proyecto nuevo, dale un nombre como "FreeAgents-Orvi"

### 1.4 Copiar y Guardar la API Key
1. **IMPORTANTE**: Copia la API key inmediatamente (empieza con `AIza...`)
2. Guárdala en un lugar seguro (por ahora, la pondremos en el archivo `.env`)
3. **⚠️ NO la compartas públicamente ni la subas a GitHub**

### 1.5 (Opcional) Restringir la API Key para Producción
Para mayor seguridad en producción:
1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Navega a **APIs & Services** > **Credentials**
3. Encuentra tu API key y haz clic en ella
4. En **"API restrictions"**:
   - Selecciona **"Restrict key"**
   - Marca solo **"Generative Language API"**
5. En **"Application restrictions"** (opcional):
   - Puedes restringir por dominio HTTP referrer
   - O por direcciones IP

## 🔧 Paso 2: Configurar en el Proyecto

### 2.1 Actualizar el archivo .env
Abre el archivo `.env` en la raíz del proyecto y actualiza:

```env
ORVI_API_KEY=tu_api_key_aqui
```

**Ejemplo:**
```env
ORVI_API_KEY=AIzaSyB7DXAb5aZngamAS1suOuSt6CUDgMfeAJY
```

### 2.2 Verificar que el archivo esté en .gitignore
El archivo `.env` ya está en `.gitignore`, así que no se subirá al repositorio.

## ✅ Paso 3: Verificar la Configuración

### 3.1 Iniciar el servidor de desarrollo
```bash
npm run dev
```

### 3.2 Probar el endpoint de diagnóstico
Abre en tu navegador:
```
http://localhost:4321/api/orvi
```

Deberías ver:
```json
{
  "hasKey": true,
  "envName": "ORVI_API_KEY"
}
```

Si ves `"hasKey": false`, verifica que:
- El archivo `.env` existe
- La variable `ORVI_API_KEY` está correctamente escrita
- Reiniciaste el servidor después de crear/actualizar el `.env`

### 3.3 Probar el chat
1. Abre el sitio en el navegador: `http://localhost:4321`
2. Haz clic en el botón flotante de Orvi (esquina inferior derecha)
3. Escribe un mensaje de prueba como:
   - "¿Cuánto cuesta un e-commerce?"
   - "Qué servicios ofrecen?"
   - "Necesito una app para mi restaurante"
4. Verifica que Orvi responda correctamente con información de servicios y precios

### 3.4 Probar con el script de prueba (Opcional)
```bash
# Desde la raíz del proyecto
node scripts/test-orvi.js
```

Este script verifica:
- ✅ Que la API key esté configurada
- ✅ Que la conexión con Gemini API funcione
- ✅ Que puedas recibir respuestas

## 🎯 Paso 4: Entender cómo Funciona Orvi

### 4.1 Información que Orvi Conoce
Orvi ahora tiene acceso automático a:
- ✅ Todos los servicios y sus descripciones
- ✅ Precios en USD y COP de todos los planes
- ✅ Productos rápidos y sus tiempos de entrega
- ✅ Planes de mantenimiento mensuales
- ✅ URLs de todas las páginas del sitio

### 4.2 Cómo Funciona el Prompt
El prompt del sistema está en `src/pages/api/orvi.ts` y se genera dinámicamente usando:
- Información de `src/config/services.ts`
- Contexto de la página actual
- Idioma preferido del usuario

### 4.3 Personalizar el Prompt (Opcional)
Puedes editar el `systemPrompt` en `src/pages/api/orvi.ts` para:
- Cambiar el tono de Orvi (más formal, más casual, etc.)
- Agregar información adicional sobre FreeAgents
- Ajustar cómo responde a diferentes situaciones
- Modificar las reglas de comportamiento

## 🔒 Seguridad

### Buenas Prácticas:
1. ✅ **NUNCA** subas el archivo `.env` al repositorio
2. ✅ Restringe la API key en Google Cloud Console
3. ✅ Usa diferentes API keys para desarrollo y producción
4. ✅ Monitorea el uso de la API en Google Cloud Console

### Restricciones Recomendadas:
- **API Restrictions**: Solo "Generative Language API"
- **Application Restrictions**: Por dominio (en producción)

## 📊 Monitoreo y Límites

### Límites de Gemini API (Gratis):
- **RPM (Requests Per Minute)**: 15
- **TPM (Tokens Per Minute)**: 1,000,000
- **RPD (Requests Per Day)**: 1,500

### Límites en el Código:
- **Rate Limiting**: 10 requests por minuto por IP
- **Max Message Length**: 1000 caracteres

## 🐛 Solución de Problemas

### Error: "ORVI_API_KEY is not configured"
- Verifica que el archivo `.env` existe
- Verifica que la variable se llama exactamente `ORVI_API_KEY`
- Reinicia el servidor

### Error: "API key not valid"
- Verifica que la API key esté correctamente copiada
- Verifica que la API key no esté restringida incorrectamente
- Verifica que el proyecto de Google Cloud tenga habilitada la API

### Error: "Quota exceeded"
- Has alcanzado el límite de requests
- Espera unos minutos o verifica tu cuota en Google Cloud Console

### El chat no responde
- Abre la consola del navegador (F12) y revisa errores
- Verifica que el endpoint `/api/orvi` esté funcionando
- Revisa los logs del servidor

## 📚 Recursos

- [Google AI Studio](https://aistudio.google.com/)
- [Gemini API Documentation](https://ai.google.dev/docs)
- [Google Cloud Console](https://console.cloud.google.com/)

## 🎉 ¡Listo!

Una vez configurado, Orvi estará listo para ayudar a los visitantes de tu sitio. El asistente puede:
- Responder preguntas sobre servicios
- Explicar planes y precios
- Guiar a los usuarios a páginas relevantes
- Sugerir contactar al equipo cuando sea necesario

