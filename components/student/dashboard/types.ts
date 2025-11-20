import type { LucideIcon } from 'lucide-react'

export type StatDelta = {
  direction: 'up' | 'down'
  value: string
  description: string
}

export type StatCardConfig = {
  id: string
  title: string
  value: string
  icon: LucideIcon
  accent?: string
  delta: StatDelta
}

export type LearningDataPoint = {
  day: number
  hours: number
}

export type CourseCardConfig = {
  id: string
  moduleName: string
  classType: string
  class_name: string
  lecturerName: string[]
  progress: number
  thumbnail: string
}

export type BadgeCardConfig = {
  id: string
  title: string
  description: string
  icon: LucideIcon
  accent: string
}

export type CategoryConfig = {
  id: string
  label: string
  percentage: number
}

export type EmptyStateSuggestion = {
  id: string
  title: string
  description: string
  icon: LucideIcon
}
