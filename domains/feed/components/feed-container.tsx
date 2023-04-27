'use client'

// import { useFeed } from '@/domains/platform/hooks/use-feed'

import { useFeedContext } from '../context/feed-context'

import { AddNewTitter } from './add-new-titter'
import { FeedFilter } from './feed-filter'
import { TitterList } from './titter-list'

export function FeedContainer() {
  const { titters, loadingTitters } = useFeedContext()
  return (
    <div className="mx-auto max-w-2xl pt-6">
      <div className="mb-6 rounded-md bg-white py-6 shadow-md">
        <AddNewTitter />
      </div>

      <div className="flex flex-col items-stretch rounded-md bg-white pb-6 shadow-md">
        <FeedFilter />
        <TitterList titters={titters} loadingTitters={loadingTitters} />
      </div>
    </div>
  )
}
