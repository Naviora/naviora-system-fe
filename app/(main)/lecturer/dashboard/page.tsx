'use client'

import Link from 'next/link'
import { useMemo, type ReactNode } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { ArrowRight, Users, BookOpen, CalendarDays, Presentation, ClipboardList } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty'

interface StatCard {
  id: string
  label: string
  value: string
  description: string
  icon: ReactNode
  color: string
}

interface QuickAction {
  id: string
  title: string
  description: string
  href: string
  icon: ReactNode
  color: string
}

function formatDateInfo(): { greeting: string; formattedDate: string } {
  const now = new Date()
  const hour = now.getHours()

  const greeting = hour < 12 ? 'Chào buổi sáng' : hour < 18 ? 'Chào buổi chiều' : 'Chào buổi tối'
  const formattedDate = new Intl.DateTimeFormat('vi-VN', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  }).format(now)

  return { greeting, formattedDate }
}

export default function DashboardPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const isEmptyState = searchParams?.get('state') === 'empty'

  const { greeting, formattedDate } = useMemo(() => formatDateInfo(), [])

  const stats: StatCard[] = [
    {
      id: 'classes',
      label: 'Lớp đang phụ trách',
      value: '08',
      description: 'Tổng số lớp bạn đang giảng dạy',
      icon: <Users className='h-8 w-8' />,
      color: 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
    },
    {
      id: 'modules',
      label: 'Chuyên đề hiện tại',
      value: '14',
      description: 'Chuyên đề thuộc học kỳ này',
      icon: <BookOpen className='h-8 w-8' />,
      color: 'bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400'
    },
    {
      id: 'sessions',
      label: 'Buổi dạy hôm nay',
      value: '03',
      description: 'Số buổi trong lịch hôm nay',
      icon: <Presentation className='h-8 w-8' />,
      color: 'bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400'
    },
    {
      id: 'activities',
      label: 'Hoạt động sắp tới',
      value: '05',
      description: 'Sự kiện quan trọng trong tuần',
      icon: <ClipboardList className='h-8 w-8' />,
      color: 'bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400'
    }
  ]

  const quickActions: QuickAction[] = [
    {
      id: 'schedule',
      title: 'Lịch giảng dạy',
      description: 'Theo dõi lịch và phòng học',
      href: '/lecturer/calendar',
      icon: <Presentation className='h-6 w-6' />,
      color: 'bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/30 dark:hover:bg-blue-900/50'
    },
    {
      id: 'modules',
      title: 'Chuyên đề của tôi',
      description: 'Quản lý nội dung và tiến độ',
      href: '/lecturer/modules',
      icon: <BookOpen className='h-6 w-6' />,
      color: 'bg-green-50 hover:bg-green-100 dark:bg-green-900/30 dark:hover:bg-green-900/50'
    },
    {
      id: 'classes',
      title: 'Lớp phụ trách',
      description: 'Xem danh sách lớp hiện tại',
      href: '/lecturer/classes',
      icon: <Users className='h-6 w-6' />,
      color: 'bg-amber-50 hover:bg-amber-100 dark:bg-amber-900/30 dark:hover:bg-amber-900/50'
    },
    {
      id: 'resources',
      title: 'Tài liệu giảng dạy',
      description: 'Truy cập tài nguyên nhanh',
      href: '/lecturer/modules?tab=resources',
      icon: <ClipboardList className='h-6 w-6' />,
      color: 'bg-purple-50 hover:bg-purple-100 dark:bg-purple-900/30 dark:hover:bg-purple-900/50'
    }
  ]

  if (isEmptyState) {
    return (
      <div className='flex h-full flex-col items-center justify-center px-4 pb-12 pt-10 sm:px-6 lg:px-8'>
        <Empty className='max-w-2xl border border-dashed border-greyscale-200 bg-greyscale-25/60'>
          <EmptyHeader>
            <EmptyMedia variant='icon'>
              <CalendarDays className='size-6 text-greyscale-500' />
            </EmptyMedia>
            <EmptyTitle>Chưa có dữ liệu khả dụng</EmptyTitle>
            <EmptyDescription>
              Hệ thống sẽ hiển thị lịch giảng dạy, chuyên đề và thông báo khi bạn được phân công lớp hoặc có cập nhật
              mới.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button asChild>
              <Link href='/lecturer/modules'>Xem danh sách chuyên đề</Link>
            </Button>
            <Button variant='outline' asChild>
              <Link href='/settings/notifications'>Thiết lập thông báo</Link>
            </Button>
          </EmptyContent>
        </Empty>
      </div>
    )
  }

  return (
    <div className='space-y-8 px-4 py-8 sm:px-6 lg:px-8'>
      {/* Hero Section */}
      <section className='rounded-2xl border border-primary/15 bg-linear-to-r from-primary/15 via-primary/5 to-primary/10 p-8'>
        <div className='max-w-3xl'>
          <p className='mb-2 text-sm font-semibold uppercase tracking-wide text-primary'>{formattedDate}</p>
          <h1 className='mb-3 text-3xl font-bold text-greyscale-900 dark:text-greyscale-0'>{greeting}, Thầy/Cô! 👋</h1>
          <p className='mb-6 text-base text-greyscale-600 dark:text-greyscale-400'>
            Theo dõi tiến độ lớp học, bài nộp và những cập nhật quan trọng trong ngày để duy trì chất lượng giảng dạy
            tốt nhất.
          </p>
          <Button
            onClick={() => router.push('/lecturer/calendar')}
            className='h-11 bg-primary px-6 text-primary-foreground hover:bg-primary/90'
          >
            Mở lịch giảng dạy
            <ArrowRight className='ml-2 h-4 w-4' />
          </Button>
        </div>
      </section>

      {/* Stats Section */}
      <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4'>
        {stats.map((stat) => (
          <Card
            key={stat.id}
            className='shadow-xs border-greyscale-200 bg-greyscale-0 p-6 dark:border-greyscale-700 dark:bg-greyscale-800'
          >
            <div className='flex items-start justify-between'>
              <div>
                <p className='mb-1 text-sm font-medium text-greyscale-600 dark:text-greyscale-400'>{stat.label}</p>
                <p className='mb-3 text-2xl font-bold text-greyscale-900 dark:text-greyscale-0'>{stat.value}</p>
                <p className='text-xs text-greyscale-500 dark:text-greyscale-400'>{stat.description}</p>
              </div>
              <div className={`rounded-lg p-3 ${stat.color}`}>{stat.icon}</div>
            </div>
          </Card>
        ))}
      </div>

      {/* Quick Actions Section */}
      <div>
        <div className='mb-6'>
          <h2 className='mb-2 text-xl font-bold text-greyscale-900 dark:text-greyscale-0'>Thao tác nhanh</h2>
          <p className='text-sm text-greyscale-600 dark:text-greyscale-400'>Truy cập nhanh các tiện ích giảng dạy</p>
        </div>

        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4'>
          {quickActions.map((action) => (
            <button
              key={action.id}
              onClick={() => router.push(action.href)}
              className={`group relative rounded-lg border-2 border-greyscale-200 p-6 transition-all duration-200 hover:border-primary/30 dark:border-greyscale-700 dark:hover:border-primary/30 ${action.color}`}
            >
              <div className='flex flex-col items-start gap-3'>
                <div className='text-greyscale-600 transition-colors group-hover:text-primary dark:text-greyscale-400 dark:group-hover:text-primary'>
                  {action.icon}
                </div>
                <div className='text-left'>
                  <h3 className='mb-1 font-semibold text-greyscale-900 dark:text-greyscale-0'>{action.title}</h3>
                  <p className='text-sm text-greyscale-600 dark:text-greyscale-400'>{action.description}</p>
                </div>
              </div>
              <ArrowRight className='absolute bottom-4 right-4 h-4 w-4 text-greyscale-400 transition-all group-hover:translate-x-1 group-hover:text-primary' />
            </button>
          ))}
        </div>
      </div>

      {/* Info Section */}
      <div className='rounded-lg border border-greyscale-200 bg-greyscale-50 p-6 dark:border-greyscale-700 dark:bg-greyscale-800/50'>
        <h3 className='mb-3 font-semibold text-greyscale-900 dark:text-greyscale-0'>💡 Mẹo sử dụng</h3>
        <ul className='space-y-2 text-sm text-greyscale-600 dark:text-greyscale-400'>
          <li>• Kiểm tra lịch mỗi sáng để nắm bắt phòng học và thời gian</li>
          <li>• Cập nhật tiến độ chuyên đề sau mỗi buổi để giữ đúng kế hoạch</li>
          <li>• Chia sẻ tài liệu trực tiếp từ trang chuyên đề để sinh viên theo kịp</li>
          <li>• Theo dõi thông báo hệ thống để không bỏ lỡ yêu cầu mới</li>
        </ul>
      </div>
    </div>
  )
}
