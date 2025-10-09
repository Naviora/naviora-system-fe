'use client'

import { motion } from 'framer-motion'
import { CourseCard } from '@/components/modules/course-card'
import { SectionHeader } from '@/components/common/section-header'

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5
    }
  }
}

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

export default function ModulesPage() {
  return (
    <div className='flex h-full w-full flex-col gap-12 px-6 py-8 md:px-12 lg:px-16'>
      {/* Hero Section */}
      <motion.div
        className='flex flex-col gap-3'
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className='text-4xl font-semibold text-greyscale-900 md:text-5xl'>Your Path to Growth Starts Here</h1>
        <p className='text-lg text-greyscale-600'>
          Discover curated courses designed to accelerate your learning journey
        </p>
      </motion.div>

      {/* Recommended for you Section */}
      <motion.section
        className='flex flex-col gap-6'
        initial='hidden'
        whileInView='visible'
        viewport={{ once: true, margin: '-100px' }}
        variants={containerVariants}
      >
        <motion.div variants={itemVariants}>
          <SectionHeader title='Recommended for you' viewAllHref='/modules/recommended' />
        </motion.div>
        <motion.div
          className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5'
          variants={containerVariants}
        >
          {recommendedCourses.map((course) => (
            <motion.div key={course.id} variants={itemVariants}>
              <CourseCard {...course} />
            </motion.div>
          ))}
        </motion.div>
      </motion.section>

      {/* New Release Section */}
      <motion.section
        className='flex flex-col gap-6'
        initial='hidden'
        whileInView='visible'
        viewport={{ once: true, margin: '-100px' }}
        variants={containerVariants}
      >
        <motion.div variants={itemVariants}>
          <SectionHeader title='New Release' viewAllHref='/modules/new-releases' />
        </motion.div>
        <motion.div
          className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5'
          variants={containerVariants}
        >
          {newReleaseCourses.map((course) => (
            <motion.div key={course.id} variants={itemVariants}>
              <CourseCard {...course} />
            </motion.div>
          ))}
        </motion.div>
      </motion.section>
    </div>
  )
}
