'use client'
import { LoginForm } from '@/components/forms/login-form'
import { isLoggedIn } from '@/hooks/api/use-auth'

export default function LoginPage() {
  if (isLoggedIn()) {
    return null
  }

  return (
    <div className='flex overflow-hidden w-full min-h-screen'>
      {/* Left Side - Login Form */}
      <div className='relative flex items-center justify-center bg-greyscale-0 md:w-1/2 w-full *:px-8'>
        <LoginForm className='w-full' />
        <div className='absolute bottom-4 text-sm text-muted-foreground'>
          Bằng cách tiếp tục, bạn đồng ý với <span className='text-primary hover:underline'>Điều khoản Dịch vụ</span> và{' '}
          <span className='text-primary hover:underline'>Chính sách Bảo mật</span> của chúng tôi.
        </div>
      </div>
      <div
        className='hidden md:block md:w-1/2 bg-cover bg-right bg-no-repeat'
        style={{
          backgroundImage: "url('/login-bg.jpg')"
        }}
        aria-hidden='true'
      ></div>
    </div>
  )
}
