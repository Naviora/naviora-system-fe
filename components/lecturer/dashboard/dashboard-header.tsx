'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'

interface DashboardHeaderProps {
  greeting: string
  formattedDate: string
}

export function DashboardHeader({ greeting, formattedDate }: DashboardHeaderProps) {
  return (
    <header className='flex flex-col gap-2 rounded-xl border border-greyscale-200 bg-greyscale-0 px-6 py-6 shadow-sm sm:flex-row sm:items-center sm:justify-between'>
      <div className='flex flex-col gap-1'>
        <p className='text-sm font-medium text-primary-500'>{formattedDate}</p>
        <h1 className='text-2xl font-semibold text-greyscale-900 sm:text-3xl'>{greeting}, Thầy/Cô!</h1>
        <p className='text-sm text-muted-foreground'>
          Theo dõi tiến độ lớp học, bài nộp và phản hồi sinh viên trong một nơi duy nhất.
        </p>
      </div>
      <div className='flex flex-col gap-2 sm:items-end'>
        <Button className='gap-2' asChild>
          <Link href='/lecturer/modules'>Quản lý chuyên đề</Link>
        </Button>
        <Button variant='outline' className='gap-2' asChild>
          <Link href='/calendar'>Xem lịch tuần</Link>
        </Button>
      </div>
    </header>
  )
}
