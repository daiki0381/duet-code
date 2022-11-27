describe('Reviews', () => {
  before(() => {
    cy.login()
  })

  it('If there is not review', () => {
    cy.visit('/')
    cy.intercept('GET', 'http://localhost:3000/api/v1/reviews', {
      fixture: 'reviews/none.json',
    })
    cy.contains('レビュー募集はまだありません')
    cy.contains('Rubyのレビューをお願いします').should('not.exist')
    cy.contains('レビュー募集終了').click({ force: true })
    cy.contains('レビュー募集終了はまだありません')
    cy.contains('Rubyのレビューをお願いします').should('not.exist')
  })

  it('If there is wanted reviews', () => {
    cy.visit('/')
    cy.intercept('GET', 'http://localhost:3000/api/v1/reviews', {
      fixture: 'reviews/wanted.json',
    })
    cy.contains('Rubyのレビューをお願いします')
    cy.contains('レビュー募集はまだありません').should('not.exist')
    cy.contains('レビュー募集終了').click({ force: true })
    cy.contains('レビュー募集終了はまだありません')
    cy.contains('Rubyのレビューをお願いします').should('not.exist')
  })

  it('If there is accepted reviews', () => {
    cy.visit('/')
    cy.intercept('GET', 'http://localhost:3000/api/v1/reviews', {
      fixture: 'reviews/accepted.json',
    })
    cy.contains('レビュー募集はまだありません')
    cy.contains('Rubyのレビューをお願いします').should('not.exist')
    cy.contains('レビュー募集終了').click({ force: true })
    cy.contains('Rubyのレビューをお願いします')
    cy.contains('レビュー募集終了はまだありません').should('not.exist')
  })

  after(() => {
    cy.logout()
  })
})
