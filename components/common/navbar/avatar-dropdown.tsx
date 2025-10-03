'use client'

import { useState } from 'react'
import { ChevronDown, User, Settings, LogOut, HelpCircle } from 'lucide-react'
import Link from 'next/link'
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

interface UserData {
  name: string
  email: string
  avatar?: string
}

// Mock user data - replace with real data from auth context
const mockUser: UserData = {
  name: 'John Doe',
  email: 'john.doe@example.com',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John'
}

export function AvatarDropdown() {
  const [user] = useState<UserData>(mockUser)

  const handleLogout = () => {
    // Implement logout logic
    console.log('Logging out...')
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant='ghost'
          className='flex h-8 items-center gap-1 rounded-lg border border-greyscale-200 px-1 hover:bg-greyscale-25'
          aria-label='User menu'
        >
          <Avatar className='h-6 w-6'>
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback className='bg-primary-100 text-xs font-medium text-primary-foreground'>
              {user.name
                .split(' ')
                .map((n) => n[0])
                .join('')
                .toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <ChevronDown className='h-4 w-4 text-greyscale-600' />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='w-56'>
        <DropdownMenuLabel>
          <div className='flex flex-col space-y-1'>
            <p className='text-sm font-medium text-greyscale-900'>{user.name}</p>
            <p className='text-xs text-greyscale-500'>{user.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href='/profile' className='flex cursor-pointer items-center gap-2'>
            <User className='h-4 w-4' />
            <span>Profile</span>
          </Link>
        </DropdownMenuItem>
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
        <DropdownMenuItem onClick={handleLogout} className='cursor-pointer text-error-100 focus:text-error-100'>
          <LogOut className='mr-2 h-4 w-4' />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
