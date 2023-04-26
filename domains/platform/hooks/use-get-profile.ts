import { useEffect, useState } from 'react'

import { useToast } from '@/components/ui/use-toast'

import { Profile } from '../entities'
import titter from '../services/titter'

import { useGetUser } from './use-get-user'

export const useGetProfile = () => {
  const { user } = useGetUser()
  const { toast } = useToast()

  const [profile, setProfile] = useState<Profile>()
  const [loadingProfile, setLoading] = useState(true)

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const getProfile = async () => {
    try {
      setLoading(true)
      const profileData = await titter.getUserProfile(user!.username)
      setProfile(profileData)
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
      setLoading(false)
    }
  }

  const followUser = async () => {
    try {
      setLoading(true)

      await titter.follow(profile!.id)

      await getProfile()
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
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user && !profile) {
      getProfile()
    }
  }, [getProfile, profile, user])

  return { profile, loadingProfile, getProfile, followUser }
}
