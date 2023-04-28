'use client'

import { FeedProvider } from '@/components/feed/feed-context'
import { Separator } from '@/components/ui/separator'

import { UserInfo } from '../../../components/user/user-info'
import { UserTitterList } from '../../../components/user/user-titter-list'

export default function UserPage({ params }: { params: { username: string } }) {
  return (
    <FeedProvider defaultUsername={params.username}>
      <div className="0 min-h-[inherit] pt-6" data-cy="profile-home">
        <div className="container mx-auto flex min-h-screen max-w-2xl flex-col bg-white pb-6">
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
