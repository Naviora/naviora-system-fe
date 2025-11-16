'use client'

import React, { useState } from 'react'
import ManageReviewedExercise from '@/components/student/reviewed-exercise/manage-reviewed-exercise'
import ManageReviewedExerciseResult from '@/components/student/reviewed-exercise/manage-reviewed-exercise-result'
import type { SubmitReviewedExerciseResponse } from '@/hooks/api/lecturer/exams/use-reviewed-exercise-submission'
import { useParams } from 'next/navigation'

export default function ReviewedExercisePage() {
  const params = useParams()
  const reviewedExerciseId = params.reviewedExerciseId as string
  const [result, setResult] = useState<SubmitReviewedExerciseResponse>()
  const [duration, setDuration] = useState<number | null>(null)

  if (result) {
    return <ManageReviewedExerciseResult result={result} duration={duration ?? undefined} />
  }

  return (
    <ManageReviewedExercise
      reviewedExerciseId={reviewedExerciseId}
      onShowResult={(res, dur) => {
        setResult(res)
        setDuration(dur)
      }}
    />
  )
}
