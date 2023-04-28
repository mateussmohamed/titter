'use client'

import { Avatar, AvatarFallback } from '@/components/ui/avatar'
// import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useUserInfo } from '@/components/user/use-user'
import { abbreviation } from '@/lib/utils'

import { Cake, Calendar, Loader2, MapPin } from 'lucide-react'

interface UserInfoProps {
  username: string
}

export function UserInfo({ username }: UserInfoProps) {
  const { userInfo, loadingUserInfo, loadingFollowUser, followUser } = useUserInfo(username)

  const handleFollow = () => followUser()

  return (
    <>
      <div
        className="flex h-[200px] flex-row items-center justify-between rounded-bl-[4px] rounded-br-[4px] bg-black/[.40] px-5"
        data-cy="user-info-home"
      >
        {loadingUserInfo ? (
          <Skeleton className=" h-[128px] w-[128px] rounded-full bg-slate-950" />
        ) : (
          <Avatar className="h-[128px] w-[128px]">
            <AvatarFallback className="bg-slate-950 text-4xl text-gray-200">
              {abbreviation(userInfo?.name)}
            </AvatarFallback>
          </Avatar>
        )}

        {loadingUserInfo ? (
          <Skeleton className="h-[40px] w-[80px] bg-slate-950" />
        ) : (
          userInfo?.showFollowButton && (
            <Button disabled={loadingFollowUser} onClick={handleFollow} data-cy="follow-btn" className="min-w-[80px]">
              {loadingFollowUser ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              {userInfo?.loggedUserFollowProfile ? 'unfollow' : 'follow'}
            </Button>
          )
        )}
      </div>

      <div className="flex w-full flex-col px-5">
        {loadingUserInfo ? (
          <>
            <Skeleton className="my-2 h-[40px] w-full bg-slate-200" />
            <Skeleton className="mb-1 h-[25px] w-full bg-slate-200" />
            <Skeleton className="mb-1 h-[25px] w-full bg-slate-200" />
            <div className="flex flex-row justify-center gap-2">
              <Skeleton className="h-[30px] w-[100px] bg-slate-200" />
              <Skeleton className="h-[30px] w-[100px] bg-slate-200" />
              <Skeleton className="h-[30px] w-[100px] bg-slate-200" />
            </div>
          </>
        ) : (
          <div className="my-2 flex flex-col items-start">
            <div className="flex w-full flex-row items-center justify-center gap-1">
              <span className="text-4xl text-slate-950">{userInfo?.name}</span>
              <span className="text-2xl text-slate-500">@{userInfo?.username}</span>
            </div>

            <p className="w-full flex-row py-2 text-center text-lg text-slate-500">{userInfo?.bio}</p>

            <div className="flex w-full flex-row items-center justify-center gap-5">
              <span className="flex items-center text-base text-slate-500">
                <MapPin className="mr-1 h-[18px] w-[18px] text-slate-950" />
                Living in {userInfo?.location}
              </span>
              <span className="flex items-center text-base text-slate-500">
                <Cake className="mr-1 h-[18px] w-[18px] text-slate-950" />
                Born in {userInfo?.birthday}
              </span>
              <span className="flex items-center text-base text-slate-500">
                <Calendar className="mr-1 h-[18px] w-[18px] text-slate-950" />
                Joined in {userInfo?.createdAt}
              </span>
            </div>

            <div className="flex w-full flex-row justify-center gap-2">
              <div className="flex flex-row gap-1">
                <span className="text-lg text-slate-950">{userInfo?.followingCount}</span>
                <span className="text-lg text-slate-500">Following</span>
              </div>
              <span className="text-lg text-black">•</span>
              <div className="flex flex-row gap-1">
                <span className="text-lg text-slate-950">{userInfo?.followersCount}</span>
                <span className="text-lg text-slate-500">Followers</span>
              </div>
              <span className="text-lg text-black">•</span>
              <div className="flex flex-row gap-1">
                <span className="text-lg text-slate-950">{userInfo?.tittersCount}</span>
                <span className="text-lg text-slate-500">Titters</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
