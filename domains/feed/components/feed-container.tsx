'use client'

import { AddNewTitter } from './add-new-titter'
import { FeedFilter } from './feed-filter'
import { TitterList } from './titter-list'

export function FeedContainer() {
  return (
    <div className="mx-auto max-w-2xl pt-6">
      <div className="mx-auto max-w-2xl pt-6">
        <div className="mb-6 rounded-md bg-white py-5 shadow-md">
          <AddNewTitter />
        </div>

        <div className="flex flex-col items-stretch rounded-md bg-white shadow-md">
          <FeedFilter />
          <TitterList />
        </div>
      </div>
    </div>
  )
}
