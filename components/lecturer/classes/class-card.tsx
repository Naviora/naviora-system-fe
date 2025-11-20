'use client'

import { Calendar, Users, BookOpen } from 'lucide-react'
import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import type { Class } from '@/types/api/class'
import { CLASS_TYPE_LABELS } from '@/types/api/class'

interface ClassCardProps {
  classData: Class
}

export function ClassCard({ classData }: ClassCardProps) {
  const getClassTypeBadgeColor = (type: string) => {
    const colors: Record<string, string> = {
      school: 'bg-blue-100 text-blue-700 border-blue-200',
      city: 'bg-green-100 text-green-700 border-green-200',
      province: 'bg-purple-100 text-purple-700 border-purple-200',
      national: 'bg-orange-100 text-orange-700 border-orange-200',
      international: 'bg-red-100 text-red-700 border-red-200'
    }
    return colors[type] || 'bg-greyscale-100 text-greyscale-700 border-greyscale-200'
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <Card className='p-6 hover:shadow-md transition-shadow'>
      <div className='space-y-4'>
        {/* Header */}
        <div className='flex items-start justify-between'>
          <div className='flex-1'>
            <div className='flex items-center gap-2 mb-2'>
              <h3 className='text-lg font-semibold text-greyscale-900 line-clamp-1'>{classData.class_name}</h3>
              {classData.is_active && (
                <span className='inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-green-100 text-green-700 border border-green-200 whitespace-nowrap'>
                  Hoạt động
                </span>
              )}
            </div>
            <p className='text-sm text-greyscale-600 font-mono'>{classData.class_code}</p>
          </div>
        </div>

        {/* Class Type Badge */}
        <div>
          <span
            className={`inline-flex items-center px-3 py-1 rounded-md text-xs font-medium border ${getClassTypeBadgeColor(classData.class_type)}`}
          >
            {CLASS_TYPE_LABELS[classData.class_type]}
          </span>
        </div>

        {/* Details */}
        <div className='space-y-2'>
          <div className='flex items-center gap-2 text-sm text-greyscale-600'>
            <Calendar className='w-4 h-4' />
            <span>
              {formatDate(classData.start_date)} - {formatDate(classData.end_date)}
            </span>
          </div>
          <div className='flex items-center gap-2 text-sm text-greyscale-600'>
            <Users className='w-4 h-4' />
            <span>0 Học viên</span>
          </div>
          <div className='flex items-center gap-2 text-sm text-greyscale-600'>
            <BookOpen className='w-4 h-4' />
            <span>0 Chuyên đề</span>
          </div>
        </div>

        {/* Actions */}
        <div className='flex gap-2 pt-2 border-t border-greyscale-200'>
          <Button asChild variant='default' size='sm' className='flex-1'>
            <Link href={`/lecturer/classes/${classData.class_id}`}>Xem chi tiết</Link>
          </Button>
          <Button asChild variant='outline' size='sm' className='flex-1'>
            <Link href={`/lecturer/classes/${classData.class_id}/students`}>Quản lý học viên</Link>
          </Button>
        </div>
      </div>
    </Card>
  )
}
