# Guia de Solução de Problemas - Testes Cypress

## 🔍 Problema: "socket hang up" ou "We attempted to make an http request to this URL but the request failed"

### Diagnóstico

1. **Teste a conectividade básica:**
   ```bash
   node test-connectivity.js
   ```

2. **Verifique se o site está acessível:**
   ```bash
   ping homolog.agricultura.gov.br
   ```

### Soluções

#### ✅ Solução 1: Usar versão robusta
```bash
npx cypress run --spec "cypress/e2e/cadastro_pte_robust.cy.js"
```

#### ✅ Solução 2: Usar versão com mocks
```bash
npx cypress run --spec "cypress/e2e/cadastro_pte_mock.cy.js"
```

#### ✅ Solução 3: Configurar proxy (se necessário)
Edite `cypress.config.js`:
```javascript
proxy: {
  host: 'seu-proxy.com',
  port: 8080
}
```

#### ✅ Solução 4: Desabilitar verificação SSL
Edite `cypress.config.js`:
```javascript
ssl: {
  rejectUnauthorized: false
}
```

## 🔍 Problema: Elementos não encontrados

### Soluções

#### ✅ Solução 1: Aumentar timeouts
```javascript
Cypress.config('defaultCommandTimeout', 20000);
Cypress.config('pageLoadTimeout', 60000);
```

#### ✅ Solução 2: Usar verificações condicionais
```javascript
cy.get('body').then($body => {
  const element = $body.find('#meuElemento');
  if (element.length) {
    cy.wrap(element).click();
  } else {
    cy.log('Elemento não encontrado, continuando...');
  }
});
```

#### ✅ Solução 3: Usar `failOnStatusCode: false`
```javascript
cy.visit('https://homolog.agricultura.gov.br/sia/?enableMockedUsers=true', {
  failOnStatusCode: false
});
```

## 🔍 Problema: Elementos ocultos por overflow

### Soluções

#### ✅ Solução 1: Usar `should('exist')` em vez de `should('be.visible')`
```javascript
cy.get('#elemento').should('exist').click({ force: true });
```

#### ✅ Solução 2: Scroll com offset
```javascript
cy.get('#elemento').scrollIntoView({ 
  duration: 1000, 
  offset: { top: -100, left: 0 } 
});
```

#### ✅ Solução 3: Usar `force: true`
```javascript
cy.get('#elemento').click({ force: true });
```

## 🔍 Problema: Timeouts frequentes

### Soluções

#### ✅ Solução 1: Configurar retries
```javascript
retries: {
  runMode: 2,
  openMode: 1
}
```

#### ✅ Solução 2: Aumentar timeouts específicos
```javascript
cy.get('#elemento', { timeout: 30000 }).should('exist');
```

#### ✅ Solução 3: Usar `cy.wait()` para elementos dinâmicos
```javascript
cy.wait(2000); // Aguarda 2 segundos
```

## 🔍 Problema: Falhas intermitentes

### Soluções

#### ✅ Solução 1: Usar `cy.reload()` em caso de falha
```javascript
cy.get('#elemento').should('exist').then($el => {
  if (!$el.length) {
    cy.reload();
    cy.get('#elemento').should('exist');
  }
});
```

#### ✅ Solução 2: Usar `cy.retry()` para operações críticas
```javascript
const retryOperation = (operation, maxAttempts = 3) => {
  let attempts = 0;
  const attempt = () => {
    attempts++;
    return operation().catch(err => {
      if (attempts < maxAttempts) {
        cy.wait(1000);
        return attempt();
      }
      throw err;
    });
  };
  return attempt();
};
```

## 🔍 Problema: Problemas de rede corporativa

### Soluções

#### ✅ Solução 1: Configurar certificados corporativos
```javascript
// Adicione certificados ao Cypress
```

#### ✅ Solução 2: Usar VPN ou proxy corporativo
```javascript
proxy: {
  host: 'proxy.corporacao.com',
  port: 8080,
  auth: {
    username: 'usuario',
    password: 'senha'
  }
}
```

#### ✅ Solução 3: Desabilitar verificação de certificados
```javascript
chromeWebSecurity: false
```

## 🚀 Comandos Úteis

### Executar testes específicos
```bash
# Versão robusta
npx cypress run --spec "cypress/e2e/cadastro_pte_robust.cy.js"

# Versão com mocks
npx cypress run --spec "cypress/e2e/cadastro_pte_mock.cy.js"

# Versão simplificada
npx cypress run --spec "cypress/e2e/cadastro_pte_simple.cy.js"
```

### Executar em modo interativo
```bash
npx cypress open
```

### Executar com configurações específicas
```bash
npx cypress run --config defaultCommandTimeout=20000
```

### Gerar relatórios
```bash
npx cypress run --reporter mochawesome
```

## 📊 Monitoramento

### Verificar logs
```bash
# Logs do Cypress
npx cypress run --spec "cypress/e2e/cadastro_pte_robust.cy.js" --reporter spec

# Screenshots automáticos
# Verificar pasta cypress/screenshots/
```

### Debugging
```bash
# Executar com debug
DEBUG=cypress:* npx cypress run
```

## 🎯 Recomendações Finais

1. **Sempre teste a conectividade primeiro**: `node test-connectivity.js`
2. **Use a versão robusta para testes reais**: `cadastro_pte_robust.cy.js`
3. **Use a versão com mocks para desenvolvimento**: `cadastro_pte_mock.cy.js`
4. **Configure timeouts adequados** para sua rede
5. **Monitore os logs** para identificar padrões de falha
6. **Use screenshots** para debug visual

---

**Se nenhuma solução funcionar, entre em contato com o suporte técnico da sua organização para verificar configurações de rede e firewall.** 