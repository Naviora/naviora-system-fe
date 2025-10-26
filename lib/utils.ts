import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const DEFAULT_DATETIME_OPTIONS: Intl.DateTimeFormatOptions = {
  dateStyle: 'medium',
  timeStyle: 'short'
}

export function formatDateTime(
  value: string | number | Date,
  options: Intl.DateTimeFormatOptions = DEFAULT_DATETIME_OPTIONS,
  locale = 'vi-VN'
) {
  const date = value instanceof Date ? value : new Date(value)

  if (Number.isNaN(date.getTime())) {
    return ''
  }

  return new Intl.DateTimeFormat(locale, options).format(date)
}
//Function tính thời gian đã qua bao lâu
export function timeAgo(dateString: string) {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffSec = Math.floor(diffMs / 1000)
  const diffMin = Math.floor(diffSec / 60)
  const diffHour = Math.floor(diffMin / 60)
  const diffDay = Math.floor(diffHour / 24)

  if (diffDay > 0) return `${diffDay} ngày trước`
  if (diffHour > 0) return `${diffHour} giờ trước`
  if (diffMin > 0) return `${diffMin} phút trước`
  return `Vừa xong`
}
