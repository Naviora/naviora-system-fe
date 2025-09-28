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
import Link from 'next/link'

interface LoginFormProps {
  onSuccess?: () => void
  redirectTo?: string
  className?: string
}

export function LoginForm({ onSuccess, redirectTo = '/dashboard', className = '' }: LoginFormProps) {
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
      await loginMutation.mutateAsync(data)
      toast.success('Welcome back!')

      if (onSuccess) {
        onSuccess()
      } else {
        router.push(redirectTo)
      }
    } catch (error) {
      const errorMessage = ErrorHandler.getErrorMessage(error)
      toast.error(errorMessage)
      ErrorHandler.logError(error, 'Login Form')
    }
  }

  return (
    <FadeIn className={className}>
      <div className='mx-auto max-w-sm space-y-6'>
        <div className='text-center space-y-2'>
          <h1 className='text-2xl font-bold'>Welcome back</h1>
          <p className='text-muted-foreground'>Sign in to your account to continue</p>
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
                  <FormItem className='flex flex-row items-start space-x-3 space-y-0'>
                    <FormControl>
                      <input type='checkbox' checked={field.value} onChange={field.onChange} className='mt-1' />
                    </FormControl>
                    <div className='space-y-1 leading-none'>
                      <FormLabel className='text-sm font-normal'>Remember me</FormLabel>
                    </div>
                  </FormItem>
                )}
              />

              <Link href='/auth/forgot-password' className='text-sm text-primary hover:underline'>
                Forgot password?
              </Link>
            </div>

            <Button type='submit' className='w-full' disabled={loginMutation.isPending}>
              {loginMutation.isPending ? (
                <>
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                  Signing in...
                </>
              ) : (
                'Sign in'
              )}
            </Button>
          </form>
        </Form>

        <div className='text-center text-sm'>
          <span className='text-muted-foreground'>Don&apos;t have an account? </span>
          <Link href='/auth/register' className='text-primary hover:underline'>
            Sign up
          </Link>
        </div>
      </div>
    </FadeIn>
  )
}
