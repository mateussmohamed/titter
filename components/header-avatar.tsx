'use client'

import { useState } from 'react'
import Link from 'next/link'

import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import type { User } from '@/entities'
import { titterService } from '@/lib/titter'
import { useEffectOnce } from '@/lib/utils'
import { abbreviation } from '@/lib/utils'

export function HeaderAvatar() {
  const [user, setUser] = useState<User>()

  useEffectOnce(() => {
    setUser(titterService.getLoggedUser())
  })

  return (
    <Link href={`/user/${user?.username}`}>
      <Avatar className="cursor-pointer text-2xl text-gray-200">
        <AvatarFallback className="bg-slate-950">{abbreviation(user?.name)}</AvatarFallback>
      </Avatar>
    </Link>
  )
}
