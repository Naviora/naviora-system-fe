'use client'

import * as React from 'react'
import { ArrowUpDown, LucideIcon, SearchIcon, SlidersHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group'

interface ToolbarButtonProps {
  label: string
  icon: LucideIcon
  onClick?: () => void
  className?: string
}

function ToolbarButton({ label, icon: Icon, onClick, className }: ToolbarButtonProps) {
  return (
    <Button
      type='button'
      size='sm'
      variant='outline'
      onClick={onClick}
      className={cn(
        'gap-2 rounded-md border-greyscale-200 bg-greyscale-0 text-sm font-medium text-greyscale-700',
        className
      )}
    >
      {label}
      <Icon className='h-4 w-4 text-greyscale-500' aria-hidden='true' />
    </Button>
  )
}

export interface ModuleToolbarProps {
  searchValue: string
  onSearchChange: (value: string) => void
  actions?: React.ReactNode
  isSearchDisabled?: boolean
  className?: string
  onSortClick?: () => void
  onFilterClick?: () => void
}

export function ModuleToolbar({
  searchValue,
  onSearchChange,
  actions,
  isSearchDisabled,
  className,
  onSortClick,
  onFilterClick
}: ModuleToolbarProps) {
  return (
    <div className={cn('flex flex-col gap-3 md:flex-row md:items-center md:justify-between', className)}>
      <div className='flex flex-wrap items-center gap-2'>
        <ToolbarButton label='Sắp xếp' icon={ArrowUpDown} onClick={onSortClick} />
        <ToolbarButton label='Bộ lọc' icon={SlidersHorizontal} onClick={onFilterClick} />
      </div>

      <div className='flex w-full flex-col gap-2 sm:flex-row sm:items-center sm:justify-end'>
        <InputGroup className='w-full sm:w-60'>
          <InputGroupInput
            type='search'
            placeholder='Tìm kiếm chuyên đề'
            value={searchValue}
            onChange={(event) => onSearchChange(event.target.value)}
            disabled={isSearchDisabled}
          />
          <InputGroupAddon>
            <SearchIcon className='text-greyscale-400' />
          </InputGroupAddon>
        </InputGroup>
        {actions ? <div className='sm:ml-2'>{actions}</div> : null}
      </div>
    </div>
  )
}
