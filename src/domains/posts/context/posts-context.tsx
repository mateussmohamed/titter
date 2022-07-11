import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/router'

import { FeedPost, FilterType, Post, User } from '~/domains/platform/entities'
import titter from '~/domains/platform/services/titter'
import storage from '~/domains/platform/services/storage'

export interface PostsContextProps {
  fetchPosts: (filter: FilterType, search?: string) => void
  loading: boolean
  posts?: FeedPost[]
  user?: User
}

const initialValues = {
  fetchPosts: () => undefined,
  loading: true,
  user: undefined,
  posts: []
}

export const PostsContext = createContext<PostsContextProps>(initialValues)

export function PostsProvider({ children }: { children: React.ReactNode }) {
  const { query } = useRouter()

  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<User>()
  const [posts, setPosts] = useState<FeedPost[]>()

  const fetchPosts = useCallback(async (filter: FilterType, search?: string) => {
    setLoading(true)

    const posts = await titter.feed(filter, user?.username, search)

    setPosts(posts)

    setLoading(false)
  }, [])

  useEffect(() => {
    const filterType = query?.filter
    if (filterType === 'all' || filterType === 'following') {
      fetchPosts(filterType)
    }
  }, [fetchPosts, query?.filter, user])

  useEffect(() => {
    const loggedUser = storage.getItem<User>('current_user')

    if (loggedUser) {
      setUser(loggedUser)
      fetchPosts('all')
    }
  }, [fetchPosts])

  const providerValue: PostsContextProps = useMemo(
    () => ({ loading, fetchPosts, posts, user }),
    [fetchPosts, loading, posts, user]
  )

  return <PostsContext.Provider value={providerValue}>{children}</PostsContext.Provider>
}
