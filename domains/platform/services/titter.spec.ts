import { TitterBuilder } from '@/domains/platform/builders/titter-builder'
import { UserBuilder } from '@/domains/platform/builders/user-builder'
import { Titter } from '@/domains/platform/entities'
import titter from '@/domains/platform/services/titter'

import Chance from 'chance'

describe('titter ~ service', () => {
  afterEach(() => {
    localStorage.clear()

    jest.clearAllMocks()
    ;(localStorage.setItem as jest.Mocked<any>).mockClear()
  })

  describe('when titter.newTitter is called', () => {
    describe('when an error happens to submit a titter', () => {
      test('should return "the titter reached the maximum amount of characters." when user try send body with more than 777 characters', async () => {
        try {
          const mockLoggedUser = UserBuilder()
          localStorage.setItem('current_user', JSON.stringify(mockLoggedUser))

          const ChanceTitter = new Chance()

          await titter.newTitter({
            body: ChanceTitter.paragraph({ sentences: 10 }),
            createdAt: new Date().toLocaleString()
          })
        } catch (error) {
          if (error instanceof Error) {
            expect(error).toBeInstanceOf(Error)
            expect(error.message).toBe('the titter reached the maximum amount of characters.')
          }
        }
      })

      test('should return "you exceeded the titter limit for today." when user try send the sixth titter', async () => {
        try {
          const mockLoggedUser = UserBuilder()
          localStorage.setItem('current_user', JSON.stringify(mockLoggedUser))
          const createdAt = new Date().toLocaleString()

          const titters = Array(5)
            .fill(null)
            .map(() => TitterBuilder({ user: mockLoggedUser, createdAt }))

          localStorage.setItem('titters', JSON.stringify(titters))

          await titter.newTitter({ user: mockLoggedUser, createdAt, kind: 'titter' })
        } catch (error) {
          if (error instanceof Error) {
            expect(error).toBeInstanceOf(Error)
            expect(error.message).toBe('you exceeded the titter limit for the day.')
          }
        }
      })
    })

    test('should be insert a "titter"', async () => {
      const mockLoggedUser = UserBuilder()
      localStorage.setItem('current_user', JSON.stringify(mockLoggedUser))

      const response = (await titter.newTitter({ createdAt: new Date().toLocaleString() })) as Titter

      const user_titter = { [mockLoggedUser.id]: [response.id] }

      expect(localStorage.setItem).toHaveBeenNthCalledWith(2, 'user_titter', JSON.stringify(user_titter))
      expect(localStorage.setItem).toHaveBeenNthCalledWith(3, 'titters', JSON.stringify([response]))

      const titters = JSON.parse(localStorage.getItem('titters') || '[]') as Titter[]
      const titterWasPersisted = Boolean(titters?.find(titter => titter.id === response.id))
      expect(titterWasPersisted).toBe(true)
    })

    test('should be insert a "retitter"', async () => {
      const mockLoggedUser = UserBuilder()
      localStorage.setItem('current_user', JSON.stringify(mockLoggedUser))

      const mockRetitter = TitterBuilder({ kind: 'titter', user: UserBuilder() })

      const response = (await titter.newTitter({
        kind: 'retitter',
        createdAt: new Date().toLocaleString(),
        referencedTitter: mockRetitter
      })) as Titter

      const userTitter = { [mockLoggedUser.id]: [response.id] }
      const userRetitter = { [mockRetitter.id]: [response.user.id] }

      expect(localStorage.setItem).toHaveBeenNthCalledWith(2, 'user_retitter', JSON.stringify(userRetitter))
      expect(localStorage.setItem).toHaveBeenNthCalledWith(3, 'user_titter', JSON.stringify(userTitter))
      expect(localStorage.setItem).toHaveBeenNthCalledWith(4, 'titters', JSON.stringify([response]))

      const titters = JSON.parse(localStorage.getItem('titters') || '[]') as Titter[]
      const titterWasPersisted = Boolean(titters?.find(titter => titter.id === response.id))
      expect(titterWasPersisted).toBe(true)
    })

    test('should be insert a "quote"', async () => {
      const mockLoggedUser = UserBuilder()
      localStorage.setItem('current_user', JSON.stringify(mockLoggedUser))

      const mockQuote = TitterBuilder({ kind: 'titter', user: UserBuilder() })

      const response = (await titter.newTitter({
        kind: 'quote',
        createdAt: new Date().toLocaleString(),
        referencedTitter: mockQuote
      })) as Titter

      const user_titter = { [mockLoggedUser.id]: [response.id] }
      const userQuote = { [mockQuote.id]: [response.user.id] }

      expect(localStorage.setItem).toHaveBeenNthCalledWith(2, 'user_quote', JSON.stringify(userQuote))
      expect(localStorage.setItem).toHaveBeenNthCalledWith(3, 'user_titter', JSON.stringify(user_titter))
      expect(localStorage.setItem).toHaveBeenNthCalledWith(4, 'titters', JSON.stringify([response]))

      const titters = JSON.parse(localStorage.getItem('titters') || '[]') as Titter[]
      const titterWasPersisted = Boolean(titters?.find(titter => titter.id === response.id))
      expect(titterWasPersisted).toBe(true)
    })
  })

  describe('when titterer.feed is called', () => {
    const mockLoggedUser = UserBuilder()

    beforeEach(() => {
      localStorage.setItem('current_user', JSON.stringify(mockLoggedUser))
    })

    describe('when called without params', () => {
      test('should return all titters', async () => {
        const mockTitters = Array(20)
          .fill(null)
          .map(() => UserBuilder())
          .map(user => TitterBuilder({ user }))

        localStorage.setItem('titters', JSON.stringify(mockTitters))

        const response = await titter.feed()

        expect(response).toHaveLength(20)
        expect(response[0]).toHaveProperty('createdAt')
        expect(response[0]).toHaveProperty('quote')
        expect(response[0]).toHaveProperty('retitter')
        expect(response[0]).toHaveProperty('sameUser')
        expect(response[0]).toHaveProperty('loggedUserQuoted')
        expect(response[0]).toHaveProperty('loggedUserRetittered')
      })

      test('should return following titters', async () => {
        const mockUsers = Array(20)
          .fill(null)
          .map(() => UserBuilder())
          .concat(mockLoggedUser)

        const mockTitters = mockUsers.map(user => TitterBuilder({ user }))

        const userFollowingData = {
          [mockLoggedUser.id]: mockUsers.slice(0, 12).map(user => user.id)
        }

        localStorage.setItem('titters', JSON.stringify(mockTitters))
        localStorage.setItem('user_following', JSON.stringify(userFollowingData))

        const response = await titter.feed('following')

        expect(response).toHaveLength(12)
      })

      test('should return user titters', async () => {
        const mockUsers = Array(20)
          .fill(null)
          .map(() => UserBuilder())
          .concat(mockLoggedUser)

        const mockTitters = mockUsers
          .map(user => TitterBuilder({ user }))
          .concat([TitterBuilder({ user: mockLoggedUser }), TitterBuilder({ user: mockLoggedUser })])

        localStorage.setItem('titters', JSON.stringify(mockTitters))

        const response = await titter.feed('user', mockLoggedUser.username)

        expect(response).toHaveLength(3)
      })

      test('should return following titters', async () => {
        const mockUsers = Array(20)
          .fill(null)
          .map(() => UserBuilder())
          .concat(mockLoggedUser)

        const mockTitters = mockUsers.map(user => TitterBuilder({ user }))

        const userFollowingData = {
          [mockLoggedUser.id]: mockUsers.slice(0, 12).map(user => user.id)
        }

        localStorage.setItem('titters', JSON.stringify(mockTitters))
        localStorage.setItem('user_following', JSON.stringify(userFollowingData))

        const response = await titter.feed('following')

        expect(response).toHaveLength(12)
      })

      test('should return titters from search result', async () => {
        const mockUsers = Array(20)
          .fill(null)
          .map(() => UserBuilder())
          .concat(mockLoggedUser)

        const mockTitters = mockUsers
          .map(user => TitterBuilder({ user }))
          .concat([
            TitterBuilder({ user: mockUsers[5], body: 'mateus is a nice guy', kind: 'titter' }),
            TitterBuilder({ user: mockUsers[10], body: 'mateus is a nice guy', kind: 'titter' })
          ])

        localStorage.setItem('titters', JSON.stringify(mockTitters))

        const response = await titter.feed('all', '', 'mateus is a nice guy')

        expect(response).toHaveLength(2)
      })
    })
  })

  describe('when titter.getUserProfile is called', () => {
    test('should be return "user not found!" when the username not found', async () => {
      const mockUsers = Array(5)
        .fill(null)
        .map(() => UserBuilder())

      localStorage.setItem('users', JSON.stringify(mockUsers))

      try {
        await titter.getUserProfile('@mateussmohamed')
      } catch (error) {
        if (error instanceof Error) {
          expect(error).toBeInstanceOf(Error)
          expect(error.message).toBe('user not found!')
        }
      }
    })

    test('should be return a correct user', async () => {
      const mockLoggedUser = UserBuilder()
      localStorage.setItem('current_user', JSON.stringify(mockLoggedUser))
      const mockUser = UserBuilder()
      const mockUsers = Array(10)
        .fill(null)
        .map(() => UserBuilder())
        .concat(mockUser)

      localStorage.setItem('users', JSON.stringify(mockUsers))

      const userFollowingData = {
        [mockUser.id]: mockUsers.slice(0, 4).map(user => user.id)
      }

      const userFollowersData = {
        [mockUser.id]: mockUsers.slice(0, 8).map(user => user.id)
      }
      const userTitterData = {
        [mockUser.id]: Array(10)
          .fill(null)
          .map(() => TitterBuilder().id)
      }

      localStorage.setItem('user_following', JSON.stringify(userFollowingData))
      localStorage.setItem('user_followers', JSON.stringify(userFollowersData))
      localStorage.setItem('user_titter', JSON.stringify(userTitterData))

      const response = await titter.getUserProfile(mockUser.username)

      expect(response.username).toBe(mockUser.username)
      expect(response.showFollowButton).toBe(true)
      expect(response.loggedUserFollowProfile).toBe(false)
      expect(response.followingCount).toBe(4)
      expect(response.followersCount).toBe(8)
      expect(response.tittersCount).toBe(10)
    })

    test('should be return a profile from current user', async () => {
      const mockLoggedUser = UserBuilder()
      localStorage.setItem('current_user', JSON.stringify(mockLoggedUser))
      const mockUsers = Array(20)
        .fill(null)
        .map(() => UserBuilder())
        .concat(mockLoggedUser)

      localStorage.setItem('users', JSON.stringify(mockUsers))

      const userFollowingData = {
        [mockLoggedUser.id]: mockUsers.slice(0, 12).map(user => user.id)
      }

      const userFollowersData = {
        [mockLoggedUser.id]: mockUsers.slice(0, 18).map(user => user.id)
      }
      const userTitterData = {
        [mockLoggedUser.id]: Array(33)
          .fill(null)
          .map(() => TitterBuilder().id)
      }

      localStorage.setItem('user_following', JSON.stringify(userFollowingData))
      localStorage.setItem('user_followers', JSON.stringify(userFollowersData))
      localStorage.setItem('user_titter', JSON.stringify(userTitterData))

      const response = await titter.getUserProfile(mockLoggedUser.username)

      expect(response.username).toBe(mockLoggedUser.username)
      expect(response.showFollowButton).toBe(false)
      expect(response.loggedUserFollowProfile).toBe(false)
      expect(response.followingCount).toBe(12)
      expect(response.followersCount).toBe(18)
      expect(response.tittersCount).toBe(33)
    })
  })

  describe('when titter.follow is called', () => {
    test('should be follow an user', async () => {
      const mockUserToFollowing = UserBuilder()
      const mockLoggedUser = UserBuilder()

      localStorage.setItem('current_user', JSON.stringify(mockLoggedUser))

      const ramdomUserId = Array(2)
        .fill(null)
        .map(() => UserBuilder().id)

      const userFollowersData = {
        [mockUserToFollowing.id]: [...ramdomUserId]
      }

      const resultUserFollowers = {
        [mockUserToFollowing.id]: [...ramdomUserId, mockLoggedUser.id]
      }

      const resultUserFollowing = {
        [mockLoggedUser.id]: [...ramdomUserId, mockUserToFollowing.id]
      }

      localStorage.setItem('user_followers', JSON.stringify(userFollowersData))
      localStorage.setItem('user_following', JSON.stringify(resultUserFollowing))

      const response = await titter.follow(mockUserToFollowing.id)

      expect(localStorage.setItem).toHaveBeenNthCalledWith(4, 'user_followers', JSON.stringify(resultUserFollowers))
      expect(localStorage.setItem).toHaveBeenNthCalledWith(5, 'user_following', JSON.stringify(resultUserFollowing))
      expect(response).toBe('follow')
    })

    test('should be unfollow', async () => {
      const mockUserToFollowing = UserBuilder()
      const mockLoggedUser = UserBuilder()

      localStorage.setItem('current_user', JSON.stringify(mockLoggedUser))

      const ramdomUserId = Array(2)
        .fill(null)
        .map(() => UserBuilder().id)

      const userFollowersData = {
        [mockUserToFollowing.id]: [...ramdomUserId, mockLoggedUser.id]
      }

      const resultUserFollowers = {
        [mockUserToFollowing.id]: [...ramdomUserId]
      }

      const resultUserFollowing = {
        [mockLoggedUser.id]: [...ramdomUserId]
      }

      localStorage.setItem('user_followers', JSON.stringify(userFollowersData))
      localStorage.setItem('user_following', JSON.stringify(resultUserFollowing))

      const response = await titter.follow(mockUserToFollowing.id)

      expect(localStorage.setItem).toHaveBeenNthCalledWith(4, 'user_followers', JSON.stringify(resultUserFollowers))
      expect(localStorage.setItem).toHaveBeenNthCalledWith(5, 'user_following', JSON.stringify(resultUserFollowing))
      expect(response).toBe('unfollow')
    })
  })
})
