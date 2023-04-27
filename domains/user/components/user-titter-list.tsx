'use client'

import { TitterList } from '@/domains/feed/components/titter-list'
import { useFeedContext } from '@/domains/feed/context/feed-context'

export const UserTitterList = ({ username }: { username: string }) => {
  const { loadingTitters, titters } = useFeedContext()

  return <TitterList titters={titters} loadingTitters={loadingTitters} />
}
