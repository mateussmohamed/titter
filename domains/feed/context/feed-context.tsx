'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { useParams } from 'next/navigation'

import { useToast } from '@/components/ui/use-toast'
import { FilterType, TitterFeed, TitterPayload, User } from '@/domains/platform/entities'
import titterService from '@/domains/platform/services/titter'

export interface FeedContextProps {
  fetchTitters: (filter: FilterType, username?: string, search?: string) => void
  addNewTitter: (payload: TitterPayload) => void
  loadingTitters: boolean
  titters?: TitterFeed[]
  user?: User
}

const initialValues = {
  fetchTitters: () => undefined,
  addNewTitter: () => undefined,
  loadingTitters: true,
  user: undefined,
  titters: []
}

export const FeedContext = createContext<FeedContextProps>(initialValues)

export const useFeedContext = () => {
  const context = useContext(FeedContext)

  if (!context) {
    throw Error('No Feed context initilized!')
  }

  return context
}

export function FeedProvider({ children, defaultUsername }: { defaultUsername?: string; children: React.ReactNode }) {
  const [loadingTitters, setLoadingTitters] = useState(true)
  const [titters, setTitters] = useState<TitterFeed[]>()

  const { toast } = useToast()
  const params = useParams()

  const usernameFromQuery = defaultUsername ?? params.username
  const userFromStorage = titterService.getUser(usernameFromQuery)
  const currentUserName = (usernameFromQuery ?? userFromStorage?.username) as string
  const isMe = userFromStorage?.username && currentUserName && userFromStorage?.username === currentUserName
  const filterQuery = isMe ? 'me' : currentUserName ? 'user' : 'all'

  const fetchTitters = useCallback(
    async (_filter: FilterType = 'all', _username?: string, _search?: string) => {
      try {
        setLoadingTitters(true)
        const titters = await titterService.feed(_filter, _username, _search)
        setTitters(titters)
      } catch (error) {
        if (error instanceof Error) {
          toast({
            title: 'Oh no =(',
            description: error.message,
            variant: 'destructive',
            duration: 3000
          })
        }
      } finally {
        setLoadingTitters(false)
      }
    },
    [toast]
  )

  const addNewTitter = useCallback(
    async (payload: TitterPayload) => {
      try {
        await titterService.newTitter({
          kind: 'titter',
          ...payload,
          createdAt: new Date().toLocaleString()
        })
        fetchTitters(filterQuery, currentUserName)
      } catch (error) {
        if (error instanceof Error) {
          toast({
            title: 'Oh no =(',
            description: error.message,
            variant: 'destructive',
            duration: 3000
          })
        }
      }
    },
    [fetchTitters, filterQuery, toast, currentUserName]
  )

  useEffect(() => {
    fetchTitters(filterQuery, currentUserName)
  }, [fetchTitters, currentUserName, filterQuery])

  const providerValue: FeedContextProps = useMemo(
    () => ({ loadingTitters, titters, user: userFromStorage, addNewTitter, fetchTitters }),
    [addNewTitter, fetchTitters, loadingTitters, titters, userFromStorage]
  )

  return <FeedContext.Provider value={providerValue}>{children}</FeedContext.Provider>
}
