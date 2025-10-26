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
import { useBreadcrumbLabel } from '@/lib/context/breadcrumb-context'
import { formatSegment } from '@/lib/constants/breadcrumb-translations'

export function Navbar() {
  const router = useRouter()
  const pathname = usePathname()
  const breadcrumbLabel = useBreadcrumbLabel()
  const segments = pathname.split('/').filter(Boolean)

  const breadcrumbs = segments.map((segment, index) => {
    const isLastSegment = index === segments.length - 1
    const isDynamicSegment = /^[a-f0-9\-]+$/i.test(segment) || /^[0-9]+$/.test(segment)

    return {
      href: `/${segments.slice(0, index + 1).join('/')}`,
      label: isLastSegment && isDynamicSegment && breadcrumbLabel ? breadcrumbLabel : formatSegment(segment),
      isId: isDynamicSegment
    }
  }).filter(b => b.label) // Filter out empty labels

  return (
    <nav className='flex h-16 min-h-16 items-center justify-between rounded-t-lg border-b border-border bg-greyscale-0 px-4'>
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
