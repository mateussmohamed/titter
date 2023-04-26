import { useCallback, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'

import { useToast } from '@/components/ui/use-toast'

import { FilterType, Titter } from '../entities'
import titter from '../services/titter'

import { useGetUser } from './use-get-user'

interface useFeedProps {
  search?: string
}

export const useFeed = (props: useFeedProps = { search: '' }) => {
  const { search } = props
  const { toast } = useToast()
  const searchParams = useSearchParams()
  const { user, showWriterTitter } = useGetUser()

  const [username, setUsername] = useState('')
  const [filterType, setFilter] = useState<FilterType>('all')
  const [loadingTitters, setLoadingTitters] = useState(true)
  const [titters, setTitters] = useState<Titter[]>()

  const fetchTitters = useCallback(
    async (_username: string, _filter: FilterType, _search?: string) => {
      try {
        setLoadingTitters(true)

        const titters = await titter.feed(_filter, _username, _search)

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

  const newTitter = async (body: string) => {
    try {
      setLoadingTitters(true)
      await titter.newTitter({ body, kind: 'titter', createdAt: new Date().toLocaleString() })

      fetchTitters(username, filterType, search)
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
  }

  useEffect(() => {
    const filterQuery = searchParams.get('filter')
    const usernameFromQuery = searchParams.get('profile') || searchParams.get('username')
    const username = (usernameFromQuery || user?.username) as string
    const filterType = usernameFromQuery ? 'user' : filterQuery

    if (username && filterType) {
      setUsername(username)
      setFilter(filterType as FilterType)
    }
  }, [fetchTitters, search, searchParams, user])

  useEffect(() => {
    if (username && filterType) {
      setUsername(username)
      setFilter(filterType as FilterType)
      fetchTitters(String(username), filterType as FilterType, search)
    }
  }, [fetchTitters, username, filterType, search])

  return { titters, loadingTitters, showWriterTitter, fetchTitters, newTitter }
}
