'use client'

import Facebook from '@/components/asset/Facebook'
import Google from '@/components/asset/Google'
import {
  AuthCredential,
  AuthProvider,
  createUserWithEmailAndPassword,
  FacebookAuthProvider,
  fetchSignInMethodsForEmail,
  GoogleAuthProvider,
  linkWithCredential,
  OAuthProvider,
  signInWithPopup,
  signInWithRedirect,
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

  const googleProvider = new GoogleAuthProvider()
  const facebookProvider = new FacebookAuthProvider()

  function getProvider(providerId: string) {
    switch (providerId) {
      case GoogleAuthProvider.PROVIDER_ID:
        return new GoogleAuthProvider()
      case FacebookAuthProvider.PROVIDER_ID:
        return new FacebookAuthProvider()
      default:
        throw new Error(`No provider implemented for ${providerId}`)
    }
  }

  const supportedPopupSignInMethods = [
    GoogleAuthProvider.PROVIDER_ID,
    FacebookAuthProvider.PROVIDER_ID,
  ]

  async function authLogin(provider: AuthProvider) {
    try {
      const result = await signInWithPopup(auth, provider)
      if (provider.providerId === 'facebook.com') {
        const userCredential = FacebookAuthProvider.credentialFromResult(result)
        const token = userCredential?.accessToken
        const photo = result.user.photoURL + '?height=500&access_token=' + token
        await updateProfile(auth?.currentUser!, { photoURL: photo })
      }
      router.replace('/')
    } catch (error: any) {
      if (error.code === 'auth/account-exists-with-different-credential') {
        const email = error.customData.email
        const pendingCred = OAuthProvider.credentialFromError(
          error
        ) as AuthCredential

        const providers = await fetchSignInMethodsForEmail(auth, email)

        const firstPopupProviderMethod = providers.find((p: any) =>
          supportedPopupSignInMethods.includes(p)
        )

        if (!firstPopupProviderMethod) {
          throw new Error(
            `Your account is linked to a provider that isn't supported.`
          )
        }

        const linkedProvider = getProvider(firstPopupProviderMethod)
        linkedProvider.setCustomParameters({ login_hint: email })

        const result = await signInWithRedirect(auth, linkedProvider)
        linkWithCredential(result, pendingCred)
        router.replace('/')
      }
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
            onClick={() => authLogin(googleProvider)}
            className="flex w-full items-center gap-2 rounded-lg bg-gray-700 p-4 align-middle font-medium text-white"
          >
            <Google />
            Sign in with Google
          </button>
          <button
            onClick={() => authLogin(facebookProvider)}
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
