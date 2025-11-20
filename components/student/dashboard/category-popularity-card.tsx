'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

import type { CategoryConfig } from './types'

type CategoryPopularityCardProps = {
  categories: CategoryConfig[]
}

export function CategoryPopularityCard({ categories }: CategoryPopularityCardProps) {
  return (
    <Card className='border-[rgba(230,230,230,0.9)] shadow-none'>
      <CardHeader className='flex flex-wrap items-center justify-between gap-3 px-6'>
        <CardTitle className='text-base font-medium text-greyscale-700'>Độ phổ biến theo danh mục</CardTitle>
        <Button variant='outline' size='sm' className='h-9 rounded-lg border-greyscale-100 text-xs font-medium'>
          Xem tất cả
        </Button>
      </CardHeader>
      <CardContent className='px-6 pb-6'>
        <div className='relative flex h-64 items-end justify-between gap-4'>
          <div className='absolute left-0 top-0 flex h-full flex-col justify-between text-xs text-muted-foreground'>
            {[100, 80, 60, 40, 20, 0].map((value) => (
              <span key={value}>{value === 0 ? '0%' : `${value}%`}</span>
            ))}
          </div>
          <div className='ml-12 flex flex-1 items-end justify-between gap-6'>
            {categories.map((category) => (
              <div key={category.id} className='flex flex-col items-center gap-3'>
                <div className='flex h-48 w-12 flex-col justify-end rounded-lg bg-[rgba(236,239,243,0.8)]'>
                  <div
                    className='mx-1 rounded-lg bg-primary-200'
                    style={{ height: `${Math.max(8, (category.percentage / 100) * 180)}px` }}
                  />
                </div>
                <span className='text-xs font-medium text-muted-foreground'>{category.label}</span>
                <span className='text-xs text-greyscale-700'>{category.percentage}%</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
