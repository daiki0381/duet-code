describe('Update review', () => {
  before(() => {
    cy.login()
  })

  it('accessing a non-existent review redirects to the main page', () => {
    cy.intercept('GET', '**/api/v1/reviews/1', 'undefined')
    cy.intercept('GET', '**/api/v1/current_user/id', 'undefined')
    cy.visit('/posts/1/edit')
    cy.location('pathname').should('eq', '/')
  })

  it('If non-reviewee access the site, they are redirected to the main page', () => {
    cy.intercept('GET', '**/api/v1/reviews/1', {
      fixture: 'review/no_accepted.json',
    })
    cy.intercept('GET', '**/api/v1/current_user/id', {
      fixture: 'current-user-id/2.json',
    })
    cy.visit('/posts/1/edit')
    cy.location('pathname').should('eq', '/')
  })

  it('If reviewee accesses', () => {
    cy.intercept('GET', '**/api/v1/reviews/1', {
      fixture: 'review/no_accepted.json',
    })
    cy.intercept('GET', '**/api/v1/current_user/id', {
      fixture: 'current-user-id/1.json',
    })
    cy.intercept('GET', '**/api/v1/current_user/pulls', {
      fixture: 'current-user-pulls.json',
    })
    cy.visit('/posts/1/edit')
    cy.get('[name="title"]').type('(変更しました)')
    cy.intercept('PATCH', '**/api/v1/reviews/1', {
      statusCode: 200,
    })
    cy.get('[form="review_edit_form"]').click()
    cy.location('pathname').should('eq', '/posts/1')
  })

  after(() => {
    cy.logout()
  })
})

export {}
