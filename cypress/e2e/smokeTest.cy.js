describe("smoke tests",()=>{
    it ("Verify the presence of the login fields and buttons",()=>{
        cy.visit("http://localhost:8080/#/login")
        cy.getBySel("login-input-username").should ("be.visible")
        cy.getBySel("login-input-password").should ("be.visible")
        cy.getBySel("login-submit").should ("be.visible")
    })

    it("Verify the presence of the add-to-cart buttons when you are logged in", () => {
        cy.userLogin()
        // Access the products page from the navigation bar
        cy.getBySel("nav-link-products").click()
        //Consult a product
        cy.getBySel("product-link").first().click()
        //Verify if the Add to Cart button is visible
        cy.getBySel("detail-product-add").should("be.visible")
    })

    it("Verify the presence of the product availability field", () => {
        cy.visit("http://localhost:8080/#/products")
        cy.getBySel("product-link").first().click()
        //Verify if the product availability field is visible
        cy.getBySel("detail-product-stock").should("be.visible")
    })
})