'use client'

import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'next/navigation'

import { FilterType, Titter, TitterFeed, User } from '@/domains/platform/entities'
import storage from '@/domains/platform/services/storage'
import titter from '@/domains/platform/services/titter'

export interface FeedContextProps {
  fetchTitters: (filter: FilterType, search?: string) => void
  loading: boolean
  titters?: TitterFeed[]
  user?: User
}

const initialValues = {
  fetchTitters: () => undefined,
  loading: true,
  user: undefined,
  titters: []
}

export const FeedContext = createContext<FeedContextProps>(initialValues)

export function FeedProvider({ children }: { children: React.ReactNode }) {
  const searchParams = useSearchParams()

  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<User>()
  const [titters, setTitters] = useState<TitterFeed[]>()

  const filter = searchParams.get('filter')

  const fetchTitters = useCallback(async (filter: FilterType, search?: string) => {
    setLoading(true)

    const titters = await titter.feed(filter, user?.username, search)

    setTitters(titters)

    setLoading(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const filterType = filter
    if (filterType === 'all' || filterType === 'following') {
      fetchTitters(filterType)
    }
  }, [fetchTitters, filter, user])

  useEffect(() => {
    const loggedUser = storage.getItem<User>('current_user')

    if (loggedUser) {
      setUser(loggedUser)
      fetchTitters('all')
    }
  }, [fetchTitters])

  const providerValue: FeedContextProps = useMemo(
    () => ({ loading, fetchTitters, titters, user }),
    [fetchTitters, loading, titters, user]
  )

  return <FeedContext.Provider value={providerValue}>{children}</FeedContext.Provider>
}
