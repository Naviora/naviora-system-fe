'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Book, Clock, Hourglass, Menu, CheckCircle2, Circle } from 'lucide-react'
import { cn } from '@/lib/utils'

type Lesson = {
  id: string
  name: string
  description: string
  duration: string
  completed: boolean
  content: {
    title: string
    body: string
  }
  quiz?: {
    title: string
    questions: number
    timeLimit: string
  }
  materials?: {
    title: string
    files: Array<{
      name: string
      type: string
      size: string
    }>
  }
}

type Module = {
  id: string
  title: string
  description: string
  totalLessons: number
  totalDuration: string
  completedLessons: number
  lessons: Lesson[]
}

// Mock Data
const mockModule: Module = {
  id: 'module-1',
  title: 'Nghiên cứu UX Nâng cao',
  description: 'Tìm hiểu các phương pháp luận và thực hành tốt nhất về nghiên cứu UX',
  totalLessons: 34,
  totalDuration: '6 giờ 02 phút',
  completedLessons: 1,
  lessons: [
    {
      id: 'lesson-1',
      name: 'Giới thiệu về Nghiên cứu UX',
      description: 'Các khái niệm cơ bản và tổng quan',
      duration: '06:12',
      completed: true,
      content: {
        title: 'Giới thiệu về Nghiên cứu UX',
        body: 'Nghiên cứu UX là quá trình điều tra hệ thống về người dùng và nhu cầu của họ. Trong bài học này, chúng ta khám phá các khái niệm cơ bản và phương pháp luận...'
      },
      quiz: {
        title: 'Kiểm tra Giới thiệu',
        questions: 10,
        timeLimit: '15 phút'
      },
      materials: {
        title: 'Tài liệu Khóa học',
        files: [
          { name: 'Syllabus.pdf', type: 'PDF', size: '2.4 MB' },
          { name: 'Khung Nghiên cứu.docx', type: 'DOCX', size: '1.2 MB' }
        ]
      }
    },
    {
      id: 'lesson-2',
      name: 'Vai trò của Nghiên cứu trong Thiết kế Sản phẩm',
      description: 'Hiểu tác động của nghiên cứu',
      duration: '07:35',
      completed: false,
      content: {
        title: 'Vai trò của Nghiên cứu trong Thiết kế Sản phẩm',
        body: 'Nghiên cứu thông báo cho các quyết định sản phẩm và xác thực các giả thuyết thiết kế. Bài học này bao gồm cách tích hợp nghiên cứu vào quy trình thiết kế...'
      },
      materials: {
        title: 'Tài liệu Hỗ trợ',
        files: [
          { name: 'Các Nghiên cứu Điển hình.pdf', type: 'PDF', size: '3.1 MB' },
          { name: 'Nguyên tắc Thiết kế.xlsx', type: 'XLSX', size: '890 KB' }
        ]
      }
    },
    {
      id: 'lesson-3',
      name: 'Tải Xuống Điều Lệ Khóa học',
      description: 'Toàn bộ đề cương khóa học',
      duration: '00:15',
      completed: false,
      content: {
        title: 'Điều Lệ Khóa học',
        body: 'Tài liệu này phác thảo tất cả các tài liệu khóa học, mục tiêu học tập và tiêu chí đánh giá...'
      }
    },
    {
      id: 'lesson-4',
      name: 'Tổng Quan Quy Trình Nghiên cứu',
      description: 'Phương pháp và quy trình làm việc',
      duration: '09:40',
      completed: false,
      content: {
        title: 'Tổng Quan Quy Trình Nghiên cứu',
        body: 'Tổng quan toàn diện về quy trình nghiên cứu từ lập kế hoạch đến báo cáo...'
      },
      quiz: {
        title: 'Bài Kiểm Tra Tổng Quan Quy Trình',
        questions: 8,
        timeLimit: '12 phút'
      }
    },
    {
      id: 'lesson-5',
      name: 'Đạo Đức & Thực Hành Tốt Nhất trong Nghiên cứu',
      description: 'Xem xét các yếu tố đạo đức',
      duration: '08:22',
      completed: false,
      content: {
        title: 'Đạo Đức & Thực Hành Tốt Nhất trong Nghiên cứu',
        body: 'Tìm hiểu về các hướng dẫn đạo đức và thực hành tốt nhất trong việc tiến hành nghiên cứu người dùng...'
      },
      materials: {
        title: 'Hướng Dẫn Đạo Đức',
        files: [{ name: 'Danh sách Kiểm tra Đạo đức.pdf', type: 'PDF', size: '1.5 MB' }]
      }
    },
    {
      id: 'lesson-6',
      name: 'Bài Kiểm Tra: Kiểm tra Giới thiệu',
      description: 'Kiểm tra kiến thức của bạn',
      duration: '08:55',
      completed: false,
      content: {
        title: 'Kiểm tra Giới thiệu',
        body: 'Hoàn thành bài kiểm tra toàn diện này để đánh giá hiểu biết của bạn về mô-đun giới thiệu...'
      },
      quiz: {
        title: 'Kiểm tra Giới thiệu',
        questions: 15,
        timeLimit: '30 phút'
      }
    }
  ]
}

