// 'use client'

// import { useRouter, useSearchParams } from 'next/navigation'

// import { Modal, ModalContent, ModalOverlay } from '@chakra-ui/react'
// import { Layout } from '@/domains/platform/components'
// import { PostsHome } from '@/domains/posts/components'
// import { ProfileHome } from '@/domains/profile/components'

export default function HomePage() {
  // const router = useRouter()
  // const searchParams = useSearchParams()

  // const handleClose = () => {
  //   router.push('/?filter=all')
  // }

  // const renderModal = !!searchParams.get('profile') || !!searchParams.get('profile')

  return <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">Titter</h1>
}
{
  /* <Layout>
      <PostsHome />

    {renderModal && (
        <Modal onClose={handleClose} size="xl" isOpen={true}>
          <ModalOverlay />
          <ModalContent>
            <ProfileHome />
          </ModalContent>
        </Modal>
      )} 
    </Layout>*/
}
