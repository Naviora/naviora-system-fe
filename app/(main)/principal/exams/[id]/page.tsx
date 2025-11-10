'use client'

import { use } from 'react'
import { EntryTestDetailPageClient } from '@/components/principal/exams'

interface EntryTestDetailPageProps {
  params: Promise<{
    id: string
  }>
}

export default function EntryTestDetailPage({ params }: EntryTestDetailPageProps) {
  const { id } = use(params)

  return <EntryTestDetailPageClient entryTestId={id} />
}
