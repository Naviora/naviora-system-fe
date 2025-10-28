'use client'

import { Search } from 'lucide-react'

import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group'

export function StudentModuleToolbar() {
  return (
    <div className='flex justify-end'>
      <InputGroup className='w-full max-w-xs border-greyscale-100 shadow-none'>
        <InputGroupAddon align='inline-start' className='text-greyscale-400'>
          <Search className='h-4 w-4' aria-hidden='true' />
        </InputGroupAddon>
        <InputGroupInput placeholder='Tìm kiếm khóa học' aria-label='Tìm kiếm khóa học' />
      </InputGroup>
    </div>
  )
}
