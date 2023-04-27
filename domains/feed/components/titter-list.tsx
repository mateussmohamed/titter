'use client'

import { Fragment, useMemo } from 'react'

import { Separator } from '@/components/ui/separator'
import { TitterFeed } from '@/domains/platform/entities'

import { TitterCard } from './titter-card'
import { TitterListSkeleton } from './titter-list-skeleton'

interface TitterListProps {
  loadingTitters?: boolean
  titters?: TitterFeed[]
}

export const TitterList = ({ loadingTitters, titters }: TitterListProps) => {
  const hasTitters = Boolean(titters?.length)
  const lastIndex = useMemo(() => (titters || [])?.length - 1, [titters])

  if (loadingTitters) {
    return <TitterListSkeleton />
  }

  if (!hasTitters && loadingTitters === false) {
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
