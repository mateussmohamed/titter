/// <reference types="cypress" />

context('Profile', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000')
    cy.wait(500)
  })

  afterEach(() => {
    localStorage.clear()
  })

  it('should displays a first profile page', () => {
    cy.get('[data-cy="loading-post-list"]').should('have.length', 0)
    cy.get('[data-cy="post-card-post"]').first().find('[data-cy="open-profile"]').first().click()

    cy.url().should('include', '/profile')

    cy.get('[data-cy="profile-home"]').should('have.length', 1)
    cy.get('[data-cy="profile-home"]').first().find('[data-cy="loading-profile-write"]').should('have.length', 0)
    cy.get('[data-cy="profile-home"]').first().find('[data-cy="loading-post-list"]').should('have.length', 0)

    cy.get('[data-cy="follow-btn"]').should('have.text', 'follow')

    cy.get('[data-cy="follow-btn"]').click()
    cy.get('[data-cy="follow-btn"]').should('have.text', 'unfollow')

    cy.get('[data-cy="post-card-quote-button"]').should('have.length.greaterThan', 0)
    cy.get('[data-cy="post-card-repost-button"]').should('have.length.greaterThan', 0)
  })

  it('should write a post in current user profile page', () => {
    cy.get('[data-cy="loading-post-list"]').should('have.length', 0)

    cy.get('[data-cy="open-current-profile"]').first().click()

    cy.url().should('include', '/profile')

    cy.get('[data-cy="profile-home"]').should('have.length', 1)
    cy.get('[data-cy="profile-home"]').find('[data-cy="post-card-quote-button"]').should('have.length', 0)
    cy.get('[data-cy="profile-home"]').find('[data-cy="post-card-repost-button"]').should('have.length', 0)

    cy.get('[data-cy="profile-home"]').first().find('[data-cy="post-input"]').type('nice post!!!')
    cy.get('[data-cy="profile-home"]').first().find('[data-cy="post-btn"]').click()

    cy.get('[data-cy="profile-home"]').first().find('[data-cy="loading-post-list"]').should('have.length', 1)

    cy.get('[data-cy="profile-home"]')
      .first()
      .find('[data-cy="post-card-body"]')
      .first()
      .should('have.text', 'nice post!!!')
  })
})
