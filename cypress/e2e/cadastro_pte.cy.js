describe('Cadastrar PTE', () => {
  it('Automatizando formulário', () => {
    // --- Preparação do Teste ---
    cy.intercept('GET', '/sia_api/documento-exigencia/em-aberto/parametros*').as('loadDashboard');

    // --- Passos de Login e Seleção Inicial ---
    cy.visit('https://homolog.agricultura.gov.br/sia/?enableMockedUsers=true');
    cy.get('.mt-3 > .br-button').click();
    cy.get(':nth-child(1) > [data-th="Ação"] > .br-button').click();
    cy.get('.form-select').select('7: Object');
    cy.get('.primary').click();

    // --- Sincronização e Navegação ---
    cy.wait('@loadDashboard');
    cy.get('[data-target="#main-navigation"]').click();
    cy.get('[href="/sia/solicitar-registro"] > .content').click();

    // --- Preenchimento do Formulário Principal ---
    cy.get('#tipoRegistro').select('1: REGISTRO');
    cy.get('#tipoProduto').select('2: PRODUTO_TECNICO_EQUIVALENTE');
    cy.get('.col-12 > .br-button').click();
    
    // É uma boa prática encadear comandos no mesmo elemento
    cy.get('#marcaComercial').type('Teste de automação no Cypress');
    
    // Este seletor é muito específico e frágil. Tente usar 'contains' se possível.
    cy.get('.col.br-input').type('teste cypress');
    cy.get('.col-12 > .ng-untouched > .br-list > [role="listitem"] > .row > .col-auto > .br-button > .fas').click();
    cy.get('.swal2-cancel').click();
    cy.get('[for="certificadoRETnaoSeAplica"]').click();
    cy.get('#justificativa').type('Uma breve justificativa.');

    //Clica no botão para ABRIR o modal de pesquisa de PTR
    cy.get('#consultarPTR').click();

    // Dentro do modal, digita no campo de busca "Ingrediente Ativo"
    const ingrediente = 'Glifosato';
    cy.get('#nomeQuimico').type(ingrediente)
    
  });
});