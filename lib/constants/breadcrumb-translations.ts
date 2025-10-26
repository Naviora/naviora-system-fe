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
  detail: 'Chi tiết',
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
