'use client'
import { LoginForm } from '@/components/forms/login-form'
import { LoadingSpinner } from '@/components/ui'
import { isLoggedIn } from '@/hooks/api/use-auth'
import { useRouter } from 'next/navigation'
import React, { useEffect } from 'react'

export default function LoginPage() {
  const router = useRouter()

  useEffect(() => {
    if (isLoggedIn()) {
      router.push('/dashboard')
    }
  }, [router])

  if (isLoggedIn()) {
    return (
      <div className="flex h-screen items-center justify-center">
        <LoadingSpinner size='lg' />
      </div>
    )
  }

  return (
    <div className='flex overflow-hidden w-full min-h-screen'>
      {/* Left Side - Login Form */}
      <div className='relative flex items-center justify-center bg-greyscale-0 md:w-1/2 w-full *:px-8'>
        <LoginForm className='w-full' />
        <div className='absolute bottom-4 text-sm text-muted-foreground'>
          By proceeding, you agree to our <span className='text-primary hover:underline'>Terms of Service</span> and <span className='text-primary hover:underline'>Privacy Policy</span>.
        </div>
      </div>
      <div
        className='hidden md:block md:w-1/2 bg-cover bg-right bg-no-repeat'
        style={{
          backgroundImage: "url('/login-bg.jpg')"
        }}
        aria-hidden="true"
      ></div>
    </div>
  )
}
