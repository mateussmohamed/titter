'use client'

import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'next/navigation'

import { FeedPost, FilterType, User } from '@/domains/platform/entities'
import storage from '@/domains/platform/services/storage'
import titter from '@/domains/platform/services/titter'

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
  const searchParams = useSearchParams()

  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<User>()
  const [posts, setPosts] = useState<FeedPost[]>()

  const filter = searchParams.get('filter')

  const fetchPosts = useCallback(async (filter: FilterType, search?: string) => {
    setLoading(true)

    const posts = await titter.feed(filter, user?.username, search)

    setPosts(posts)

    setLoading(false)
  }, [])

  useEffect(() => {
    const filterType = filter
    if (filterType === 'all' || filterType === 'following') {
      fetchPosts(filterType)
    }
  }, [fetchPosts, filter, user])

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
