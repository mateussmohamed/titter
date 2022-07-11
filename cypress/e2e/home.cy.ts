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

  it('should displays all posts from localStorage', () => {
    cy.get('[data-cy="loading-post-list"]').should('have.length', 1)

    cy.get('[data-cy="search-input"]').should('have.length', 1)
    cy.get('[data-cy="post-input"]').should('have.length', 1)
    cy.get('[data-cy="post-btn"]').should('have.length', 1)

    cy.get('[data-cy="loading-post-list"]').should('have.length', 0)

    cy.get('[data-test="post-card"]').should('have.length', 47)
  })

  it('should displays all posts from search result', () => {
    cy.get('[data-cy="post-input"]').type('nice post!!!')
    cy.get('[data-cy="post-btn"]').click()

    cy.get('[data-cy="loading-post-list"]').should('have.length', 1)

    cy.get('[data-test="post-card"]').should('have.length', 48)

    cy.get('[data-cy="search-input"]').type('nice post!!!', { delay: 3 })

    cy.wait(500)

    cy.get('[data-test="post-card"]').should('have.length', 1)

    cy.get('[data-cy="post-card-body"]').first().should('have.text', 'nice post!!!')
  })

  it('should display only posts of the users that current user follow', () => {
    const loggedUser = JSON.parse(localStorage.getItem('current_user') || '{}')
    const posts = JSON.parse(localStorage.getItem('posts') || '[]')
    const followingData = JSON.parse(localStorage.getItem('user_following') || '{}')
    const loggedUserFollowing = followingData[loggedUser.id]
    const postsIFollow = posts
      .filter(post => Boolean(loggedUserFollowing.find(item => item === post.user.id)))
      .sort((a, b) => {
        const aTime = new Date(a.createdAt).getTime()
        const bTime = new Date(b.createdAt).getTime()

        return bTime - aTime
      })

    cy.get('[data-cy="home-filter"]').click()

    cy.get('[data-cy="loading-post-list"]').should('have.length', 0)

    cy.get('[data-test="post-card"]').should('have.length', postsIFollow.length)

    cy.url().should('eq', 'http://localhost:3000/?filter=following')
  })

  it('should display the last post created', () => {
    cy.get('[data-cy="post-input"]').type('nice post!!!')
    cy.get('[data-cy="post-btn"]').click()

    cy.get('[data-cy="loading-post-list"]').should('have.length', 1)

    cy.get('[data-test="post-card"]').should('have.length', 48)

    cy.get('[data-cy="post-card-body"]').first().should('have.text', 'nice post!!!')
  })

  it('should display the last repost created', () => {
    cy.get('[data-cy="loading-post-list"]').should('have.length', 1)

    cy.get('[data-cy="post-card-post"]').first().get('[data-cy="post-card-repost-button"]').first().click()

    cy.get('[data-cy="loading-post-list"]').should('have.length', 1)

    cy.get('[data-cy="post-card-reposted-by"]').first().should('have.text', 'you reposted on')
  })

  it('should display the last quoted created', () => {
    cy.get('[data-cy="loading-post-list"]').should('have.length', 1)

    cy.get('[data-cy="post-card-post"]').first().find('[data-cy="post-card-quote-button"]').first().click()

    cy.get('[data-cy="post-card-post"]').first().find('[data-cy="post-input"]').type('nice quote!!!')
    cy.get('[data-cy="post-card-post"]').first().find('[data-cy="post-btn"]').click()

    cy.get('[data-cy="loading-post-list"]').should('have.length', 1)

    cy.get('[data-cy="post-card-quoted-by"]').first().should('have.text', 'you commented on')
    cy.get('[data-cy="post-card-quote-body"]').first().should('have.text', 'nice quote!!!')
  })

  it('should display a error message when create a post more than 777 chars', () => {
    const chanceQuote = new Chance()

    cy.get('[data-cy="post-input"]').type(chanceQuote.paragraph({ sentences: 10 }), { delay: 0 })
    cy.get('[data-cy="post-btn"]').click()

    cy.get('.chakra-alert__title').should('have.text', 'Oh no =(')
    cy.get('.chakra-alert__desc').should('have.text', 'the post reached the maximum amount of characters.')
  })

  it('should display a error message when user try create the sixth post on same day', () => {
    const chanceQuote = new Chance()
    cy.get('[data-test="post-card"]').should('have.length', 47)

    cy.get('[data-cy="post-input"]').type('post of the day 1', { delay: 0 })
    cy.get('[data-cy="post-btn"]').click()
    cy.get('[data-cy="loading-post-list"]').should('have.length', 1)
    cy.get('[data-test="post-card"]').should('have.length', 48)
    cy.get('[data-cy="post-card-body"]').first().should('have.text', 'post of the day 1')

    cy.get('[data-cy="post-input"]').type('post of the day 2', { delay: 0 })
    cy.get('[data-cy="post-btn"]').click()
    cy.get('[data-cy="loading-post-list"]').should('have.length', 1)
    cy.get('[data-test="post-card"]').should('have.length', 49)
    cy.get('[data-cy="post-card-body"]').first().should('have.text', 'post of the day 2')

    cy.get('[data-cy="post-input"]').type('post of the day 3', { delay: 0 })
    cy.get('[data-cy="post-btn"]').click()
    cy.get('[data-cy="loading-post-list"]').should('have.length', 1)
    cy.get('[data-test="post-card"]').should('have.length', 50)
    cy.get('[data-cy="post-card-body"]').first().should('have.text', 'post of the day 3')

    cy.get('[data-cy="post-input"]').type('post of the day 4', { delay: 0 })
    cy.get('[data-cy="post-btn"]').click()
    cy.get('[data-cy="loading-post-list"]').should('have.length', 1)
    cy.get('[data-test="post-card"]').should('have.length', 51)
    cy.get('[data-cy="post-card-body"]').first().should('have.text', 'post of the day 4')

    cy.get('[data-cy="post-input"]').type('post of the day 5', { delay: 0 })
    cy.get('[data-cy="post-btn"]').click()
    cy.get('[data-cy="loading-post-list"]').should('have.length', 1)
    cy.get('[data-test="post-card"]').should('have.length', 52)
    cy.get('[data-cy="post-card-body"]').first().should('have.text', 'post of the day 5')

    cy.get('[data-cy="post-input"]').type('post of the day 6', { delay: 0 })
    cy.get('[data-cy="post-btn"]').click()

    cy.get('.chakra-alert__title').should('have.text', 'Oh no =(')
    cy.get('.chakra-alert__desc').should('have.text', 'you exceeded the post limit for the day.')
  })
})
