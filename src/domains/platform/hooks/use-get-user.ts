import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

import { User } from '../entities'
import storage from '../services/storage'
import titter from '../services/titter'

export const useGetUser = () => {
  const { query } = useRouter()

  const [user, setuser] = useState<User>()
  const [showWriterPost, toggleWriterPost] = useState(false)

  useEffect(() => {
    const username = (query?.profile || query?.username) as string
    const userFromStorage = storage.getItem<User>('current_user')

    if (username) {
      const foundedUser = titter.getUser(username)

      toggleWriterPost(userFromStorage?.username === username)

      return setuser(foundedUser)
    }
  }, [query?.profile, query?.username])

  return { user, showWriterPost }
}
