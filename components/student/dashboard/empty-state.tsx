'use client'

import Link from 'next/link'
import { GraduationCap } from 'lucide-react'

import { Button } from '@/components/ui/button'

import type { EmptyStateSuggestion } from './types'

type DashboardEmptyStateProps = {
  suggestions: EmptyStateSuggestion[]
}

export function DashboardEmptyState({ suggestions }: DashboardEmptyStateProps) {
  return (
    <div className='flex flex-1 items-center justify-center rounded-2xl border border-dashed border-[rgba(223,225,231,0.8)] bg-greyscale-25 p-10 shadow-inner'>
      <div className='mx-auto flex max-w-4xl flex-col items-center gap-8 text-center'>
        <span className='flex size-20 items-center justify-center rounded-full bg-primary-25 text-primary-200'>
          <GraduationCap className='size-10' aria-hidden='true' />
        </span>
        <div className='flex flex-col gap-2'>
          <h2 className='text-3xl font-semibold text-greyscale-700'>Hành trình học tập của bạn bắt đầu từ đây</h2>
          <p className='text-sm text-muted-foreground'>
            Đăng ký khoá học đầu tiên để mở khoá bảng thống kê cá nhân, theo dõi tiến độ và nhận huy hiệu thành tích.
          </p>
        </div>
        <div className='flex flex-wrap items-center justify-center gap-3'>
          <Button size='lg' className='h-12 rounded-lg px-6'>
            Khám phá khoá học
          </Button>
          <Button asChild variant='outline' size='lg' className='h-12 rounded-lg border-greyscale-100 px-6'>
            <Link href='/student/modules'>Xem danh sách học phần</Link>
          </Button>
        </div>
        <div className='grid gap-4 text-left md:grid-cols-3'>
          {suggestions.map((suggestion) => {
            const Icon = suggestion.icon
            return (
              <div
                key={suggestion.id}
                className='flex flex-col gap-3 rounded-xl border border-white bg-white/70 p-5 shadow-sm'
              >
                <span className='flex size-10 items-center justify-center rounded-lg bg-primary-25 text-primary-200'>
                  <Icon className='size-5' aria-hidden='true' />
                </span>
                <div className='flex flex-col gap-1'>
                  <h3 className='text-base font-semibold text-greyscale-700'>{suggestion.title}</h3>
                  <p className='text-sm text-muted-foreground'>{suggestion.description}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
