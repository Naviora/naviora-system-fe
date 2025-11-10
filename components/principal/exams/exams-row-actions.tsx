'use client'

import * as React from 'react'
import { EyeIcon, PencilIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import type { ExamsRow } from './principal-exams-table'

interface ExamsRowActionsProps {
  exam: ExamsRow
  onView?: (exam: ExamsRow) => void
  onEdit?: (exam: ExamsRow) => void
}

const actionButtons: Array<{
  key: 'view' | 'edit'
  icon: React.ElementType
  label: string
  variant?: 'ghost' | 'outline'
}> = [
  { key: 'view', icon: EyeIcon, label: 'Xem chi tiết', variant: 'ghost' },
  { key: 'edit', icon: PencilIcon, label: 'Chỉnh sửa bài thi', variant: 'ghost' }
]

export function ExamsRowActions({ exam, onView, onEdit }: ExamsRowActionsProps) {
  const handleAction = React.useCallback(
    (key: 'view' | 'edit') => {
      if (key === 'view') {
        onView?.(exam)
        return
      }

      if (key === 'edit') {
        onEdit?.(exam)
        return
      }
    },
    [exam, onView, onEdit]
  )

  return (
    <div className='flex items-center justify-end gap-2'>
      {actionButtons.map(({ key, icon: Icon, label, variant }) => {
        return (
          <Tooltip key={key}>
            <TooltipTrigger asChild>
              <Button
                type='button'
                size='icon'
                variant={variant ?? 'ghost'}
                className={cn('h-8 w-8 border-greyscale-200 text-greyscale-600 hover:text-greyscale-900')}
                onClick={() => handleAction(key)}
              >
                <Icon className='size-4' aria-hidden='true' />
                <span className='sr-only'>{label}</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side='top'>
              <p className='text-xs font-medium'>{label}</p>
            </TooltipContent>
          </Tooltip>
        )
      })}
    </div>
  )
}
