import { getDate } from './get-date'

import Chance from 'chance'

function validUsername(value: string) {
  const validLength = value.length >= 3 && value.length <= 15
  return /(?<=^|(?<=[^a-zA-Z0-9-_\.]))@([A-Za-z]+[A-Za-z0-9-_]+)/.test(value) && validLength
}

export function UserBuilder() {
  const ChanceUser = new Chance()

  const id = ChanceUser.hash({ length: 25 })
  const name = ChanceUser.name({ nationality: 'en' })
  const username = ChanceUser.twitter()
  const createdAt = ChanceUser.date(getDate()).toLocaleString()

  if (validUsername(username)) {
    return {
      id,
      name,
      username,
      createdAt
    }
  } else {
    throw new Error('Invalid username!')
  }
}
