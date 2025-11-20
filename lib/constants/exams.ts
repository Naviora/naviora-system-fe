
export const QUESTION_TYPES = [
  { value: 'ALL', label: 'Tất cả' },
  { value: 'MATCHING', label: 'Ghép nối' },
  { value: 'MULTI_CHOICE', label: 'Trắc nghiệm' },
  { value: 'TRUE_FALSE', label: 'Đúng/Sai' },
  { value: 'SHORT_ANSWER', label: 'Câu trả lời ngắn' },
  { value: 'ESSAY ', label: 'Tự luận' }
]

export const DIFFICULTY_LEVELS = [
  { value: 'ALL', label: 'Tất cả' },
  { value: 'EASY', label: 'Dễ' },
  { value: 'MEDIUM', label: 'Trung bình' },
  { value: 'HARD', label: 'Khó' }
]

export const ENTRY_TEST_STATUS = [
  { value: "ACTIVE", label: "Đang mở"},
  { value: "CLOSED", label: "Đã đóng"},
  { value: "DRAFT", label: "Chưa mở"},
  { value: "ARCHIVED", label: "Đã lưu trữ"},
  { value: "PENDING", label: "Đang dừng"},
  { value: "ENDED", label: "Đã kết thúc"},
]

export const getTypeLabel = (value: string) =>
  QUESTION_TYPES.find(t => t.value === value)?.label || value

export const getDifficultyLabel = (value: string) =>
  DIFFICULTY_LEVELS.find(d => d.value === value)?.label || value

export const getEntryTestStatus = (value: string) =>
  ENTRY_TEST_STATUS.find(e => e.value === value)?.label || value