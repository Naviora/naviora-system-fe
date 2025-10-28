import { getNavigationConfig } from '@/lib/constants/navigation'
import type { UserRole } from '@/lib/constants/roles'

// Route segment translations to Vietnamese
export const SEGMENT_TRANSLATIONS: Record<string, string> = {
  // Roles
  lecturer: 'Giảng viên',
  principal: 'Quản lý',
  student: 'Học viên',

  // Routes
  classes: 'Quản lý lớp học',
  modules: 'Quản lý chuyên đề',
  students: 'Danh sách học viên',
  exams: 'Quản lý bài thi',
  materials: 'Tài liệu học',
  calendar: 'Lịch học',

  // Common
  management: 'Quản lý',
  dashboard: 'Bảng điều khiển',
  list: 'Danh sách',
  detail: 'Chi tiết'
}

/**
 * Get segment translation for a specific role
 * Checks ROLE_SPECIFIC_NAVIGATION first to get role-specific labels
 * Falls back to SEGMENT_TRANSLATIONS if not found
 */
export function getSegmentTranslation(segment: string, role?: UserRole | null): string {
  if (!role) {
    return SEGMENT_TRANSLATIONS[segment] || ''
  }

  try {
    const navigationConfig = getNavigationConfig(role)
    const mainNav = navigationConfig.main

    // Look for the segment in the navigation items
    const navItem = mainNav.find((item) => {
      const itemSegment = item.href.split('/').pop()
      return itemSegment === segment
    })

    if (navItem) {
      return navItem.name
    }
  } catch (error) {
    // If there's any error, fall back to default translation
    console.warn(`Error getting navigation config for role ${role}:`, error)
  }

  // Fallback to standard translation
  return SEGMENT_TRANSLATIONS[segment] || ''
}

export function formatSegment(segment: string): string {
  // Check if it's a translation
  if (SEGMENT_TRANSLATIONS[segment]) {
    return SEGMENT_TRANSLATIONS[segment]
  }

  // Check if it looks like an ID (UUID or similar)
  if (/^[a-f0-9\-]+$/i.test(segment) || /^[0-9]+$/.test(segment)) {
    return '' // Skip IDs
  }

  // Fallback: capitalize first letter
  return segment.charAt(0).toUpperCase() + segment.slice(1)
}
