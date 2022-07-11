import { PostBuilder } from '../builders/post-builder'
import { MAXIMUM_BODY_LENGTH, MAXIMUM_POSTS_PER_DAY } from '../constants'
import { FeedPost, FilterType, Post, PostPayload, Profile, User } from '../entities'
import { formatDate } from '../helpers/format-date'

import storage from './storage'

const datesAreOnSameDay = (first: Date, second: Date) =>
  first.getFullYear() === second.getFullYear() &&
  first.getMonth() === second.getMonth() &&
  first.getDate() === second.getDate()

const postControlValidation = (posts: Post[], userId: string) => {
  const today = new Date()

  const userPost = posts.filter(post => post.user.id === userId)
  const postsFromToday = userPost.filter(post => datesAreOnSameDay(today, new Date(post.createdAt)))
  return postsFromToday.length >= MAXIMUM_POSTS_PER_DAY
}

const postBodyValidation = (payload: PostPayload) => {
  return payload.kind !== 'repost' && (payload.body || '').length > MAXIMUM_BODY_LENGTH
}

const writePost = (payload: PostPayload) =>
  new Promise((resolve, reject) => {
    setTimeout(() => {
      if (postBodyValidation(payload)) {
        return reject(new Error('the post reached the maximum amount of characters.'))
      }

      const loggedUser = storage.getItem<User>('current_user')

      if (loggedUser?.id) {
        const posts = storage.getItem<Post[]>('posts') || []

        if (postControlValidation(posts, loggedUser.id)) {
          return reject(new Error('you exceeded the post limit for the day.'))
        }

        let post = PostBuilder({ ...payload, user: loggedUser })

        if (payload?.referencedPost?.id && payload?.referencedPost?.user) {
          post = {
            ...post,
            referencedPost: {
              ...payload?.referencedPost,
              user: {
                id: payload?.referencedPost?.user.id,
                name: payload?.referencedPost?.user.name,
                username: payload?.referencedPost?.user.username
              }
            }
          }

          if (post.kind === 'quote' && payload.referencedPost) {
            storage.setValueToItemAtDocument('user_quote', payload?.referencedPost?.id, loggedUser.id)
          }

          if (post.kind === 'repost' && payload.referencedPost) {
            storage.setValueToItemAtDocument('user_repost', payload?.referencedPost?.id, loggedUser.id)
          }
        }

        const newPosts = [...posts, post]

        storage.setValueToItemAtDocument('user_post', loggedUser.id, post.id)
        storage.setItem('posts', newPosts)

        return resolve(post)
      }
    }, 500)
  })

const follow = (userId: string) =>
  new Promise(resolve => {
    setTimeout(() => {
      const loggedUser = storage.getItem<User>('current_user')

      const loggedUserFollowUserId = storage
        .getValueToItemCollection('user_followers', userId)
        ?.includes(loggedUser!.id)

      if (loggedUserFollowUserId) {
        storage.removeValueItemAtDocument('user_followers', userId, loggedUser!.id)
        storage.removeValueItemAtDocument('user_following', loggedUser!.id, userId)
        return resolve('unfollow')
      } else {
        storage.setValueToItemAtDocument('user_followers', userId, loggedUser!.id)
        storage.setValueToItemAtDocument('user_following', loggedUser!.id, userId)
        return resolve('follow')
      }
    }, 500)
  })

const sortPost = (a: Post, b: Post) => {
  const aTime = new Date(a.createdAt).getTime()
  const bTime = new Date(b.createdAt).getTime()

  return bTime - aTime
}

const postDateFormate: Intl.DateTimeFormatOptions = {
  day: 'numeric',
  month: 'short',
  hour: 'numeric',
  minute: 'numeric'
}

const enhancedPost = (userId: string) => {
  return (post: Post) => {
    const quoteData = storage.getDocument('user_quote', post.id)
    const repostData = storage.getDocument('user_repost', post.id)

    return {
      ...post,
      referencedPost: {
        ...post.referencedPost,
        createdAt: formatDate(new Date(post.createdAt), postDateFormate)
      },
      createdAt: formatDate(new Date(post.createdAt), postDateFormate),
      quote: quoteData,
      repost: repostData,
      sameUser: userId === post.user.id,
      loggedUserQuoted: Boolean(quoteData.data.find(item => item === userId)),
      loggedUserReposted: Boolean(repostData.data.find(item => item === userId))
    }
  }
}

const filterByFollowing = (posts: Post[], userId: string) => {
  const followingData = storage.getDocument('user_following', userId)

  return posts.filter(post => Boolean(followingData.data?.find(item => item === post.user.id))).sort(sortPost)
}

const sortAndEnchancedPost = (posts: Post[], userId: string) => {
  return posts.sort(sortPost).map(enhancedPost(userId))
}

const feed = (filter: FilterType = 'all', username?: string, searchTerm?: string) =>
  new Promise<FeedPost[]>(resolve => {
    setTimeout(() => {
      const posts = storage.getItem<Post[]>('posts') || []
      const loggedUser = storage.getItem<User>('current_user')

      if (loggedUser?.id) {
        if (searchTerm) {
          const searchTermInLowerCase = searchTerm.toLowerCase()
          const allPosts = posts
            .filter(post => post.kind !== 'repost')
            .filter(post => post.body?.toLowerCase().includes(searchTermInLowerCase))

          return resolve(sortAndEnchancedPost(allPosts, loggedUser.id))
        }

        if (filter === 'user' && username) {
          const mePosts = sortAndEnchancedPost(
            posts.filter(post => post.user.username === username),
            loggedUser.id
          )

          return resolve(mePosts)
        }

        if (filter === 'following') {
          const followingPosts = sortAndEnchancedPost(filterByFollowing(posts, loggedUser.id), loggedUser.id)

          return resolve(followingPosts)
        }

        return resolve(sortAndEnchancedPost(posts, loggedUser.id))
      }
    }, 500)
  })

const getUser = (username: string) => {
  const users = storage.getItem<Record<string, User>>('users') || {}
  const foundedUser = Object.values(users).find(user => user.username === username)

  return foundedUser
}

const getUserProfile = (username: string) =>
  new Promise<Profile>((resolve, reject) => {
    setTimeout(() => {
      const userProfile = getUser(username)

      if (!userProfile) {
        return reject(new Error('user not found!'))
      }

      const loggedUser = storage.getItem<User>('current_user')

      if (userProfile?.id && userProfile.createdAt && loggedUser) {
        const followersData = storage.getDocument('user_followers', userProfile.id)
        const followingData = storage.getDocument('user_following', userProfile.id)
        const postingsData = storage.getDocument('user_post', userProfile.id)

        const showFollowButton = loggedUser?.username !== username
        const loggedUserFollowProfile = followersData.data.includes(loggedUser.id)
        const profileFollowLoggedUser = followingData.data.includes(loggedUser.id)

        const data = {
          ...userProfile,
          createdAt: formatDate(new Date(userProfile.createdAt)),
          showFollowButton,
          loggedUserFollowProfile,
          profileFollowLoggedUser,
          followersCount: followersData.count,
          followingCount: followingData.count,
          postsCount: postingsData.count
        }

        resolve(data)
      }
    }, 500)
  })

const titter = { writePost, feed, getUserProfile, getUser, follow }

export default titter
