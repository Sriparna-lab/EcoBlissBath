describe('API Login Test', () => {
  it('should log in with valid credentials and return 200', () => {
    cy.request({
      method: 'POST',
      url: 'http://localhost:8081/login',
      body: {
        username: 'test2@test.fr',
        password: 'testtest'
      }
    }).then((response) => {
      // Verify that the response status is 200
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property("token");
    });
  });
  
  it('should return 401 for unknown user', () => {
    cy.request({
      method: 'POST',
      url: 'http://localhost:8081/login',
      body: {
        username: 'test2@test',
        password: 'testtest'
      },
      failOnStatusCode: false 
    }).then((response) => {
      // Verify that the response status is 401
      expect(response.status).to.eq(401);
    });
  });
})
   