// Components
const ModuleInfoHeader = ({ module }: { module: Module }) => {
  const progressPercentage = Math.round((module.completedLessons / module.totalLessons) * 100)

  return (
    <div className='p-3'>
      <h2 className='text-2xl font-semibold text-gray-800 dark:text-gray-100'>{module.title}</h2>
      <p className='text-sm text-gray-600 dark:text-gray-400 mt-1'>{module.description}</p>
      <div className='mt-3 flex items-center text-sm text-gray-600 dark:text-gray-400 gap-3'>
        <div className='flex items-center'>
          <Book className='mr-2 h-4 w-4' />
          <span>{module.totalLessons} bài học</span>
        </div>
        <span>-</span>
        <div className='flex items-center'>
          <Hourglass className='mr-2 h-4 w-4' />
          <span>{module.totalDuration}</span>
        </div>
      </div>
      <div className='mt-4'>
        <div className='flex justify-between text-xs text-gray-500 dark:text-gray-400'>
          <span>Tiến độ</span>
          <span>{progressPercentage}%</span>
        </div>
        <div className='mt-1 h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700'>
          <div
            className='h-2 rounded-full bg-blue-600 transition-all duration-300'
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
      </div>
    </div>
  )
}

interface ModuleLessonsListProps {
  module: Module
  moduleId: string
  selectedLessonId?: string
}

const ModuleLessonsList = ({ module, moduleId, selectedLessonId }: ModuleLessonsListProps) => (
  <div className='space-y-2'>
    {module.lessons.map((lesson) => (
      <Link
        key={lesson.id}
        href={`/student/modules/${moduleId}/lessons/${lesson.id}`}
        className={cn(
          'w-full text-left p-3 rounded-lg transition-colors duration-200 block',
          selectedLessonId === lesson.id
            ? 'bg-blue-100 dark:bg-blue-900 border-l-4 border-blue-600'
            : 'bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600'
        )}
      >
        <div className='flex items-center gap-2'>
          {lesson.completed ? (
            <CheckCircle2 className='h-4 w-4 text-blue-600 shrink-0' />
          ) : (
            <Circle className='h-4 w-4 text-gray-400 shrink-0' />
          )}
          <div className='flex-1'>
            <p className='font-medium text-sm text-gray-900 dark:text-gray-100'>{lesson.name}</p>
            <p className='text-xs text-gray-500 dark:text-gray-400'>{lesson.description}</p>
          </div>
          <div className='flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 shrink-0'>
            <Clock className='h-3 w-3' />
            <span>{lesson.duration}</span>
          </div>
        </div>
      </Link>
    ))}
  </div>
)

interface ModuleDetailSidebarProps {
  module?: Module
  moduleId?: string
  selectedLessonId?: string
}

export const ModuleDetailSidebar = ({
  module = mockModule,
  moduleId = 'module-1',
  selectedLessonId
}: ModuleDetailSidebarProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  return (
    <div
      className={cn(
        'relative h-screen border-r dark:bg-gray-900 transition-all duration-300 p-3',
        isSidebarOpen ? 'w-[400px]' : 'w-10'
      )}
    >
      {isSidebarOpen ? (
        <div className='flex flex-col gap-2'>
          <button
            className='flex justify-end items-center gap-2 rounded-sm p-2 text-gray-700 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-800'
            onClick={() => setIsSidebarOpen(false)}
          >
            <Menu className='h-4 w-4' />
          </button>
          <div className='rounded-xl bg-white dark:bg-gray-800 overflow-hidden max-h-[calc(100vh-80px)] flex flex-col'>
            <ModuleInfoHeader module={module} />
            <div className='border-t border-gray-200 dark:border-gray-700 flex-1 overflow-y-auto px-3 py-3'>
              <ModuleLessonsList module={module} moduleId={moduleId} selectedLessonId={selectedLessonId} />
            </div>
          </div>
        </div>
      ) : (
        <div className='flex flex-col items-center gap-4'>
          <button
            className='flex items-center justify-center rounded-md p-2 text-gray-700 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-800'
            onClick={() => setIsSidebarOpen(true)}
          >
            <Menu className='h-4 w-4' />
          </button>
        </div>
      )}
    </div>
  )
}
