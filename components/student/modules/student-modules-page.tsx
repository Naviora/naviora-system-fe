'use client'

import { DayStreak } from "@/components/common/day-streak";
import { StudentModuleGrid, StudentModuleToolbar } from '@/components/student/modules'
import { motion } from "framer-motion";

const recommendedCourses = [
  {
    id: '1',
    moduleName: 'Introduction to Cell Biology',
    classType: 'Course',
    class_name: 'BIOL101',
    lecturerName: ['Dr. Sarah Johnson', 'Prof. Michael Chen'],
    progress: 65,
    thumbnail: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop',
    className: 'recommended-course'
  },
  {
    id: '2',
    moduleName: 'Human Anatomy and Physiology',
    classType: 'Short Course',
    class_name: 'ANAT202',
    lecturerName: ['Dr. Emily Rodriguez'],
    progress: 42,
    thumbnail: 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=400&h=300&fit=crop',
    className: 'recommended-course'
  },
  {
    id: '3',
    moduleName: 'Genetics and Heredity',
    classType: 'Course',
    class_name: 'GENE301',
    lecturerName: ['Prof. David Kim', 'Dr. Lisa Wang'],
    progress: 78,
    thumbnail: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop',
    className: 'recommended-course'
  },
  {
    id: '4',
    moduleName: 'Molecular Biology Fundamentals',
    classType: 'Course',
    class_name: 'MOLB250',
    lecturerName: ['Dr. Robert Martinez'],
    progress: 23,
    thumbnail: 'https://images.unsplash.com/photo-1628595351029-c2bf17511435?w=400&h=300&fit=crop',
    className: 'recommended-course'
  },
  {
    id: '5',
    moduleName: 'Ecology and Environmental Science',
    classType: 'Short Course',
    class_name: 'ECOL180',
    lecturerName: ['Prof. Amanda Green', 'Dr. James Wilson'],
    progress: 89,
    thumbnail: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop',
    className: 'recommended-course'
  }
]

const newReleaseCourses = [
  {
    id: '6',
    moduleName: 'Microbiology and Immunology',
    classType: 'Course',
    class_name: 'MICR320',
    lecturerName: ['Dr. Patricia Brown'],
    progress: 0,
    thumbnail: 'https://images.unsplash.com/photo-1576086213369-97a306d36557?w=400&h=300&fit=crop',
    className: 'new-release-course'
  },
  {
    id: '7',
    moduleName: 'Biochemistry Basics',
    classType: 'Course',
    class_name: 'BIOC210',
    lecturerName: ['Prof. Thomas Anderson', 'Dr. Maria Garcia'],
    progress: 15,
    thumbnail: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=400&h=300&fit=crop',
    className: 'new-release-course'
  },
  {
    id: '8',
    moduleName: 'Marine Biology Exploration',
    classType: 'Short Course',
    class_name: 'MARB190',
    lecturerName: ['Dr. Ocean Blue'],
    progress: 34,
    thumbnail: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop',
    className: 'new-release-course'
  },
  {
    id: '9',
    moduleName: 'Plant Biology and Botany',
    classType: 'Course',
    class_name: 'BOTM240',
    lecturerName: ['Prof. Flora Greenwood'],
    progress: 56,
    thumbnail: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=300&fit=crop',
    className: 'new-release-course'
  },
  {
    id: '10',
    moduleName: 'Evolutionary Biology',
    classType: 'Short Course',
    class_name: 'EVOL350',
    lecturerName: ['Dr. Charles Darwin Jr.', 'Prof. Evolution Smith'],
    progress: 72,
    thumbnail: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
    className: 'new-release-course'
  }
]

const allCourses = [...recommendedCourses, ...newReleaseCourses]

export function StudentModulesPageClient() {

  return (
    <div className="flex flex-col-reverse lg:flex-row gap-6 px-4 pb-10 pt-6 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full "
      >
        <div className='flex flex-col gap-1'>
          <h1 className='text-2xl font-semibold text-greyscale-900 sm:text-3xl'>Hành trình học tập của bạn</h1>
          <p className='text-sm text-muted-foreground'>
            Hành trình học tập của bạn bắt đầu từ bây giờ, hãy khám phá các bài học của bạn và tiếp tục tiến về phía trước.
          </p>
        </div>

        <section className='mt-6 rounded-xl border border-greyscale-200 bg-card p-4 shadow-sm sm:p-6'>
          <StudentModuleToolbar />

          <div className='mt-6'>
            <StudentModuleGrid modules={allCourses} />
          </div>
        </section>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
       
      >
        <DayStreak />
      </motion.div>
    </div>
  )
}
