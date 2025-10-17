import { LecturerModulesPageClient } from '@/components/lecturer/modules'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Lecturer Modules'
}

export default function LecturerModulesPage() {
  return <LecturerModulesPageClient />
}
