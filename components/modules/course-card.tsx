'use client'

import { Star, MoreVertical } from 'lucide-react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Progress } from '@/components/ui/progress'

export interface CourseCardProps {
  id: string
  moduleName: string
  classType: string
  class_name: string
  lecturerName: string[]
  progress: number
  thumbnail: string
  className?: string
}

export function CourseCard({
  moduleName,
  classType,
  class_name,
  lecturerName,
  progress,
  thumbnail,
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
            alt={moduleName}
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
            <span className='text-sm text-greyscale-500'>{classType}</span>
          </div>
          <Button variant='ghost' size='icon' className='h-6 w-6 rounded-lg border border-greyscale-200'>
            <MoreVertical className='h-4 w-4 text-greyscale-500' />
          </Button>
        </div>

        {/* Course Type */}
        <div className='text-sm text-greyscale-900'>{class_name}</div>

        {/* Title and Category */}
        <div className='flex flex-col gap-1'>
          <h3 className='line-clamp-1 text-base font-medium leading-tight text-greyscale-800'>{moduleName}</h3>
          <p className='text-xs text-greyscale-500'>{lecturerName?.join(', ')}</p>
        </div>
      </div>

      {/* Footer */}
      <Progress value={progress} className='h-1.5 w-full rounded-none' />
      <div className='px-3 pb-3 pt-1 text-sm text-greyscale-500'>{progress}% completed</div>
    </motion.div>
  )
}
