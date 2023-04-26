/// <reference types="cypress" />

const Chance = require('chance')

context('Home', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000')
    cy.wait(500)
  })

  afterEach(() => {
    localStorage.clear()
  })

  it('should displays all titters from localStorage', () => {
    cy.get('[data-cy="loading-titter-list"]').should('have.length', 1)

    cy.get('[data-cy="search-input"]').should('have.length', 1)
    cy.get('[data-cy="titter-input"]').should('have.length', 1)
    cy.get('[data-cy="titter-btn"]').should('have.length', 1)

    cy.get('[data-cy="loading-titter-list"]').should('have.length', 0)

    cy.get('[data-test="titter-card"]').should('have.length', 47)
  })

  it('should displays all titters from search result', () => {
    cy.get('[data-cy="titter-input"]').type('nice titter!!!')
    cy.get('[data-cy="titter-btn"]').click()

    cy.get('[data-cy="loading-titter-list"]').should('have.length', 1)

    cy.get('[data-test="titter-card"]').should('have.length', 48)

    cy.get('[data-cy="search-input"]').type('nice titter!!!', { delay: 3 })

    cy.wait(500)

    cy.get('[data-test="titter-card"]').should('have.length', 1)

    cy.get('[data-cy="titter-card-body"]').first().should('have.text', 'nice titter!!!')
  })

  it('should display only titters of the users that current user follow', () => {
    const loggedUser = JSON.parse(localStorage.getItem('current_user') || '{}')
    const titters = JSON.parse(localStorage.getItem('titters') || '[]')
    const followingData = JSON.parse(localStorage.getItem('user_following') || '{}')
    const loggedUserFollowing = followingData[loggedUser.id]
    const tittersIFollow = titters
      .filter(titter => Boolean(loggedUserFollowing.find(item => item === titter.user.id)))
      .sort((a, b) => {
        const aTime = new Date(a.createdAt).getTime()
        const bTime = new Date(b.createdAt).getTime()

        return bTime - aTime
      })

    cy.get('[data-cy="home-filter"]').click()

    cy.get('[data-cy="loading-titter-list"]').should('have.length', 0)

    cy.get('[data-test="titter-card"]').should('have.length', tittersIFollow.length)

    cy.url().should('eq', 'http://localhost:3000/?filter=following')
  })

  it('should display the last titter created', () => {
    cy.get('[data-cy="titter-input"]').type('nice titter!!!')
    cy.get('[data-cy="titter-btn"]').click()

    cy.get('[data-cy="loading-titter-list"]').should('have.length', 1)

    cy.get('[data-test="titter-card"]').should('have.length', 48)

    cy.get('[data-cy="titter-card-body"]').first().should('have.text', 'nice titter!!!')
  })

  it('should display the last retitter created', () => {
    cy.get('[data-cy="loading-titter-list"]').should('have.length', 1)

    cy.get('[data-cy="titter-card-titter"]').first().get('[data-cy="titter-card-retitter-button"]').first().click()

    cy.get('[data-cy="loading-titter-list"]').should('have.length', 1)

    cy.get('[data-cy="titter-card-retittered-by"]').first().should('have.text', 'you retittered on')
  })

  it('should display the last quoted created', () => {
    cy.get('[data-cy="loading-titter-list"]').should('have.length', 1)

    cy.get('[data-cy="titter-card-titter"]').first().find('[data-cy="titter-card-quote-button"]').first().click()

    cy.get('[data-cy="titter-card-titter"]').first().find('[data-cy="titter-input"]').type('nice quote!!!')
    cy.get('[data-cy="titter-card-titter"]').first().find('[data-cy="titter-btn"]').click()

    cy.get('[data-cy="loading-titter-list"]').should('have.length', 1)

    cy.get('[data-cy="titter-card-quoted-by"]').first().should('have.text', 'you commented on')
    cy.get('[data-cy="titter-card-quote-body"]').first().should('have.text', 'nice quote!!!')
  })

  it('should display a error message when create a titter more than 777 chars', () => {
    const chanceQuote = new Chance()

    cy.get('[data-cy="titter-input"]').type(chanceQuote.paragraph({ sentences: 10 }), { delay: 0 })
    cy.get('[data-cy="titter-btn"]').click()

    cy.get('.chakra-alert__title').should('have.text', 'Oh no =(')
    cy.get('.chakra-alert__desc').should('have.text', 'the titter reached the maximum amount of characters.')
  })

  it('should display a error message when user try create the sixth titter on same day', () => {
    const chanceQuote = new Chance()
    cy.get('[data-test="titter-card"]').should('have.length', 47)

    cy.get('[data-cy="titter-input"]').type('titter of the day 1', { delay: 0 })
    cy.get('[data-cy="titter-btn"]').click()
    cy.get('[data-cy="loading-titter-list"]').should('have.length', 1)
    cy.get('[data-test="titter-card"]').should('have.length', 48)
    cy.get('[data-cy="titter-card-body"]').first().should('have.text', 'titter of the day 1')

    cy.get('[data-cy="titter-input"]').type('titter of the day 2', { delay: 0 })
    cy.get('[data-cy="titter-btn"]').click()
    cy.get('[data-cy="loading-titter-list"]').should('have.length', 1)
    cy.get('[data-test="titter-card"]').should('have.length', 49)
    cy.get('[data-cy="titter-card-body"]').first().should('have.text', 'titter of the day 2')

    cy.get('[data-cy="titter-input"]').type('titter of the day 3', { delay: 0 })
    cy.get('[data-cy="titter-btn"]').click()
    cy.get('[data-cy="loading-titter-list"]').should('have.length', 1)
    cy.get('[data-test="titter-card"]').should('have.length', 50)
    cy.get('[data-cy="titter-card-body"]').first().should('have.text', 'titter of the day 3')

    cy.get('[data-cy="titter-input"]').type('titter of the day 4', { delay: 0 })
    cy.get('[data-cy="titter-btn"]').click()
    cy.get('[data-cy="loading-titter-list"]').should('have.length', 1)
    cy.get('[data-test="titter-card"]').should('have.length', 51)
    cy.get('[data-cy="titter-card-body"]').first().should('have.text', 'titter of the day 4')

    cy.get('[data-cy="titter-input"]').type('titter of the day 5', { delay: 0 })
    cy.get('[data-cy="titter-btn"]').click()
    cy.get('[data-cy="loading-titter-list"]').should('have.length', 1)
    cy.get('[data-test="titter-card"]').should('have.length', 52)
    cy.get('[data-cy="titter-card-body"]').first().should('have.text', 'titter of the day 5')

    cy.get('[data-cy="titter-input"]').type('titter of the day 6', { delay: 0 })
    cy.get('[data-cy="titter-btn"]').click()

    cy.get('.chakra-alert__title').should('have.text', 'Oh no =(')
    cy.get('.chakra-alert__desc').should('have.text', 'you exceeded the titter limit for the day.')
  })
})
