'use client'

import { useRouter } from 'next/navigation'
import { BarChart3, Users, BookOpen, FileText, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

interface StatCard {
  id: string
  label: string
  value: string
  description: string
  icon: React.ReactNode
  color: string
}

interface QuickAction {
  id: string
  title: string
  description: string
  href: string
  icon: React.ReactNode
  color: string
}

export default function PrincipalDashboardPage() {
  const router = useRouter()

  const stats: StatCard[] = [
    {
      id: 'classes',
      label: 'Lớp học',
      value: '12',
      description: 'Tổng số lớp quản lý',
      icon: <Users className='h-8 w-8' />,
      color: 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
    },
    {
      id: 'modules',
      label: 'Chuyên đề',
      value: '28',
      description: 'Chuyên đề đang mở',
      icon: <BookOpen className='h-8 w-8' />,
      color: 'bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400'
    },
    {
      id: 'exams',
      label: 'Bài kiểm tra',
      value: '15',
      description: 'Bài kiểm tra hôm nay',
      icon: <FileText className='h-8 w-8' />,
      color: 'bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400'
    },
    {
      id: 'performance',
      label: 'Hiệu suất',
      value: '8.5/10',
      description: 'Điểm trung bình hệ thống',
      icon: <BarChart3 className='h-8 w-8' />,
      color: 'bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400'
    }
  ]

  const quickActions: QuickAction[] = [
    {
      id: 'manage-classes',
      title: 'Quản lý lớp học',
      description: 'Xem và quản lý các lớp học',
      href: '/principal/classes',
      icon: <Users className='h-6 w-6' />,
      color: 'bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/30 dark:hover:bg-blue-900/50'
    },
    {
      id: 'manage-modules',
      title: 'Quản lý chuyên đề',
      description: 'Tổ chức nội dung học tập',
      href: '/principal/modules',
      icon: <BookOpen className='h-6 w-6' />,
      color: 'bg-green-50 hover:bg-green-100 dark:bg-green-900/30 dark:hover:bg-green-900/50'
    },
    {
      id: 'manage-exams',
      title: 'Quản lý bài kiểm tra',
      description: 'Tạo và quản lý bài kiểm tra',
      href: '/principal/exams',
      icon: <FileText className='h-6 w-6' />,
      color: 'bg-purple-50 hover:bg-purple-100 dark:bg-purple-900/30 dark:hover:bg-purple-900/50'
    },
    {
      id: 'manage-materials',
      title: 'Quản lý tài liệu',
      description: 'Tài liệu và tài nguyên học tập',
      href: '/principal/materials',
      icon: <BookOpen className='h-6 w-6' />,
      color: 'bg-amber-50 hover:bg-amber-100 dark:bg-amber-900/30 dark:hover:bg-amber-900/50'
    }
  ]

  return (
    <div className='space-y-8 px-4 py-8 sm:px-6 lg:px-8'>
      {/* Hero Section */}
      <div className='rounded-xl bg-linear-to-r from-primary/10 to-primary/5 border border-primary/20 p-8'>
        <div className='max-w-2xl'>
          <h1 className='text-3xl sm:text-4xl font-bold text-greyscale-900 dark:text-greyscale-0 mb-3'>
            Chào mừng trở lại! 👋
          </h1>
          <p className='text-base sm:text-lg text-greyscale-600 dark:text-greyscale-400 mb-6'>
            Quản lý toàn bộ hệ thống giáo dục, theo dõi tiến độ học tập, và tạo ra trải nghiệm học tập tốt nhất cho sinh
            viên.
          </p>
          <Button
            onClick={() => router.push('/principal/classes')}
            className='bg-primary hover:bg-primary/90 text-primary-foreground h-11 px-6'
          >
            Bắt đầu quản lý
            <ArrowRight className='ml-2 h-4 w-4' />
          </Button>
        </div>
      </div>

      {/* Stats Section */}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
        {stats.map((stat) => (
          <Card
            key={stat.id}
            className='p-6 border-greyscale-200 bg-greyscale-0 dark:border-greyscale-700 dark:bg-greyscale-800 shadow-xs'
          >
            <div className='flex items-start justify-between'>
              <div>
                <p className='text-sm font-medium text-greyscale-600 dark:text-greyscale-400 mb-1'>{stat.label}</p>
                <p className='text-2xl sm:text-3xl font-bold text-greyscale-900 dark:text-greyscale-0 mb-3'>
                  {stat.value}
                </p>
                <p className='text-xs sm:text-sm text-greyscale-500 dark:text-greyscale-500'>{stat.description}</p>
              </div>
              <div className={`rounded-lg p-3 ${stat.color}`}>{stat.icon}</div>
            </div>
          </Card>
        ))}
      </div>

      {/* Quick Actions Section */}
      <div>
        <div className='mb-6'>
          <h2 className='text-xl sm:text-2xl font-bold text-greyscale-900 dark:text-greyscale-0 mb-2'>
            Thao tác nhanh
          </h2>
          <p className='text-sm sm:text-base text-greyscale-600 dark:text-greyscale-400'>
            Truy cập nhanh các tính năng quản lý chính
          </p>
        </div>

        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
          {quickActions.map((action) => (
            <button
              key={action.id}
              onClick={() => router.push(action.href)}
              className={`group relative rounded-lg border-2 border-greyscale-200 dark:border-greyscale-700 p-6 transition-all duration-200 hover:border-primary/30 dark:hover:border-primary/30 ${action.color}`}
            >
              <div className='flex flex-col items-start gap-3'>
                <div className='text-greyscale-600 dark:text-greyscale-400 group-hover:text-primary dark:group-hover:text-primary transition-colors'>
                  {action.icon}
                </div>
                <div className='text-left'>
                  <h3 className='font-semibold text-greyscale-900 dark:text-greyscale-0 mb-1'>{action.title}</h3>
                  <p className='text-sm text-greyscale-600 dark:text-greyscale-400'>{action.description}</p>
                </div>
              </div>
              <ArrowRight className='absolute right-4 bottom-4 h-4 w-4 text-greyscale-400 group-hover:text-primary group-hover:translate-x-1 transition-all duration-200' />
            </button>
          ))}
        </div>
      </div>

      {/* Info Section */}
      <div className='rounded-lg border border-greyscale-200 dark:border-greyscale-700 bg-greyscale-50 dark:bg-greyscale-800/50 p-6'>
        <h3 className='font-semibold text-greyscale-900 dark:text-greyscale-0 mb-3'>💡 Mẹo sử dụng</h3>
        <ul className='space-y-2 text-sm text-greyscale-600 dark:text-greyscale-400'>
          <li>• Sử dụng tính năng quản lý lớp để theo dõi tiến độ sinh viên</li>
          <li>• Tạo chuyên đề và bài học mới để phong phú nội dung giáo dục</li>
          <li>• Xem báo cáo chi tiết về hiệu suất học tập của từng lớp</li>
          <li>• Cấu hình bài kiểm tra và theo dõi kết quả trực tuyến</li>
        </ul>
      </div>
    </div>
  )
}
