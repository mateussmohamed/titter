'use client'

import { Center, Skeleton, SkeletonCircle, Stack, StackDivider, Text } from '@chakra-ui/react'

import { FeedPost } from '@/domains/platform/entities'

import { PostCard } from './post-card'

interface PostListProps {
  posts?: FeedPost[]
  loading: boolean
}

export const PostList = ({ posts, loading }: PostListProps) => {
  const hasPosts = Boolean(posts?.length)

  if (loading) {
    return (
      <div data-cy="loading-post-list">
        {Array.from({ length: 5 }, (_, index) => (
          <Stack direction="row" p={4} key={`post-load-${index}`}>
            <Stack direction="column">
              <SkeletonCircle size="48px" />
            </Stack>

            <Stack direction="column" flex={1}>
              <Skeleton height="25px" />
              <Skeleton height="50px" />
              <Skeleton height="40px" />
            </Stack>
          </Stack>
        ))}
      </div>
    )
  }

  if (!hasPosts && loading === false) {
    return (
      <Center padding={20}>
        <Text size="xl">No Data</Text>
      </Center>
    )
  }

  return (
    <Stack divider={<StackDivider borderColor="gray.200" />} align="stretch" direction="column">
      {posts?.map(post => (
        <PostCard post={post} key={post.id} />
      ))}
    </Stack>
  )
}
