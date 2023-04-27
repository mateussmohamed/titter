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
    cy.get('[data-cy="loading-titter-list"]').should('have.length', 0)
    cy.get('[data-cy="titter-card-titter"]').first().find('[data-cy="open-profile"]').first().click()

    cy.url().should('include', '/user')

    cy.get('[data-cy="profile-home"]').should('have.length', 1)
    cy.get('[data-cy="profile-home"]').first().find('[data-cy="loading-profile-write"]').should('have.length', 0)
    cy.get('[data-cy="profile-home"]').first().find('[data-cy="loading-titter-list"]').should('have.length', 0)

    cy.get('[data-cy="follow-btn"]').should('have.text', 'follow')

    cy.get('[data-cy="follow-btn"]').click()
    cy.get('[data-cy="follow-btn"]').should('have.text', 'unfollow')

    cy.get('[data-cy="titter-card-quote-button"]').should('have.length.greaterThan', 0)
    cy.get('[data-cy="titter-card-retitter-button"]').should('have.length.greaterThan', 0)
  })

  it('should write a titter in current user profile page', () => {
    cy.get('[data-cy="loading-titter-list"]').should('have.length', 0)

    cy.get('[data-cy="open-current-profile"]').first().click()

    cy.url().should('include', '/user')

    cy.get('[data-cy="profile-home"]').should('have.length', 1)
    cy.get('[data-cy="profile-home"]').find('[data-cy="titter-card-quote-button"]').should('have.length', 0)
    cy.get('[data-cy="profile-home"]').find('[data-cy="titter-card-retitter-button"]').should('have.length', 0)

    cy.get('[data-cy="profile-home"]').first().find('[data-cy="titter-input"]').type('nice titter!!!')
    cy.get('[data-cy="profile-home"]').first().find('[data-cy="titter-btn"]').click()

    cy.get('[data-cy="profile-home"]').first().find('[data-cy="loading-titter-list"]').should('have.length', 1)

    cy.get('[data-cy="profile-home"]')
      .first()
      .find('[data-cy="titter-card-body"]')
      .first()
      .should('have.text', 'nice titter!!!')
  })
})
