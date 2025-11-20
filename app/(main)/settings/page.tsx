'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { SectionHeader } from '@/components/common/section-header'
import { AvatarUpload } from '@/components/common/avatar-upload'
import { ProfileForm } from '@/components/common/profile-form'
import { useProfile } from '@/hooks/api/use-profile'
import { User, Shield, Bell, Mail } from 'lucide-react'

const pageVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.3,
      staggerChildren: 0.1
    }
  },
  exit: { opacity: 0 }
}

const contentVariants = {
  hidden: { opacity: 0, x: 20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.4 }
  },
  exit: { opacity: 0, x: -20, transition: { duration: 0.2 } }
}

type SettingSection = 'profile' | 'security' | 'notifications'

const navigationItems = [
  { id: 'profile' as SettingSection, label: 'Thông tin cá nhân', icon: User, description: 'Quản lý thông tin cá nhân' },
  { id: 'security' as SettingSection, label: 'Bảo mật', icon: Shield, description: 'Mật khẩu và bảo mật' },
  { id: 'notifications' as SettingSection, label: 'Thông báo', icon: Bell, description: 'Quản lý thông báo' }
]

export default function SettingsPage() {
  const { data: profile, isLoading, error } = useProfile()
  const [activeSection, setActiveSection] = useState<SettingSection>('profile')

  if (isLoading) {
    return (
      <div className='flex-1 overflow-y-auto p-6 bg-greyscale-25'>
        <div className='max-w-7xl mx-auto space-y-6'>
          <SectionHeader title='Cài đặt' />
          <div className='grid grid-cols-1 lg:grid-cols-4 gap-6'>
            <Card className='lg:col-span-1 p-4'>
              <Skeleton className='h-12 w-full mb-3' />
              <Skeleton className='h-12 w-full mb-3' />
              <Skeleton className='h-12 w-full' />
            </Card>
            <Card className='lg:col-span-3 p-6'>
              <Skeleton className='h-64 w-full' />
            </Card>
          </div>
        </div>
      </div>
    )
  }

  if (error || !profile) {
    return (
      <div className='flex-1 overflow-y-auto p-6 bg-greyscale-25'>
        <div className='max-w-7xl mx-auto space-y-6'>
          <SectionHeader title='Cài đặt' />
          <Card className='p-6 border-red-200 bg-red-50'>
            <p className='text-red-700'>Không thể tải thông tin cá nhân. Vui lòng thử lại sau.</p>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <motion.div
      className='flex-1 overflow-y-auto p-6 bg-greyscale-25'
      variants={pageVariants}
      initial='hidden'
      animate='visible'
    >
      <div className='max-w-7xl mx-auto space-y-6'>
        {/* Header */}
        <div className='flex items-center justify-between'>
          <div>
            <h1 className='text-3xl font-bold text-greyscale-900'>Cài đặt chung</h1>
            <p className='text-greyscale-600 mt-1'>Quản lý cài đặt tài khoản và tùy chọn cá nhân</p>
          </div>
        </div>

        {/* Main Content */}
        <div className='grid grid-cols-1 lg:grid-cols-4 gap-6'>
          {/* Sidebar Navigation */}
          <Card className='lg:col-span-1 p-4 h-fit'>
            <nav className='space-y-2'>
              {navigationItems.map((item) => {
                const Icon = item.icon
                const isActive = activeSection === item.id
                return (
                  <Button
                    key={item.id}
                    onClick={() => setActiveSection(item.id)}
                    variant={isActive ? 'default' : 'ghost'}
                    size='default'
                    className='w-full justify-start gap-3 h-auto py-3'
                  >
                    <Icon className='w-5 h-5' />
                    <span className='text-sm'>{item.label}</span>
                  </Button>
                )
              })}
            </nav>
          </Card>

          {/* Content Area */}
          <div className='lg:col-span-3'>
            <AnimatePresence mode='wait'>
              {activeSection === 'profile' && (
                <motion.div
                  key='profile'
                  variants={contentVariants}
                  initial='hidden'
                  animate='visible'
                  exit='exit'
                  className='space-y-6'
                >
                  {/* Profile Header Card */}
                  <Card className='p-6 border-greyscale-200'>
                    <div className='flex items-center gap-6'>
                      <div className='relative'>
                        <div className='w-24 h-24 rounded-full overflow-hidden border-2 border-greyscale-200'>
                          {profile.avatar ? (
                            <Image
                              src={profile.avatar}
                              alt={profile.name}
                              width={96}
                              height={96}
                              className='w-full h-full object-cover'
                            />
                          ) : (
                            <div className='w-full h-full bg-greyscale-100 flex items-center justify-center'>
                              <User className='w-12 h-12 text-greyscale-600' />
                            </div>
                          )}
                        </div>
                      </div>
                      <div className='flex-1'>
                        <h2 className='text-2xl font-bold text-greyscale-900'>{profile.name}</h2>
                        <p className='text-greyscale-600 flex items-center gap-2 mt-1'>
                          <Mail className='w-4 h-4' />
                          {profile.email}
                        </p>
                        <div className='flex gap-2 mt-3'>
                          <span className='inline-flex items-center px-3 py-1 rounded-md text-xs font-medium border border-greyscale-300 text-greyscale-700'>
                            {profile.role}
                          </span>
                          <span className='inline-flex items-center px-3 py-1 rounded-md text-xs font-medium border border-greyscale-300 text-greyscale-700'>
                            {profile.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Card>

                  {/* Avatar Upload Card */}
                  <Card className='p-6'>
                    <div className='mb-4'>
                      <h3 className='text-lg font-semibold text-greyscale-900'>Ảnh đại diện</h3>
                      <p className='text-sm text-greyscale-600'>Cập nhật ảnh đại diện của bạn</p>
                    </div>
                    <AvatarUpload currentAvatar={profile.avatar} userName={profile.name} />
                  </Card>

                  {/* Personal Information Card */}
                  <Card className='p-6'>
                    <div className='mb-4'>
                      <h3 className='text-lg font-semibold text-greyscale-900'>Thông tin cá nhân</h3>
                      <p className='text-sm text-greyscale-600'>Cập nhật thông tin cá nhân của bạn</p>
                    </div>
                    <ProfileForm profile={profile} />
                  </Card>
                </motion.div>
              )}

              {activeSection === 'security' && (
                <motion.div key='security' variants={contentVariants} initial='hidden' animate='visible' exit='exit'>
                  <Card className='p-6'>
                    <div className='mb-4'>
                      <h3 className='text-lg font-semibold text-greyscale-900'>Cài đặt bảo mật</h3>
                      <p className='text-sm text-greyscale-600'>Quản lý mật khẩu và bảo mật tài khoản</p>
                    </div>
                    <div className='py-12 text-center'>
                      <Shield className='w-16 h-16 text-greyscale-300 mx-auto mb-4' />
                      <p className='text-greyscale-600'>Tính năng bảo mật sẽ sớm được cập nhật...</p>
                    </div>
                  </Card>
                </motion.div>
              )}

              {activeSection === 'notifications' && (
                <motion.div
                  key='notifications'
                  variants={contentVariants}
                  initial='hidden'
                  animate='visible'
                  exit='exit'
                >
                  <Card className='p-6'>
                    <div className='mb-4'>
                      <h3 className='text-lg font-semibold text-greyscale-900'>Cài đặt thông báo</h3>
                      <p className='text-sm text-greyscale-600'>Quản lý cách bạn nhận thông báo từ hệ thống</p>
                    </div>
                    <div className='py-12 text-center'>
                      <Bell className='w-16 h-16 text-greyscale-300 mx-auto mb-4' />
                      <p className='text-greyscale-600'>Tính năng thông báo sẽ sớm được cập nhật...</p>
                    </div>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
