'use client'

import { TitterList } from '@/domains/feed/components/titter-list'
import { useFeed } from '@/domains/platform/hooks/use-feed'
import { useGetProfile } from '@/domains/platform/hooks/use-get-profile'

import { ProfileData } from './profile-data'
import { ProfileWriteTitter } from './profile-write-titter'

export const ProfileHome = () => {
  const { loadingTitters, newTitter, showWriterTitter } = useFeed()
  const { loadingProfile, profile, getProfile, followUser } = useGetProfile()

  const handleFollow = () => followUser()

  const handleWriteTitter = async (body: string) => {
    newTitter(body)
    getProfile()
  }

  return (
    <div className="flex flex-col bg-white" data-cy="profile-home">
      <ProfileData loadingProfile={loadingProfile} profile={profile} handleFollow={handleFollow} />
      <div className="pb 10 flex flex-col items-stretch bg-white shadow-md">
        <ProfileWriteTitter
          onWriteTitter={handleWriteTitter}
          showWriterTitter={showWriterTitter}
          loading={loadingTitters}
        />
        <TitterList />
      </div>
    </div>
  )
}
