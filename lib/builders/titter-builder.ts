import type { TitterPayload } from '../../entities'

import { getDate } from './get-date'

import Chance from 'chance'

export function TitterBuilder(payload: TitterPayload = {}) {
  const ChanceTitter = new Chance()

  const {
    body = ChanceTitter.paragraph({ sentences: ChanceTitter.integer({ min: 1, max: 5 }) }),
    user,
    createdAt = ChanceTitter.date(getDate()).toLocaleString(),
    referencedTitter = undefined,
    kind = 'titter'
  } = payload

  return {
    id: ChanceTitter.hash({ length: 25 }),
    user,
    kind,
    body,
    referencedTitter,
    createdAt
  }
}
