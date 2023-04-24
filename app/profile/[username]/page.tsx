import { Fragment } from 'react'
import { NextPage } from 'next'
import { useSearchParams } from 'next/navigation'
import { Stack } from '@chakra-ui/react'

import { Layout } from '@/domains/platform/components'
import { ProfileHome } from '@/domains/profile/components'

const ProfilePage: NextPage = () => {
  const searchParams = useSearchParams()

  const username = searchParams.get('profile') || searchParams.get('username')

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
