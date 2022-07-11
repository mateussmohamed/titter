import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { Modal, ModalContent, ModalOverlay } from '@chakra-ui/react'

import { Layout } from '~/domains/platform/components'
import { PostsHome } from '~/domains/posts/components'
import { ProfileHome } from '~/domains/profile/components'

const HomePage: NextPage = () => {
  const { push, query } = useRouter()

  const handleClose = () => {
    push('/?filter=all')
  }

  const renderModal = !!query?.profile || !!query?.username

  return (
    <>
      <Layout>
        <PostsHome />

        {renderModal && (
          <Modal onClose={handleClose} size="xl" isOpen={true}>
            <ModalOverlay />
            <ModalContent>
              <ProfileHome />
            </ModalContent>
          </Modal>
        )}
      </Layout>
    </>
  )
}

export default HomePage
