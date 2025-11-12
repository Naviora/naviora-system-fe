'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { FadeIn, StaggerContainer, StaggerItem } from '@/components/animations/fade-slide-scale'
import { Users, UserCheck, UserX, Settings, FileText, TrendingUp, Activity, ArrowRight, BarChart3 } from 'lucide-react'
import Link from 'next/link'
import { useAccounts } from '@/hooks/api/use-account'
import { LoadingSpinner } from '@/components/ui/loading'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts'

export default function DashboardPage() {
  // Fetch accounts data for statistics
  const { data: accountsData, isLoading } = useAccounts({ page: 1, limit: 1 })

  // Calculate statistics
  const totalUsers = accountsData?.pagination?.total ?? 0
  const activeUsers = accountsData?.data?.filter((user) => user.status === 'active').length ?? 0
  // Ensure inactiveUsers is always positive (not negative)
  const inactiveUsers = Math.max(0, totalUsers - activeUsers)

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

  // Mock data for user growth chart (7 months)
  const userGrowthData = [
    { month: 'Tháng 6', users: 120, active: 95 },
    { month: 'Tháng 7', users: 145, active: 115 },
    { month: 'Tháng 8', users: 168, active: 132 },
    { month: 'Tháng 9', users: 192, active: 150 },
    { month: 'Tháng 10', users: 215, active: 168 },
    { month: 'Tháng 11', users: 238, active: 185 },
    { month: 'Tháng 12', users: totalUsers || 260, active: activeUsers || 200 }
  ]

  // Mock data for role distribution
  const roleDistributionData = [
    { name: 'Student', value: 180, color: '#3b82f6' },
    { name: 'Lecturer', value: 45, color: '#10b981' },
    { name: 'Principal', value: 12, color: '#f59e0b' },
    { name: 'Admin', value: 8, color: '#8b5cf6' }
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

      {/* Charts Section */}
      <div className='grid gap-6 lg:grid-cols-2'>
        {/* User Growth Chart */}
        <FadeIn direction='up' distance={30} delay={0.6}>
          <Card>
            <CardHeader>
              <div className='flex items-center gap-2'>
                <TrendingUp className='h-5 w-5 text-greyscale-600' />
                <CardTitle>Tăng trưởng người dùng</CardTitle>
              </div>
              <CardDescription>Tổng số người dùng và tài khoản hoạt động theo tháng</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width='100%' height={300}>
                <LineChart data={userGrowthData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray='3 3' className='stroke-greyscale-200' />
                  <XAxis dataKey='month' className='text-xs' tick={{ fill: '#6b7280' }} stroke='#e5e7eb' />
                  <YAxis className='text-xs' tick={{ fill: '#6b7280' }} stroke='#e5e7eb' />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Legend />
                  <Line
                    type='monotone'
                    dataKey='users'
                    stroke='#3b82f6'
                    strokeWidth={2}
                    name='Tổng người dùng'
                    dot={{ fill: '#3b82f6', r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                  <Line
                    type='monotone'
                    dataKey='active'
                    stroke='#10b981'
                    strokeWidth={2}
                    name='Tài khoản hoạt động'
                    dot={{ fill: '#10b981', r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </FadeIn>

        {/* Role Distribution Chart */}
        <FadeIn direction='up' distance={30} delay={0.7}>
          <Card>
            <CardHeader>
              <div className='flex items-center gap-2'>
                <BarChart3 className='h-5 w-5 text-greyscale-600' />
                <CardTitle>Phân bố vai trò</CardTitle>
              </div>
              <CardDescription>Số lượng người dùng theo từng vai trò trong hệ thống</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width='100%' height={300}>
                <BarChart data={roleDistributionData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray='3 3' className='stroke-greyscale-200' />
                  <XAxis dataKey='name' className='text-xs' tick={{ fill: '#6b7280' }} stroke='#e5e7eb' />
                  <YAxis className='text-xs' tick={{ fill: '#6b7280' }} stroke='#e5e7eb' />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Bar dataKey='value' name='Số lượng' radius={[8, 8, 0, 0]}>
                    {roleDistributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </FadeIn>
      </div>

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
