describe('Create review', () => {
  before(() => {
    cy.login()
  })

  beforeEach(() => {
    cy.intercept('GET', 'http://localhost:3000/api/v1/current_user/pulls', {
      fixture: 'current-user-pulls.json',
    })
  })

  it('If you save without entering anything', () => {
    cy.visit('posts/new')
    cy.wait(1000)
    cy.get('[form="review_create_form"]').click()
    cy.contains('タイトルを入力してください')
    cy.contains('プルリクエストを選択してください')
    cy.contains('使用言語を選択してください')
    cy.contains('プルリクエストの説明を入力してください')
    cy.contains('レビューしてほしい点を入力してください')
  })

  it('If you enter everything and save it', () => {
    cy.visit('posts/new')
    cy.get('[name="title"]').type('Rubyのレビューをお願いします')
    cy.get('[id="mui-component-select-pull_request_title"]').click()
    cy.contains(
      'ruby-practices/ボウリングのスコア計算オブジェクト指向版',
    ).click()
    cy.get('[id="mui-component-select-languages"]').click()
    cy.contains('Ruby').click()
    cy.get('body').click(0, 0)
    cy.get('[name="pull_request_description"]').type(
      'ボウリングのスコア計算をオブジェクト指向プログラミングで書きました。',
    )
    cy.get('[name="review_point"]').type('メソッド/変数の命名')
    cy.intercept('POST', 'http://localhost:3000/api/v1/reviews', {
      statusCode: 201,
    })
    cy.get('[form="review_create_form"]').click()
    cy.location('pathname').should('eq', '/')
  })

  after(() => {
    cy.logout()
  })
})
