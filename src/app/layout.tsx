'use client'
import Nav from '@/components/Nav'
import { Roboto } from '@next/font/google'
import { Provider } from 'jotai'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth } from 'utils/firebase'
import './globals.css'

const roboto = Roboto({
  weight: ['100', '300', '400', '500', '700', '900'],
  subsets: ['latin'],
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [_user, loading] = useAuthState(auth)
  return (
    <html lang="en">
      <head />
      <body className={roboto.className}>
        {loading ? (
          <h1>Loading...</h1>
        ) : (
          <Provider>
            <div className="mx-6 md:mx-auto md:max-w-2xl">
              <Nav />
              <main>{children}</main>
            </div>
          </Provider>
        )}
      </body>
    </html>
  )
}
