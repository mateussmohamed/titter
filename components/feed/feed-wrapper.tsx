'use client'

import { memo } from 'react'

import { seedGenerator } from '@/lib/seed-generator'
import { useEffectOnce } from '@/lib/utils'

import { FeedContainer } from './feed-container'
import { FeedProvider } from './feed-context'

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
