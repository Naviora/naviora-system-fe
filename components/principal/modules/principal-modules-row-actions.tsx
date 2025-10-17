'use client'

import * as React from 'react'
import { EyeIcon, PencilIcon, Trash2Icon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import type { PrincipalModuleRow } from '@/types/principal/modules'

interface PrincipalModuleRowActionsProps {
  module: PrincipalModuleRow
  onView?: (module: PrincipalModuleRow) => void
  onEdit?: (module: PrincipalModuleRow) => void
  onDelete?: (module: PrincipalModuleRow) => void
  isDeleting?: boolean
}

const actionButtons: Array<{
  key: 'view' | 'edit' | 'delete'
  icon: React.ElementType
  label: string
  variant?: 'ghost' | 'outline'
}> = [
  { key: 'view', icon: EyeIcon, label: 'Xem chi tiết', variant: 'ghost' },
  { key: 'edit', icon: PencilIcon, label: 'Chỉnh sửa', variant: 'ghost' },
  { key: 'delete', icon: Trash2Icon, label: 'Xóa chuyên đề', variant: 'outline' }
]

export function PrincipalModuleRowActions({
  module,
  onView,
  onEdit,
  onDelete,
  isDeleting
}: PrincipalModuleRowActionsProps) {
  const handleAction = React.useCallback(
    (key: 'view' | 'edit' | 'delete') => {
      if (key === 'view') {
        onView?.(module)
        return
      }

      if (key === 'edit') {
        onEdit?.(module)
        return
      }

      onDelete?.(module)
    },
    [module, onView, onEdit, onDelete]
  )

  return (
    <div className='flex items-center justify-end gap-2'>
      {actionButtons.map(({ key, icon: Icon, label, variant }) => {
        const isDeleteAction = key === 'delete'
        const isDisabled = isDeleteAction && isDeleting

        return (
          <Tooltip key={key}>
            <TooltipTrigger asChild>
              <Button
                type='button'
                size='icon'
                variant={variant ?? 'ghost'}
                className={cn('h-8 w-8 border-greyscale-200 text-greyscale-600 hover:text-greyscale-900', {
                  'opacity-60': isDisabled
                })}
                onClick={() => handleAction(key)}
                disabled={isDisabled}
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
