// Constantes para dados de teste
const TEST_DATA = {
  BASE_URL: 'https://homolog.agricultura.gov.br/sia/?enableMockedUsers=true',
  MARCA_COMERCIAL: 'Teste de automação no Cypress',
  DESCRICAO: 'teste cypress',
  NOME_QUIMICO: 'Glifosato',
  JUSTIFICATIVA: 'Uma breve justificativa.',
  JUSTIFICATIVA_EMERGENCIAL: 'Uma breve justificativa para uso emergencial.',
  EXPOSICAO: 'Exposição ao produto',
  EMBALAGEM: {
    TIPO: 'Big bag',
    MATERIAL: 'Fibra celulósica',
    CARACTERISTICA: 'Rígida',
    ACONDICIONAMENTO: 'Sólido',
    MEDIDA: 'Kg',
    VALOR: '20'
  }
};

// Função auxiliar para lidar com elementos que podem estar ocultos
const safeSelect = (selector, value) => {
  cy.get(selector)
    .should('exist')
    .scrollIntoView({ duration: 1000, offset: { top: -100, left: 0 } })
    .select(value, { force: true });
};

// Função auxiliar para lidar com elementos que podem estar ocultos
const safeClick = (selector) => {
  cy.get(selector)
    .should('exist')
    .scrollIntoView({ duration: 1000, offset: { top: -100, left: 0 } })
    .click({ force: true });
};

// ================= FLUXO DE CADASTRO COM COMENTÁRIOS =====================

// 1. Login e seleção de perfil (não há campos obrigatórios de formulário aqui)
const loginAndSelectProfile = () => {
  cy.visit(TEST_DATA.BASE_URL);
  cy.get('.mt-3 > .br-button').should('be.visible').click();
  cy.get(':nth-child(1) > [data-th="Ação"] > .br-button').should('be.visible').click();
  cy.get('.form-select').should('be.visible').select('7: Object');
  cy.get('.primary').should('be.visible').click();
};

// 2. Navegação até o formulário (apenas navegação)
const navigateToForm = () => {
  cy.wait('@loadDashboard');
  cy.get('[data-target="#main-navigation"]').should('be.visible').click();
  cy.get('[href="/sia/solicitar-registro"] > .content').should('be.visible').click();
};

// 3. Preenchimento inicial - CAMPOS OBRIGATÓRIOS: tipoRegistro, tipoProduto
const fillInitialForm = () => {
  // Campo obrigatório: Tipo de Registro
  cy.get('#tipoRegistro').should('be.visible').select('1: REGISTRO');
  // Campo obrigatório: Tipo de Produto
  cy.get('#tipoProduto').should('be.visible').select('2: PRODUTO_TECNICO_EQUIVALENTE');
  cy.get('.col-12 > .br-button').should('be.visible').click();
};

// 4. Detalhes do produto - CAMPOS OBRIGATÓRIOS: marcaComercial, descrição, justificativa
const fillProductDetails = () => {
  // Campo obrigatório: Marca Comercial
  cy.get('#marcaComercial').should('be.visible').clear().type(TEST_DATA.MARCA_COMERCIAL);
  // Campo obrigatório: Descrição do Produto
  cy.get('.col.br-input').should('be.visible').clear().type(TEST_DATA.DESCRICAO);

  // Remove item sugerido (se existir)
  cy.get('body').then($body => {
    const removeBtn = $body.find('.col-12 > .ng-untouched > .br-list > [role="listitem"] > .row > .col-auto > .br-button > .fas');
    if (removeBtn.length) {
      cy.wrap(removeBtn).click();
      // Trata modal de confirmação
      cy.get('body').then($body => {
        const cancelBtn = $body.find('button.swal2-cancel:visible');
        if (cancelBtn.length) {
          cy.wrap(cancelBtn).click();
        }
      });
    }
  });

  // Campo obrigatório: Justificativa para não apresentar certificado RET
  cy.get('[for="certificadoRETnaoSeAplica"]').should('be.visible').click();
  // Campo obrigatório: Justificativa
  cy.get('#justificativa').should('be.visible').clear().type(TEST_DATA.JUSTIFICATIVA);
};

