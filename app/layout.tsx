// 'use client'

// import { useEffect } from 'react'

// import { seedGenerator } from '@/domains/platform/helpers/seed-generator'

import '@fontsource/patrick-hand'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // useEffect(() => {
  //   seedGenerator()
  // }, [])

  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
