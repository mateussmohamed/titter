import { Stack } from '@chakra-ui/react'

import { useFeed } from '~/domains/platform/hooks/use-feed'
import { useGetProfile } from '~/domains/platform/hooks/use-get-profile'
import { PostList } from '~/domains/posts/components/post-list'

import { ProfileData } from './profile-data'
import { ProfileWritePost } from './profile-write-post'

export const ProfileHome = () => {
  const { posts, loadingPosts, writePost, showWriterPost } = useFeed()
  const { loadingProfile, profile, getProfile, followUser } = useGetProfile()

  const handleFollow = () => followUser()

  const handleWritePost = async (body: string) => {
    writePost(body)
    getProfile()
  }

  return (
    <Stack direction="column" bg="white" data-cy="profile-home">
      <ProfileData loadingProfile={loadingProfile} profile={profile} handleFollow={handleFollow} />
      <Stack
        align="stretch"
        bg="white"
        direction="column"
        pb={10}
        boxShadow="0 1px 3px 0 rgb(0 0 0 / 10%), 0 1px 2px 0 rgb(0 0 0 / 6%)"
      >
        <ProfileWritePost onWritePost={handleWritePost} showWriterPost={showWriterPost} loading={loadingPosts} />
        <PostList posts={posts} loading={loadingPosts} />
      </Stack>
    </Stack>
  )
}
