// Descreve o cenário de teste para o cadastro de PTE
describe('Cadastrar PTE', () => {
  
  // Define o caso de teste individual
  it('Automatizando formulário', () => {

    // --- Preparação do Teste ---
    // Intercepta a requisição GET da API e dá um alias a ela para aguardar depois
    cy.intercept('GET', '/sia_api/documento-exigencia/em-aberto/parametros*').as('loadDashboard');

    // --- Passos de Login e Seleção Inicial ---
    cy.visit('https://homolog.agricultura.gov.br/sia/?enableMockedUsers=true'); // Acessa o sistema
    cy.get('.mt-3 > .br-button').click(); // Clica no botão "Acessar"
    cy.get(':nth-child(1) > [data-th="Ação"] > .br-button').click(); // Clica para selecionar um usuário mockado
    cy.get('.form-select').select('7: Object'); // Seleciona um perfil (provavelmente de usuário ou órgão)
    cy.get('.primary').click(); // Confirma a seleção

    // --- Sincronização e Navegação ---
    cy.wait('@loadDashboard'); // Aguarda a requisição interceptada finalizar
    cy.get('[data-target="#main-navigation"]').click(); // Abre o menu lateral
    cy.get('[href="/sia/solicitar-registro"] > .content').click(); // Navega para a página de solicitação de registro

    // --- Preenchimento do Formulário Principal ---
    cy.get('#tipoRegistro').select('1: REGISTRO'); // Seleciona o tipo de registro
    cy.get('#tipoProduto').select('2: PRODUTO_TECNICO_EQUIVALENTE'); // Seleciona o tipo de produto
    cy.get('.col-12 > .br-button').click(); // Avança para o próximo passo

    // Preenche o campo de marca comercial
    cy.get('#marcaComercial').type('Teste de automação no Cypress');

    // Preenche outro campo de entrada (possivelmente nome comum)
    cy.get('.col.br-input').type('teste cypress');

    // Remove um item sugerido de uma lista (ícone de lixeira)
    cy.get('.col-12 > .ng-untouched > .br-list > [role="listitem"] > .row > .col-auto > .br-button > .fas').click();

    // Fecha um modal (provavelmente um alerta do SweetAlert2)
    cy.get('.swal2-cancel').click();

    // Marca a opção "RET não se aplica"
    cy.get('[for="certificadoRETnaoSeAplica"]').click();

    // Justifica a escolha acima
    cy.get('#justificativa').type('Uma breve justificativa.');

    // --- Modal de Pesquisa PTR ---
    // Clica para abrir o modal de pesquisa de PTR
    cy.get('#consultarPTR').click();

    // 1. Preenche o nome químico e pressiona Enter
    cy.get('#nomeQuimico').type('Glifosato{enter}');

    // 2. Clica no botão de pesquisa no modal (direita)
    cy.get('.br-button.float-right.active.mr-2:visible').click();

    // 3. Seleciona o item retornado na lista
    cy.get('.br-button:visible').contains('Selecionar').click();

    // --- Seleção da Finalidade ---
    // Encontra o "for" da label "Finalidade" para associar ao select correto
    cy.contains('label', 'Finalidade')
      .invoke('attr', 'for')
      .then((id) => {
        cy.get(`#${id}`)              // Seleciona o campo pelo ID identificado na label
          .scrollIntoView()          // Garante que o elemento está visível
          .should('be.visible')      // Verifica visibilidade
          .select('Comercialização'); // Seleciona a opção desejada
      });

    // --- Confirmação ---
    // Clica no botão "Adicionar" (índice 1 geralmente refere-se ao segundo botão)
    cy.get('button[aria-label="Adicionar"]')
      .eq(1)
      .should('be.visible')
      .click();

    // Clica no botão "Ok" do modal de confirmação
    cy.contains('button.swal2-cancel', 'Ok')
      .should('be.visible')
      .click();
    
  });
  
});
