describe('Authentication', () => {
  it('If you are not authenticated, you will be redirected to the login page', () => {
    cy.visit('/')
    cy.location('pathname').should('eq', '/login')
  })

  it('If authenticated, redirected to main page', () => {
    cy.login()
    cy.visit('/login')
    cy.location('pathname').should('eq', '/')
  })

  after(() => {
    cy.logout()
  })
})

export {}
