import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'

import { User } from '../entities'
import storage from '../services/storage'
import titter from '../services/titter'

export const useGetUser = () => {
  const searchParams = useSearchParams()

  const [user, setuser] = useState<User>()
  const [showWriterTitter, toggleWriterTitter] = useState(false)

  useEffect(() => {
    const username = searchParams.get('profile') || searchParams.get('username')
    const userFromStorage = storage.getItem<User>('current_user')

    if (username) {
      const foundedUser = titter.getUser(username)

      toggleWriterTitter(userFromStorage?.username === username)

      return setuser(foundedUser)
    }
  }, [searchParams])

  return { user, showWriterTitter }
}
