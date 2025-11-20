'use client'

import { Bell } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'

interface Notification {
  id: string
  title: string
  description: string
  time: string
  isRead: boolean
}

// Mock notifications - replace with real data
const mockNotifications: Notification[] = [
  {
    id: '1',
    title: 'New course available',
    description: 'Check out the new Advanced React course',
    time: '2 hours ago',
    isRead: false
  },
  {
    id: '2',
    title: 'Assignment due soon',
    description: 'Your assignment is due in 24 hours',
    time: '5 hours ago',
    isRead: false
  },
  {
    id: '3',
    title: 'Course completed',
    description: 'You have completed Introduction to UI/UX',
    time: '1 day ago',
    isRead: true
  }
]

export function NotificationBell() {
  const unreadCount = mockNotifications.filter((n) => !n.isRead).length

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant='outline'
          size='icon'
          className='relative size-8 rounded-lg border-greyscale-200'
          aria-label='Notifications'
        >
          <Bell className='h-4 w-4 text-greyscale-700' />
          {unreadCount > 0 && (
            <span className='absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-error-100 text-[10px] font-medium text-destructive-foreground'>
              {unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='w-80'>
        <DropdownMenuLabel className='flex items-center justify-between'>
          <span>Notifications</span>
          {unreadCount > 0 && <span className='text-xs font-normal text-greyscale-500'>{unreadCount} unread</span>}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <div className='max-h-[400px] overflow-y-auto space-y-2'>
          {mockNotifications.length === 0 ? (
            <div className='p-4 text-center text-sm text-greyscale-500'>No notifications</div>
          ) : (
            mockNotifications.map((notification) => (
              <DropdownMenuItem
                key={notification.id}
                className={cn(
                  'flex cursor-pointer flex-col items-start gap-1 p-3',
                  !notification.isRead && 'bg-primary-0'
                )}
              >
                <div className='flex w-full items-start justify-between gap-2'>
                  <p className='text-sm font-medium text-greyscale-900'>{notification.title}</p>
                  {!notification.isRead && <span className='mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-primary-200' />}
                </div>
                <p className='text-xs text-greyscale-600'>{notification.description}</p>
                <span className='text-xs text-greyscale-400'>{notification.time}</span>
              </DropdownMenuItem>
            ))
          )}
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem className='cursor-pointer justify-center text-sm font-medium text-primary-200'>
          View all notifications
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
