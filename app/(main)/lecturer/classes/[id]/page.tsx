'use client'

import { useParams } from 'next/navigation'
import { useClassDetail } from '@/hooks/api/use-classes'
import { LoadingSpinner } from '@/components/ui/loading'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Calendar, Users, BookOpen, Edit } from 'lucide-react'
import Link from 'next/link'
import { CLASS_TYPE_LABELS } from '@/types/api/class'
import { formatDate } from '@/lib/utils'

export default function ClassDetailPage() {
  const params = useParams()
  const classId = params.id as string

  const { data: classDetail, isLoading } = useClassDetail(classId)

  if (isLoading) {
    return (
      <div className='flex items-center justify-center min-h-[400px]'>
        <LoadingSpinner />
      </div>
    )
  }

  if (!classDetail) {
    return (
      <div className='container mx-auto px-4 py-8'>
        <div className='text-center'>
          <h2 className='text-2xl font-bold'>Class not found</h2>
          <p className='text-muted-foreground mt-2'>
            The class you&apos;re looking for doesn&apos;t exist or has been removed.
          </p>
          <Button asChild className='mt-4'>
            <Link href='/lecturer/classes'>
              <ArrowLeft className='mr-2 h-4 w-4' />
              Back to Classes
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className='container mx-auto px-4 py-8'>
      {/* Header */}
      <div className='mb-6'>
        <Button variant='ghost' asChild className='mb-4'>
          <Link href='/lecturer/classes'>
            <ArrowLeft className='mr-2 h-4 w-4' />
            Back to Classes
          </Link>
        </Button>

        <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
          <div>
            <div className='flex items-center gap-3 mb-2'>
              <h1 className='text-3xl font-bold'>{classDetail.class_name}</h1>
              <span
                className={`px-3 py-1 text-xs font-semibold rounded-full ${
                  classDetail.is_active
                    ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                    : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
                }`}
              >
                {classDetail.is_active ? 'Active' : 'Inactive'}
              </span>
            </div>
            <p className='text-muted-foreground'>
              {classDetail.class_code} • {CLASS_TYPE_LABELS[classDetail.class_type]}
            </p>
          </div>
          <Button>
            <Edit className='mr-2 h-4 w-4' />
            Edit Class
          </Button>
        </div>
      </div>

      {/* Class Information Cards */}
      <div className='grid gap-6 md:grid-cols-3 mb-8'>
        <div className='border rounded-lg p-6'>
          <div className='flex items-center gap-3 mb-4'>
            <Calendar className='h-5 w-5 text-primary' />
            <h3 className='font-semibold'>Duration</h3>
          </div>
          <div className='space-y-2 text-sm'>
            <div>
              <span className='text-muted-foreground'>Start: </span>
              <span className='font-medium'>{formatDate(classDetail.start_date)}</span>
            </div>
            <div>
              <span className='text-muted-foreground'>End: </span>
              <span className='font-medium'>{formatDate(classDetail.end_date)}</span>
            </div>
          </div>
        </div>

        <div className='border rounded-lg p-6'>
          <div className='flex items-center gap-3 mb-4'>
            <Users className='h-5 w-5 text-primary' />
            <h3 className='font-semibold'>Lecturers</h3>
          </div>
          <div className='text-2xl font-bold'>{classDetail.lecturers.length}</div>
          <p className='text-sm text-muted-foreground mt-1'>Teaching this class</p>
        </div>

        <div className='border rounded-lg p-6'>
          <div className='flex items-center gap-3 mb-4'>
            <BookOpen className='h-5 w-5 text-primary' />
            <h3 className='font-semibold'>Class Type</h3>
          </div>
          <div className='text-2xl font-bold'>{CLASS_TYPE_LABELS[classDetail.class_type]}</div>
          <p className='text-sm text-muted-foreground mt-1'>Competition level</p>
        </div>
      </div>

      {/* Lecturers Section */}
      <div className='border rounded-lg p-6 mb-8'>
        <h2 className='text-xl font-semibold mb-4'>Lecturers</h2>
        {classDetail.lecturers.length > 0 ? (
          <div className='space-y-3'>
            {classDetail.lecturers.map((lecturer) => (
              <div
                key={lecturer.lecturer_id}
                className='flex items-center gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors'
              >
                <div className='h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center'>
                  <Users className='h-5 w-5 text-primary' />
                </div>
                <div className='flex-1'>
                  <p className='font-medium'>{lecturer.name}</p>
                  <p className='text-sm text-muted-foreground'>{lecturer.email}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className='text-muted-foreground text-center py-8'>No lecturers assigned to this class</p>
        )}
      </div>

      {/* Students Section */}
      <div className='border rounded-lg p-6'>
        <div className='flex items-center justify-between mb-4'>
          <h2 className='text-xl font-semibold'>Students</h2>
          <Button asChild>
            <Link href={`/lecturer/classes/${classId}/students`}>View All Students</Link>
          </Button>
        </div>
        <p className='text-muted-foreground text-center py-8'>View and manage students enrolled in this class</p>
      </div>
    </div>
  )
}
