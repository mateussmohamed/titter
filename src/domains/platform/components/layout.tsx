import { ReactNode } from 'react'
import Link from 'next/link'
import { Avatar, Container, Heading, Stack } from '@chakra-ui/react'

import { User } from '../entities'
import storage from '../services/storage'

export const Layout = ({ children }: { children: ReactNode }) => {
  const user = storage.getItem<User>('current_user')

  return (
    <main>
      <Stack
        direction="row"
        padding={4}
        align="center"
        bg="white"
        boxShadow="0 1px 3px 0 rgb(0 0 0 / 10%), 0 1px 2px 0 rgb(0 0 0 / 6%)"
      >
        <Container maxW="container.lg">
          <Stack direction="row" justifyContent="space-between">
            <Link href="/">
              <Heading variant="xxLarge" color="black" cursor="pointer">
                titter
              </Heading>
            </Link>
            <Link href={`/?profile=${user?.username}`} as={`/profile/${user?.username}`}>
              <Avatar
                name={user?.name}
                data-cy="open-current-profile"
                bg="black"
                color="gray.200"
                cursor="pointer"
                as="a"
              />
            </Link>
          </Stack>
        </Container>
      </Stack>
      <Container maxW="container.sm" padding={4}>
        {children}
      </Container>
    </main>
  )
}
