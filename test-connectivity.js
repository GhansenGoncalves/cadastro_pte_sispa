const https = require('https');
const http = require('http');

// Função para testar conectividade
function testConnectivity(url) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https:') ? https : http;
    
    const req = protocol.get(url, (res) => {
      console.log(`✅ Status: ${res.statusCode}`);
      console.log(`✅ Headers: ${JSON.stringify(res.headers, null, 2)}`);
      resolve({
        status: res.statusCode,
        headers: res.headers,
        accessible: res.statusCode >= 200 && res.statusCode < 400
      });
    });

    req.on('error', (err) => {
      console.log(`❌ Erro de conectividade: ${err.message}`);
      reject(err);
    });

    req.setTimeout(10000, () => {
      req.destroy();
      reject(new Error('Timeout - site não respondeu em 10 segundos'));
    });
  });
}

// URLs para testar
const urls = [
  'https://homolog.agricultura.gov.br/sia/?enableMockedUsers=true',
  'https://homolog.agricultura.gov.br',
  'https://agricultura.gov.br'
];

async function runConnectivityTests() {
  console.log('🔍 Testando conectividade com os sites...\n');
  
  for (const url of urls) {
    console.log(`📡 Testando: ${url}`);
    try {
      const result = await testConnectivity(url);
      if (result.accessible) {
        console.log(`✅ ${url} - ACESSÍVEL\n`);
      } else {
        console.log(`⚠️  ${url} - Status: ${result.status}\n`);
      }
    } catch (error) {
      console.log(`❌ ${url} - INACESSÍVEL: ${error.message}\n`);
    }
  }
  
  console.log('🎯 Recomendações:');
  console.log('1. Se todos os sites estiverem inacessíveis, verifique sua conexão com a internet');
  console.log('2. Se apenas o site de homologação estiver inacessível, use a versão com mocks');
  console.log('3. Execute: npx cypress run --spec "cypress/e2e/cadastro_pte_mock.cy.js"');
}

// Executa os testes
runConnectivityTests().catch(console.error); 