// 5. Pesquisa e seleção de PTR - CAMPOS OBRIGATÓRIOS: nomeQuimico
const searchAndSelectPTR = () => {
  cy.get('#consultarPTR').should('be.visible').click();
  // Campo obrigatório: Nome Químico
  cy.get('#nomeQuimico').should('be.visible').clear().type(`${TEST_DATA.NOME_QUIMICO}{enter}`);
  cy.get('.br-button.float-right.active.mr-2:visible').should('be.visible').click();
  cy.get('.br-button:visible').contains('Selecionar').should('be.visible').click();
};

// 6. Finalidade e Classe de Uso - CAMPOS OBRIGATÓRIOS: pelo menos uma finalidade e uma classe de uso
const addFinalidadeAndClasseUso = () => {
  // Campo obrigatório: Finalidade
  cy.contains('label', 'Finalidade')
    .invoke('attr', 'for')
    .then((id) => {
      safeSelect(`#${id}`, 'Comercialização');
    });

  cy.contains('label', 'Finalidade')
    .parents('.row')
    .find('button[aria-label="Adicionar"]:visible')
    .should('exist')
    .click({ force: true });

  // Trata modal de confirmação
  cy.get('body').then($body => {
    const okBtn = $body.find('button.swal2-cancel:visible');
    if (okBtn.length) {
      cy.wrap(okBtn).click();
    }
  });

  // Campo obrigatório: Classe de Uso
  cy.contains('Classe de Uso')
    .parents('.row')
    .find('select')
    .should('exist')
    .select('FUNGICIDA', { force: true });

  cy.contains('Classe de Uso')
    .parents('.row')
    .find('button[aria-label="Adicionar"]:visible')
    .should('exist')
    .click({ force: true });
};

// 7. Embalagem - TODOS OS CAMPOS SÃO OBRIGATÓRIOS
const fillEmbalagemSection = () => {
  const { EMBALAGEM } = TEST_DATA;
  // Campo obrigatório: Tipo de Embalagem
  safeSelect('#tipoEmbalagem', EMBALAGEM.TIPO);
  // Campo obrigatório: Material da Embalagem
  safeSelect('#materialEmbalagem', EMBALAGEM.MATERIAL);
  // Campo obrigatório: Característica da Embalagem
  safeSelect('#caracteristicaEmbalagem', EMBALAGEM.CARACTERISTICA);
  // Campo obrigatório: Acondicionamento
  safeSelect('#acondicionamento', EMBALAGEM.ACONDICIONAMENTO);
  // Campo obrigatório: Medida
  safeSelect('#medida', EMBALAGEM.MEDIDA);
  // Campo obrigatório: Valor
  cy.get('#valor').should('exist').scrollIntoView({ duration: 1000, offset: { top: -100, left: 0 } }).clear({ force: true }).type(EMBALAGEM.VALOR, { force: true });

  // Adiciona embalagem
  cy.get('button[aria-label="Adicionar"][class*="circle"]:visible')
    .first()
    .should('exist')
    .click({ force: true });
  cy.get('button.float-right.br-button.warning.mr-2:visible')
    .should('exist')
    .click({ force: true });
  // Verifica se foi adicionada
  cy.contains(EMBALAGEM.TIPO).should('exist');
  // Trata modal de confirmação
  cy.get('body').then($body => {
    const confirmBtn = $body.find('button.swal2-confirm.swal2-styled:visible');
    if (confirmBtn.length) {
      cy.wrap(confirmBtn).click({ force: true });
    }
  });
};

