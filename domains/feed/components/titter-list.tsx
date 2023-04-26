'use client'

import { Fragment, useContext, useMemo } from 'react'

import { Separator } from '@/components/ui/separator'
import { Titter } from '@/domains/platform/entities'

import { FeedContext } from '../context/feed-context'

import { TitterCard } from './titter-card'
import { TitterListSkeleton } from './titter-list-skeleton'

export const TitterList = () => {
  const { loading, titters } = useContext(FeedContext)

  const hasTitters = Boolean(titters?.length)
  const lastIndex = useMemo(() => (titters || [])?.length - 1, [titters])

  if (loading) {
    return <TitterListSkeleton />
  }

  if (!hasTitters && loading === false) {
    return (
      <div className="p-20">
        <p className="text-center text-4xl">No Data</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col pb-2">
      {titters?.map((titter, index) => (
        <Fragment key={titter.id}>
          <TitterCard titter={titter} />
          {index === lastIndex ? null : <Separator className="my-2" />}
        </Fragment>
      ))}
    </div>
  )
}
