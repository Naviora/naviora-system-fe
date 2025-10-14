/* eslint-disable @typescript-eslint/no-explicit-any */
import { Switch } from '@/components/ui/switch'
import React, { useState } from 'react'
import { FaRegEdit } from "react-icons/fa";
import { MdDeleteOutline } from "react-icons/md";

const QUESTION_TYPES = [
  'Tất cả',
  'Một đáp án đúng',
  'Nhiều đáp án đúng',
  'Đúng/Sai',
  'Điền vào chỗ trống',
  'Câu hỏi tổng hợp'
]

const DIFFICULTY_LEVELS = ['Tất cả', 'Dễ', 'Khá dễ', 'Trung bình', 'Khá khó', 'Khó']

const mockQuestions = [
  {
    id: 1,
    type: 'Một đáp án đúng',
    difficulty: 'Khá khó',
    question: 'Love or no love?',
    options: ['A.Sí', 'B.Yes', 'C.Có', 'D.Không'],
    answer: 'C.Có',
    createdAt: '2024/10/13 16:06'
  },
  {
    id: 2,
    type: 'Một đáp án đúng',
    difficulty: 'Khá khó',
    question: 'Love or no love?',
    options: ['A.Sí', 'B.Yes', 'C.Có', 'D.Không'],
    answer: 'C.Có',
    createdAt: '2024/10/13 16:06'
  },
  {
    id: 3,
    type: 'Nhiều đáp án đúng',
    difficulty: 'Trung bình',
    question: 'Which are fruits?',
    options: ['A.Apple', 'B.Carrot', 'C.Banana', 'D.Potato'],
    answer: 'A.Apple, C.Banana',
    createdAt: '2024/10/12 14:20'
  },
  {
    id: 4,
    type: 'Đúng/Sai',
    difficulty: 'Dễ',
    question: 'The sky is blue.',
    options: ['A.Đúng', 'B.Sai'],
    answer: 'A.Đúng',
    createdAt: '2024/10/10 09:00'
  }
]

function parseDate(str: string) {
  const [date, time] = str.split(' ')
  const [year, month, day] = date.split('/').map(Number)
  const [hour, minute] = time.split(':').map(Number)
  return new Date(year, month - 1, day, hour, minute)
}

interface ManageQuestionProps {
  onEdit: (data: any) => void
}

export default function ManageQuestion({ onEdit }: ManageQuestionProps) {
  const [selectedType, setSelectedType] = useState('Tất cả')
  const [selectedDifficulty, setSelectedDifficulty] = useState('Tất cả')
  const [sortNewest, setSortNewest] = useState(true)
  const [showAnswers, setShowAnswers] = useState(false)

  const filteredQuestions = mockQuestions
    .filter((q) => {
      const typeMatch = selectedType === 'Tất cả' || q.type === selectedType
      const diffMatch = selectedDifficulty === 'Tất cả' || q.difficulty === selectedDifficulty
      return typeMatch && diffMatch
    })
    .sort((a, b) => {
      const dateA = parseDate(a.createdAt)
      const dateB = parseDate(b.createdAt)
      return sortNewest ? dateB.getTime() - dateA.getTime() : dateA.getTime() - dateB.getTime()
    })

  return (
    <div className='bg-white rounded-lg shadow p-4'>
      <div className='flex flex-col gap-2 mb-4'>
        <div className='flex gap-4 flex-wrap items-center'>
          <span className='font-medium text-sm'>Loại đề</span>
          {QUESTION_TYPES.map((type) => (
            <button
              key={type}
              className={`text-sm px-2 py-1 rounded ${selectedType === type ? 'text-primary font-semibold' : 'text-gray-700 hover:bg-gray-100'}`}
              onClick={() => setSelectedType(type)}
            >
              {type}
            </button>
          ))}
        </div>
        <div className='flex gap-4 flex-wrap items-center'>
          <span className='font-medium text-sm'>Độ khó</span>
          {DIFFICULTY_LEVELS.map((level) => (
            <button
              key={level}
              className={`text-sm px-2 py-1 rounded ${selectedDifficulty === level ? 'text-primary font-semibold' : 'text-gray-700 hover:bg-gray-100'}`}
              onClick={() => setSelectedDifficulty(level)}
            >
              {level}
            </button>
          ))}
        </div>
      </div>

      {/* Sort & Total & Toggle Answer */}
      <div className='flex items-center justify-between mb-4'>
        <div className='flex gap-4 items-center'>
          <button
            className={`text-sm px-2 py-1 rounded border ${sortNewest ? 'bg-green-50 text-green-600 border-green-200' : 'bg-gray-50 text-gray-700 border-gray-200'}`}
            onClick={() => setSortNewest(true)}
          >
            Mới nhất ↑
          </button>
          <button
            className={`text-sm px-2 py-1 rounded border ${!sortNewest ? 'bg-green-50 text-green-600 border-green-200' : 'bg-gray-50 text-gray-700 border-gray-200'}`}
            onClick={() => setSortNewest(false)}
          >
            Cũ nhất ↓
          </button>
        </div>
        <div className='flex gap-4 items-center'>
          <div className='text-sm text-gray-600'>
            Tổng cộng <span className='font-semibold'>{filteredQuestions.length}</span> câu
          </div>
          <div className='flex items-center gap-2'>
            <label htmlFor='showAnswers' className='text-sm text-gray-700 cursor-pointer'>
              Hiển thị đáp án
            </label>
            <Switch id='showAnswers' checked={showAnswers} onCheckedChange={setShowAnswers} />
          </div>
        </div>
      </div>

      {/* Questions List */}
      <div className='space-y-6'>
        {filteredQuestions.map((q, idx) => (
          <div key={q.id} className='bg-gray-50 rounded-lg p-4 border'>
            <div className='flex gap-2 mb-2'>
              <span className='bg-gray-200 text-xs px-2 py-0.5 rounded'>{q.type}</span>
              <span className='bg-gray-200 text-xs px-2 py-0.5 rounded'>{q.difficulty}</span>
            </div>
            <div className='font-medium mb-2'>
              {idx + 1}. {q.question}
            </div>
            <ul className='mb-2'>
              {q.options.map((opt) => (
                <li key={opt} className='text-gray-700 text-sm'>
                  {opt}
                </li>
              ))}
            </ul>
            {showAnswers && (
              <div className='mb-2 text-green-700 text-sm'>
                <span className='font-semibold'>Đáp án: </span>
                {q.answer}
              </div>
            )}
            <div className='flex items-center justify-between text-sm text-gray-400'>
              <span>{q.createdAt}</span>
              <div className='flex gap-4'>
                <button className='text-gray-500 hover:text-primary flex items-center gap-1' onClick={() => onEdit(q)}>
                  <FaRegEdit />
                  <span>Chỉnh sửa</span>
                </button>
                <button className='text-error hover:underline flex items-center gap-1'>
                  <MdDeleteOutline />
                  <span>Xóa</span>
                </button>
              </div>
            </div>
          </div>
        ))}
        {filteredQuestions.length === 0 && (
          <div className='text-center text-gray-400 py-8'>Không có câu hỏi phù hợp.</div>
        )}
      </div>
    </div>
  )
}
