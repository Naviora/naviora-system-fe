import { Button } from '@/components/ui'
import { GoogleOAuthProvider, useGoogleLogin } from '@react-oauth/google'
import Image from 'next/image'
import React from 'react'

function GoogleLoginButton() {
  const loginGG = useGoogleLogin({
    onSuccess: (tokenResponse) => console.log(tokenResponse),
    onError: () => console.log('Login Failed')
  })

  return (
    <Button type='button' className='flex items-center gap-2 w-full' variant={'outline'} onClick={() => loginGG()}>
      <Image src='/gg-logo.png' alt='Google Icon' width={20} height={20} />
      Login with Google
    </Button>
  )
}

export default function LoginGoogleButton() {
  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? ''}>
      <GoogleLoginButton />
    </GoogleOAuthProvider>
  )
}
