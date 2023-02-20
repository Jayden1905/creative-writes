'use client'

import Link from 'next/link'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth } from 'utils/firebase'

export default function Nav() {
  const [user] = useAuthState(auth)

  return (
    <nav className="flex items-center justify-between py-10">
      <Link href={'/'} className="text-lg font-medium">
        Creative Minds
      </Link>
      <ul className="flex items-center gap-10">
        {user ? (
          <li>
            <button
              onClick={() => auth.signOut()}
              className="ml-8 rounded-lg bg-cyan-500 py-2 px-4 text-sm font-medium text-white"
            >
              Logout
            </button>
          </li>
        ) : (
          <li>
            <Link
              href={'/auth/login'}
              className="ml-8 rounded-lg bg-cyan-500 py-2 px-4 text-sm font-medium text-white"
            >
              Join Now
            </Link>
          </li>
        )}
      </ul>
    </nav>
  )
}
