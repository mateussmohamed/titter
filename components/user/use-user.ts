import { useState } from 'react'
import { useParams } from 'next/navigation'

import { useToast } from '@/components/ui/use-toast'
import { Profile } from '@/entities'
import { titterService } from '@/lib/titter'
import { useEffectOnce } from '@/lib/utils'

export const useUserInfo = (usernameFromParam?: string) => {
  const { toast } = useToast()

  const [userInfo, setUserInfo] = useState<Profile>()
  const [loadingUserInfo, setLoadingUserInfo] = useState(true)
  const [loadingFollowUser, setLoadingFollowUser] = useState(false)

  const params = useParams()
  const username = usernameFromParam ?? params.username

  const user = titterService.getUser(username)

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const loadUserInfo = async (showLoading = false) => {
    try {
      showLoading && setLoadingUserInfo(true)
      const userInfoData = await titterService.getUserProfile(user!.username)
      setUserInfo(userInfoData)
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
      showLoading && setLoadingUserInfo(false)
    }
  }

  const followUser = async () => {
    try {
      setLoadingFollowUser(true)
      await titterService.follow(user!.id)
      await loadUserInfo(false)
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
      setLoadingFollowUser(false)
    }
  }

  useEffectOnce(() => {
    loadUserInfo(true)
  })

  return { user, userInfo, loadingUserInfo, loadingFollowUser, followUser }
}
