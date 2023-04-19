export type KindPost = 'post' | 'repost' | 'quote'
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
  postsCount: number
}

export interface Post {
  id: string
  createdAt: string
  user: Pick<User, 'id' | 'name' | 'username'>
  kind: KindPost
  body?: string
  referencedPost: Partial<Post>
}

export interface PostPayload extends Partial<Post> {}

export interface FeedPost extends Post {
  repost: { data: string[]; count: number }
  quote: { data: string[]; count: number }
  loggedUserQuoted: boolean
  loggedUserReposted: boolean
  sameUser: boolean
}
