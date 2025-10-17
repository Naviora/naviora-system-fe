'use client'

import * as React from 'react'
import { RotateCcw, Search } from 'lucide-react'
import { Table } from '@tanstack/react-table'

import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from '@/components/ui/input-group'
import type { PrincipalModuleRow } from '@/types/principal/modules'

interface ModuleTableToolbarProps {
  table: Table<PrincipalModuleRow>
  searchValue?: string
  onSearchChange?: (value: string) => void
  isSearchDisabled?: boolean
}

export function ModuleTableToolbar({ table, searchValue, onSearchChange, isSearchDisabled }: ModuleTableToolbarProps) {
  const searchColumn = table.getColumn('name')
  const currentValue = searchValue ?? (searchColumn?.getFilterValue() as string) ?? ''

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value
    if (onSearchChange) {
      onSearchChange(value)
    } else {
      searchColumn?.setFilterValue(value)
    }
  }

  const handleResetFilters = () => {
    if (onSearchChange) {
      onSearchChange('')
    }
    table.resetColumnFilters()
    table.resetSorting()
  }

  return (
    <div className='flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between'>
      <div className='flex flex-1 flex-col gap-2 sm:flex-row sm:items-center sm:gap-3'>
        <InputGroup className='sm:max-w-xs'>
          <InputGroupAddon>
            <Search className='size-4 text-greyscale-400' aria-hidden='true' />
          </InputGroupAddon>
          <InputGroupInput
            placeholder='Tìm kiếm theo tên hoặc mã chuyên đề'
            value={currentValue}
            onChange={handleSearchChange}
            disabled={isSearchDisabled}
          />
        </InputGroup>
      </div>

      <div className='flex items-center gap-2 self-start text-sm text-greyscale-500 sm:self-auto'>
        <span>
          Đã lọc {table.getFilteredRowModel().rows.length} / {table.getPreFilteredRowModel().rows.length} chuyên đề
        </span>
        <InputGroupButton
          variant='ghost'
          size='sm'
          className='rounded-md border border-greyscale-200 text-sm font-medium text-greyscale-600'
          onClick={handleResetFilters}
        >
          <RotateCcw className='mr-1 size-4' aria-hidden='true' />
          Đặt lại
        </InputGroupButton>
      </div>
    </div>
  )
}
