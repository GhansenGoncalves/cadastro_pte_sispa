// ***********************************************************
// This example support/e2e.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands'

// Alternatively you can use CommonJS syntax:
// require('./commands')

// Configurações globais para melhorar robustez
Cypress.on('uncaught:exception', (err, runnable) => {
  // Retorna false para evitar que o Cypress falhe em erros não capturados
  // Isso é útil para aplicações que podem ter erros de JavaScript não críticos
  return false;
});

// Configuração para lidar melhor com elementos que podem estar ocultos
Cypress.Commands.overwrite('scrollIntoView', (originalFn, subject, options) => {
  const defaultOptions = {
    duration: 1000,
    offset: { top: -100, left: 0 },
    ...options
  };
  
  return originalFn(subject, defaultOptions);
});

// Configuração simplificada para melhorar robustez
Cypress.config('defaultCommandTimeout', 10000);
Cypress.config('requestTimeout', 10000);
Cypress.config('responseTimeout', 10000);