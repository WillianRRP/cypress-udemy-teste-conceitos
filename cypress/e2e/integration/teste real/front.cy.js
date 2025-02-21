/// <reference types='cypress'/>
import loc from '../../../support/locators';
import '../../../support/commandsContas';
import buildEnv from '../../../support/buildEnv';

describe('Should test at a funcional level', () => {
  after(() => {
    cy.clearLocalStorage()
})
  beforeEach(() => {
    buildEnv()
    cy.login('testewp@a', 'a');
    //cy.resetApp()
    cy.get(loc.MENU.HOME).click()
  });

  it('should create account', () => {

  cy.intercept({
    method: 'POST',
    url: '/contas'
  },
  { id: 3, nome: 'Conta de teste', visivel: true, usuario_id: 1 }
  )
    cy.acessaMenuConta();

    cy.intercept({
      method: 'GET',
      url: '/contas'},
      [
        { id: 1, nome: 'Carteira', visivel: true, usuario_id: 1 },
        { id: 2, nome: 'Banco', visivel: true, usuario_id: 1 },
        { id: 3, nome: 'Conta de teste', visivel: true, usuario_id: 1 },
      ]
  ).as('contasSave')
  
    cy.InserirConta('Conta inserida');
    cy.get(loc.MESSAGE).should('contain', 'Conta inserida com sucesso');
  });
  it('should update an account', () => {
  cy.intercept({
    method: 'PUT',
    url: '/contas/**'},
    [
      { id: 1, nome: 'Conta alterada', visivel: true, usuario_id: 1 },
    ]
  )
// cy.get(':nth-child(7) > :nth-child(2) > .fa-edit')
cy.acessaMenuConta()
cy.xpath(loc.CONTAS.FN_XP_BTN_ALTERAR('Banco')).click()
cy.get(loc.CONTAS.NOME)
  .clear()
  .type('Conta alterada')
cy.get(loc.CONTAS.BTN_SALVAR).click()
cy.get(loc.MESSAGE).should('contain', 'Conta atualizada com sucesso')
})
  it('should not creat an account with same name', () => {
    cy.intercept({
      method: 'POST',
      url: '/contas'
  }, { 
      statusCode: 400,
      body: {"error": "Já existe uma conta com esse nome!" }
  }).as('saveContaMesmoNome')
  
    cy.acessaMenuConta()

   cy.get(loc.CONTAS.NOME).type('Conta mesmo nome')
   cy.get(loc.CONTAS.BTN_SALVAR).click();
   cy.get(loc.MESSAGE).should('contain', 'code 400');
   
  });
  it('Should create a transaction', () => {
    cy.intercept({
      method: 'POST',
      url: '/transacoes'},
      [
        {
          "id": 2234692,
          "descricao": "desc",
          "envolvido": "joaozinho",
          "observacao": null,
          "tipo": "REC",
          "data_transacao": "2025-02-10T03:00:00.000Z",
          "data_pagamento": "2025-02-10T03:00:00.000Z",
          "valor": "2323.00",
          "status": false,
          "conta_id": 2379404,
          "usuario_id": 58539,
          "transferencia_id": null,
          "parcelamento_id": null
      }
      ]
    )
    cy.intercept({
      method: 'GET',
      url: '/extrato/**'
  },
  {fixture: 'movimentacaoSalva2.json'}
)
    cy.get(loc.MENU.MOVIMENTACAO).click();
    cy.get(loc.MOVIMENTACAO.DESCRICAO).type('Desc')
    cy.get(loc.MOVIMENTACAO.VALOR).type('123')
    cy.get(loc.MOVIMENTACAO.INTERESSADO).type('Inter')
    cy.get(loc.MOVIMENTACAO.CONTA).select('Carteira')
    cy.get(loc.MOVIMENTACAO.STATUS).click()
    cy.get(loc.MOVIMENTACAO.BTN_SALVAR).click()
    cy.get(loc.MESSAGE).should('contain', 'sucesso')
    cy.get(loc.EXTRATO.LINHAS).should('have.length', 7)
    cy.xpath(loc.EXTRATO.FN_XP_BUSCA_ELEMENTO('Desc', '123')).should('exist')
})

// por algum motivo esse teste esta bugando as vezes
  it('should  get balance', () => {
    cy.intercept({
      method: 'GET',
      url: '/transacoes/**'
    },
  {
    "conta": "Conta para saldo",
    "id": 2234690,
    "descricao": "Movimentacao 1, calculo saldo",
    "envolvido": "EEE",
    "observacao": null,
    "tipo": "REC",
    "data_transacao": "2025-02-10T03:00:00.000Z",
    "data_pagamento": "2025-02-10T03:00:00.000Z",
    "valor": "1534.00",
    "status": true,
    "conta_id": 2379406,
    "usuario_id": 58539,
    "transferencia_id": null,
    "parcelamento_id": null
  }
)
    cy.intercept({
      method: 'PUT',
      url: '/transacoes/**'
    },
  {
    "conta": "Conta para saldo",
    "id": 2234690,
    "descricao": "Movimentacao 1, calculo saldo",
    "envolvido": "EEE",
    "observacao": null,
    "tipo": "REC",
    "data_transacao": "2025-02-10T03:00:00.000Z",
    "data_pagamento": "2025-02-10T03:00:00.000Z",
    "valor": "1534.00",
    "status": true,
    "conta_id": 2379406,
    "usuario_id": 58539,
    "transferencia_id": null,
    "parcelamento_id": null
  }
)
    cy.get(loc.MENU.HOME).click()
    cy.xpath(loc.SALDO.FN_XP_SALDO_CONTA('Carteira')).should('contain', '100,00')
    cy.get(loc.MENU.EXTRATO).click()
    cy.xpath(loc.EXTRATO.FN_XP_ALTERAR_ELEMENTO('Movimentacao 1, calculo saldo')).click()
    cy.get(loc.MOVIMENTACAO.DESCRICAO).should('have.value', 'Movimentacao 1, calculo saldo')
    cy.get(loc.MOVIMENTACAO.STATUS).click()
    cy.get(loc.MOVIMENTACAO.BTN_SALVAR).click()
    cy.get(loc.MESSAGE).should('contain', 'sucesso')
    cy.intercept({
      method: 'GET',
      url: '/saldo'},
      [{
          conta_id: 999,
          conta: "Carteira",
          saldo: "100.00"
      },
      {
          conta_id: 9909,
          conta: "Banco",
          saldo: "534,00"
      },
      ]
  ).as('saldoFinal')

    cy.get(loc.MENU.HOME).click()
    cy.xpath(loc.SALDO.FN_XP_SALDO_CONTA('Carteira')).should('contain', '100')
  });
  it('should remove a transaction', () => {
    cy.intercept({
      method: 'DELETE',
      url: '/transacoes/**'
    }, 
    {statusCode: 204}
).as('del')
    cy.get(loc.MENU.EXTRATO).click()
    cy.xpath(loc.EXTRATO.FN_XP_REMOVER_ELEMENTO('Movimentacao para exclusao')).click()
    cy.get(loc.MESSAGE).should('contain', 'sucesso')
  });
  it('should validate to date send create account', () => {

    const reqStub = cy.stub()
    cy.intercept({
            method: 'POST',
            url: '/contas'
        },
        (req) => {
            console.log(req.headers)
            expect(req.body.nome).to.be.empty
            expect(req.headers).to.have.property('authorization')

            req.reply({id: 3, nome: 'Conta de teste', visivel: true, usuario_id: 1 })
        }
    ).as('saveConta')

    cy.acessaMenuConta()

    cy.intercept({
            method: 'GET',
            url: '/contas'
        },
        [
            { id: 1, nome: 'Carteira', visivel: true, usuario_id: 1 },
            { id: 2, nome: 'Banco', visivel: true, usuario_id: 1 },
            { id: 3, nome: 'Conta de teste', visivel: true, usuario_id: 1 },
        ]
    ).as('contasSave')

    cy.InserirConta('{CONTROL}')
    //cy.wait('@saveConta').its('request.body.nome').should('not.be.empty')
    
    cy.get(loc.MESSAGE).should('contain', 'Conta inserida com sucesso')
})


//todo
it('Should test colors', () => {
  cy.intercept({
    method: 'GET',
    url: '/extrato/**'
},
[
  { "conta": "Conta para movimentacoes", "id": 31434, "descricao": "Receita paga", "envolvido": "AAA", "observacao": null, "tipo": "REC", "data_transacao": "2019-11-13T03:00:00.000Z", "data_pagamento": "2019-11-13T03:00:00.000Z", "valor": "-1500.00", "status": true, "conta_id": 42077, "usuario_id": 1, "transferencia_id": null, "parcelamento_id": null },
  { "conta": "Conta com movimentacao", "id": 31435, "descricao": "Receita pendente", "envolvido": "BBB", "observacao": null, "tipo": "REC", "data_transacao": "2019-11-13T03:00:00.000Z", "data_pagamento": "2019-11-13T03:00:00.000Z", "valor": "-1500.00", "status": false, "conta_id": 42078, "usuario_id": 1, "transferencia_id": null, "parcelamento_id": null },
  { "conta": "Conta para saldo", "id": 31436, "descricao": "Despesa paga", "envolvido": "CCC", "observacao": null, "tipo": "DESP", "data_transacao": "2019-11-13T03:00:00.000Z", "data_pagamento": "2019-11-13T03:00:00.000Z", "valor": "3500.00", "status": true, "conta_id": 42079, "usuario_id": 1, "transferencia_id": null, "parcelamento_id": null },
  { "conta": "Conta para saldo", "id": 31437, "descricao": "Despesa pendente", "envolvido": "DDD", "observacao": null, "tipo": "DESP", "data_transacao": "2019-11-13T03:00:00.000Z", "data_pagamento": "2019-11-13T03:00:00.000Z", "valor": "-1000.00", "status": false, "conta_id": 42079, "usuario_id": 1, "transferencia_id": null, "parcelamento_id": null },
])

  cy.get(loc.MENU.EXTRATO).click()
  cy.xpath(loc.EXTRATO.FN_XP_LINHA('Receita paga')).should('have.class', 'receitaPaga')
  cy.xpath(loc.EXTRATO.FN_XP_LINHA('Receita pendente')).should('have.class', 'receitaPendente')
  cy.xpath(loc.EXTRATO.FN_XP_LINHA('Despesa paga')).should('have.class', 'despesaPaga')
  cy.xpath(loc.EXTRATO.FN_XP_LINHA('Despesa pendente')).should('have.class', 'despesaPendente')
})

it('should test the responsoveness', () =>{
  cy.get('[data-test="menu-home"] > .fas').should('exist')
 .and('be.visible')
 cy.viewport(500, 700)
 cy.get('[data-test="menu-home"] > .fas').should('exist')
 .and('be.not.visible')
 cy.viewport('iphone-5')
 cy.get('[data-test="menu-home"] > .fas').should('exist')
 .and('be.not.visible')
 cy.viewport('ipad-2')
 cy.get('[data-test="menu-home"] > .fas').should('exist')
 .and('be.visible')
})
});