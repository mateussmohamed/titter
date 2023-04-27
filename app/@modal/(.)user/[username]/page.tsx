'use client'

import React, { useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import { FeedProvider } from '@/domains/feed/context/feed-context'
import { UserInfo } from '@/domains/user/components/user-info'
import { UserTitterList } from '@/domains/user/components/user-titter-list'

export default function UserModal({ params }: { params: { username: string } }) {
  const [open, setOpen] = useState(true)
  const router = useRouter()

  const onDismiss = useCallback(() => {
    router.back()
  }, [router])

  const onKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onDismiss()
    },
    [onDismiss]
  )

  useEffect(() => {
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [onKeyDown])

  const handleDimiss = () => {
    setOpen(prev => !prev)
    onDismiss()
  }

  return (
    <Dialog open={open} onOpenChange={handleDimiss}>
      <DialogContent className="p-0 sm:max-w-2xl">
        <FeedProvider defaultUsername={params.username}>
          <UserInfo username={params?.username} />
          <Separator className="my-2" />
          <div className="h-[320px] overflow-y-auto">
            <UserTitterList username={params?.username} />
          </div>
        </FeedProvider>
      </DialogContent>
    </Dialog>
  )
}
