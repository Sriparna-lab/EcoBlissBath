context("GET /orders without authentication", () => {
  it("should return 403 when accessing orders without authentication", () => {
    cy.request({
      method: "GET",
      url: "http://localhost:8081/orders",
      failOnStatusCode: false // Prevents Cypress from failing the test on non-2xx status codes
    }).then((response) => {
      expect(response.status).to.eq(403);
    });
  });
});

describe('orders API', () => {
  before(() => {
    cy.signIn("test2@test.fr", "testtest").then((token) => {
      Cypress.env('token', token);
    });
  });

  it("should return the list of products in the cart", () => {
    cy.request({
      method: "GET",
      url: "http://localhost:8081/orders",
      headers: {
        "Authorization": "Bearer " + Cypress.env('token')
      },
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.exist;
    });
  });

  it('should add the product in the cart', () => {
    cy.request({
      method: 'POST',
      url: "http://localhost:8081/orders/add",
      headers: {
        "Authorization": "Bearer " + Cypress.env('token')
      },
      body: {
        product: 6,
        quantity: 1,
      },
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(200);
    });
  });

  it('adding an out-of-stock product to the cart', () => {
    cy.request({
      method: 'POST',
      url: 'http://localhost:8081/orders/add',
      headers: {
        "Authorization": "Bearer " + Cypress.env('token')
      },
      body: {
        product: 3,
        quantity: 1
      },
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.eq(400);
    });
  });
});

describe('Products API', () => {
  let productCard;

  it('should return details of a product by ID', () => {
    cy.request({
      method: 'GET',
      url: "http://localhost:8081/products/3",
    }).then((response) => {
      expect(response.status).to.equal(200);
      productCard = response.body;
      expect(productCard.id).to.eq(3);
      expect(productCard.availableStock).to.be.a("number");
      expect(productCard.name).to.eq("Sentiments printaniers");
      expect(productCard.skin).to.eq("Propre, fraîche");
      expect(productCard.aromas).to.eq("Frais et fruité");
      expect(productCard.ingredients).to.eq("Framboise, zeste de citron et feuille de menthe");
      expect(productCard).to.have.property("description");
      expect(productCard.price).to.be.a("number");
    });
  });
});

describe('Reviews API', () => {
  before(() => {
    // Clear the access token before each test
    Cypress.env('token', null);
    cy.signIn("test2@test.fr", "testtest").then((token) => {
      Cypress.env('token', token);
    });
  });

  it('should add a review', () => {
    cy.request({
      method: 'POST',
      url: 'http://localhost:8081/reviews',
      headers: {
        "Authorization": "Bearer " + Cypress.env('token')
      },
      body: {
        title: "Test",
        comment: "Test",
        rating: 5,
      },
    }).then((response) => {
      expect(response.status).to.eq(200);
    });
  });

  it('should not add a review with script XSS', () => {
    cy.request({
      method: 'POST',
      url: 'http://localhost:8081/reviews',
      failOnStatusCode: false,
      headers: {
        "Authorization": "Bearer " + Cypress.env('token')
      },
      body: {
        title: "Test",
        comment: "<script>alert('Test')</script>",
        rating: 5,
      }
    }).then((response) => {
      expect(response.status).to.be.eq(500);
    });
  });
});
