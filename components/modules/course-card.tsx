'use client'

import { Star, MoreVertical } from 'lucide-react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export interface CourseCardProps {
  id: string
  title: string
  category: string
  courseType: 'Course' | 'Short Course'
  provider: string
  providerLogo: string
  thumbnail: string
  rating: number
  price: number | 'Free'
  className?: string
}

export function CourseCard({
  title,
  category,
  courseType,
  provider,
  providerLogo,
  thumbnail,
  rating,
  price,
  className
}: CourseCardProps) {
  return (
    <motion.div
      className={cn(
        'flex w-full min-w-[240px] flex-col overflow-hidden rounded-xl border border-border bg-card transition-all',
        className
      )}
      whileHover={{ y: -4, boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)' }}
      transition={{ duration: 0.2 }}
    >
      {/* Thumbnail */}
      <div className='relative h-40 w-full overflow-hidden bg-greyscale-50 p-2'>
        <div className='relative h-full w-full overflow-hidden rounded-lg'>
          <Image
            src={thumbnail}
            alt={title}
            fill
            className='object-cover transition-transform duration-300 hover:scale-105'
            sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
          />
        </div>
      </div>

      {/* Content */}
      <div className='flex flex-col gap-2 p-2'>
        {/* Provider and Menu */}
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-1'>
            <div className='relative h-6 w-6 overflow-hidden rounded'>
              <Image src={providerLogo} alt={provider} fill className='object-contain' sizes='24px' />
            </div>
            <span className='text-sm text-greyscale-500'>{provider}</span>
          </div>
          <Button variant='ghost' size='icon' className='h-6 w-6 rounded-lg border border-greyscale-200'>
            <MoreVertical className='h-4 w-4 text-greyscale-500' />
          </Button>
        </div>

        {/* Course Type */}
        <div className='text-sm text-greyscale-900'>{courseType}</div>

        {/* Title and Category */}
        <div className='flex flex-col gap-1'>
          <h3 className='line-clamp-1 text-base font-medium leading-tight text-greyscale-800'>{title}</h3>
          <p className='text-xs text-greyscale-500'>{category}</p>
        </div>
      </div>

      {/* Divider */}
      <div className='h-px w-full bg-greyscale-200' />

      {/* Footer */}
      <div className='flex items-center justify-between p-3'>
        <div className='flex items-center gap-1'>
          <Star className='h-4 w-4 fill-warning-100 text-warning-100' />
          <span className='text-sm text-greyscale-900'>{rating.toFixed(1)}</span>
        </div>
        <span className='text-sm font-medium text-greyscale-900'>{price === 'Free' ? 'Free' : `$${price}`}</span>
      </div>
    </motion.div>
  )
}
