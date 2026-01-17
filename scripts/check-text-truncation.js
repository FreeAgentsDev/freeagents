/**
 * Script para detectar texto cortado o truncado en el sitio
 * Ejecutar después del build para verificar que no hay contenido cortado
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Patrones que indican texto cortado
const truncationPatterns = [
  /\.\.\.$/,           // Texto que termina en "..."
  /[a-z]d\.\.\.$/i,   // Patrón como "futuro d..."
  /con\.\.\.$/i,      // Patrón como "experiencia con..."
  /[a-z]\s\.\.\.$/i,  // Palabra seguida de "..."
];

// Clases CSS que pueden causar truncamiento
const truncationClasses = [
  'line-clamp',
  'truncate',
  'text-ellipsis',
  'overflow-hidden',
];

// Archivos HTML a verificar
const distDir = path.join(__dirname, '../dist');
const htmlFiles = [];

function findHTMLFiles(dir) {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      findHTMLFiles(filePath);
    } else if (file.endsWith('.html')) {
      htmlFiles.push(filePath);
    }
  });
}

function checkForTruncatedText(content, filePath) {
  const issues = [];
  const lines = content.split('\n');
  
  lines.forEach((line, lineNumber) => {
    // Verificar patrones de texto cortado en contenido visible (no en atributos)
    truncationPatterns.forEach(pattern => {
      if (pattern.test(line)) {
        // Verificar que no sea parte de código, comentarios, o atributos
        if (!line.includes('<!--') && 
            !line.includes('//') && 
            !line.includes('/*') &&
            !line.match(/class=["']/) &&
            !line.match(/href=["']/) &&
            !line.match(/src=["']/) &&
            !line.match(/data-/) &&
            (line.includes('>') || line.match(/[a-záéíóúñ]d\.\.\./i))) {
          // Verificar que sea texto visible (entre tags o en contenido)
          const textMatch = line.match(/>([^<]*\.\.\.[^<]*)</);
          if (textMatch && textMatch[1].trim().length > 0) {
            issues.push({
              file: filePath,
              line: lineNumber + 1,
              content: line.trim(),
              issue: 'Texto truncado detectado en contenido visible',
            });
          }
        }
      }
    });
    
    // Verificar palabras cortadas específicamente (como "futuro d..." o "experiencia con...")
    const cutWordPatterns = [
      /[a-záéíóúñ]d\.\.\./i,  // "futuro d..."
      /con\.\.\.$/i,           // "experiencia con..."
      /[a-záéíóúñ]\s\.\.\./i,  // palabra seguida de "..."
    ];
    
    cutWordPatterns.forEach(pattern => {
      if (pattern.test(line)) {
        // Solo si está en contenido visible, no en atributos
        if (!line.match(/class=["']/) && 
            !line.match(/href=["']/) && 
            !line.match(/src=["']/) &&
            !line.includes('<!--') &&
            !line.includes('//')) {
          const textMatch = line.match(/>([^<]*)/);
          if (textMatch && textMatch[1].trim().length > 0) {
            issues.push({
              file: filePath,
              line: lineNumber + 1,
              content: line.trim(),
              issue: 'Palabra cortada detectada',
            });
          }
        }
      }
    });
  });
  
  return issues;
}

function main() {
  console.log('🔍 Verificando texto truncado en archivos HTML...\n');
  
  if (!fs.existsSync(distDir)) {
    console.error('❌ Directorio dist/ no encontrado. Ejecuta "npm run build" primero.');
    process.exit(1);
  }
  
  findHTMLFiles(distDir);
  
  if (htmlFiles.length === 0) {
    console.error('❌ No se encontraron archivos HTML en dist/');
    process.exit(1);
  }
  
  let totalIssues = 0;
  const allIssues = [];
  
  htmlFiles.forEach(filePath => {
    const content = fs.readFileSync(filePath, 'utf-8');
    const issues = checkForTruncatedText(content, path.relative(distDir, filePath));
    
    if (issues.length > 0) {
      totalIssues += issues.length;
      allIssues.push(...issues);
    }
  });
  
  // Reporte
  if (totalIssues === 0) {
    console.log('✅ No se encontraron problemas de texto truncado.\n');
    console.log(`📄 Archivos verificados: ${htmlFiles.length}`);
    process.exit(0);
  } else {
    console.log(`⚠️  Se encontraron ${totalIssues} posibles problemas:\n`);
    
    allIssues.forEach((issue, index) => {
      console.log(`${index + 1}. ${issue.file}:${issue.line}`);
      console.log(`   ${issue.issue}`);
      console.log(`   Contenido: ${issue.content.substring(0, 100)}...\n`);
    });
    
    console.log(`\n📄 Archivos verificados: ${htmlFiles.length}`);
    console.log(`❌ Total de problemas: ${totalIssues}\n`);
    process.exit(1);
  }
}

main();
