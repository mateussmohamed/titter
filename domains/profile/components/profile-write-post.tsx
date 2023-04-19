import { Fragment } from 'react'
import { Skeleton, Stack } from '@chakra-ui/react'

import { WritePostInput } from '~/domains/posts/components'

interface ProfileWritePostProps {
  showWriterPost?: boolean
  loading?: boolean
  onWritePost: (body: string) => Promise<void>
}

export const ProfileWritePost = (props: ProfileWritePostProps) => {
  const { loading, showWriterPost, onWritePost } = props

  if (loading) {
    return (
      <Stack px={5} data-cy="loading-profile-write">
        <Skeleton height="80px" />
        <Skeleton height="40px" />
      </Stack>
    )
  }

  return showWriterPost ? <WritePostInput onWritePost={onWritePost} /> : <Fragment />
}
