export interface LecturerModuleSummary {
  id: string
  level: string
  code: string
  title: string
  thumbnail: string
}

export interface LecturerModuleStat {
  id: string
  label: string
  value: string
}

export interface LecturerModuleLesson {
  id: string
  title: string
  duration: string
  resources?: number
  type?: 'video' | 'document' | 'quiz' | 'assignment' | 'other'
}

export interface LecturerModuleSection {
  id: string
  title: string
  summary: string
  resourceCount: number
  duration: string
  lessons: LecturerModuleLesson[]
  isExpanded?: boolean
}

export interface LecturerModuleDetail extends LecturerModuleSummary {
  subtitle: string
  description: string
  stats: LecturerModuleStat[]
  sections: LecturerModuleSection[]
}

export type LecturerModuleMap = Record<string, LecturerModuleDetail>
