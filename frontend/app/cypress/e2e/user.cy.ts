describe('User', () => {
  before(() => {
    cy.login()
  })

  it('accessing a non-existent user redirects to the main page', () => {
    cy.visit('/users/1')
    cy.location('pathname').should('eq', '/')
  })

  it('If user exists', () => {
    cy.intercept('GET', 'http://localhost:3000/api/v1/users/1', {
      fixture: 'user/1.json',
    })
    cy.visit('/users/1')
    cy.contains('daiki0381')
  })

  it('If there is not user wanted reviews and user accepted reviews', () => {
    cy.intercept('GET', 'http://localhost:3000/api/v1/users/1', {
      fixture: 'user/1.json',
    })
    cy.intercept('GET', 'http://localhost:3000/api/v1/users/1/wanted_reviews', {
      fixture: 'user/none-user-wanted-reviews.json',
    })
    cy.intercept(
      'GET',
      'http://localhost:3000/api/v1/users/1/accepted_reviews',
      {
        fixture: 'user/none-user-accepted-reviews.json',
      },
    )
    cy.visit('/users/1')
    cy.contains('daiki0381')
    cy.contains('お礼はまだありません')
    cy.contains(
      '今回はありがとうございました。ご丁寧にレビューして頂いたおかげで綺麗なコードが書けるようになりました。また機会がありましたら、よろしくお願いします。',
    ).should('not.exist')
    cy.contains('フィードバック').click()
    cy.contains('フィードバックはまだありません')
    cy.contains(
      '今回はありがとうございました。レビューした側もとても勉強になりました。また機会がありましたら、よろしくお願いします。',
    ).should('not.exist')
    cy.contains('募集した一覧').click()
    cy.contains('募集した一覧はまだありません')
    cy.contains('Rubyのレビューをお願いします').should('not.exist')
    cy.contains('承諾した一覧').click()
    cy.contains('承諾した一覧はまだありません')
    cy.contains('Rubyのレビューをお願いします').should('not.exist')
  })

  it('If there is user wanted reviews and user accepted reviews', () => {
    cy.intercept('GET', 'http://localhost:3000/api/v1/users/1', {
      fixture: 'user/1.json',
    })
    cy.intercept('GET', 'http://localhost:3000/api/v1/users/1/wanted_reviews', {
      fixture: 'user/user-wanted-reviews.json',
    })
    cy.intercept(
      'GET',
      'http://localhost:3000/api/v1/users/1/accepted_reviews',
      {
        fixture: 'user/user-accepted-reviews.json',
      },
    )
    cy.visit('/users/1')
    cy.contains('daiki0381')
    cy.contains(
      '今回はありがとうございました。ご丁寧にレビューして頂いたおかげで綺麗なコードが書けるようになりました。また機会がありましたら、よろしくお願いします。',
    )
    cy.contains('お礼はまだありません').should('not.exist')
    cy.contains('フィードバック').click()
    cy.contains(
      '今回はありがとうございました。レビューした側もとても勉強になりました。また機会がありましたら、よろしくお願いします。',
    )
    cy.contains('フィードバックはまだありません').should('not.exist')
    cy.contains('募集した一覧').click()
    cy.contains('Rubyのレビューをお願いします')
    cy.contains('募集した一覧はまだありません').should('not.exist')
    cy.contains('承諾した一覧').click()
    cy.contains('Rubyのレビューをお願いします')
    cy.contains('承諾した一覧はまだありません').should('not.exist')
  })

  after(() => {
    cy.logout()
  })
})

export {}
