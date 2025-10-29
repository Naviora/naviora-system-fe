'use client'

import { ChevronDown, Settings, LogOut, HelpCircle } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Skeleton } from '@/components/ui/skeleton'
import { useProfile } from '@/hooks/api/use-profile'
import { useLogout } from '@/hooks/api/use-auth'
import { toast } from 'sonner'

export function AvatarDropdown() {
  const { data: profile, isLoading } = useProfile()
  const router = useRouter()
  const logoutMutation = useLogout()

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync()
      toast.success('Logged out successfully')
      router.push('/login')
    } catch (error) {
      console.error('Logout failed:', error)
      toast.error('Failed to log out. Please try again.')
    }
  }

  if (isLoading || !profile) {
    return <Skeleton className='h-8 w-8 rounded-lg' />
  }

  const getInitials = (name: string) =>
    name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant='ghost'
          className='flex h-8 items-center gap-1 rounded-lg border border-greyscale-200 px-1 hover:bg-greyscale-25'
          aria-label='User menu'
        >
          <Avatar className='h-6 w-6'>
            <AvatarImage src={profile.avatar} alt={profile.name} />
            <AvatarFallback className='bg-primary-100 text-xs font-medium text-primary-foreground'>
              {getInitials(profile.name)}
            </AvatarFallback>
          </Avatar>
          <ChevronDown className='h-4 w-4 text-greyscale-600' />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='w-56'>
        <DropdownMenuLabel>
          <div className='flex flex-col space-y-1'>
            <p className='text-sm font-medium text-greyscale-900'>{profile.name}</p>
            <p className='text-xs text-greyscale-500'>{profile.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href='/settings' className='flex cursor-pointer items-center gap-2'>
            <Settings className='h-4 w-4' />
            <span>Settings</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href='/help' className='flex cursor-pointer items-center gap-2'>
            <HelpCircle className='h-4 w-4' />
            <span>Help & Support</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={handleLogout}
          className='cursor-pointer text-error-100 focus:text-error-100'
          disabled={logoutMutation.isPending}
        >
          <LogOut className='mr-2 h-4 w-4' />
          <span>{logoutMutation.isPending ? 'Logging out...' : 'Log out'}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
