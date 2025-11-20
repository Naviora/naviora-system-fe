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

export function formatDate(value: string | number | Date, locale = 'vi-VN') {
  const date = value instanceof Date ? value : new Date(value)

  if (Number.isNaN(date.getTime())) {
    return ''
  }

  return new Intl.DateTimeFormat(locale, { dateStyle: 'medium' }).format(date)
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

export type ExamCountdownPhase = 'UPCOMING' | 'ONGOING' | 'ENDED'

export interface ExamCountdownState {
  phase: ExamCountdownPhase
  secondsRemaining: number
  label: string
}

export function formatDurationShort(totalSeconds: number) {
  const seconds = Math.max(0, Math.floor(totalSeconds))
  const days = Math.floor(seconds / 86400)
  const hours = Math.floor((seconds % 86400) / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60

  if (seconds === 0) {
    return '00:00'
  }

  if (days > 0) {
    return `${days}d ${hours}h`
  }

  if (hours > 0) {
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs
      .toString()
      .padStart(2, '0')}`
  }

  return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

export function getCountdownParts(totalSeconds: number) {
  const seconds = Math.max(0, Math.floor(totalSeconds))
  const days = Math.floor(seconds / 86400)
  const hours = Math.floor((seconds % 86400) / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60

  return { days, hours, minutes, seconds: secs }
}

export function getExamCountdownState(
  startTime: string | number | Date,
  endTime: string | number | Date,
  nowInput?: number | Date
): ExamCountdownState {
  const start = new Date(startTime).getTime()
  const end = new Date(endTime).getTime()
  const now = typeof nowInput === 'number' ? nowInput : nowInput ? new Date(nowInput).getTime() : Date.now()

  if (Number.isNaN(start) || Number.isNaN(end)) {
    return {
      phase: 'ENDED',
      secondsRemaining: 0,
      label: 'Không xác định'
    }
  }

  if (now < start) {
    const secondsRemaining = Math.max(0, Math.floor((start - now) / 1000))
    return {
      phase: 'UPCOMING',
      secondsRemaining,
      label: `Bắt đầu trong ${formatDurationShort(secondsRemaining)}`
    }
  }

  if (now >= start && now <= end) {
    const secondsRemaining = Math.max(0, Math.floor((end - now) / 1000))
    return {
      phase: 'ONGOING',
      secondsRemaining,
      label: `Còn lại ${formatDurationShort(secondsRemaining)}`
    }
  }

  return {
    phase: 'ENDED',
    secondsRemaining: 0,
    label: 'Đã kết thúc'
  }
}

/**
 * Convert camelCase object keys to snake_case
 */
export function camelToSnakeCase(obj: Record<string, unknown>): Record<string, unknown> {
  const snakeCase: Record<string, unknown> = {}

  for (const [key, value] of Object.entries(obj)) {
    const snakeKey = key.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`)
    snakeCase[snakeKey] = value
  }

  return snakeCase
}
