import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react'

import { FeedPost } from '~/domains/platform/entities'
import titter from '~/domains/platform/services/titter'

export interface ProfilePostsContextProps {
  fetchPosts?: () => void
  loadingPosts: boolean
  posts?: FeedPost[]
}

const initialValues: ProfilePostsContextProps = {
  loadingPosts: true,
  posts: []
}

export const ProfilePostsContext = createContext(initialValues)

export function ProfilePostsProvider({ children, username }: { username: string; children: React.ReactNode }) {
  const [loadingPosts, setLoadingPosts] = useState(true)
  const [posts, setPosts] = useState<FeedPost[]>([])

  const fetchPosts = useCallback(async () => {
    setLoadingPosts(true)

    const posts = await titter.feed('user', username)

    setPosts(posts)

    setLoadingPosts(false)
  }, [username])

  useEffect(() => {
    fetchPosts()
  }, [fetchPosts, username])

  const providerValue: ProfilePostsContextProps = useMemo(
    () => ({ fetchPosts, loadingPosts, posts }),
    [fetchPosts, loadingPosts, posts]
  )

  return <ProfilePostsContext.Provider value={providerValue}>{children}</ProfilePostsContext.Provider>
}
