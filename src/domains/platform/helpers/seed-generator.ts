import { Chance } from 'chance'

import { PostBuilder } from '../builders/post-builder'
import { UserBuilder } from '../builders/user-builder'
import { Post, PostPayload, User } from '../entities'
import storage, { StorageKyes } from '../services/storage'

function getRandomArbitrary(min: number, max: number) {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min) + min)
}

function generateArray(max: number) {
  return Array(max).fill(null)
}

function addDays(date: Date, days: number) {
  date.setDate(date.getDate() + days)

  return date
}

function insertPost(payload: PostPayload) {
  const posts = storage.getItem<Post[]>('posts') || []
  const post = PostBuilder(payload)

  const newPosts = [...posts, post]
  storage.setItem('posts', newPosts)

  storage.setValueToItemAtDocument('user_post', payload!.user!.id, post.id)

  if (post?.referencedPost?.id) {
    if (post.kind === 'quote') {
      storage.setValueToItemAtDocument('user_quote', post.referencedPost!.id, post.user!.id)
    }

    if (post.kind === 'repost') {
      storage.setValueToItemAtDocument('user_repost', post.referencedPost!.id, post.user!.id)
    }
  }

  return post
}

function canPerist() {
  const storageKeys: StorageKyes[] = [
    'users',
    'posts',
    'current_user',
    'user_followers',
    'user_following',
    'user_followers',
    'user_post',
    'user_quote',
    'user_repost'
  ]
  return !storageKeys.some(key => storage.existItem(key))
}

export function seedGenerator() {
  if (typeof window !== 'undefined') {
    if (canPerist()) {
      try {
        const loggedUser = UserBuilder()
        const usersToPersist = [...generateArray(20).map(() => UserBuilder()), loggedUser].map(user => {
          storage.setItemAtDocument('users', user.id, user)
          return user
        })

        storage.setItem('current_user', loggedUser)

        const postByUser = usersToPersist.map(user => insertPost({ kind: 'post', user, referencedPost: undefined }))

        const getRandomicPost = (user: User) => {
          const filteredPosts = postByUser.filter(post => post.user?.id !== user.id)
          const randomIndex = getRandomArbitrary(0, filteredPosts.length)
          return filteredPosts[randomIndex] as Post
        }

        const addRandomicReposts = (user: User) => {
          const referencedPost = getRandomicPost(user)
          const createdAt = addDays(new Date(referencedPost?.createdAt), 1).toLocaleString()

          insertPost({ user, referencedPost, createdAt, kind: 'repost', body: '' })
        }

        const addRandomicQuotes = (user: User) => {
          const referencedPost = getRandomicPost(user)
          const createdAt = addDays(new Date(referencedPost?.createdAt), 1).toLocaleString()
          const chanceQuote = new Chance()

          insertPost({ user, referencedPost, createdAt, kind: 'quote', body: chanceQuote.paragraph({ sentences: 2 }) })
        }

        const firstUserGroup = usersToPersist.slice(0, 4)
        const secondUserGroup = usersToPersist.slice(5, 9)
        const thirdUserGroup = usersToPersist.slice(10, 19)

        firstUserGroup.forEach(addRandomicReposts)
        secondUserGroup.forEach(addRandomicQuotes)
        thirdUserGroup.forEach(addRandomicReposts)
        thirdUserGroup.forEach(addRandomicQuotes)

        const setFollowersAndFollowing = (user: User) => {
          const filteredUsers = usersToPersist.filter(u => u.id !== user.id).map(u => u.id)
          const filteredLength = filteredUsers.length

          const ramdomFollowersNumber = getRandomArbitrary(0, filteredLength)
          generateArray(ramdomFollowersNumber).forEach(() =>
            storage.setValueToItemAtDocument(
              'user_followers',
              String(user.id),
              filteredUsers[getRandomArbitrary(0, filteredLength)]
            )
          )

          const ramdomFollowingNumber = getRandomArbitrary(0, filteredLength)
          generateArray(ramdomFollowingNumber).forEach(() =>
            storage.setValueToItemAtDocument(
              'user_following',
              String(user.id),
              filteredUsers[getRandomArbitrary(0, filteredLength)]
            )
          )
        }

        setFollowersAndFollowing(loggedUser)

        usersToPersist.forEach(setFollowersAndFollowing)
      } catch (error) {
        console.log(error)
      }
    }
  }
}
