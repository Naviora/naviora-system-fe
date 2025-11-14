import { RiHeadphoneFill, RiHome5Fill, RiBook2Fill, RiSettings2Fill, RiCalendarFill, RiGroupFill } from 'react-icons/ri'
import { PiExamFill } from 'react-icons/pi'
import type { IconType } from 'react-icons'
import { z } from 'zod'

import type { UserRole } from '@/lib/constants/roles'

const iconSchema = z.custom<IconType>((value) => typeof value === 'function', {
  message: 'Icon must be a valid icon component'
})

export const navigationItemSchema = z.object({
  name: z.string(),
  href: z.string(),
  icon: iconSchema,
  permissions: z.array(z.string()).optional()
})

export type NavigationItem = z.infer<typeof navigationItemSchema>

const navigationItemsSchema = z.array(navigationItemSchema)

export const navigationConfigSchema = z.object({
  main: navigationItemsSchema,
  bottom: navigationItemsSchema
})

export type NavigationConfig = z.infer<typeof navigationConfigSchema>

const COMMON_BOTTOM_NAVIGATION = navigationItemsSchema.parse([
  { name: 'Settings', href: '/settings', icon: RiSettings2Fill },
  { name: 'Help', href: '/help', icon: RiHeadphoneFill }
])

const COMMON_MAIN_NAVIGATION = navigationItemsSchema.parse([
  { name: 'Dashboard', href: '/dashboard', icon: RiHome5Fill },
  { name: 'Calendar', href: '/calendar', icon: RiCalendarFill }
])

const STUDENT_MAIN_NAVIGATION = navigationItemsSchema.parse([
  { name: 'Tổng quan', href: '/student/dashboard', icon: RiHome5Fill },
  { name: 'Lịch', href: '/calendar', icon: RiCalendarFill },
  { name: 'Chuyên đề', href: '/student/modules', icon: RiBook2Fill }
])

const LECTURER_MAIN_NAVIGATION = navigationItemsSchema.parse([
  { name: 'Tổng quan', href: '/lecturer/dashboard', icon: RiHome5Fill },
  { name: 'Lịch', href: '/calendar', icon: RiCalendarFill },
  { name: 'Quản lý chuyên đề', href: '/lecturer/modules', icon: RiBook2Fill },
  { name: 'Quản lý lớp', href: '/lecturer/classes', icon: RiGroupFill },
  { name: 'Quản lý đề thi', href: '/lecturer/exams', icon: PiExamFill }
])

const PRINCIPAL_MAIN_NAVIGATION = navigationItemsSchema.parse([
  { name: 'Tổng quan', href: '/principal/dashboard', icon: RiHome5Fill },
  { name: 'Quản lý chuyên đề', href: '/principal/modules', icon: RiBook2Fill },
  { name: 'Quản lý lớp', href: '/principal/classes', icon: RiGroupFill },
  { name: 'Quản lý bài thi', href: '/principal/exams', icon: PiExamFill }
])

const ADMIN_MAIN_NAVIGATION = navigationItemsSchema.parse([
  { name: 'Tổng quan', href: '/admin/dashboard', icon: RiHome5Fill },
  { name: 'Lịch', href: '/calendar', icon: RiCalendarFill },
  { name: 'Quản lý chuyên đề', href: '/admin/modules', icon: RiBook2Fill }
])

const ROLE_SPECIFIC_NAVIGATION = new Map<UserRole, NavigationItem[]>([
  ['Student', STUDENT_MAIN_NAVIGATION],
  ['Lecturer', LECTURER_MAIN_NAVIGATION],
  ['Principal', PRINCIPAL_MAIN_NAVIGATION],
  ['Admin', ADMIN_MAIN_NAVIGATION]
])

export const getNavigationConfig = (role?: UserRole | null): NavigationConfig => {
  if (!role) {
    return navigationConfigSchema.parse({
      main: [...COMMON_MAIN_NAVIGATION],
      bottom: [...COMMON_BOTTOM_NAVIGATION]
    })
  }

  const roleNavigation = ROLE_SPECIFIC_NAVIGATION.get(role)

  return navigationConfigSchema.parse({
    main: roleNavigation ? [...roleNavigation] : [...COMMON_MAIN_NAVIGATION],
    bottom: [...COMMON_BOTTOM_NAVIGATION]
  })
}

export const getDefaultRouteForRole = (role?: UserRole | null) => {
  const fallbackRoute = COMMON_MAIN_NAVIGATION[0]?.href ?? '/'

  if (!role) {
    return fallbackRoute
  }

  const roleNavigation = ROLE_SPECIFIC_NAVIGATION.get(role)

  if (roleNavigation && roleNavigation.length > 0) {
    return roleNavigation[0].href
  }

  return fallbackRoute
}
