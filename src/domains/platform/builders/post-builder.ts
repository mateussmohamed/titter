import Chance from 'chance'

import { PostPayload } from '../entities'

import { getDate } from './get-date'

export function PostBuilder(payload: PostPayload = {}) {
  const ChancePost = new Chance()

  const {
    body = ChancePost.paragraph({ sentences: ChancePost.integer({ min: 1, max: 5 }) }),
    user,
    createdAt = ChancePost.date(getDate()).toLocaleString(),
    referencedPost = undefined,
    kind = 'post'
  } = payload

  return {
    id: ChancePost.hash({ length: 25 }),
    user,
    kind,
    body,
    referencedPost,
    createdAt
  }
}
