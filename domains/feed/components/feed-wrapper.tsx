'use client'

import { memo } from 'react'

import { useEffectOnce } from '@/domains/platform/lib/hooks'
import { seedGenerator } from '@/domains/platform/lib/seed-generator'

import { FeedProvider } from '../context/feed-context'

import { FeedContainer } from './feed-container'

const FeedWrapperComponent = () => {
  useEffectOnce(() => {
    seedGenerator()
  })

  return (
    <FeedProvider>
      <FeedContainer />
    </FeedProvider>
  )
}

export const FeedWrapper = memo(FeedWrapperComponent)
