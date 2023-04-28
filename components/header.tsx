import Link from 'next/link'

import { HeaderAvatar } from './header-avatar'

export function Header() {
  return (
    <header className="fixed z-50 w-full bg-white shadow-md">
      <div className="mx-auto flex min-h-[100px] max-w-2xl items-center justify-between py-4">
        <Link href="/" className="flex scroll-m-20 items-center text-4xl font-extrabold tracking-tight">
          Titter
        </Link>

        <HeaderAvatar />
      </div>
    </header>
  )
}
