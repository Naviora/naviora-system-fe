'use client'

import { Moon, Sun, Monitor } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { Button } from './button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu'

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Tránh hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Button variant='outline' size='icon' disabled>
        <Sun className='h-[1.2rem] w-[1.2rem]' />
      </Button>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='outline' size='icon' aria-label='Toggle theme'>
          {theme === 'dark' ? (
            <Moon className='h-[1.2rem] w-[1.2rem]' />
          ) : theme === 'light' ? (
            <Sun className='h-[1.2rem] w-[1.2rem]' />
          ) : (
            <Monitor className='h-[1.2rem] w-[1.2rem]' />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align='end'
        className='bg-card border border-border rounded-lg shadow-container p-1 min-w-[120px]'
      >
        <DropdownMenuItem
          onClick={() => setTheme('light')}
          className='flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-accent rounded-md transition-colors'
        >
          <Sun className='h-4 w-4' />
          <span className='body-small-medium'>Light</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme('dark')}
          className='flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-accent rounded-md transition-colors'
        >
          <Moon className='h-4 w-4' />
          <span className='body-small-medium'>Dark</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme('system')}
          className='flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-accent rounded-md transition-colors'
        >
          <Monitor className='h-4 w-4' />
          <span className='body-small-medium'>System</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

// Simple toggle version (chỉ đổi light/dark)
export function ThemeToggleSimple() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Button variant='outline' size='icon' disabled>
        <Sun className='h-[1.2rem] w-[1.2rem]' />
      </Button>
    )
  }

  const toggleTheme = () => {
    if (theme === 'dark') {
      setTheme('light')
    } else {
      setTheme('dark')
    }
  }

  return (
    <Button variant='outline' size='icon' onClick={toggleTheme} aria-label='Toggle theme'>
      {theme === 'dark' ? (
        <Sun className='h-[1.2rem] w-[1.2rem] transition-transform duration-200' />
      ) : (
        <Moon className='h-[1.2rem] w-[1.2rem] transition-transform duration-200' />
      )}
    </Button>
  )
}
