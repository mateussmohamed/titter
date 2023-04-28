'use client'

import { useFeedContext } from '@/components/feed/feed-context'

import { TitterList } from '../feed/titter-list'

export const UserTitterList = ({ username }: { username: string }) => {
  const { loadingTitters, titters } = useFeedContext()

  return <TitterList titters={titters} loadingTitters={loadingTitters} />
}
