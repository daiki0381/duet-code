describe('Delete review', () => {
  before(() => {
    cy.login()
  })

  it('If reviewee accesses no accepted review', () => {
    cy.intercept('GET', 'http://localhost:3000/api/v1/reviews/1', {
      fixture: 'review/no_accepted.json',
    })
    cy.intercept('GET', 'http://localhost:3000/api/v1/current_user/id', {
      fixture: 'current-user-id/1.json',
    })
    cy.visit('posts/1')
    cy.get('[data-testid=MoreHorizIcon]').click()
    cy.contains('削除する')
  })

  it('If other user accesses no accepted review', () => {
    cy.intercept('GET', 'http://localhost:3000/api/v1/reviews/1', {
      fixture: 'review/no_accepted.json',
    })
    cy.intercept('GET', 'http://localhost:3000/api/v1/current_user/id', {
      fixture: 'current-user-id/2.json',
    })
    cy.visit('posts/1')
    cy.get('[data-testid=MoreHorizIcon]').should('not.exist')
  })

  it('If reviewee accesses accepted review', () => {
    cy.intercept('GET', 'http://localhost:3000/api/v1/reviews/1', {
      fixture: 'review/accepted.json',
    })
    cy.intercept('GET', 'http://localhost:3000/api/v1/current_user/id', {
      fixture: 'current-user-id/1.json',
    })
    cy.visit('posts/1')
    cy.get('[data-testid=MoreHorizIcon]').click()
    cy.contains('削除する').should('not.exist')
  })

  it('If reviewer accesses accepted review', () => {
    cy.intercept('GET', 'http://localhost:3000/api/v1/reviews/1', {
      fixture: 'review/accepted.json',
    })
    cy.intercept('GET', 'http://localhost:3000/api/v1/current_user/id', {
      fixture: 'current-user-id/2.json',
    })
    cy.visit('posts/1')
    cy.get('[data-testid=MoreHorizIcon]').should('not.exist')
  })

  it('If other user accesses accepted review', () => {
    cy.intercept('GET', 'http://localhost:3000/api/v1/reviews/1', {
      fixture: 'review/accepted.json',
    })
    cy.intercept('GET', 'http://localhost:3000/api/v1/current_user/id', {
      fixture: 'current-user-id/3.json',
    })
    cy.visit('posts/1')
    cy.get('[data-testid=MoreHorizIcon]').should('not.exist')
  })

  after(() => {
    cy.logout()
  })
})
