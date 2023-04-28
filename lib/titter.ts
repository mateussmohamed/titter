import type { FilterType, Profile, Titter, TitterFeed, TitterPayload, User } from '@/entities'

import { TitterBuilder } from './builders/titter-builder'
import { MAXIMUM_BODY_LENGTH, MAXIMUM_POSTS_PER_DAY } from './constants'
import { formatDate } from './format-date'
import { storageService } from './storage'

const datesAreOnSameDay = (first: Date, second: Date) =>
  first.getFullYear() === second.getFullYear() &&
  first.getMonth() === second.getMonth() &&
  first.getDate() === second.getDate()

const titterControlValidation = (titters: Titter[], userId: string) => {
  const today = new Date()

  const userTitter = titters.filter(titter => titter.user.id === userId)
  const tittersFromToday = userTitter.filter(titter => datesAreOnSameDay(today, new Date(titter.createdAt)))
  return tittersFromToday.length >= MAXIMUM_POSTS_PER_DAY
}

const titterBodyValidation = (payload: TitterPayload) => {
  return payload.kind !== 'retitter' && (payload.body || '').length > MAXIMUM_BODY_LENGTH
}

const newTitter = (payload: TitterPayload) =>
  new Promise((resolve, reject) => {
    setTimeout(() => {
      if (titterBodyValidation(payload)) {
        return reject(new Error('the titter reached the maximum amount of characters.'))
      }

      const loggedUser = storageService.getItem<User>('current_user')

      if (loggedUser?.id) {
        const titters = storageService.getItem<Titter[]>('titters') || []

        if (titterControlValidation(titters, loggedUser.id)) {
          return reject(new Error('you exceeded the titter limit for the day.'))
        }

        let titter = TitterBuilder({ ...payload, user: loggedUser })

        if (payload?.referencedTitter?.id && payload?.referencedTitter?.user) {
          titter = {
            ...titter,
            referencedTitter: {
              ...payload?.referencedTitter,
              user: {
                id: payload?.referencedTitter?.user.id,
                name: payload?.referencedTitter?.user.name,
                username: payload?.referencedTitter?.user.username
              }
            }
          }

          if (titter.kind === 'quote' && payload.referencedTitter) {
            storageService.setValueToItemAtDocument('user_quote', payload?.referencedTitter?.id, loggedUser.id)
          }

          if (titter.kind === 'retitter' && payload.referencedTitter) {
            storageService.setValueToItemAtDocument('user_retitter', payload?.referencedTitter?.id, loggedUser.id)
          }
        }

        const newTitters = [...titters, titter]

        storageService.setValueToItemAtDocument('user_titter', loggedUser.id, titter.id)
        storageService.setItem('titters', newTitters)

        return resolve(titter)
      }
    }, 1000)
  })

const follow = (userId: string) =>
  new Promise(resolve => {
    setTimeout(() => {
      const loggedUser = storageService.getItem<User>('current_user')

      const loggedUserFollowUserId = storageService
        .getValueToItemCollection('user_followers', userId)
        ?.includes(loggedUser!.id)

      if (loggedUserFollowUserId) {
        storageService.removeValueItemAtDocument('user_followers', userId, loggedUser!.id)
        storageService.removeValueItemAtDocument('user_following', loggedUser!.id, userId)
        return resolve('unfollow')
      } else {
        storageService.setValueToItemAtDocument('user_followers', userId, loggedUser!.id)
        storageService.setValueToItemAtDocument('user_following', loggedUser!.id, userId)
        return resolve('follow')
      }
    }, 200)
  })

const sortTitter = (a: Titter, b: Titter) => {
  const aTime = new Date(a.createdAt).getTime()
  const bTime = new Date(b.createdAt).getTime()

  return bTime - aTime
}

const titterDateFormate: Intl.DateTimeFormatOptions = {
  day: 'numeric',
  month: 'short',
  hour: 'numeric',
  minute: 'numeric'
}

const enhancedTitter = (loggedUserId: string) => {
  return (titter: Titter) => {
    const quoteData = storageService.getDocument('user_quote', titter.id)
    const retitterData = storageService.getDocument('user_retitter', titter.id)

    return {
      ...titter,
      referencedTitter: {
        ...titter.referencedTitter,
        createdAt: formatDate(new Date(titter.createdAt), titterDateFormate)
      },
      createdAt: formatDate(new Date(titter.createdAt), titterDateFormate),
      quote: quoteData,
      retitter: retitterData,
      sameUser: loggedUserId === titter.user.id,
      loggedUserQuoted: Boolean(quoteData.data.find(item => item === loggedUserId)),
      loggedUserRetittered: Boolean(retitterData.data.find(item => item === loggedUserId))
    }
  }
}

const filterByFollowing = (titters: Titter[], loggedUserId: string) => {
  const followingData = storageService.getDocument('user_following', loggedUserId)

  return titters.filter(titter => Boolean(followingData.data?.find(item => item === titter.user.id))).sort(sortTitter)
}

const sortAndEnchancedTitter = (titters: Titter[], loggedUserId: string) => {
  return titters.sort(sortTitter).map(enhancedTitter(loggedUserId))
}

const feed = (filter: FilterType = 'all', username?: string, searchTerm?: string) =>
  new Promise<TitterFeed[]>(resolve => {
    setTimeout(() => {
      const titters = storageService.getItem<Titter[]>('titters') || []
      const loggedUser = storageService.getItem<User>('current_user')

      if (loggedUser?.id) {
        if (searchTerm) {
          const searchTermInLowerCase = searchTerm.toLowerCase()
          const allTitters = titters
            .filter(titter => titter.kind !== 'retitter')
            .filter(titter => titter.body?.toLowerCase().includes(searchTermInLowerCase))

          return resolve(sortAndEnchancedTitter(allTitters, loggedUser.id))
        }

        if (['user', 'me'].includes(filter) && username) {
          const meTitters = sortAndEnchancedTitter(
            titters.filter(titter => titter.user.username === username),
            loggedUser.id
          )

          return resolve(meTitters)
        }

        if (filter === 'following') {
          const followingTitters = sortAndEnchancedTitter(filterByFollowing(titters, loggedUser.id), loggedUser.id)

          return resolve(followingTitters)
        }

        return resolve(sortAndEnchancedTitter(titters, loggedUser.id))
      }
    }, 1000)
  })

const getUser = (username: string) => {
  const users = storageService.getItem<Record<string, User>>('users') || {}
  const foundedUser = Object.values(users).find(user => user.username === username)

  return foundedUser
}

const getLoggedUser = () => {
  return storageService.getItem<User>('current_user')
}

const getUserProfile = (username: string) =>
  new Promise<Profile>((resolve, reject) => {
    setTimeout(() => {
      const userProfile = getUser(username)

      if (!userProfile) {
        return reject(new Error('user not found!'))
      }

      const loggedUser = storageService.getItem<User>('current_user')

      if (userProfile?.id && userProfile.createdAt && loggedUser) {
        const followersData = storageService.getDocument('user_followers', userProfile.id)
        const followingData = storageService.getDocument('user_following', userProfile.id)
        const titteringsData = storageService.getDocument('user_titter', userProfile.id)

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
          tittersCount: titteringsData.count
        }

        resolve(data)
      }
    }, 1000)
  })

export const titterService = { newTitter, feed, follow, getUserProfile, getUser, getLoggedUser }
