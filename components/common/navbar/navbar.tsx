'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react'

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb'
import { Button } from '@/components/ui/button'
import { ThemeToggleSimple } from '@/components/ui/theme-toggle'
import { NotificationBell } from './notification-bell'
import { AvatarDropdown } from './avatar-dropdown'

const formatSegment = (segment: string) =>
  decodeURIComponent(segment)
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')

export function Navbar() {
  const router = useRouter()
  const pathname = usePathname()
  const segments = pathname.split('/').filter(Boolean)

  const breadcrumbs = segments.map((segment, index) => ({
    href: `/${segments.slice(0, index + 1).join('/')}`,
    label: formatSegment(segment)
  }))

  return (
    <nav className='flex h-16 min-h-16 items-center justify-between rounded-t-lg border-b border-border bg-card px-4'>
      {/* Left Section: Navigation + Breadcrumb */}
      <div className='flex items-center gap-4'>
        {/* Navigation Buttons */}
        <div className='flex gap-1'>
          <Button
            variant='secondary'
            size='icon'
            className='size-8'
            type='button'
            aria-label='Go back'
            onClick={() => router.back()}
          >
            <ChevronLeftIcon className='h-4 w-4' />
          </Button>
          <Button
            variant='secondary'
            size='icon'
            className='size-8'
            type='button'
            aria-label='Go forward'
            onClick={() => router.forward()}
          >
            <ChevronRightIcon className='h-4 w-4' />
          </Button>
        </div>

        {/* Breadcrumb */}
        {breadcrumbs.length > 0 && (
          <Breadcrumb>
            <BreadcrumbList>
              {breadcrumbs.map((crumb, index) => (
                <React.Fragment key={crumb.href}>
                  {index > 0 && <BreadcrumbSeparator>/</BreadcrumbSeparator>}
                  <BreadcrumbItem>
                    {index === breadcrumbs.length - 1 ? (
                      <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink asChild>
                        <Link href={crumb.href}>{crumb.label}</Link>
                      </BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                </React.Fragment>
              ))}
            </BreadcrumbList>
          </Breadcrumb>
        )}
      </div>

      {/* Right Section: Actions */}
      <div className='flex items-center gap-3'>
        {/* Notification Bell */}
        <NotificationBell />

        {/* Theme Toggle */}
        <ThemeToggleSimple />

        {/* Avatar Dropdown */}
        <AvatarDropdown />
      </div>
    </nav>
  )
}
