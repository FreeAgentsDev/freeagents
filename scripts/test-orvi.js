#!/usr/bin/env node
/**
 * Script de prueba para verificar la configuración de Orvi
 * Uso: node scripts/test-orvi.js
 */

const API_KEY = process.env.ORVI_API_KEY;

if (!API_KEY) {
  console.error('❌ Error: ORVI_API_KEY no está configurada en las variables de entorno');
  console.log('\n📝 Pasos para configurar:');
  console.log('1. Crea un archivo .env en la raíz del proyecto');
  console.log('2. Agrega: ORVI_API_KEY=tu_api_key_aqui');
  console.log('3. Obtén tu API key en: https://aistudio.google.com/');
  process.exit(1);
}

console.log('✅ API Key encontrada');
console.log(`   Longitud: ${API_KEY.length} caracteres`);
console.log(`   Empieza con: ${API_KEY.substring(0, 10)}...`);

// Probar conexión con Gemini API
const GEMINI_ENDPOINT = 'https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent';

const testMessage = {
  contents: [
    {
      role: 'user',
      parts: [
        {
          text: 'Responde solo con "OK" si puedes leer este mensaje.'
        }
      ]
    }
  ]
};

console.log('\n🔄 Probando conexión con Gemini API...');

fetch(`${GEMINI_ENDPOINT}?key=${API_KEY}`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(testMessage),
})
  .then(async (response) => {
    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Error en la API:', errorText);
      console.log('\n💡 Posibles soluciones:');
      console.log('- Verifica que la API key sea correcta');
      console.log('- Verifica que la API esté habilitada en Google Cloud Console');
      console.log('- Verifica que no hayas excedido los límites de cuota');
      process.exit(1);
    }
    
    const data = await response.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || 'Sin respuesta';
    
    console.log('✅ Conexión exitosa!');
    console.log(`   Respuesta: ${text}`);
    console.log('\n🎉 Orvi está configurado correctamente!');
  })
  .catch((error) => {
    console.error('❌ Error de conexión:', error.message);
    console.log('\n💡 Verifica tu conexión a internet');
    process.exit(1);
  });

