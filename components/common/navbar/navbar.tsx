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
import { useModuleDetail } from '@/hooks/api/use-modules'
import { useClassDetail } from '@/hooks/api/use-classes'

const formatSegment = (segment: string) =>
  decodeURIComponent(segment)
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')

// Helper function to check if a string is a module ID (UUID format or 24-char hex)
const isModuleId = (segment: string) => {
  // Check for UUID format (with or without hyphens): xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
  // Or 24-char hex string
  return /^[a-f0-9]{8}[-]?[a-f0-9]{4}[-]?[a-f0-9]{4}[-]?[a-f0-9]{4}[-]?[a-f0-9]{12}$|^[a-f0-9]{24}$/.test(segment)
}

// Helper function to check if a string is a class ID (UUID format)
const isClassId = (segment: string, pathSegments: string[]) => {
  // Check if this is in a /classes/ route
  const classIndex = pathSegments.indexOf('classes')
  if (classIndex === -1) return false
  
  // If segment is right after 'classes', it's likely a class ID
  const segmentIndex = pathSegments.indexOf(segment)
  return segmentIndex === classIndex + 1 && /^[a-f0-9]{8}[-]?[a-f0-9]{4}[-]?[a-f0-9]{4}[-]?[a-f0-9]{4}[-]?[a-f0-9]{12}$/.test(segment)
}

export function Navbar() {
  const router = useRouter()
  const pathname = usePathname()
  const segments = pathname.split('/').filter(Boolean)
  
  // Extract module ID from path (for principal/lecturer modules)
  const moduleId = segments.find((segment) => isModuleId(segment))
  
  // Extract class ID from path (for lecturer classes)
  let classId = ''
  const classIndex = segments.indexOf('classes')
  if (classIndex !== -1 && classIndex + 1 < segments.length) {
    const potentialClassId = segments[classIndex + 1]
    if (isClassId(potentialClassId, segments)) {
      classId = potentialClassId
    }
  }
  
  // Fetch module detail if we found a module ID
  const { data: moduleDetail } = useModuleDetail(moduleId || '')
  
  // Fetch class detail if we found a class ID
  const { data: classDetail } = useClassDetail(classId || '')

  const breadcrumbs = segments.map((segment, index) => {
    const href = `/${segments.slice(0, index + 1).join('/')}`
    let label = formatSegment(segment)
    
    // Replace module ID with module name if available
    if (moduleId === segment && moduleDetail) {
      label = moduleDetail.module_name || label
    }
    
    // Replace class ID with class name if available
    if (classId === segment && classDetail) {
      label = classDetail.class_name || label
    }
    
    return {
      href,
      label
    }
  })

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
