import { Patrick_Hand } from 'next/font/google'

import { Footer } from '@/components/footer'
import { Header } from '@/components/header'
import { Toaster } from '@/components/toaster'

import '@/styles/globals.css'

const patrick = Patrick_Hand({
  variable: '--font-patrick-hand',
  weight: '400',
  subsets: ['latin'],
  display: 'swap'
})

export default function RootLayout({ children, modal }: { children: React.ReactNode; modal: React.ReactNode }) {
  return (
    <html lang="en" className={`${patrick.className} ${patrick.variable}`}>
      <body className="min-h-screen">
        <Header />
        <main className="min-h-screen bg-slate-100 pt-[100px]">{children}</main>
        <Footer />
        {modal}
        <Toaster />
      </body>
    </html>
  )
}
