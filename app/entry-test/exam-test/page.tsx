'use client'
import React, { useState } from 'react'
import ManageEntryTest from '@/components/entry-test/manage-entry-test'
import ManageTestResult from '@/components/entry-test/manage-test-result'
import { SubmitEntryTestResponse } from '@/lib/validations/lecturer/exams/entry-test'

export default function EntryTestPage() {
  const [result, setResult] = useState<SubmitEntryTestResponse>()
  const [duration, setDuration] = useState<number | null>(null)

  if (result) {
    return <ManageTestResult result={result} duration={duration ?? undefined} />
  }

  return (
    <ManageEntryTest
      onShowResult={(res, dur) => {
        setResult(res)
        setDuration(dur)
      }}
    />
  )
}