'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { loginSchema, type LoginFormData } from '@/lib/validations/auth'
import { useLogin } from '@/hooks/api/use-auth'
import { FadeIn } from '@/components/animations/fade-slide-scale'
import { ErrorHandler } from '@/lib/utils/error-handler'
import { getDefaultRouteForRole } from '@/lib/constants/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Checkbox } from '@/components/ui/checkbox'
import { Separator } from '@/components/ui/separator'
import GoogleLoginButton from '@/components/forms/login-gg-btn'

interface LoginFormProps {
  onSuccess?: () => void
  redirectTo?: string
  className?: string
}

export function LoginForm({ onSuccess, redirectTo, className = '' }: LoginFormProps) {
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()
  const loginMutation = useLogin()

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false
    }
  })

  const handleSubmit = async (data: LoginFormData) => {
    try {
      const response = await loginMutation.mutateAsync(data)
      toast.success('Login successful!')
      if (onSuccess) {
        onSuccess()
      } else {
        const targetRoute = redirectTo ?? getDefaultRouteForRole(response.role)
        router.push(targetRoute)
      }
    } catch (error) {
      const errorMessage = ErrorHandler.getErrorMessage(error)
      toast.error(errorMessage)
      ErrorHandler.logError(error, 'Login Form')
    }
  }

  return (
    <FadeIn className={className}>
      <div className='mx-auto max-w-md space-y-6'>
        <div className='flex flex-col gap-2 items-center'>
          <Image width={60} height={60} src='/Naviora.png' alt='Logo' />
          <h1 className='text-lg sm:text-xl md:text-2xl font-bold'>Welcome back to Naviora</h1>
          <p className='text-muted-foreground'>Login with your email and password</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-4'>
            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type='email' placeholder='Enter your email' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='password'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <div className='relative'>
                      <Input type={showPassword ? 'text' : 'password'} placeholder='Enter your password' {...field} />
                      <Button
                        type='button'
                        variant='ghost'
                        size='sm'
                        className='absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent'
                        onClick={() => setShowPassword(!showPassword)}
                        disabled={loginMutation.isPending}
                      >
                        {showPassword ? <EyeOff className='h-4 w-4' /> : <Eye className='h-4 w-4' />}
                        <span className='sr-only'>{showPassword ? 'Hide password' : 'Show password'}</span>
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className='flex items-center justify-between'>
              <FormField
                control={form.control}
                name='rememberMe'
                render={({ field }) => (
                  <FormItem className='flex flex-row items-center space-x-0 space-y-0'>
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <div className='space-y-1 leading-none'>
                      <FormLabel className='text-sm font-normal'>Keep Sign in</FormLabel>
                    </div>
                  </FormItem>
                )}
              />

              <Link href='/auth/forgot-password' className='text-sm text-primary hover:underline'>
                Forgot password?
              </Link>
            </div>

            <div className='flex items-center gap-4'>
              <Separator className='flex-1' />
              <span className='text-sm text-muted-foreground'>Or continue with</span>
              <Separator className='flex-1' />
            </div>

            <GoogleLoginButton />

            <Button type='submit' className='w-full' disabled={loginMutation.isPending}>
              {loginMutation.isPending ? (
                <>
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                  Logging in...
                </>
              ) : (
                'Login'
              )}
            </Button>
          </form>
        </Form>

        <div className='text-center text-sm'>
          <span className='text-muted-foreground'>Don&apos;t have an account? </span>
          <Link href='/auth/register' className='text-primary hover:underline'>
            Register
          </Link>
        </div>
      </div>
    </FadeIn>
  )
}
