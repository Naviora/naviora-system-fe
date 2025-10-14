import { RiHeadphoneFill, RiHome5Fill, RiBook2Fill, RiSettings2Fill } from 'react-icons/ri'
import { PiExamFill } from "react-icons/pi";
import type { IconType } from 'react-icons'
import type { UserRole } from '@/lib/constants/roles'

export interface NavigationItem {
  name: string
  href: string
  icon: IconType
  permissions?: string[]
}

export interface NavigationConfig {
  main: NavigationItem[]
  bottom: NavigationItem[]
}

const COMMON_BOTTOM_NAVIGATION: NavigationItem[] = [
  { name: 'Settings', href: '/settings', icon: RiSettings2Fill },
  { name: 'Help', href: '/help', icon: RiHeadphoneFill }
]

const COMMON_MAIN_NAVIGATION: NavigationItem[] = [{ name: 'Dashboard', href: '/dashboard', icon: RiHome5Fill }]

const ROLE_SPECIFIC_NAVIGATION = new Map<UserRole, NavigationItem[]>([
  [
    'Student',
    [
      { name: 'Tổng quan', href: '/student/dashboard', icon: RiHome5Fill },
      { name: 'Chuyên đề', href: '/student/modules', icon: RiBook2Fill }
    ]
  ],
  [
    'Lecturer',
    [
      { name: 'Tổng quan', href: '/lecturer/dashboard', icon: RiHome5Fill },
      { name: 'Chuyên đề', href: '/lecturer/modules', icon: RiBook2Fill },
      { name: 'Quản lý đề thi', href: '/lecturer/exams', icon: PiExamFill }
    ]
  ]
])

export const getNavigationConfig = (role?: UserRole | null): NavigationConfig => {
  if (!role) {
    return {
      main: [...COMMON_MAIN_NAVIGATION],
      bottom: [...COMMON_BOTTOM_NAVIGATION]
    }
  }

  const roleNavigation = ROLE_SPECIFIC_NAVIGATION.get(role)

  return {
    main: roleNavigation ? roleNavigation : [...COMMON_MAIN_NAVIGATION],
    bottom: [...COMMON_BOTTOM_NAVIGATION]
  }
}

export const getDefaultRouteForRole = (role?: UserRole | null) => {
  const fallbackRoute = COMMON_MAIN_NAVIGATION[0]?.href ?? '/dashboard'

  if (!role) {
    return fallbackRoute
  }

  const roleNavigation = ROLE_SPECIFIC_NAVIGATION.get(role)

  if (roleNavigation && roleNavigation.length > 0) {
    return roleNavigation[0].href
  }

  return fallbackRoute
}
