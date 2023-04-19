import { Fragment } from 'react'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { Stack } from '@chakra-ui/react'

import { Layout } from '~/domains/platform/components'
import { ProfileHome } from '~/domains/profile/components'

const ProfilePage: NextPage = () => {
  const { query } = useRouter()
  const username = query?.profile || query?.username

  return username ? (
    <Layout>
      <Stack align="stretch" direction="column">
        <ProfileHome />
      </Stack>
    </Layout>
  ) : (
    <Fragment />
  )
}

export default ProfilePage
