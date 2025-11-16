import { Metadata } from 'next'
import { StudentFinalExamsPageClient } from '@/components/student/final-exams/student-final-exams-page'

export const metadata: Metadata = {
  title: 'Bài thi cuối kỳ của tôi'
}

export default function StudentFinalExamsPage() {
  return <StudentFinalExamsPageClient />
}
