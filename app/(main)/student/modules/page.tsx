import { StudentModulesPageClient } from '@/components/student/modules'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Student Modules'
}

export default function StudentModulesPage() {
  return <StudentModulesPageClient />
}