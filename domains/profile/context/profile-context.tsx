'use client'

import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react'

import { Titter } from '@/domains/platform/entities'
import titter from '@/domains/platform/services/titter'

export interface ProfileTittersContextProps {
  fetchTitters?: () => void
  loadingTitters: boolean
  titters?: Titter[]
}

const initialValues: ProfileTittersContextProps = {
  loadingTitters: true,
  titters: []
}

export const ProfileTittersContext = createContext(initialValues)

export function ProfileTittersProvider({ children, username }: { username: string; children: React.ReactNode }) {
  const [loadingTitters, setLoadingTitters] = useState(true)
  const [titters, setTitters] = useState<Titter[]>([])

  const fetchTitters = useCallback(async () => {
    setLoadingTitters(true)

    const titters = await titter.feed('user', username)

    setTitters(titters)

    setLoadingTitters(false)
  }, [username])

  useEffect(() => {
    fetchTitters()
  }, [fetchTitters, username])

  const providerValue: ProfileTittersContextProps = useMemo(
    () => ({ fetchTitters, loadingTitters, titters }),
    [fetchTitters, loadingTitters, titters]
  )

  return <ProfileTittersContext.Provider value={providerValue}>{children}</ProfileTittersContext.Provider>
}
