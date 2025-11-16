/* eslint-disable @typescript-eslint/no-explicit-any */
import { set, get, del } from 'idb-keyval'

const EXAM_TEST_KEY = 'exam-test-progress'

export async function saveEXAMTestProgress(data: any) {
  await set(EXAM_TEST_KEY, data)
}

export async function loadEXAMTestProgress() {
  return await get(EXAM_TEST_KEY)
}

export async function clearEXAMTestProgress() {
  await del(EXAM_TEST_KEY)
}

const QUESTION_SET_KEY = 'question-set'

export async function saveQuestionSet(data: any) {
  await set(QUESTION_SET_KEY, data)
}

export async function loadQuestionSet() {
  return await get(QUESTION_SET_KEY)
}

export async function clearQuestionSet() {
  await del(QUESTION_SET_KEY)
}

const REVIEWED_EXERCISE_SESSION_KEY = 'reviewed-exercise-session'

export type ReviewedExerciseSessionPayload = {
  reviewed_exercise_id: string
  question_set_id: string
  reviewed_exercise_submission_id: string
  attempt_status: 'IN_PROGRESS' | 'SUBMITTED' | 'GRADED' | 'CANCELLED'
  student_id?: string
  created_at?: string
  updated_at?: string
}

export async function saveReviewedExerciseSession(data: ReviewedExerciseSessionPayload) {
  await set(REVIEWED_EXERCISE_SESSION_KEY, data)
}

export async function loadReviewedExerciseSession(): Promise<ReviewedExerciseSessionPayload | undefined> {
  return await get(REVIEWED_EXERCISE_SESSION_KEY)
}

export async function clearReviewedExerciseSession() {
  await del(REVIEWED_EXERCISE_SESSION_KEY)
}
