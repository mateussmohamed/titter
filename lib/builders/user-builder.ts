import { formatDate } from '../format-date'

import { getDate } from './get-date'

import Chance from 'chance'

function validUsername(value: string) {
  return value.length >= 3 && value.length <= 15
}

export function UserBuilder() {
  const ChanceUser = new Chance()

  const id = ChanceUser.hash({ length: 25 })
  const name = ChanceUser.name({ nationality: 'en' })
  const username = ChanceUser.twitter()
  const createdAt = ChanceUser.date(getDate()) as Date
  const birthday = ChanceUser.date(
    getDate(Number(ChanceUser.year({ min: 1900, max: new Date().getFullYear() - 13 })))
  ) as Date

  const bio = ChanceUser.sentence()
  const location = `${ChanceUser.city()}, ${ChanceUser.country({ full: true })}`

  if (validUsername(username)) {
    return {
      id,
      name,
      bio,
      location,
      username: username.replace('@', ''),
      birthday: formatDate(birthday),
      createdAt: formatDate(createdAt)
    }
  } else {
    throw new Error('Invalid username!')
  }
}
