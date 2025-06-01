describe('Homepage', () => {
  it('should visit the homepage', () => {
    cy.visit('http://localhost:9002');
    cy.url().should('eq', 'http://localhost:9002/'); // Assuming your app runs on localhost:9002
  });
});