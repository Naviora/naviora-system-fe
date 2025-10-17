'use client'

import { ArrowDownIcon, ArrowUpIcon, ChevronsUpDownIcon } from 'lucide-react'
import { Column } from '@tanstack/react-table'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface DataTableColumnHeaderProps<TData, TValue> extends React.HTMLAttributes<HTMLDivElement> {
  column: Column<TData, TValue>
  title: string
  hideSort?: boolean
}

export function DataTableColumnHeader<TData, TValue>({
  column,
  title,
  className,
  hideSort = false
}: DataTableColumnHeaderProps<TData, TValue>) {
  if (!column.getCanSort() || hideSort) {
    return <div className={cn('text-left font-semibold', className)}>{title}</div>
  }

  const icon =
    column.getIsSorted() === 'desc' ? (
      <ArrowDownIcon className='size-4' aria-hidden='true' />
    ) : column.getIsSorted() === 'asc' ? (
      <ArrowUpIcon className='size-4' aria-hidden='true' />
    ) : (
      <ChevronsUpDownIcon className='size-4' aria-hidden='true' />
    )

  return (
    <div className={cn('flex items-center justify-start gap-2', className)}>
      <Button
        type='button'
        variant='ghost'
        size='sm'
        className='-ml-3 h-8 px-2 text-xs font-semibold uppercase tracking-wide text-greyscale-500'
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        <span className='mr-2'>{title}</span>
        {icon}
      </Button>
    </div>
  )
}
