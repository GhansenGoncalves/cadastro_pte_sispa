// Descreve o cenário de teste para o cadastro de PTE
describe('Cadastrar PTE', () => {

  // Define o caso de teste individual
  it('Deve preencher e submeter o formulário de cadastro de PTE com sucesso', () => {

    // --- Preparação do Teste ---
    // Intercepta a requisição GET da API para aguardar sua conclusão posteriormente
    cy.intercept('GET', '/sia_api/documento-exigencia/em-aberto/parametros*').as('loadDashboard');

    // --- Etapa 1: Login e Seleção de Perfil ---
    cy.visit('https://homolog.agricultura.gov.br/sia/?enableMockedUsers=true');
    cy.get('.mt-3 > .br-button').should('be.visible').click();
    cy.get(':nth-child(1) > [data-th="Ação"] > .br-button').should('be.visible').click();
    cy.get('.form-select').should('be.visible').select('7: Object');
    cy.get('.primary').should('be.visible').click();

    // --- Etapa 2: Navegação até o Formulário ---
    cy.wait('@loadDashboard'); // Aguarda o dashboard carregar
    cy.get('[data-target="#main-navigation"]').should('be.visible').click();
    cy.get('[href="/sia/solicitar-registro"] > .content').should('be.visible').click();

    // --- Etapa 3: Preenchimento da Seção Inicial do Formulário ---
    cy.get('#tipoRegistro').should('be.visible').select('1: REGISTRO');
    cy.get('#tipoProduto').should('be.visible').select('2: PRODUTO_TECNICO_EQUIVALENTE');
    cy.get('.col-12 > .br-button').should('be.visible').click();

    // --- Etapa 4: Detalhes do Produto ---
    cy.get('#marcaComercial').should('be.visible').type('Teste de automação no Cypress');
    cy.get('.col.br-input').should('be.visible').type('teste cypress');

    // Remove um item sugerido (exemplo de interação)
    cy.get('.col-12 > .ng-untouched > .br-list > [role="listitem"] > .row > .col-auto > .br-button > .fas').should('be.visible').click();
    cy.get('.swal2-cancel').should('be.visible').click(); // Cancela a remoção no modal de confirmação

    // Preenche a justificativa para o certificado RET
    cy.get('[for="certificadoRETnaoSeAplica"]').should('be.visible').click();
    cy.get('#justificativa').should('be.visible').type('Uma breve justificativa.');

    // --- Etapa 5: Modal de Pesquisa PTR (Produto Técnico de Referência) ---
    cy.get('#consultarPTR').click();
    cy.get('#nomeQuimico').type('Glifosato{enter}');
    cy.get('.br-button.float-right.active.mr-2:visible').click();
    cy.get('.br-button:visible').contains('Selecionar').click();

    // --- Etapa 6: Adição de Finalidade e Classe de Uso ---
    // Seleciona a Finalidade
    cy.contains('label', 'Finalidade')
      .invoke('attr', 'for')
      .then((id) => {
        cy.get(`#${id}`)
          .scrollIntoView()
          .should('be.visible')
          .select('Comercialização');
      });

    // Clica no botão "Adicionar" do bloco Finalidade
    cy.contains('label', 'Finalidade')
      .parents('.row')
      .find('button[aria-label="Adicionar"]:visible')
      .should('be.visible')
      .click();

    // Clica no "Ok" do modal de confirmação
    cy.contains('button.swal2-cancel', 'Ok')
      .should('be.visible')
      .click();

    // Seleciona a Classe de Uso
    cy.contains('Classe de Uso')
      .parents('.row')
      .find('select')
      .select('FUNGICIDA');

    // Clica no botão "Adicionar" do bloco Classe de Uso
    cy.contains('Classe de Uso')
      .parents('.row')
      .find('button[aria-label="Adicionar"]:visible')
      .should('be.visible')
      .click();

    // --- Etapa 7: Preenchimento do Bloco de Embalagem ---
    cy.get('#tipoEmbalagem').should('exist').scrollIntoView().select('Big bag', { force: true });
    cy.get('#materialEmbalagem').should('exist').scrollIntoView().select('Fibra celulósica', { force: true });
    cy.get('#caracteristicaEmbalagem').should('exist').scrollIntoView().select('Rígida', { force: true });
    cy.get('#acondicionamento').should('exist').scrollIntoView().select('Sólido', { force: true });
    cy.get('#medida').should('exist').scrollIntoView().select('Kg', { force: true });
    cy.get('#valor').should('exist').scrollIntoView().clear({ force: true }).type('20', { force: true });

    // Adiciona a embalagem individualmente
    cy.get('button[aria-label="Adicionar"][class*="circle"]:visible').first().should('be.visible').click({ force: true });
    
    // Adiciona o conjunto de embalagens à lista principal
    cy.get('button.float-right.br-button.warning.mr-2:visible').should('be.visible').click({ force: true });
    
    // Confirma que a embalagem foi adicionada na lista
    cy.contains('Big bag').should('exist');
    
    // Clica no botão "Confirmar" do modal (se ele aparecer)
    cy.get('body').then($body => {
      const confirmBtn = $body.find('button.swal2-confirm.swal2-styled:visible');
      if (confirmBtn.length) {
        cy.wrap(confirmBtn).should('be.visible').click({ force: true });
      }
    });

    // --- Etapa 8: Justificativa e Avanço ---
    // Preenche o uso emergencial
    cy.get('label[for="usoEmergencial"]').should('exist').scrollIntoView().click({ force: true });
    cy.get('#justificativaUsoEmergencial').should('exist').scrollIntoView().clear({ force: true }).type('Uma breve justificativa para uso emergencial.', { force: true });
    
    // Salva e avança para a próxima etapa do wizard
    cy.get('[active="active"] > .wizard-panel-btn > .success').should('be.visible').click({ force: true });
    
    // Clica no botão "Confirmar" do modal, se visível
    cy.get('button.swal2-confirm.swal2-styled:visible').then($btn => {
      if ($btn.length) {
        cy.wrap($btn).click({ force: true });
        cy.get('button.swal2-confirm.swal2-styled:visible', { timeout: 10000 }).should('not.exist'); // Aguarda o modal sumir
      }
    });
    
    // Clica no botão "Avançar" principal
    cy.get('button.br-button.secondary.wizard-btn-next:visible').should('be.visible').and('not.be.disabled').click({ force: true });
    
    // --- Etapa 9: Validação da Navegação e Preenchimento da Aba "Ingrediente Ativo" ---
    // Aguarda a URL mudar para garantir que a navegação ocorreu
    cy.url({ timeout: 20000 }).should('include', '/sia/solicitacao/pte/');
    
    // Aguarda um elemento da nova tela carregar
    cy.contains('Ingrediente Ativo', { timeout: 20000 }).should('be.visible');

    // Preenche um campo na nova aba
    cy.get('#exposicao')
      .focus()
      .type('Exposição ao produto', { force: true })
      .blur();
      
  }); // Fim do it()

}); // Fim do describe()