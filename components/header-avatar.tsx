'use client'

import { useState } from 'react'
import Link from 'next/link'

import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { User } from '@/domains/platform/entities'
import { useEffectOnce } from '@/domains/platform/lib/hooks'
import { abbreviation } from '@/domains/platform/lib/utils'
import storage from '@/domains/platform/services/storage'

export function HeaderAvatar() {
  const [user, setUser] = useState<User>()

  useEffectOnce(() => {
    setUser(storage.getItem<User>('current_user'))
  })

  return (
    <Link href={`/?profile=${user?.username}`} as={`/profile/${user?.username}`}>
      <Avatar className="cursor-pointer text-2xl text-gray-200">
        <AvatarFallback className="bg-slate-900">{abbreviation(user?.name)}</AvatarFallback>
      </Avatar>
    </Link>
  )
}
