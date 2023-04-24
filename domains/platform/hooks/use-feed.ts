import { useCallback, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { useToast } from '@chakra-ui/react'

import { FeedPost, FilterType } from '../entities'
import titter from '../services/titter'

import { useGetUser } from './use-get-user'

interface useFeedProps {
  search?: string
}

export const useFeed = (props: useFeedProps = { search: '' }) => {
  const { search } = props
  const toast = useToast()
  const searchParams = useSearchParams()
  const { user, showWriterPost } = useGetUser()

  const [username, setUsername] = useState('')
  const [filterType, setFilter] = useState<FilterType>('all')
  const [loadingPosts, setLoadingPosts] = useState(true)
  const [posts, setPosts] = useState<FeedPost[]>()

  const fetchPosts = useCallback(
    async (_username: string, _filter: FilterType, _search?: string) => {
      try {
        setLoadingPosts(true)

        const posts = await titter.feed(_filter, _username, _search)

        setPosts(posts)
      } catch (error) {
        if (error instanceof Error) {
          toast({
            title: 'Oh no =(',
            description: error.message,
            status: 'error',
            duration: 3000,
            isClosable: true
          })
        }
      } finally {
        setLoadingPosts(false)
      }
    },
    [toast]
  )

  const writePost = async (body: string) => {
    try {
      setLoadingPosts(true)
      await titter.writePost({ body, kind: 'post', createdAt: new Date().toLocaleString() })

      fetchPosts(username, filterType, search)
    } catch (error) {
      if (error instanceof Error) {
        toast({
          title: 'Oh no =(',
          description: error.message,
          status: 'error',
          duration: 3000,
          isClosable: true
        })
      }
    } finally {
      setLoadingPosts(false)
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
  }, [fetchPosts, search, searchParams, user])

  useEffect(() => {
    if (username && filterType) {
      setUsername(username)
      setFilter(filterType as FilterType)
      fetchPosts(String(username), filterType as FilterType, search)
    }
  }, [fetchPosts, username, filterType, search])

  return { posts, loadingPosts, showWriterPost, fetchPosts, writePost }
}
