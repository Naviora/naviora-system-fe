import { z } from 'zod'

// Common schemas
const userSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  avatar: z.string().nullable(),
  phone: z.string(),
  address: z.string(),
  gender: z.string(),
  date_of_birth: z.string(),
  status: z.string(),
  office_phone_number: z.string().nullable(),
  point: z.any().nullable(),
  username: z.string().nullable(),
  has_participated_entry_test: z.boolean(),
  created_at: z.string(),
  updated_at: z.string(),
  deleted_at: z.string().nullable(),
  version: z.number()
})

const roleSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string(),
  is_active: z.boolean(),
  permissions: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
  deleted_at: z.string().nullable(),
  version: z.number()
})

const questionSetConfigSchema = z.object({
  general: z.object({
    allow_review: z.boolean(),
    shuffle_answers: z.boolean(),
    total_questions: z.number(),
    duration_minutes: z.number(),
    shuffle_questions: z.boolean()
  }),
  scoring: z.object({
    per_question: z.boolean(),
    passing_score: z.number()
  }),
  behavior: z.object({
    max_attempts: z.number(),
    show_correct_after_submit: z.boolean()
  }),
  proctoring: z.object({
    enable_tab_tracking: z.boolean(),
    enable_copy_paste_restriction: z.boolean()
  }),
  composition: z.object({
    topics: z.array(z.string()),
    question_sources: z.array(z.string())
  })
})

const questionSetSchema = z.object({
  question_set_id: z.string(),
  title: z.string(),
  description: z.string(),
  questions: z.array(z.string()),
  config: questionSetConfigSchema,
  is_in_use: z.boolean(),
  created_at: z.string(),
  updated_at: z.string(),
  deleted_at: z.string().nullable(),
  version: z.number()
})

const answeredSchema = z.array(
  z.object({
    question_id: z.string(),
    answer_id: z.string()
  })
)

// Entry Test CRUD
export const createEntryTestSchema = z.object({
  title: z.string(),
  description: z.string(),
  startTime: z.string(),
  endTime: z.string(),
  questionSets: z.array(z.string())
})

export const entryTestSchema = z.object({
  entry_test_id: z.string(),
  title: z.string(),
  description: z.string(),
  status: z.enum(['ACTIVE', 'CLOSED', 'DRAFT', 'ARCHIVED', 'PENDING', 'ENDED']),
  start_time: z.string(),
  end_time: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
  deleted_at: z.string().nullable(),
  version: z.number(),
  question_sets: z.array(z.string()),
  created_by: userSchema.extend({ role: roleSchema }),
  updated_by: z.any().nullable()
})

export const getEntryTestsResponseSchema = z.object({
  entry_tests: z.array(entryTestSchema),
  pagination: z.object({
    limit: z.number(),
    current_page: z.number(),
    total_records: z.number(),
    total_pages: z.number()
  })
})

// Start entry test
export const startEntryTestResponseSchema = z.object({
  student_id: z.string(),
  entry_test_id: z.string(),
  question_set_id: z.string(),
  attempt_status: z.enum(['IN_PROGRESS', 'SUBMITTED', 'PENDING', 'CANCELLED']),
  score: z.number().nullable(),
  answered: z.any().nullable(),
  penalty: z.number().nullable(),
  note: z.string().nullable(),
  submitted_at: z.string().nullable(),
  created_at: z.string(),
  updated_at: z.string(),
  deleted_at: z.string().nullable(),
  version: z.number(),
  entry_test_submission_id: z.string()
})

// Submit entry test
export const submitEntryTestSchema = z.object({
  answered: z.array(
    z.object({
      questionId: z.string(),
      answerId: z.string()
    })
  )
})

export const submitEntryTestResponseSchema = z.object({
  entry_test_submission_id: z.string(),
  student_id: z.string(),
  entry_test_id: z.string(),
  question_set_id: z.string(),
  attempt_status: z.enum(['IN_PROGRESS', 'SUBMITTED', 'PENDING', 'CANCELLED']),
  score: z.number().nullable(),
  answered: answeredSchema,
  penalty: z.number().nullable(),
  note: z.string().nullable(),
  submitted_at: z.string().nullable(),
  created_at: z.string(),
  updated_at: z.string(),
  deleted_at: z.string().nullable(),
  version: z.number(),
  student: userSchema,
  entry_test: z.object({
    entry_test_id: z.string(),
    title: z.string(),
    description: z.string(),
    status: z.string(),
    start_time: z.string(),
    end_time: z.string(),
    created_at: z.string(),
    updated_at: z.string(),
    deleted_at: z.string().nullable(),
    version: z.number()
  }),
  question_set: questionSetSchema
})

// Types
export type CreateEntryTestRequest = z.infer<typeof createEntryTestSchema>
export type EntryTest = z.infer<typeof entryTestSchema>
export type GetEntryTestsResponse = z.infer<typeof getEntryTestsResponseSchema>
export type StartEntryTestResponse = z.infer<typeof startEntryTestResponseSchema>
export type SubmitEntryTestRequest = z.infer<typeof submitEntryTestSchema>
export type SubmitEntryTestResponse = z.infer<typeof submitEntryTestResponseSchema>
