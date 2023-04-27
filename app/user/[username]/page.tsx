'use client'

import { Separator } from '@/components/ui/separator'
import { FeedProvider } from '@/domains/feed/context/feed-context'
import { UserInfo } from '@/domains/user/components/user-info'
import { UserTitterList } from '@/domains/user/components/user-titter-list'

export default function UserPage({ params }: { params: { username: string } }) {
  return (
    <FeedProvider defaultUsername={params.username}>
      <div className="0 min-h-[inherit] pt-6" data-cy="user-info-home">
        <div className="container mx-auto flex max-w-2xl flex-col bg-white pb-6" data-cy="user-info-home">
          <UserInfo username={params?.username} />
          <Separator className="my-2" />
          <div className="overflow-auto">
            <UserTitterList username={params?.username} />
          </div>
        </div>
      </div>
    </FeedProvider>
  )
}
