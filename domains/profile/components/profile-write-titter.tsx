'use client'

import { Fragment } from 'react'

import { Skeleton } from '@/components/ui/skeleton'
import { AddNewTitter } from '@/domains/feed/components/add-new-titter'

interface ProfileWriteTitterProps {
  showWriterTitter?: boolean
  loading?: boolean
  onWriteTitter: (body: string) => Promise<void>
}

export const ProfileWriteTitter = (props: ProfileWriteTitterProps) => {
  const { loading, showWriterTitter, onWriteTitter } = props

  if (loading) {
    return (
      <div className="px-5" data-cy="loading-profile-write">
        <Skeleton className="h-[80px] w-full" />
        <Skeleton className="h-[40px] w-full" />
      </div>
    )
  }

  return showWriterTitter ? <AddNewTitter /> : <Fragment />
}
