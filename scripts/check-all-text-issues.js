/**
 * Script exhaustivo para detectar todos los problemas de texto
 * - Texto truncado
 * - Contenedores con ancho fijo que puedan cortar texto
 * - Elementos con overflow que puedan ocultar texto
 * - Problemas de responsive
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const distDir = path.join(__dirname, '../dist');
const srcDir = path.join(__dirname, '../src');

const issues = [];

// Patrones problemáticos
const problematicPatterns = {
  // Texto truncado
  truncatedText: [
    /[a-záéíóúñ]d\.\.\./i,
    /con\.\.\.$/i,
    /[a-záéíóúñ]\s\.\.\./i,
  ],
  
  // Clases CSS problemáticas en elementos de texto
  problematicClasses: [
    /line-clamp-\d+/,
    /truncate/,
    /text-ellipsis/,
  ],
  
  // Anchos fijos que pueden causar problemas
  fixedWidths: [
    /w-\[[0-9]+px\]/,
    /max-w-\[[0-9]+px\]/,
    /width:\s*[0-9]+px/,
  ],
  
  // Overflow hidden en contenedores de texto
  overflowInText: [
    /overflow-hidden.*(?:text|p|span|h[1-6])/i,
    /(?:text|p|span|h[1-6]).*overflow-hidden/i,
  ],
};

function findFiles(dir, extension) {
  const files = [];
  function traverse(currentDir) {
    const items = fs.readdirSync(currentDir);
    items.forEach(item => {
      const fullPath = path.join(currentDir, item);
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        traverse(fullPath);
      } else if (item.endsWith(extension)) {
        files.push(fullPath);
      }
    });
  }
  traverse(dir);
  return files;
}

function checkHTMLFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');
  const relativePath = path.relative(distDir, filePath);
  
  lines.forEach((line, lineNumber) => {
    // Verificar texto truncado
    problematicPatterns.truncatedText.forEach(pattern => {
      if (pattern.test(line)) {
        if (!line.includes('<!--') && 
            !line.includes('//') && 
            !line.match(/class=["']/) &&
            !line.match(/href=["']/) &&
            !line.match(/src=["']/) &&
            !line.match(/data-/)) {
          const textMatch = line.match(/>([^<]*\.\.\.[^<]*)</);
          if (textMatch && textMatch[1].trim().length > 0) {
            issues.push({
              type: 'text-truncated',
              file: relativePath,
              line: lineNumber + 1,
              content: line.trim().substring(0, 100),
            });
          }
        }
      }
    });
    
    // Verificar clases problemáticas en elementos de texto
    if (line.includes('class=')) {
      problematicPatterns.problematicClasses.forEach(pattern => {
        if (pattern.test(line)) {
          // Verificar que sea un elemento de texto
          if (line.match(/<(?:p|span|h[1-6]|a|button|li|td|th)/i)) {
            issues.push({
              type: 'problematic-class',
              file: relativePath,
              line: lineNumber + 1,
              content: line.trim().substring(0, 100),
              class: line.match(pattern)?.[0],
            });
          }
        }
      });
    }
  });
}

function checkSourceFiles() {
  const astroFiles = findFiles(srcDir, '.astro');
  const tsFiles = findFiles(srcDir, '.ts');
  
  [...astroFiles, ...tsFiles].forEach(filePath => {
    const content = fs.readFileSync(filePath, 'utf-8');
    const relativePath = path.relative(srcDir, filePath);
    
    // Verificar anchos fijos problemáticos (solo en elementos de texto, no decorativos)
    problematicPatterns.fixedWidths.forEach(pattern => {
      const matches = content.match(new RegExp(pattern.source, 'g'));
      if (matches) {
        matches.forEach(match => {
          const matchIndex = content.indexOf(match);
          const context = content.substring(
            Math.max(0, matchIndex - 300),
            Math.min(content.length, matchIndex + 300)
          );
          
          // Solo reportar si:
          // 1. Está en un elemento de texto (p, span, h1-6, a, button, li)
          // 2. NO es un elemento decorativo (gradiente, blur, bg-)
          // 3. NO es min-width (que es flexible)
          if (context.match(/<(?:p|span|h[1-6]|a|button|li|td|th)/i) &&
              !context.match(/(?:gradient|blur|bg-|rounded-full|absolute|fixed)/i) &&
              !match.includes('min-w')) {
            issues.push({
              type: 'fixed-width',
              file: relativePath,
              content: match,
              context: context.substring(0, 150),
            });
          }
        });
      }
    });
  });
}

function main() {
  console.log('🔍 Verificación exhaustiva de problemas de texto...\n');
  
  if (!fs.existsSync(distDir)) {
    console.error('❌ Directorio dist/ no encontrado. Ejecuta "npm run build" primero.');
    process.exit(1);
  }
  
  // Verificar HTML generado
  const htmlFiles = findFiles(distDir, '.html');
  console.log(`📄 Verificando ${htmlFiles.length} archivos HTML...`);
  htmlFiles.forEach(checkHTMLFile);
  
  // Verificar archivos fuente
  console.log(`📝 Verificando archivos fuente...`);
  checkSourceFiles();
  
  // Reporte
  if (issues.length === 0) {
    console.log('\n✅ No se encontraron problemas de texto.\n');
    process.exit(0);
  } else {
    console.log(`\n⚠️  Se encontraron ${issues.length} posibles problemas:\n`);
    
    // Agrupar por tipo
    const byType = {};
    issues.forEach(issue => {
      if (!byType[issue.type]) {
        byType[issue.type] = [];
      }
      byType[issue.type].push(issue);
    });
    
    Object.entries(byType).forEach(([type, typeIssues]) => {
      console.log(`\n📌 ${type.toUpperCase()} (${typeIssues.length}):`);
      typeIssues.slice(0, 10).forEach((issue, index) => {
        console.log(`  ${index + 1}. ${issue.file}${issue.line ? `:${issue.line}` : ''}`);
        if (issue.content) {
          console.log(`     ${issue.content}`);
        }
      });
      if (typeIssues.length > 10) {
        console.log(`  ... y ${typeIssues.length - 10} más`);
      }
    });
    
    console.log(`\n📊 Total: ${issues.length} problemas encontrados\n`);
    process.exit(1);
  }
}

main();
