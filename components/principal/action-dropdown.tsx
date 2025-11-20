'use client'

import * as React from 'react'
import { MoreHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'

export interface ActionItem {
  key: string
  label: string
  icon: React.ElementType
  onClick: () => void | Promise<void>
  variant?: 'default' | 'destructive'
  showDividerAfter?: boolean
  disabled?: boolean
}

interface ActionDropdownProps {
  actions: ActionItem[]
  triggerClassName?: string
}

export function ActionDropdown({ actions, triggerClassName }: ActionDropdownProps) {
  const visibleActions = actions.filter((action) => action !== null && action !== undefined)

  // Nếu chỉ có 1 nút thì không dùng dropdown, dùng button thường
  if (visibleActions.length === 1) {
    const action = visibleActions[0]
    const Icon = action.icon

    return (
      <Button
        type='button'
        variant='ghost'
        size='icon'
        className={cn('h-8 w-8', triggerClassName)}
        onClick={action.onClick}
        disabled={action.disabled}
      >
        <Icon className='h-4 w-4' />
        <span className='sr-only'>{action.label}</span>
      </Button>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button type='button' variant='ghost' size='icon' className={cn('h-8 w-8', triggerClassName)}>
          <span className='sr-only'>Mở menu</span>
          <MoreHorizontal className='h-4 w-4' />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end'>
        {visibleActions.map((action, index) => {
          const Icon = action.icon
          const showDivider = action.showDividerAfter && index < visibleActions.length - 1

          return (
            <React.Fragment key={action.key}>
              <DropdownMenuItem
                onClick={action.onClick}
                disabled={action.disabled}
                className={cn(action.variant === 'destructive' && 'text-red-600 focus:text-red-600 focus:bg-red-50')}
              >
                <Icon className='mr-2 h-4 w-4' />
                {action.label}
              </DropdownMenuItem>
              {showDivider && <DropdownMenuSeparator />}
            </React.Fragment>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
