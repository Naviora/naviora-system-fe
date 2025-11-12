'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { FadeIn, StaggerContainer, StaggerItem } from '@/components/animations/fade-slide-scale'
import { Users, UserCheck, UserX, Settings, FileText, TrendingUp, Activity, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { useAccounts } from '@/hooks/api/use-account'
import { LoadingSpinner } from '@/components/ui/loading'

export default function DashboardPage() {
  // Fetch accounts data for statistics
  const { data: accountsData, isLoading } = useAccounts({ page: 1, limit: 1 })

  // Calculate statistics
  const totalUsers = accountsData?.pagination?.total ?? 0
  const activeUsers = accountsData?.data?.filter((user) => user.status === 'active').length ?? 0
  const inactiveUsers = totalUsers - activeUsers

  // Mock data for recent activity (can be replaced with real API calls)
  const quickActions = [
    {
      title: 'Quản lý tài khoản',
      description: 'Xem và quản lý tất cả tài khoản hệ thống',
      icon: Users,
      href: '/admin/account',
      color: 'text-blue-600'
    },
    {
      title: 'Cài đặt hệ thống',
      description: 'Cấu hình và quản lý hệ thống',
      icon: Settings,
      href: '/settings',
      color: 'text-purple-600'
    }
  ]

  return (
    <div className='flex flex-col gap-6 px-4 pb-10 pt-4 sm:px-6 lg:px-8'>
      {/* Header Section */}
      <FadeIn direction='down' distance={20} delay={0.1}>
        <header className='space-y-2'>
          <h1 className='text-3xl font-semibold text-greyscale-900 sm:text-4xl'>Dashboard</h1>
          <p className='text-sm text-greyscale-500 sm:text-base'>Tổng quan về hệ thống và quản lý</p>
        </header>
      </FadeIn>

      {/* Statistics Cards */}
      <StaggerContainer staggerChildren={0.1} delayChildren={0.2}>
        <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
          <StaggerItem>
            <Card className='hover:shadow-md transition-shadow duration-300'>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-sm font-medium text-greyscale-600'>Tổng số người dùng</CardTitle>
                <div className='h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center'>
                  <Users className='h-4 w-4 text-blue-600' />
                </div>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <LoadingSpinner variant='minimal' size='sm' />
                ) : (
                  <>
                    <div className='text-2xl font-bold text-greyscale-900'>{totalUsers}</div>
                    <p className='text-xs text-greyscale-500 mt-1'>Tất cả người dùng trong hệ thống</p>
                  </>
                )}
              </CardContent>
            </Card>
          </StaggerItem>

          <StaggerItem>
            <Card className='hover:shadow-md transition-shadow duration-300'>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-sm font-medium text-greyscale-600'>Tài khoản hoạt động</CardTitle>
                <div className='h-8 w-8 rounded-full bg-green-100 flex items-center justify-center'>
                  <UserCheck className='h-4 w-4 text-green-600' />
                </div>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <LoadingSpinner variant='minimal' size='sm' />
                ) : (
                  <>
                    <div className='text-2xl font-bold text-greyscale-900'>{activeUsers}</div>
                    <p className='text-xs text-greyscale-500 mt-1'>Đang hoạt động</p>
                  </>
                )}
              </CardContent>
            </Card>
          </StaggerItem>

          <StaggerItem>
            <Card className='hover:shadow-md transition-shadow duration-300'>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-sm font-medium text-greyscale-600'>Tài khoản không hoạt động</CardTitle>
                <div className='h-8 w-8 rounded-full bg-orange-100 flex items-center justify-center'>
                  <UserX className='h-4 w-4 text-orange-600' />
                </div>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <LoadingSpinner variant='minimal' size='sm' />
                ) : (
                  <>
                    <div className='text-2xl font-bold text-greyscale-900'>{inactiveUsers}</div>
                    <p className='text-xs text-greyscale-500 mt-1'>Đã vô hiệu hóa</p>
                  </>
                )}
              </CardContent>
            </Card>
          </StaggerItem>

          <StaggerItem>
            <Card className='hover:shadow-md transition-shadow duration-300'>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-sm font-medium text-greyscale-600'>Tỷ lệ hoạt động</CardTitle>
                <div className='h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center'>
                  <TrendingUp className='h-4 w-4 text-purple-600' />
                </div>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <LoadingSpinner variant='minimal' size='sm' />
                ) : (
                  <>
                    <div className='text-2xl font-bold text-greyscale-900'>
                      {totalUsers > 0 ? Math.round((activeUsers / totalUsers) * 100) : 0}%
                    </div>
                    <p className='text-xs text-greyscale-500 mt-1'>Tài khoản đang hoạt động</p>
                  </>
                )}
              </CardContent>
            </Card>
          </StaggerItem>
        </div>
      </StaggerContainer>

      {/* Quick Actions Section */}
      <FadeIn direction='up' distance={30} delay={0.4}>
        <div className='space-y-4'>
          <div className='flex items-center justify-between'>
            <h2 className='text-xl font-semibold text-greyscale-900'>Thao tác nhanh</h2>
            <Activity className='h-5 w-5 text-greyscale-400' />
          </div>
          <div className='grid gap-4 md:grid-cols-2'>
            {quickActions.map((action) => (
              <StaggerItem key={action.href}>
                <Card className='hover:shadow-lg transition-all duration-300 hover:border-primary/50 group'>
                  <CardHeader>
                    <div className='flex items-start justify-between'>
                      <div className='flex items-center gap-3'>
                        <div
                          className={`h-10 w-10 rounded-lg bg-greyscale-100 flex items-center justify-center group-hover:bg-primary/10 transition-colors ${action.color}`}
                        >
                          <action.icon className='h-5 w-5' />
                        </div>
                        <div>
                          <CardTitle className='text-base'>{action.title}</CardTitle>
                          <CardDescription className='text-sm mt-1'>{action.description}</CardDescription>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Button variant='ghost' className='w-full justify-between group-hover:text-primary' asChild>
                      <Link href={action.href}>
                        Xem chi tiết
                        <ArrowRight className='h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform' />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </StaggerItem>
            ))}
          </div>
        </div>
      </FadeIn>

      {/* System Overview Section */}
      <FadeIn direction='up' distance={30} delay={0.5}>
        <Card>
          <CardHeader>
            <div className='flex items-center gap-2'>
              <FileText className='h-5 w-5 text-greyscale-600' />
              <CardTitle>Tổng quan hệ thống</CardTitle>
            </div>
            <CardDescription>Thông tin tổng quan về hệ thống quản lý</CardDescription>
          </CardHeader>
          <CardContent>
            <div className='space-y-4'>
              <div className='flex items-center justify-between py-2 border-b border-greyscale-100 last:border-0'>
                <span className='text-sm text-greyscale-600'>Trạng thái hệ thống</span>
                <span className='text-sm font-medium text-green-600'>Hoạt động bình thường</span>
              </div>
              <div className='flex items-center justify-between py-2 border-b border-greyscale-100 last:border-0'>
                <span className='text-sm text-greyscale-600'>Phiên bản</span>
                <span className='text-sm font-medium text-greyscale-900'>v1.0.0</span>
              </div>
              <div className='flex items-center justify-between py-2'>
                <span className='text-sm text-greyscale-600'>Cập nhật cuối</span>
                <span className='text-sm font-medium text-greyscale-900'>{new Date().toLocaleDateString('vi-VN')}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </FadeIn>
    </div>
  )
}
