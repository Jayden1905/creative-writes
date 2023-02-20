'use client'

import { useAuthState } from 'react-firebase-hooks/auth'
import { auth } from 'utils/firebase'

export default function UserDisplay() {
  const [user] = useAuthState(auth)

  return (
    <>
      {user && (
        <div>
          <h1>{user?.email}</h1>
          <h1>{user?.displayName}</h1>
          <img src={user.photoURL!} alt="use photo" />
        </div>
      )}
    </>
  )
}
