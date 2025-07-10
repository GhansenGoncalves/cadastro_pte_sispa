// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
Cypress.Commands.add('login', () => {
  cy.visit('https://homolog.agricultura.gov.br/sia/?enableMockedUsers=true');
  cy.get('.mt-3 > .br-button').should('be.visible').click();
  cy.get(':nth-child(1) > [data-th="Ação"] > .br-button').should('be.visible').click();
  cy.get('.form-select').should('be.visible').select('7: Object'); // Considere usar um valor mais estável se possível
  cy.get('.primary').should('be.visible').click();
});

// Comandos customizados para testes de formulários
Cypress.Commands.add('fillFormField', (selector, value, options = {}) => {
  const defaultOptions = { timeout: 10000, ...options };
  
  return cy.get(selector, defaultOptions)
    .should('be.visible')
    .clear()
    .type(value, options);
});

Cypress.Commands.add('selectDropdownOption', (selector, option, options = {}) => {
  const defaultOptions = { timeout: 10000, ...options };
  
  return cy.get(selector, defaultOptions)
    .should('be.visible')
    .select(option, options);
});

Cypress.Commands.add('waitForPageLoad', (urlPattern, timeout = 20000) => {
  return cy.url({ timeout }).should('include', urlPattern);
});

Cypress.Commands.add('assertElementExists', (selector, options = {}) => {
  const defaultOptions = { timeout: 10000, ...options };
  
  return cy.get(selector, defaultOptions).should('exist');
});

Cypress.Commands.add('assertElementVisible', (selector, options = {}) => {
  const defaultOptions = { timeout: 10000, ...options };
  
  return cy.get(selector, defaultOptions).should('be.visible');
});

// Comando para lidar com modais de forma mais robusta
Cypress.Commands.add('handleModalDialog', (action = 'confirm') => {
  cy.get('body').then($body => {
    const confirmBtn = $body.find('button.swal2-confirm.swal2-styled:visible');
    const cancelBtn = $body.find('button.swal2-cancel:visible');
    const okBtn = $body.find('button:contains("Ok"):visible');
    
    if (action === 'confirm' && confirmBtn.length) {
      cy.wrap(confirmBtn).click();
    } else if (action === 'cancel' && cancelBtn.length) {
      cy.wrap(cancelBtn).click();
    } else if (okBtn.length) {
      cy.wrap(okBtn).click();
    }
  });
});

// Comando para aguardar carregamento de elementos dinâmicos
Cypress.Commands.add('waitForElementToLoad', (selector, timeout = 15000) => {
  return cy.get(selector, { timeout }).should('be.visible');
});

// Comando para scroll suave até elemento
Cypress.Commands.add('scrollToElement', (selector, options = {}) => {
  return cy.get(selector, options)
    .should('exist')
    .scrollIntoView(options);
});

// Comando para verificar se elemento não existe
Cypress.Commands.add('assertElementNotExists', (selector, timeout = 5000) => {
  return cy.get(selector, { timeout }).should('not.exist');
});

// Comando para aguardar requisição de API
Cypress.Commands.add('waitForApiRequest', (alias, timeout = 30000) => {
  return cy.wait(alias, { timeout });
});

// Comando para verificar mensagens de erro
Cypress.Commands.add('assertErrorMessage', (expectedMessage) => {
  return cy.get('.invalid-feedback, .error-message, [class*="error"]')
    .should('contain', expectedMessage);
});

// Comando para limpar dados de teste
Cypress.Commands.add('clearTestData', () => {
  // Implementar limpeza de dados se necessário
  cy.log('Limpando dados de teste...');
});

// Comando para fazer screenshot em caso de falha
Cypress.Commands.add('takeScreenshotOnFailure', (name) => {
  cy.screenshot(`failure-${name}-${Date.now()}`);
});

// Comando para verificar se página carregou completamente
Cypress.Commands.add('waitForPageToLoad', () => {
  cy.get('body').should('not.have.class', 'loading');
  cy.window().its('document').its('readyState').should('eq', 'complete');
});