'use client'

import Link from 'next/link'
import { LessonContentViewer } from '@/components/student/modules/detail'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useParams } from 'next/navigation'

// Mock data - same as in sidebar
const mockLessons = [
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

export default function LessonPage() {
  const params = useParams()
  const moduleId = params.id as string
  const lessonId = params.lessonId as string

  console.log('📚 Lesson Page Params:', { moduleId, lessonId, params })
  console.log(
    '📚 Available lessons:',
    mockLessons.map((l) => l.id)
  )

  const lesson = mockLessons.find((l) => l.id === lessonId)
  console.log('📚 Found lesson:', lesson?.name || 'NOT FOUND')

  if (!lesson) {
    return (
      <div className='flex flex-col h-full items-center justify-center p-8'>
        <div className='text-center'>
          <h2 className='text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4'>Không tìm thấy bài học</h2>
          <Link href={`/modules/${moduleId}`}>
            <Button variant='outline'>
              <ArrowLeft className='mr-2 h-4 w-4' />
              Quay lại mô-đun
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className='flex flex-col h-full'>
      <LessonContentViewer lesson={lesson} />
    </div>
  )
}
