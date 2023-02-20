'use client'

import Facebook from '@/components/asset/Facebook'
import Google from '@/components/asset/google'
import {
  createUserWithEmailAndPassword,
  FacebookAuthProvider,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
} from 'firebase/auth'
import { useRouter } from 'next/navigation'
import { ChangeEvent, FormEvent, useEffect, useState } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth } from 'utils/firebase'

interface FormProps {
  email: string
  password: string
}

export default function Login() {
  const router = useRouter()
  const [user] = useAuthState(auth)
  const [formData, setFormData] = useState<FormProps>({
    email: '',
    password: '',
  })

  const GoogleLogin = async () => {
    const googleProvider = new GoogleAuthProvider()
    try {
      const result = await signInWithPopup(auth, googleProvider)
      router.replace('/')
    } catch (error: any) {
      console.error(error)
    }
  }

  const FacebookLogin = async () => {
    const facebookProvider = new FacebookAuthProvider()
    try {
      const result = await signInWithPopup(auth, facebookProvider)
      const userCredential = FacebookAuthProvider.credentialFromResult(result)
      const token = userCredential?.accessToken
      const photo = result.user.photoURL + '?height=500&access_token=' + token
      await updateProfile(auth?.currentUser!, { photoURL: photo })
      router.replace('/')
    } catch (error: any) {
      console.error(error)
    }
  }

  async function registerWithEmail(email: string, password: string) {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      )
      const user = userCredential.user
      setFormData({ email: '', password: '' })
    } catch (error) {
      console.error(error)
    }
  }

  async function loginWithEmail(email: string, password: string) {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      )
      const user = userCredential.user
      router.push('/')
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    if (user) {
      router.replace('/')
    }
  }, [user])

  const formSubmitHandler = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    registerWithEmail(formData.email, formData.password)
  }

  return (
    !user && (
      <div className="mt-32 rounded-lg p-10 text-gray-700 shadow-xl">
        <h2 className="text-2xl font-medium">Join Today</h2>
        <div className="w-full">
          <form className="mb-4 rounded pt-6" onSubmit={formSubmitHandler}>
            <div className="mb-4">
              <label
                className="mb-2 block text-sm font-bold text-gray-700"
                htmlFor="email"
              >
                Email
              </label>
              <input
                className="focus:shadow-outline w-full appearance-none rounded border py-2 px-3 leading-tight text-gray-700 shadow focus:outline-none"
                id="email"
                name="email"
                type="email"
                required
                placeholder="Email"
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  setFormData({ ...formData, email: e.target.value })
                }}
              />
            </div>
            <div className="mb-6">
              <label
                className="mb-2 block text-sm font-bold text-gray-700"
                htmlFor="password"
              >
                Password
              </label>
              <input
                className="focus:shadow-outline mb-3 w-full appearance-none rounded border py-2 px-3 leading-tight text-gray-700 shadow focus:outline-none"
                id="password"
                type="password"
                required
                placeholder="******************"
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  setFormData({ ...formData, password: e.target.value })
                }}
              />
            </div>
            <div className="flex items-center justify-between">
              <button
                className="focus:shadow-outline rounded bg-gray-700 py-2 px-4 font-bold text-white hover:bg-gray-800 focus:outline-none"
                type="submit"
              >
                Register
              </button>
              <a
                className="inline-block align-baseline text-sm font-bold text-blue-500 hover:text-blue-800"
                href="#"
              >
                Forgot Password?
              </a>
            </div>
          </form>
        </div>
        <div className="py-4">
          <h3 className="py-4">Sign in with one of the providers</h3>
          <button
            onClick={GoogleLogin}
            className="flex w-full items-center gap-2 rounded-lg bg-gray-700 p-4 align-middle font-medium text-white"
          >
            <Google />
            Sign in with Google
          </button>
          <button
            onClick={FacebookLogin}
            className="mt-4 flex w-full items-center gap-2 rounded-lg bg-gray-700 p-4 align-middle font-medium text-white"
          >
            <Facebook />
            Sign in with Facebook
          </button>
        </div>
      </div>
    )
  )
}
