export type KindTitter = 'titter' | 'retitter' | 'quote'
export type FilterType = 'all' | 'following' | 'user'

export interface User {
  id: string
  name: string
  username: string
  createdAt: string
}

export interface Profile extends User {
  showFollowButton: boolean
  loggedUserFollowProfile: boolean
  profileFollowLoggedUser: boolean
  followersCount: number
  followingCount: number
  tittersCount: number
}

export interface Titter {
  id: string
  createdAt: string
  user: Pick<User, 'id' | 'name' | 'username'>
  kind: KindTitter
  body?: string
  referencedTitter: Partial<Titter>
}

export interface TitterPayload extends Partial<Titter> {}

export interface TitterFeed extends Titter {
  retitter: { data: string[]; count: number }
  quote: { data: string[]; count: number }
  loggedUserQuoted: boolean
  loggedUserRetittered: boolean
  sameUser: boolean
}
