describe("Verification of cart functionality", () => {
    let token;

    it("Add an available product to the cart (stock > 1) and verify the stock update", () => {
        cy.userLogin ()
        // Select a product 
        cy.getBySel("nav-link-products").click()
        cy.getBySel ("product-link").eq(4).click();
        cy.getBySel("detail-product-name").invoke('text')
        cy.getBySel("detail-product-stock").invoke('text')
        .should((text) => {
            // Extract the number from the string to verify if the stock is > 1
            const regex = /(-?\d+) en stock/   // Define the string to verify  
            const match = text.match(regex) //Search for occurrences in the string to process
            const stockNr = parseInt(match[1], 10) // Conversion of the string to an integer
            expect(stockNr).to.be.gte(1) // Verify that the stock is greater than 1 to be added       
        }).then((text) => {
            const stockText = text.trim(); // Remove the leading and trailing spaces from the string
            const stockNr = parseInt(stockText.match(/\d+/)) // Conversion to integer to obtain the stock
            cy.log("Stock:"+ stockNr) // Adding stock
            cy.getBySel("detail-product-add").click() // click on  "Ajouter au panier"
            cy.getBySel("cart-line-name").should("be.visible").contains("Extrait de nature") // Verify tthat the product has been added to the cart
            cy.go('back') //  Return to the product page
            // Verify if the stock level has been reduced
            const newStock = stockNr - 1
            cy.getBySel("detail-product-stock").invoke("text").should("match", new RegExp(newStock +" en stock"))
            cy.clearCart()
        })
    })

    it("Connection via API", () => {
        cy.request({
            method: "POST",
            url: "http://localhost:8081/login",
            body: {
                username: "test2@test.fr",
                password: "testtest"
            }
        }).then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body).to.have.property("token");
            token = response.body.token;
        })
    })
    
    it("Verify that the product has been added to the cart via API", () => {
        cy.request({
            method: "GET",
            url: "http://localhost:8081/orders",
            headers: {
                "Authorization": "Bearer " + token 
            },          
        }).then((response) => {
            expect(response.status).to.eq(200);
            let orderLines = response.body.orderLines
            orderLines.forEach((orderLine) => {
                if (orderLine.product.id === 7) {
                    // Verify if the quantity of the product with the identifier 7 is 1
                    expect(orderLine.quantity).to.be.equal(1)
                } else {
                    throw new Error("Product with id 7 not found in the cart");
                }
            })
        })
    })
})
    
    
describe ("Verification of limits", () => {
    beforeEach("userLogin", () => {
        cy.userLogin() 
    })
    
    it("Add a negative quantity", () => {
        cy.getBySel("nav-link-products").click()
        cy.getBySel ("product-link").eq(5).click();
        // Enter a quantity = -2
        cy.getBySel ("detail-product-quantity").click();
        cy.getBySel ("detail-product-quantity").clear();
        cy.getBySel ("detail-product-quantity").type("-2");
        // Add to cart
        cy.getBySel ("detail-product-add").click();
    })
    
    it("Add a quantity > 20", () => {
        //Select a product
        cy.getBySel("nav-link-products").click();
        //Select the product "Extrait de nature"
        cy.getBySel("product-link").eq(4).click();
        cy.getBySel("detail-product-quantity").click();
        cy.getBySel("detail-product-quantity").clear();
        //Enter a quantity > 20
        cy.getBySel("detail-product-quantity").type("21");
        // Add to cart
       cy.getBySel("detail-product-add").click();
       cy.wait(1000);
       cy.getBySel("cart-line-delete").click({ multiple: true });
       cy.getBySel("cart-empty").should("be.visible");
    });
})
    
    
    