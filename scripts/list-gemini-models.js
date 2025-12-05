/**
 * Script para listar los modelos disponibles de Google Gemini
 * Ejecuta: node scripts/list-gemini-models.js
 */

const API_KEY = process.env.ORVI_API_KEY || 'AIzaSyDZb8Mt9sN42gU4HIGKMHb86pu-WBZJV-w';
const LIST_MODELS_ENDPOINT = 'https://generativelanguage.googleapis.com/v1/models';

async function listModels() {
  try {
    console.log('🔍 Buscando modelos disponibles...\n');
    console.log(`API Key: ${API_KEY.substring(0, 10)}...${API_KEY.substring(API_KEY.length - 4)}\n`);

    const response = await fetch(`${LIST_MODELS_ENDPOINT}?key=${API_KEY}`);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Error al obtener modelos:');
      console.error(`Status: ${response.status}`);
      console.error(`Response: ${errorText}`);
      return;
    }

    const data = await response.json();
    
    if (!data.models || data.models.length === 0) {
      console.log('⚠️  No se encontraron modelos disponibles.');
      return;
    }

    console.log(`✅ Se encontraron ${data.models.length} modelos:\n`);
    console.log('='.repeat(80));
    
    // Filtrar solo modelos que soporten generateContent
    const generateContentModels = data.models.filter(model => 
      model.supportedGenerationMethods && 
      model.supportedGenerationMethods.includes('generateContent')
    );

    console.log(`\n📝 Modelos que soportan generateContent (${generateContentModels.length}):\n`);
    
    generateContentModels.forEach((model, index) => {
      console.log(`${index + 1}. ${model.name}`);
      console.log(`   Display Name: ${model.displayName || 'N/A'}`);
      console.log(`   Description: ${model.description || 'N/A'}`);
      console.log(`   Supported Methods: ${model.supportedGenerationMethods?.join(', ') || 'N/A'}`);
      console.log('');
    });

    // Mostrar todos los modelos también
    console.log('\n📋 Todos los modelos disponibles:\n');
    data.models.forEach((model, index) => {
      console.log(`${index + 1}. ${model.name}`);
      if (model.displayName) console.log(`   Display: ${model.displayName}`);
      if (model.description) console.log(`   Desc: ${model.description}`);
      if (model.supportedGenerationMethods) {
        console.log(`   Methods: ${model.supportedGenerationMethods.join(', ')}`);
      }
      console.log('');
    });

    // Recomendaciones
    console.log('\n💡 Recomendaciones:\n');
    const recommended = generateContentModels.find(m => 
      m.name.includes('gemini-pro') || 
      m.name.includes('gemini-1.5')
    );
    
    if (recommended) {
      console.log(`✅ Usa este modelo: ${recommended.name}`);
      console.log(`   En el código, cambia a:`);
      console.log(`   const GEMINI_ENDPOINT = 'https://generativelanguage.googleapis.com/v1/models/${recommended.name.split('/').pop()}:generateContent';`);
    } else if (generateContentModels.length > 0) {
      console.log(`✅ Usa este modelo: ${generateContentModels[0].name}`);
      console.log(`   En el código, cambia a:`);
      console.log(`   const GEMINI_ENDPOINT = 'https://generativelanguage.googleapis.com/v1/models/${generateContentModels[0].name.split('/').pop()}:generateContent';`);
    }

  } catch (error) {
    console.error('❌ Error inesperado:');
    console.error(error.message);
    if (error.stack) {
      console.error(error.stack);
    }
  }
}

// Ejecutar
listModels();

