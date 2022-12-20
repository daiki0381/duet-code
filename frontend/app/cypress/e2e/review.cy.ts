describe('Review', () => {
  before(() => {
    cy.login()
  })

  it('accessing a non-existent review redirects to the main page', () => {
    cy.visit('/posts/1')
    cy.location('pathname').should('eq', '/')
  })

  it('If reviewee accesses no accepted review', () => {
    cy.intercept('GET', '**/api/v1/reviews/1', {
      fixture: 'review/no_accepted.json',
    })
    cy.intercept('GET', '**/api/v1/current_user/id', {
      fixture: 'current-user-id/1.json',
    })
    cy.visit('/posts/1')
    cy.contains(
      'レビュアーを募集しています。レビュアーがレビューするをクリックすると、自動でリポジトリのコラボレーターに追加され、レビュアーにレビューリクエストが届きます。',
    )
  })

  it('If other user accesses no accepted review', () => {
    cy.intercept('GET', '**/api/v1/reviews/1', {
      fixture: 'review/no_accepted.json',
    })
    cy.intercept('GET', '**/api/v1/current_user/id', {
      fixture: 'current-user-id/2.json',
    })
    cy.visit('/posts/1')
    cy.contains(
      'daiki0381さんがレビュアーを募集しています。レビューをする場合、レビューするをクリックしてください。レビューするをクリックすると、自動でリポジトリのコラボレーターに追加され、レビューリクエストが届きます。',
    )
  })

  it('If reviewee accesses accepted review', () => {
    cy.intercept('GET', '**/api/v1/reviews/1', {
      fixture: 'review/accepted.json',
    })
    cy.intercept('GET', '**/api/v1/current_user/id', {
      fixture: 'current-user-id/1.json',
    })
    cy.visit('/posts/1')
    cy.contains(
      'daiki0218さんがレビューするをクリックしました。プルリクエストにコメントがありましたら、返信をお願いします。',
    )
  })

  it('If reviewer accesses accepted review', () => {
    cy.intercept('GET', '**/api/v1/reviews/1', {
      fixture: 'review/accepted.json',
    })
    cy.intercept('GET', '**/api/v1/current_user/id', {
      fixture: 'current-user-id/2.json',
    })
    cy.visit('/posts/1')
    cy.contains(
      'https://github.com/daiki0381/ruby-practices/pull/1からレビューリクエストが届いています。プルリクエストをApproveしたら、フィードバックするをクリックして、レビューのフィードバックをしてください。',
    )
  })

  it('If other user accesses accepted review', () => {
    cy.intercept('GET', '**/api/v1/reviews/1', {
      fixture: 'review/accepted.json',
    })
    cy.intercept('GET', '**/api/v1/current_user/id', {
      fixture: 'current-user-id/3.json',
    })
    cy.visit('/posts/1')
    cy.contains('レビュー中です。')
  })

  it('If reviewee accesses feedback review', () => {
    cy.intercept('GET', '**/api/v1/reviews/1', {
      fixture: 'review/feedback.json',
    })
    cy.intercept('GET', '**/api/v1/current_user/id', {
      fixture: 'current-user-id/1.json',
    })
    cy.visit('/posts/1')
    cy.contains(
      'daiki0218さんがレビューに対するフィードバックを送信しました。お礼するをクリックして、レビューに対するお礼をしてください。',
    )
  })

  it('If reviewer accesses feedback review', () => {
    cy.intercept('GET', '**/api/v1/reviews/1', {
      fixture: 'review/feedback.json',
    })
    cy.intercept('GET', '**/api/v1/current_user/id', {
      fixture: 'current-user-id/2.json',
    })
    cy.visit('/posts/1')
    cy.contains('daiki0381さんがレビューに対するお礼を入力しています。')
  })

  it('If other user accesses feedback review', () => {
    cy.intercept('GET', '**/api/v1/reviews/1', {
      fixture: 'review/feedback.json',
    })
    cy.intercept('GET', '**/api/v1/current_user/id', {
      fixture: 'current-user-id/3.json',
    })
    cy.visit('/posts/1')
    cy.contains('レビュー中です。')
  })

  it('If reviewee accesses thanks review', () => {
    cy.intercept('GET', '**/api/v1/reviews/1', {
      fixture: 'review/thanks.json',
    })
    cy.intercept('GET', '**/api/v1/current_user/id', {
      fixture: 'current-user-id/1.json',
    })
    cy.visit('/posts/1')
    cy.contains('レビューが完了しました。')
  })

  it('If reviewer accesses thanks review', () => {
    cy.intercept('GET', '**/api/v1/reviews/1', {
      fixture: 'review/thanks.json',
    })
    cy.intercept('GET', '**/api/v1/current_user/id', {
      fixture: 'current-user-id/2.json',
    })
    cy.visit('/posts/1')
    cy.contains('レビューが完了しました。')
  })

  it('If other user accesses thanks review', () => {
    cy.intercept('GET', '**/api/v1/reviews/1', {
      fixture: 'review/thanks.json',
    })
    cy.intercept('GET', '**/api/v1/current_user/id', {
      fixture: 'current-user-id/3.json',
    })
    cy.visit('/posts/1')
    cy.contains('レビューが完了しました。')
  })

  after(() => {
    cy.logout()
  })
})

export {}
