import Chance from 'chance'

import { PostBuilder } from '~/domains/platform/builders/post-builder'
import { UserBuilder } from '~/domains/platform/builders/user-builder'
import { Post } from '~/domains/platform/entities'
import titter from '~/domains/platform/services/titter'

describe('titter ~ service', () => {
  afterEach(() => {
    localStorage.clear()

    jest.clearAllMocks()
    ;(localStorage.setItem as jest.Mocked<any>).mockClear()
  })

  describe('when titter.writePost is called', () => {
    describe('when an error happens to submit a post', () => {
      test('should return "the post reached the maximum amount of characters." when user try send body with more than 777 characters', async () => {
        try {
          const mockLoggedUser = UserBuilder()
          localStorage.setItem('current_user', JSON.stringify(mockLoggedUser))

          const ChancePost = new Chance()

          await titter.writePost({
            body: ChancePost.paragraph({ sentences: 10 }),
            createdAt: new Date().toLocaleString()
          })
        } catch (error) {
          if (error instanceof Error) {
            expect(error).toBeInstanceOf(Error)
            expect(error.message).toBe('the post reached the maximum amount of characters.')
          }
        }
      })

      test('should return "you exceeded the post limit for today." when user try send the sixth post', async () => {
        try {
          const mockLoggedUser = UserBuilder()
          localStorage.setItem('current_user', JSON.stringify(mockLoggedUser))
          const createdAt = new Date().toLocaleString()

          const posts = Array(5)
            .fill(null)
            .map(() => PostBuilder({ user: mockLoggedUser, createdAt }))

          localStorage.setItem('posts', JSON.stringify(posts))

          await titter.writePost({ user: mockLoggedUser, createdAt, kind: 'post' })
        } catch (error) {
          if (error instanceof Error) {
            expect(error).toBeInstanceOf(Error)
            expect(error.message).toBe('you exceeded the post limit for the day.')
          }
        }
      })
    })

    test('should be insert a "post"', async () => {
      const mockLoggedUser = UserBuilder()
      localStorage.setItem('current_user', JSON.stringify(mockLoggedUser))

      const response = (await titter.writePost({ createdAt: new Date().toLocaleString() })) as Post

      const user_post = { [mockLoggedUser.id]: [response.id] }

      expect(localStorage.setItem).toHaveBeenNthCalledWith(2, 'user_post', JSON.stringify(user_post))
      expect(localStorage.setItem).toHaveBeenNthCalledWith(3, 'posts', JSON.stringify([response]))

      const posts = JSON.parse(localStorage.getItem('posts') || '[]') as Post[]
      const postWasPersisted = Boolean(posts?.find(post => post.id === response.id))
      expect(postWasPersisted).toBe(true)
    })

    test('should be insert a "repost"', async () => {
      const mockLoggedUser = UserBuilder()
      localStorage.setItem('current_user', JSON.stringify(mockLoggedUser))

      const mockRepost = PostBuilder({ kind: 'post', user: UserBuilder() })

      const response = (await titter.writePost({
        kind: 'repost',
        createdAt: new Date().toLocaleString(),
        referencedPost: mockRepost
      })) as Post

      const userPost = { [mockLoggedUser.id]: [response.id] }
      const userRepost = { [mockRepost.id]: [response.user.id] }

      expect(localStorage.setItem).toHaveBeenNthCalledWith(2, 'user_repost', JSON.stringify(userRepost))
      expect(localStorage.setItem).toHaveBeenNthCalledWith(3, 'user_post', JSON.stringify(userPost))
      expect(localStorage.setItem).toHaveBeenNthCalledWith(4, 'posts', JSON.stringify([response]))

      const posts = JSON.parse(localStorage.getItem('posts') || '[]') as Post[]
      const postWasPersisted = Boolean(posts?.find(post => post.id === response.id))
      expect(postWasPersisted).toBe(true)
    })

    test('should be insert a "quote"', async () => {
      const mockLoggedUser = UserBuilder()
      localStorage.setItem('current_user', JSON.stringify(mockLoggedUser))

      const mockQuote = PostBuilder({ kind: 'post', user: UserBuilder() })

      const response = (await titter.writePost({
        kind: 'quote',
        createdAt: new Date().toLocaleString(),
        referencedPost: mockQuote
      })) as Post

      const user_post = { [mockLoggedUser.id]: [response.id] }
      const userQuote = { [mockQuote.id]: [response.user.id] }

      expect(localStorage.setItem).toHaveBeenNthCalledWith(2, 'user_quote', JSON.stringify(userQuote))
      expect(localStorage.setItem).toHaveBeenNthCalledWith(3, 'user_post', JSON.stringify(user_post))
      expect(localStorage.setItem).toHaveBeenNthCalledWith(4, 'posts', JSON.stringify([response]))

      const posts = JSON.parse(localStorage.getItem('posts') || '[]') as Post[]
      const postWasPersisted = Boolean(posts?.find(post => post.id === response.id))
      expect(postWasPersisted).toBe(true)
    })
  })

  describe('when poster.feed is called', () => {
    const mockLoggedUser = UserBuilder()

    beforeEach(() => {
      localStorage.setItem('current_user', JSON.stringify(mockLoggedUser))
    })

    describe('when called without params', () => {
      test('should return all posts', async () => {
        const mockPosts = Array(20)
          .fill(null)
          .map(() => UserBuilder())
          .map(user => PostBuilder({ user }))

        localStorage.setItem('posts', JSON.stringify(mockPosts))

        const response = await titter.feed()

        expect(response).toHaveLength(20)
        expect(response[0]).toHaveProperty('createdAt')
        expect(response[0]).toHaveProperty('quote')
        expect(response[0]).toHaveProperty('repost')
        expect(response[0]).toHaveProperty('sameUser')
        expect(response[0]).toHaveProperty('loggedUserQuoted')
        expect(response[0]).toHaveProperty('loggedUserReposted')
      })

      test('should return following posts', async () => {
        const mockUsers = Array(20)
          .fill(null)
          .map(() => UserBuilder())
          .concat(mockLoggedUser)

        const mockPosts = mockUsers.map(user => PostBuilder({ user }))

        const userFollowingData = {
          [mockLoggedUser.id]: mockUsers.slice(0, 12).map(user => user.id)
        }

        localStorage.setItem('posts', JSON.stringify(mockPosts))
        localStorage.setItem('user_following', JSON.stringify(userFollowingData))

        const response = await titter.feed('following')

        expect(response).toHaveLength(12)
      })

      test('should return user posts', async () => {
        const mockUsers = Array(20)
          .fill(null)
          .map(() => UserBuilder())
          .concat(mockLoggedUser)

        const mockPosts = mockUsers
          .map(user => PostBuilder({ user }))
          .concat([PostBuilder({ user: mockLoggedUser }), PostBuilder({ user: mockLoggedUser })])

        localStorage.setItem('posts', JSON.stringify(mockPosts))

        const response = await titter.feed('user', mockLoggedUser.username)

        expect(response).toHaveLength(3)
      })

      test('should return following posts', async () => {
        const mockUsers = Array(20)
          .fill(null)
          .map(() => UserBuilder())
          .concat(mockLoggedUser)

        const mockPosts = mockUsers.map(user => PostBuilder({ user }))

        const userFollowingData = {
          [mockLoggedUser.id]: mockUsers.slice(0, 12).map(user => user.id)
        }

        localStorage.setItem('posts', JSON.stringify(mockPosts))
        localStorage.setItem('user_following', JSON.stringify(userFollowingData))

        const response = await titter.feed('following')

        expect(response).toHaveLength(12)
      })

      test('should return posts from search result', async () => {
        const mockUsers = Array(20)
          .fill(null)
          .map(() => UserBuilder())
          .concat(mockLoggedUser)

        const mockPosts = mockUsers
          .map(user => PostBuilder({ user }))
          .concat([
            PostBuilder({ user: mockUsers[5], body: 'mateus is a nice guy', kind: 'post' }),
            PostBuilder({ user: mockUsers[10], body: 'mateus is a nice guy', kind: 'post' })
          ])

        localStorage.setItem('posts', JSON.stringify(mockPosts))

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
      const userPostData = {
        [mockUser.id]: Array(10)
          .fill(null)
          .map(() => PostBuilder().id)
      }

      localStorage.setItem('user_following', JSON.stringify(userFollowingData))
      localStorage.setItem('user_followers', JSON.stringify(userFollowersData))
      localStorage.setItem('user_post', JSON.stringify(userPostData))

      const response = await titter.getUserProfile(mockUser.username)

      expect(response.username).toBe(mockUser.username)
      expect(response.showFollowButton).toBe(true)
      expect(response.loggedUserFollowProfile).toBe(false)
      expect(response.followingCount).toBe(4)
      expect(response.followersCount).toBe(8)
      expect(response.postsCount).toBe(10)
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
      const userPostData = {
        [mockLoggedUser.id]: Array(33)
          .fill(null)
          .map(() => PostBuilder().id)
      }

      localStorage.setItem('user_following', JSON.stringify(userFollowingData))
      localStorage.setItem('user_followers', JSON.stringify(userFollowersData))
      localStorage.setItem('user_post', JSON.stringify(userPostData))

      const response = await titter.getUserProfile(mockLoggedUser.username)

      expect(response.username).toBe(mockLoggedUser.username)
      expect(response.showFollowButton).toBe(false)
      expect(response.loggedUserFollowProfile).toBe(false)
      expect(response.followingCount).toBe(12)
      expect(response.followersCount).toBe(18)
      expect(response.postsCount).toBe(33)
    })
  })

  describe('when titter.follow is called', () => {
    test('should be follow an user', async () => {
      const mockUserToFollowing = UserBuilder()
      const mockLoggedUser = UserBuilder()

      const ramdomUserId = Array(5)
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

      localStorage.setItem('current_user', JSON.stringify(mockLoggedUser))
      localStorage.setItem('user_followers', JSON.stringify(userFollowersData))

      const response = await titter.follow(mockUserToFollowing.id)

      expect(localStorage.setItem).toHaveBeenNthCalledWith(3, 'user_followers', JSON.stringify(resultUserFollowers))
      expect(localStorage.setItem).toHaveBeenNthCalledWith(4, 'user_following', JSON.stringify(resultUserFollowing))
      expect(response).toBe('follow')
    })

    // test('should be unfollow', async () => {
    //   const mockUserToFollowing = UserBuilder()
    //   const mockLoggedUser = UserBuilder()

    //   const ramdomUserId = Array(5)
    //     .fill(null)
    //     .map(() => UserBuilder().id)

    //   const userFollowingData = {
    //     [mockUserToFollowing.id]: [mockLoggedUser.id, ...ramdomUserId]
    //   }

    //   const resultUserFollowing = {
    //     [mockUserToFollowing.id]: [...ramdomUserId]
    //   }

    //   localStorage.setItem('current_user', JSON.stringify(mockLoggedUser))
    //   localStorage.setItem('user_following', JSON.stringify(userFollowingData))

    //   const response = await titter.follow(mockUserToFollowing.id)

    //   expect(localStorage.setItem).toHaveBeenCalledWith('user_following', JSON.stringify(resultUserFollowing))
    //   expect(response).toBe('unfollow')
    // })
  })
})