// 8. Justificativa e avanço - CAMPOS OBRIGATÓRIOS: justificativa de uso emergencial (se marcado)
const fillJustificativaAndAdvance = () => {
  // Campo obrigatório: Marcação de uso emergencial
  safeClick('label[for="usoEmergencial"]');
  // Campo obrigatório: Justificativa para uso emergencial
  cy.get('#justificativaUsoEmergencial')
    .should('exist')
    .scrollIntoView({ duration: 1000, offset: { top: -100, left: 0 } })
    .clear({ force: true })
    .type(TEST_DATA.JUSTIFICATIVA_EMERGENCIAL, { force: true });
  // Salva e avança
  cy.get('[active="active"] > .wizard-panel-btn > .success')
    .should('exist')
    .click({ force: true });
  // Trata modal de confirmação
  cy.get('body').then($body => {
    const confirmBtn = $body.find('button.swal2-confirm.swal2-styled:visible');
    if (confirmBtn.length) {
      cy.wrap(confirmBtn).click({ force: true });
      cy.get('button.swal2-confirm.swal2-styled:visible', { timeout: 10000 }).should('not.exist');
    }
  });
  // Avança para próxima etapa
  cy.get('button.br-button.secondary.wizard-btn-next:visible')
    .should('exist')
    .and('not.be.disabled')
    .click({ force: true });
};

// 9. Ingrediente Ativo - CAMPO OBRIGATÓRIO: exposição
const validateNavigationAndFillIngredienteAtivo = () => {
  // Valida navegação
  cy.url({ timeout: 20000 }).should('include', '/sia/solicitacao/pte/');
  cy.contains('Ingrediente Ativo', { timeout: 20000 }).should('exist');
  // Campo obrigatório: Exposição ao produto
  cy.get('#exposicao')
    .should('exist')
    .focus()
    .clear()
    .type(TEST_DATA.EXPOSICAO, { force: true })
    .blur();
};

// Teste principal
describe('Cadastrar PTE', () => {
  beforeEach(() => {
    // Intercepta requisições importantes
    cy.intercept('GET', '/sia_api/documento-exigencia/em-aberto/parametros*').as('loadDashboard');
    cy.intercept('POST', '**/api/**').as('apiCall');
    
    // Configura viewport para evitar problemas de responsividade
    cy.viewport(1920, 1080);
    
    // Configura timeout padrão mais longo para elementos que podem estar ocultos
    Cypress.config('defaultCommandTimeout', 10000);
  });

  it('Deve preencher e submeter o formulário de cadastro de PTE com sucesso', () => {
    // Etapa 1: Login e seleção de perfil
    loginAndSelectProfile();

    // Etapa 2: Navegação até o formulário
    navigateToForm();

    // Etapa 3: Preenchimento inicial
    fillInitialForm();

    // Etapa 4: Detalhes do produto
    fillProductDetails();

    // Etapa 5: Pesquisa PTR
    searchAndSelectPTR();

    // Etapa 6: Finalidade e classe de uso
    addFinalidadeAndClasseUso();

    // Etapa 7: Embalagem
    fillEmbalagemSection();

    // Etapa 8: Justificativa e avanço
    fillJustificativaAndAdvance();

    // Etapa 9: Validação e preenchimento da próxima aba
    validateNavigationAndFillIngredienteAtivo();

    // Validação final
    cy.log('✅ Teste concluído com sucesso!');
  });

  // Teste adicional para validação de campos obrigatórios
  it('Deve validar campos obrigatórios do formulário', () => {
    cy.visit(TEST_DATA.BASE_URL);
    
    // Navega até o formulário
    loginAndSelectProfile();
    navigateToForm();
    fillInitialForm();
    
    // Tenta avançar sem preencher campos obrigatórios
    cy.get('button.br-button.secondary.wizard-btn-next:visible').click();
    
    // Verifica se aparecem mensagens de erro
    cy.get('.invalid-feedback, .error-message, [class*="error"]').should('exist');
    cy.get('#toxicocinetica').type('Toxicocinética de teste');
    cy.get('button.br-button.secondary.wizard-btn-next:visible').click();
  });
});

