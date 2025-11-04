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