import { extendTheme, withDefaultColorScheme } from '@chakra-ui/react'

import { colors } from './colors'

const fonts = {
  heading: `'Patrick Hand', cursive`,
  body: `'Patrick Hand', cursive`
}

const overrides = {
  colors,
  fonts,
  styles: {
    global: {
      'html, body': {
        bg: 'gray.100'
      }
    }
  }
}

export const theme = extendTheme(overrides, withDefaultColorScheme({ colorScheme: 'gray' }))
