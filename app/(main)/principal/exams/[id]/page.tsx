'use client'

import { use } from 'react'
import { useSearchParams } from 'next/navigation'
import { EntryTestDetailPageClient } from '@/components/principal/exams'
import { FinalExamDetailPageClient } from '@/components/principal/exams'

interface ExamDetailPageProps {
  params: Promise<{
    id: string
  }>
}

export default function ExamDetailPage({ params }: ExamDetailPageProps) {
  const { id } = use(params)
  const searchParams = useSearchParams()
  const type = searchParams.get('type') || 'entry-test'

  return type === 'final-exam' ? (
    <FinalExamDetailPageClient finalExamId={id} />
  ) : (
    <EntryTestDetailPageClient entryTestId={id} />
  )
}
