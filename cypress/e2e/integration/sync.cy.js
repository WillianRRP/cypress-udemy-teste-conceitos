/// <reference types="cypress"/>

describe("Work with basic elements", () => {
  beforeEach(() => {
    cy.visit("https://wcaquino.me/cypress/componentes.html");
  });

  it("deve esperar o elemento estar disponivel", () => {
    cy.get("#novoCampo").should("not.exist");
    cy.get("#buttonDelay").click();
    cy.get("#novoCampo").should("not.exist");
    cy.get("#novoCampo").should("exist");
    cy.get("#novoCampo").type("teste ");
  });
  it("deve fazer retrys", () => {
    cy.get("#novoCampo").should("not.exist");
    cy.get("#buttonDelay").click();
    cy.get("#novoCampo").should("not.exist");
    cy.get("#novoCampo").should("exist").type("teste");
  });
  it("uso do find", () => {
    cy.get("#buttonList").click();
    cy.get("#lista li").find("span").should("contain", "Item 1");

    cy.get("#lista li").should("contain", "Item 2");

    cy.get("#buttonListDOM").click();
    cy.get("#lista li").find("span").should("contain", "Item 1");

    cy.get("#lista li").should("contain", "Item 2");
  });
  it("uso do TimeoOut", () => {
    // cy.get('#buttonDelay').click()
    // cy.get('#novoCampo').should('exist')

    //cy.get('#buttonListDOM').click()
    //cy.wait(5000)
    //cy.get('#lista li span', { timeout: 50000 })
    //.should('contain', 'Item 2')

    //cy.get('#buttonListDOM').click()
    //cy.wait(5000)
    //cy.get('#lista li span', { timeout: 50000 })
    //.should('contain', 'Item 2')

    cy.get("#buttonListDOM").click();
    cy.get("#lista li span").should("have.length", 1);
    cy.get("#lista li span").should("have.length", 2);
  });

  it.only("Click retry", () => {
    cy.get('#buttonCount')
    .click()
    .should('have.value', '1')
  });
  it.only('Should vs Then', () => {
    cy.get('#buttonListDOM').then($el => {
        // .should('have.length', 1)
        // console.log($el)
        expect($el).to.have.length(1)
        cy.get('#buttonList')
    })

    cy.get("#buttonListDOM").should($el => {
      //.should('have.value', '1')
      //console.log($el)
    expect($el).to.have.length(1)
    return 2
    }).and('have.id', 'buttonListDOM')
    
    
  });
});
