'use client'

import { memo } from 'react'

import { PostsProvider } from '../context/posts-context'

import { PostsFeed } from './posts-feed'

const Home = () => {
  return (
    <PostsProvider>
      <PostsFeed />
    </PostsProvider>
  )
}

export const PostsHome = memo(Home)
