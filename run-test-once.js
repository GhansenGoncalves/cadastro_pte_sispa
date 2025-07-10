const { exec } = require('child_process');
const path = require('path');

console.log('🚀 Executando teste Cypress apenas uma vez...\n');

// Configurações para executar apenas uma vez
const command = `npx cypress run --spec "cypress/e2e/cadastro_pte.cy.js" --config-file cypress.config.once.js`;

console.log(`Executando: ${command}\n`);

const child = exec(command, {
  cwd: process.cwd(),
  maxBuffer: 1024 * 1024 * 10 // 10MB buffer
});

// Captura saída em tempo real
child.stdout.on('data', (data) => {
  console.log(data.toString());
});

child.stderr.on('data', (data) => {
  console.error(data.toString());
});

// Quando o processo terminar
child.on('close', (code) => {
  console.log(`\n🎯 Teste finalizado com código: ${code}`);
  
  if (code === 0) {
    console.log('✅ Teste executado com sucesso!');
  } else {
    console.log('❌ Teste falhou ou foi interrompido.');
  }
  
  console.log('🛑 Processo finalizado - não haverá execuções automáticas.');
  process.exit(code);
});

// Captura interrupção do usuário (Ctrl+C)
process.on('SIGINT', () => {
  console.log('\n🛑 Interrupção detectada - finalizando teste...');
  child.kill('SIGINT');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Terminação detectada - finalizando teste...');
  child.kill('SIGTERM');
  process.exit(0);
}); 