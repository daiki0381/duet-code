describe('Notifications', () => {
  before(() => {
    cy.login()
  })

  it('If there is not notification', () => {
    cy.visit('/')
    cy.intercept('GET', '**/api/v1/current_user/notifications', {
      fixture: 'current-user-notifications/none.json',
    })
    cy.get('[data-testid="NotificationsNoneIcon"]').click()
    cy.contains('通知がありません')
  })

  it('If there is accepted notification', () => {
    cy.visit('/')
    cy.intercept('GET', '**/api/v1/current_user/notifications', {
      fixture: 'current-user-notifications/accepted.json',
    })
    cy.get('[data-testid="NotificationsNoneIcon"]').click()
    cy.contains(
      'daiki0381さんがレビューするをクリックしました。プルリクエストにコメントがありましたら、返信をお願いします。',
    )
  })

  it('If there is feedback notification', () => {
    cy.visit('/')
    cy.intercept('GET', '**/api/v1/current_user/notifications', {
      fixture: 'current-user-notifications/feedback.json',
    })
    cy.get('[data-testid="NotificationsNoneIcon"]').click()
    cy.contains('daiki0381さんがフィードバックを送信しました。')
  })

  it('If there is thanks notification', () => {
    cy.visit('/')
    cy.intercept('GET', '**/api/v1/current_user/notifications', {
      fixture: 'current-user-notifications/thanks.json',
    })
    cy.get('[data-testid="NotificationsNoneIcon"]').click()
    cy.contains('daiki0218さんがお礼を送信しました。')
  })

  after(() => {
    cy.logout()
  })
})

export {}