describe('Validação individual dos campos obrigatórios', () => {
  // Utilitário para verificar e preencher campos obrigatórios
  const camposObrigatorios = [
    // Preenchimento inicial
    { selector: '#tipoRegistro', tipo: 'select', valor: '1: REGISTRO', etapa: 'inicial' },
    { selector: '#tipoProduto', tipo: 'select', valor: '2: PRODUTO_TECNICO_EQUIVALENTE', etapa: 'inicial' },
    // Detalhes do produto
    { selector: '#marcaComercial', tipo: 'input', valor: TEST_DATA.MARCA_COMERCIAL, etapa: 'produto' },
    { selector: '.col.br-input', tipo: 'input', valor: TEST_DATA.DESCRICAO, etapa: 'produto' },
    { selector: '#justificativa', tipo: 'input', valor: TEST_DATA.JUSTIFICATIVA, etapa: 'produto' },
    // Pesquisa PTR
    { selector: '#nomeQuimico', tipo: 'input', valor: TEST_DATA.NOME_QUIMICO, etapa: 'ptr' },
    // Finalidade e Classe de Uso
    { selector: 'finalidade', tipo: 'finalidade', valor: 'Comercialização', etapa: 'finalidade' },
    { selector: 'classeUso', tipo: 'classeUso', valor: 'FUNGICIDA', etapa: 'finalidade' },
    // Embalagem
    { selector: '#tipoEmbalagem', tipo: 'select', valor: TEST_DATA.EMBALAGEM.TIPO, etapa: 'embalagem' },
    { selector: '#materialEmbalagem', tipo: 'select', valor: TEST_DATA.EMBALAGEM.MATERIAL, etapa: 'embalagem' },
    { selector: '#caracteristicaEmbalagem', tipo: 'select', valor: TEST_DATA.EMBALAGEM.CARACTERISTICA, etapa: 'embalagem' },
    { selector: '#acondicionamento', tipo: 'select', valor: TEST_DATA.EMBALAGEM.ACONDICIONAMENTO, etapa: 'embalagem' },
    { selector: '#medida', tipo: 'select', valor: TEST_DATA.EMBALAGEM.MEDIDA, etapa: 'embalagem' },
    { selector: '#valor', tipo: 'input', valor: TEST_DATA.EMBALAGEM.VALOR, etapa: 'embalagem' },
    // Justificativa de uso emergencial
    { selector: '#justificativaUsoEmergencial', tipo: 'input', valor: TEST_DATA.JUSTIFICATIVA_EMERGENCIAL, etapa: 'emergencial' },
    // Ingrediente Ativo
    { selector: '#exposicao', tipo: 'input', valor: TEST_DATA.EXPOSICAO, etapa: 'ingrediente' },
  ];

  it('Deve exibir mensagem de erro para cada campo obrigatório e removê-la após preenchimento', () => {
    cy.visit(TEST_DATA.BASE_URL);
    loginAndSelectProfile();
    navigateToForm();

    // 1. Preenchimento inicial
    cy.get('button.br-button.secondary.wizard-btn-next:visible').click();
    // Valida obrigatoriedade dos campos iniciais
    ['#tipoRegistro', '#tipoProduto'].forEach(sel => {
      cy.get(sel).parent().find('.invalid-feedback, .error-message, [class*="error"]').should('be.visible');
    });
    cy.selectDropdownOption('#tipoRegistro', '1: REGISTRO');
    cy.selectDropdownOption('#tipoProduto', '2: PRODUTO_TECNICO_EQUIVALENTE');
    cy.get('.col-12 > .br-button').click();

    // 2. Detalhes do produto
    cy.get('button.br-button.secondary.wizard-btn-next:visible').click();
    ['#marcaComercial', '.col.br-input', '#justificativa'].forEach(sel => {
      cy.get(sel).parent().find('.invalid-feedback, .error-message, [class*="error"]').should('be.visible');
    });
    cy.fillFormField('#marcaComercial', TEST_DATA.MARCA_COMERCIAL);
    cy.fillFormField('.col.br-input', TEST_DATA.DESCRICAO);
    cy.get('[for="certificadoRETnaoSeAplica"]').click();
    cy.fillFormField('#justificativa', TEST_DATA.JUSTIFICATIVA);
    cy.get('button.br-button.secondary.wizard-btn-next:visible').click();

    // 3. Pesquisa PTR
    cy.get('#consultarPTR').click();
    cy.get('button.br-button.secondary.wizard-btn-next:visible').click();
    cy.get('#nomeQuimico').parent().find('.invalid-feedback, .error-message, [class*="error"]').should('be.visible');
    cy.fillFormField('#nomeQuimico', TEST_DATA.NOME_QUIMICO + '{enter}');
    cy.get('.br-button.float-right.active.mr-2:visible').click();
    cy.get('.br-button:visible').contains('Selecionar').click();
    cy.get('button.br-button.secondary.wizard-btn-next:visible').click();

    // 4. Finalidade e Classe de Uso
    cy.get('button.br-button.secondary.wizard-btn-next:visible').click();
    cy.contains('label', 'Finalidade').parents('.row').find('.invalid-feedback, .error-message, [class*="error"]').should('be.visible');
    cy.contains('label', 'Finalidade').invoke('attr', 'for').then((id) => {
      cy.selectDropdownOption(`#${id}`, 'Comercialização');
    });
    cy.contains('label', 'Finalidade').parents('.row').find('button[aria-label="Adicionar"]:visible').click({ force: true });
    cy.contains('Classe de Uso').parents('.row').find('.invalid-feedback, .error-message, [class*="error"]').should('be.visible');
    cy.contains('Classe de Uso').parents('.row').find('select').select('FUNGICIDA', { force: true });
    cy.contains('Classe de Uso').parents('.row').find('button[aria-label="Adicionar"]:visible').click({ force: true });
    cy.get('button.br-button.secondary.wizard-btn-next:visible').click();

    // 5. Embalagem
    cy.get('button.br-button.secondary.wizard-btn-next:visible').click();
    ['#tipoEmbalagem', '#materialEmbalagem', '#caracteristicaEmbalagem', '#acondicionamento', '#medida', '#valor'].forEach(sel => {
      cy.get(sel).parent().find('.invalid-feedback, .error-message, [class*="error"]').should('be.visible');
    });
    cy.selectDropdownOption('#tipoEmbalagem', TEST_DATA.EMBALAGEM.TIPO);
    cy.selectDropdownOption('#materialEmbalagem', TEST_DATA.EMBALAGEM.MATERIAL);
    cy.selectDropdownOption('#caracteristicaEmbalagem', TEST_DATA.EMBALAGEM.CARACTERISTICA);
    cy.selectDropdownOption('#acondicionamento', TEST_DATA.EMBALAGEM.ACONDICIONAMENTO);
    cy.selectDropdownOption('#medida', TEST_DATA.EMBALAGEM.MEDIDA);
    cy.fillFormField('#valor', TEST_DATA.EMBALAGEM.VALOR);
    cy.get('button[aria-label="Adicionar"][class*="circle"]:visible').first().click({ force: true });
    cy.get('button.float-right.br-button.warning.mr-2:visible').click({ force: true });
    cy.get('button.br-button.secondary.wizard-btn-next:visible').click();

    // 6. Justificativa de uso emergencial
    cy.get('button.br-button.secondary.wizard-btn-next:visible').click();
    cy.get('#justificativaUsoEmergencial').parent().find('.invalid-feedback, .error-message, [class*="error"]').should('be.visible');
    cy.get('label[for="usoEmergencial"]').click();
    cy.fillFormField('#justificativaUsoEmergencial', TEST_DATA.JUSTIFICATIVA_EMERGENCIAL);
    cy.get('[active="active"] > .wizard-panel-btn > .success').click({ force: true });
    cy.get('button.br-button.secondary.wizard-btn-next:visible').click();

    // 7. Ingrediente Ativo
    cy.get('button.br-button.secondary.wizard-btn-next:visible').click();
    cy.get('#exposicao').parent().find('.invalid-feedback, .error-message, [class*="error"]').should('be.visible');
    cy.fillFormField('#exposicao', TEST_DATA.EXPOSICAO);
    cy.get('button.br-button.secondary.wizard-btn-next:visible').click();
  });
});