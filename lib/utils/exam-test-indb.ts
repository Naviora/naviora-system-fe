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