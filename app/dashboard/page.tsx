'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { FadeIn, StaggerContainer, StaggerItem } from '@/components/animations/fade-slide-scale'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { RefreshCw, Users, TrendingUp, DollarSign, Activity } from 'lucide-react'
import Link from 'next/link'

// Mock data for demonstration
const mockStats = [
  {
    title: 'Total Users',
    value: '2,543',
    change: '+12%',
    changeType: 'increase' as const,
    icon: Users
  },
  {
    title: 'Revenue',
    value: '$45,231',
    change: '+23%',
    changeType: 'increase' as const,
    icon: DollarSign
  },
  {
    title: 'Growth Rate',
    value: '8.7%',
    change: '+2.1%',
    changeType: 'increase' as const,
    icon: TrendingUp
  },
  {
    title: 'Active Sessions',
    value: '573',
    change: '-5%',
    changeType: 'decrease' as const,
    icon: Activity
  }
]

const mockTodos = [
  { id: 1, title: 'Review quarterly reports', completed: false },
  { id: 2, title: 'Update API documentation', completed: true },
  { id: 3, title: 'Plan team meeting', completed: false },
  { id: 4, title: 'Optimize database queries', completed: false },
  { id: 5, title: 'Deploy new features', completed: true }
]

// Mock API functions for demonstration
const fetchStats = async () => {
  await new Promise((resolve) => setTimeout(resolve, 1000))
  return mockStats
}

const fetchTodos = async () => {
  await new Promise((resolve) => setTimeout(resolve, 800))
  return mockTodos
}

export default function DashboardPage() {
  const [searchTerm, setSearchTerm] = useState('')

  const statsQuery = useQuery({
    queryKey: ['dashboard', 'stats'],
    queryFn: fetchStats,
    staleTime: 5 * 60 * 1000 // 5 minutes
  })

  const todosQuery = useQuery({
    queryKey: ['dashboard', 'todos'],
    queryFn: fetchTodos,
    staleTime: 2 * 60 * 1000 // 2 minutes
  })

  const filteredTodos =
    todosQuery.data?.filter((todo) => todo.title.toLowerCase().includes(searchTerm.toLowerCase())) || []

  const handleRefresh = () => {
    statsQuery.refetch()
    todosQuery.refetch()
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-50 to-blue-50'>
      <div className='container mx-auto p-6'>
        <FadeIn>
          <div className='flex items-center justify-between mb-8'>
            <div>
              <h1 className='text-3xl font-bold text-gray-900'>Dashboard</h1>
              <p className='text-gray-600'>Welcome to your TanStack Query powered dashboard</p>
            </div>
            <div className='flex gap-2'>
              <Button
                variant='outline'
                size='sm'
                onClick={handleRefresh}
                disabled={statsQuery.isLoading || todosQuery.isLoading}
              >
                <RefreshCw
                  className={`h-4 w-4 mr-2 ${statsQuery.isLoading || todosQuery.isLoading ? 'animate-spin' : ''}`}
                />
                Refresh
              </Button>
              <Link href='/forms'>
                <Button size='sm'>View Forms</Button>
              </Link>
            </div>
          </div>
        </FadeIn>

        {/* Stats Cards */}
        <StaggerContainer className='grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8'>
          {statsQuery.isLoading
            ? Array.from({ length: 4 }).map((_, i) => (
                <StaggerItem key={i}>
                  <Card>
                    <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                      <CardTitle className='text-sm font-medium'>
                        <Skeleton className='h-4 w-24' />
                      </CardTitle>
                      <Skeleton className='h-4 w-4' />
                    </CardHeader>
                    <CardContent>
                      <div className='text-2xl font-bold'>
                        <Skeleton className='h-8 w-16' />
                      </div>
                      <div className='text-xs text-muted-foreground'>
                        <Skeleton className='h-3 w-12 mt-1' />
                      </div>
                    </CardContent>
                  </Card>
                </StaggerItem>
              ))
            : statsQuery.data?.map((stat) => (
                <StaggerItem key={stat.title}>
                  <Card>
                    <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                      <CardTitle className='text-sm font-medium'>{stat.title}</CardTitle>
                      <stat.icon className='h-4 w-4 text-muted-foreground' />
                    </CardHeader>
                    <CardContent>
                      <div className='text-2xl font-bold'>{stat.value}</div>
                      <p className={`text-xs ${stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'}`}>
                        {stat.change} from last month
                      </p>
                    </CardContent>
                  </Card>
                </StaggerItem>
              ))}
        </StaggerContainer>

        {/* Todos Section */}
        <FadeIn delay={0.3}>
          <Card>
            <CardHeader>
              <CardTitle>Tasks</CardTitle>
              <CardDescription>Manage your tasks with real-time updates</CardDescription>
              <div className='flex items-center space-x-2'>
                <Input
                  placeholder='Search tasks...'
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className='max-w-sm'
                />
              </div>
            </CardHeader>
            <CardContent>
              {todosQuery.isLoading ? (
                <div className='space-y-2'>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className='flex items-center space-x-3'>
                      <Skeleton className='h-4 w-4' />
                      <Skeleton className='h-4 flex-1' />
                    </div>
                  ))}
                </div>
              ) : (
                <div className='space-y-2'>
                  {filteredTodos.map((todo) => (
                    <div key={todo.id} className='flex items-center space-x-3 p-2 rounded hover:bg-gray-50'>
                      <input type='checkbox' checked={todo.completed} readOnly className='rounded' />
                      <span className={`flex-1 ${todo.completed ? 'line-through text-gray-500' : ''}`}>
                        {todo.title}
                      </span>
                    </div>
                  ))}
                  {filteredTodos.length === 0 && !todosQuery.isLoading && (
                    <p className='text-gray-500 text-center py-4'>
                      {searchTerm ? 'No tasks match your search.' : 'No tasks found.'}
                    </p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </FadeIn>
      </div>
    </div>
  )
}
