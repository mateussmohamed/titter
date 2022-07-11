import { useEffect, useState } from 'react'
import type { AppProps } from 'next/app'
import { ChakraProvider } from '@chakra-ui/react'

import { seedGenerator } from '~/domains/platform/helpers/seed-generator'

import '@fontsource/patrick-hand'

import { theme } from '../theme'

function MyApp({ Component, pageProps }: AppProps) {
  // Workaround to works with React 18.0 https://stackoverflow.com/a/71797054
  const [showChild, setShowChild] = useState(false)

  useEffect(() => {
    seedGenerator()
    setShowChild(true)
  }, [])

  if (!showChild) {
    return null
  }

  if (typeof window === 'undefined') {
    return <></>
  } else {
    return (
      <ChakraProvider resetCSS theme={theme}>
        <Component {...pageProps} />
      </ChakraProvider>
    )
  }
}

export default MyApp
