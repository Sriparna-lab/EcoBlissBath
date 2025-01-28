Cypress.Commands.add('signIn', (username, password) => {
  return cy.request({
    method: 'POST',
    url: `${Cypress.env("apiUrl")}/login`,
    body: {
      username,
      password
    },
  }).then((response) => {
    const token = response.body.token;
    return token;
  });
});

Cypress.Commands.add("getBySel", (selector, ...args) => {
  return cy.get(`[data-cy=${selector}]`,  ...args)
})
  
Cypress.Commands.add("userLogin", () => {
  cy.visit("http://localhost:8080/#/")
  cy.getBySel("nav-link-login").click()
  cy.getBySel("login-input-username").type("test2@test.fr")
  cy.getBySel("login-input-password").type("testtest")
  cy.getBySel("login-submit").click()
  cy.getBySel("nav-link-cart").should('be.visible')
})

Cypress.Commands.add("clearCart", () => {
  cy.getBySel("nav-link-cart").click();
  cy.getBySel("cart-line-delete").should("be.visible").click({ multiple: true });
  cy.getBySel("cart-empty").should("be.visible");
});


  



  

  