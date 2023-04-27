import { TitterBuilder } from '../builders/titter-builder'
import { UserBuilder } from '../builders/user-builder'
import { Titter, TitterPayload, User } from '../entities'
import storage, { StorageKyes } from '../services/storage'

import { Chance } from 'chance'

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

function insertTitter(payload: TitterPayload) {
  const titters = storage.getItem<Titter[]>('titters') || []
  const titter = TitterBuilder(payload)

  const newTitters = [...titters, titter]
  storage.setItem('titters', newTitters)

  storage.setValueToItemAtDocument('user_titter', payload!.user!.id, titter.id)

  if (titter?.referencedTitter?.id) {
    if (titter.kind === 'quote') {
      storage.setValueToItemAtDocument('user_quote', titter.referencedTitter!.id, titter.user!.id)
    }

    if (titter.kind === 'retitter') {
      storage.setValueToItemAtDocument('user_retitter', titter.referencedTitter!.id, titter.user!.id)
    }
  }

  return titter
}

function canPerist() {
  const storageKeys: StorageKyes[] = [
    'users',
    'titters',
    'current_user',
    'user_followers',
    'user_following',
    'user_followers',
    'user_titter',
    'user_quote',
    'user_retitter'
  ]
  return !storageKeys.some(key => storage.existItem(key))
}

export function seedGenerator() {
  if (typeof window !== 'undefined') {
    if (canPerist()) {
      try {
        const loggedUser = UserBuilder()
        const usersToPersist = [...generateArray(30).map(() => UserBuilder()), loggedUser].map(user => {
          storage.setItemAtDocument('users', user.id, user)
          return user
        })

        storage.setItem('current_user', loggedUser)

        const titterByUser = usersToPersist.map(user =>
          insertTitter({ kind: 'titter', user, referencedTitter: undefined })
        )

        const getRandomicTitter = (user: User) => {
          const filteredTitters = titterByUser.filter(titter => titter.user?.id !== user.id)
          const randomIndex = getRandomArbitrary(0, filteredTitters.length)
          return filteredTitters[randomIndex]
        }

        const addRandomicRetitters = (user: User) => {
          const referencedTitter = getRandomicTitter(user)
          const createdAt = addDays(new Date(referencedTitter?.createdAt), 1).toLocaleString()

          insertTitter({ user, referencedTitter, createdAt, kind: 'retitter', body: '' })
        }

        const addRandomicQuotes = (user: User) => {
          const referencedTitter = getRandomicTitter(user)
          const createdAt = addDays(new Date(referencedTitter?.createdAt), 1).toLocaleString()
          const chanceQuote = new Chance()
          insertTitter({
            user,
            referencedTitter,
            createdAt,
            kind: 'quote',
            body: chanceQuote.paragraph({ sentences: 2 })
          })
        }

        const firstUserGroup = usersToPersist.slice(0, 7)
        const secondUserGroup = usersToPersist.slice(8, 15)
        const thirdUserGroup = usersToPersist.slice(16, 22)

        firstUserGroup.forEach(addRandomicRetitters)
        secondUserGroup.forEach(addRandomicQuotes)
        thirdUserGroup.forEach(addRandomicRetitters)
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
