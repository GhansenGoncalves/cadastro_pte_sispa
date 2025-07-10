const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    // Configurações para execução única (sem retries)
    defaultCommandTimeout: 15000,
    requestTimeout: 15000,
    responseTimeout: 15000,
    pageLoadTimeout: 30000,
    
    // RETRIES DESABILITADOS - executa apenas uma vez
    retries: {
      runMode: 0,    // 0 = sem retries no modo run
      openMode: 0    // 0 = sem retries no modo open
    },
    
    // Configurações de vídeo e screenshots
    video: true,
    screenshotOnRunFailure: true,
    
    // Configurações de viewport
    viewportWidth: 1920,
    viewportHeight: 1080,
    
    // Configurações de rede
    chromeWebSecurity: false,
    
    // Configurações de base URL (opcional)
    baseUrl: null,
    
    // Configuração para parar após execução
    exitOnError: true,
    
    // Configuração para não aguardar após execução
    waitForAnimations: false,
    
    // Configuração para parar imediatamente em caso de falha
    stopOnFirstFailure: true
  },
}); 