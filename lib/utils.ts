import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

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

export function formatDate(dateString: string, withTime = false) {
  const date = new Date(dateString)
  const pad = (n: number) => n.toString().padStart(2, '0')
  const d = pad(date.getDate())
  const m = pad(date.getMonth() + 1)
  const y = date.getFullYear()
  if (withTime) {
    const h = pad(date.getHours())
    const min = pad(date.getMinutes())
    return `${d}/${m}/${y} ${h}:${min}`
  }
  return `${d}/${m}/${y}`
}