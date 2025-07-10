# 🛑 Execução Única - Sem Repetições Automáticas

## ✅ Problema Resolvido

O Cypress estava configurado para fazer **retries automáticos** (tentativas repetidas) quando o teste falhava. Agora está configurado para executar **apenas uma vez** e parar.

## 🚀 Como Executar (Escolha uma opção)

### Opção 1: Comando npm (Recomendado)
```bash
npm run test
```

### Opção 2: Script personalizado
```bash
npm run test:once
```

### Opção 3: Comando direto
```bash
npx cypress run --spec "cypress/e2e/cadastro_pte.cy.js" --config-file cypress.config.once.js
```

### Opção 4: Modo interativo (sem retries)
```bash
npm run test:open
```

## 🔧 O que foi alterado

### 1. Configuração Principal (`cypress.config.js`)
```javascript
retries: {
  runMode: 0,    // ❌ Antes: 2 tentativas
  openMode: 0    // ❌ Antes: 1 tentativa
}
```

### 2. Configuração Específica (`cypress.config.once.js`)
- Retries completamente desabilitados
- `exitOnError: true` - para imediatamente em caso de erro
- `stopOnFirstFailure: true` - para na primeira falha

### 3. Scripts no `package.json`
```json
{
  "test": "cypress run --spec \"cypress/e2e/cadastro_pte.cy.js\" --config-file cypress.config.once.js",
  "test:once": "node run-test-once.js",
  "test:open": "cypress open --config-file cypress.config.once.js"
}
```

## 🎯 Comportamento Atual

- ✅ **Executa apenas uma vez**
- ✅ **Para automaticamente após conclusão**
- ✅ **Não repete em caso de falha**
- ✅ **Mostra resultado final e encerra**

## 🛠️ Se ainda estiver repetindo

### Verifique se está usando o comando correto:
```bash
# ❌ ERRADO - pode usar configuração antiga
npx cypress run

# ✅ CORRETO - usa configuração sem retries
npm run test
```

### Force a configuração:
```bash
npx cypress run --spec "cypress/e2e/cadastro_pte.cy.js" --config retries.runMode=0,retries.openMode=0
```

## 📊 Logs Esperados

```
🚀 Executando teste Cypress apenas uma vez...

✅ Teste executado com sucesso!
🛑 Processo finalizado - não haverá execuções automáticas.
```

## 🔄 Se quiser voltar a ter retries

Edite `cypress.config.js`:
```javascript
retries: {
  runMode: 2,    // Volta a ter 2 tentativas
  openMode: 1    // Volta a ter 1 tentativa
}
```

---

**Agora o teste executa apenas uma vez e para automaticamente! 🎉** 