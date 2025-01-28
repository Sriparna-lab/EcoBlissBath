
describe('Login', () => {
    it('should connect the user', () => {
        cy.visit("http://localhost:8080/#/login")
        cy.getBySel("nav-link-login").click()
        cy.getBySel('login-input-username').type("test2@test.fr"),
        cy.getBySel('login-input-password').type("testtest"),
        cy.getBySel('login-submit').click()
        cy.getBySel('nav-link-cart').should('have.text', "Mon panier")
    });


    // Test the login with wrong username
    it('should not connect the user with wrong username', () => {
        cy.visit("http://localhost:8080/#/login")
        cy.getBySel("nav-link-login").click()
        cy.getBySel('login-input-username').type("test2@test"),
        cy.getBySel('login-input-password').type("testtest"),
        cy.getBySel('login-submit').click()
        cy.getBySel('nav-link-cart').should("not.exist")
        cy.getBySel('login-errors').should("be.visible")
    });

    // Test the login with wrong username and password
    it('should not connect the user without  username and password', () => {
        cy.visit("http://localhost:8080/#/login")
        cy.getBySel("nav-link-login").click()
        cy.getBySel('login-input-username')
        cy.getBySel('login-input-password')
        cy.getBySel('login-submit').click()
        cy.getBySel('nav-link-cart').should("not.exist")
        cy.getBySel('login-errors').should("be.visible")
    });
})