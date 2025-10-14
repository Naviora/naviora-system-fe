import type { LecturerModuleDetail, LecturerModuleMap, LecturerModuleSummary } from '@/types/lecturer/modules'

export const LECTURER_MODULES: LecturerModuleDetail[] = [
  {
    id: '1',
    level: 'Cấp Tỉnh',
    code: 'BILO101',
    title: 'Tế bào học nâng cao',
    subtitle: 'Quản lý các bài học',
    description:
      'Khám phá cấu trúc, chức năng và các cơ chế phân chia của tế bào nhằm chuẩn bị cho các nghiên cứu chuyên sâu trong sinh học hiện đại.',
    thumbnail: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=640&q=80',
    stats: [
      { id: 'lessons', label: 'Số bài học', value: '2' },
      { id: 'resources', label: 'Tổng số tài liệu', value: '3' },
      { id: 'duration', label: 'Tổng thời lượng', value: '2 tiếng 50 phút' },
      { id: 'students', label: 'Số học viên', value: '21' }
    ],
    sections: [
      {
        id: 'section-intro',
        title: 'Bắt đầu',
        summary: '2 tài liệu • 16 phút',
        resourceCount: 2,
        duration: '16 phút',
        lessons: [
          {
            id: 'lesson-intro-1',
            title: 'Giới thiệu về tế bào học nâng cao',
            duration: '10:00',
            resources: 2,
            type: 'video'
          },
          {
            id: 'lesson-intro-2',
            title: 'Khái niệm cơ bản',
            duration: '06:00',
            resources: 1,
            type: 'video'
          }
        ],
        isExpanded: true
      },
      {
        id: 'section-core',
        title: 'Khái niệm cốt lõi',
        summary: '2 tài liệu • 40 phút',
        resourceCount: 2,
        duration: '40 phút',
        lessons: [
          {
            id: 'lesson-core-1',
            title: 'Cấu trúc màng tế bào',
            duration: '18:00',
            resources: 1,
            type: 'video'
          },
          {
            id: 'lesson-core-2',
            title: 'Chu trình phân bào nâng cao',
            duration: '22:00',
            resources: 1,
            type: 'document'
          }
        ],
        isExpanded: false
      }
    ]
  },
  {
    id: '2',
    level: 'Cấp Tỉnh',
    code: 'BILO204',
    title: 'Sinh lý học ứng dụng',
    subtitle: 'Theo dõi tiến độ học tập',
    description:
      'Xây dựng nền tảng sinh lý học vững chắc với các ví dụ thực tiễn trong điều trị và chăm sóc sức khỏe cộng đồng.',
    thumbnail: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?auto=format&fit=crop&w=640&q=80',
    stats: [
      { id: 'lessons', label: 'Số bài học', value: '4' },
      { id: 'resources', label: 'Tổng số tài liệu', value: '5' },
      { id: 'duration', label: 'Tổng thời lượng', value: '3 tiếng 15 phút' },
      { id: 'students', label: 'Số học viên', value: '18' }
    ],
    sections: [
      {
        id: 'section-physiology-basics',
        title: 'Nền tảng sinh lý',
        summary: '3 tài liệu • 75 phút',
        resourceCount: 3,
        duration: '75 phút',
        lessons: [
          {
            id: 'lesson-physiology-1',
            title: 'Tổng quát về hệ thần kinh',
            duration: '30:00',
            resources: 1,
            type: 'video'
          },
          {
            id: 'lesson-physiology-2',
            title: 'Điều hòa nội môi',
            duration: '20:00',
            resources: 1,
            type: 'document'
          },
          {
            id: 'lesson-physiology-3',
            title: 'Sinh lý cơ bắp ứng dụng',
            duration: '25:00',
            resources: 1,
            type: 'video'
          }
        ],
        isExpanded: true
      }
    ]
  },
  {
    id: '3',
    level: 'Cấp Trường',
    code: 'BILO305',
    title: 'Cơ sinh học nâng cao',
    subtitle: 'Đi sâu vào cơ chế chuyển động',
    description:
      'Phân tích chi tiết cơ chế chuyển động của cơ thể con người với các mô phỏng và bài tập nghiên cứu chuyên sâu.',
    thumbnail: 'https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=640&q=80',
    stats: [
      { id: 'lessons', label: 'Số bài học', value: '5' },
      { id: 'resources', label: 'Tổng số tài liệu', value: '6' },
      { id: 'duration', label: 'Tổng thời lượng', value: '4 tiếng 5 phút' },
      { id: 'students', label: 'Số học viên', value: '27' }
    ],
    sections: [
      {
        id: 'section-biomechanics-intro',
        title: 'Giới thiệu cơ sinh học',
        summary: '2 tài liệu • 50 phút',
        resourceCount: 2,
        duration: '50 phút',
        lessons: [
          {
            id: 'lesson-biomechanics-1',
            title: 'Khung lý thuyết cơ sinh học',
            duration: '30:00',
            resources: 1,
            type: 'video'
          },
          {
            id: 'lesson-biomechanics-2',
            title: 'Động lực học khớp gối',
            duration: '20:00',
            resources: 1,
            type: 'document'
          }
        ],
        isExpanded: true
      }
    ]
  },
  {
    id: '4',
    level: 'Cấp Tỉnh',
    code: 'BILO410',
    title: 'Sinh học phân tử',
    subtitle: 'Chuẩn bị cho nghiên cứu chuyên sâu',
    description:
      'Trang bị kiến thức chuyên sâu về cấu trúc và chức năng của vật chất di truyền, phục vụ nghiên cứu và ứng dụng y sinh.',
    thumbnail: 'https://images.unsplash.com/photo-1618005198900-89ac7c74b04f?auto=format&fit=crop&w=640&q=80',
    stats: [
      { id: 'lessons', label: 'Số bài học', value: '6' },
      { id: 'resources', label: 'Tổng số tài liệu', value: '8' },
      { id: 'duration', label: 'Tổng thời lượng', value: '5 tiếng 10 phút' },
      { id: 'students', label: 'Số học viên', value: '33' }
    ],
    sections: [
      {
        id: 'section-molecular-basics',
        title: 'Nền tảng phân tử',
        summary: '3 tài liệu • 90 phút',
        resourceCount: 3,
        duration: '90 phút',
        lessons: [
          {
            id: 'lesson-molecular-1',
            title: 'Cấu trúc DNA và RNA',
            duration: '35:00',
            resources: 2,
            type: 'video'
          },
          {
            id: 'lesson-molecular-2',
            title: 'Quá trình sao chép DNA',
            duration: '30:00',
            resources: 1,
            type: 'document'
          },
          {
            id: 'lesson-molecular-3',
            title: 'Phiên mã và dịch mã',
            duration: '25:00',
            resources: 1,
            type: 'video'
          }
        ],
        isExpanded: true
      }
    ]
  }
]

const modulesMap: LecturerModuleMap = LECTURER_MODULES.reduce((accumulator, module) => {
  accumulator[module.id] = module
  return accumulator
}, {} as LecturerModuleMap)

export function getLecturerModuleById(id: string) {
  return modulesMap[id]
}

export function getLecturerModuleSummaries(): LecturerModuleSummary[] {
  return LECTURER_MODULES.map(({ id, code, level, thumbnail, title }) => ({ id, code, level, thumbnail, title }))
}
