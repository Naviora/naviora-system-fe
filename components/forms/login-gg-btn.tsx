import { Button } from '@/components/ui'
import Image from 'next/image'
import React from 'react'
import { API_CONFIG } from '@/lib/constants'

export default function GoogleLoginButton() {
  const handleGoogleLogin = () => {
    window.location.href = `${API_CONFIG.BASE_URL}/auth/google`
  }

  return (
    <Button 
      type='button' 
      className='flex items-center gap-2 w-full' 
      variant={'outline'}
      onClick={handleGoogleLogin}
    >
      <Image src='/gg-logo.png' alt='Google Icon' width={20} height={20} />
      Login with Google
    </Button>
  )
}