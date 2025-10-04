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

// Mock data for recommended courses
const recommendedCourses = [
  {
    id: '1',
    title: 'Introduction to UI/UX Design',
    category: 'Design',
    courseType: 'Course' as const,
    provider: 'Google',
    providerLogo: 'https://logo.clearbit.com/google.com',
    thumbnail: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=300&fit=crop',
    rating: 4.8,
    price: 'Free' as const
  },
  {
    id: '2',
    title: 'Advanced Figma Techniques',
    category: 'Design Tools',
    courseType: 'Short Course' as const,
    provider: 'Figma',
    providerLogo: 'https://logo.clearbit.com/figma.com',
    thumbnail: 'https://images.unsplash.com/photo-1626785774625-ddcddc3445e9?w=400&h=300&fit=crop',
    rating: 4.9,
    price: 49
  },
  {
    id: '3',
    title: 'Microsoft Azure Fundamentals',
    category: 'Cloud Computing',
    courseType: 'Course' as const,
    provider: 'Microsoft',
    providerLogo: 'https://logo.clearbit.com/microsoft.com',
    thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=300&fit=crop',
    rating: 4.7,
    price: 'Free' as const
  },
  {
    id: '4',
    title: 'React Development Bootcamp',
    category: 'Web Development',
    courseType: 'Course' as const,
    provider: 'Meta',
    providerLogo: 'https://logo.clearbit.com/meta.com',
    thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=300&fit=crop',
    rating: 4.6,
    price: 79
  },
  {
    id: '5',
    title: 'Productivity with Notion',
    category: 'Productivity',
    courseType: 'Short Course' as const,
    provider: 'Notion',
    providerLogo: 'https://logo.clearbit.com/notion.so',
    thumbnail: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=400&h=300&fit=crop',
    rating: 4.5,
    price: 29
  }
]

// Mock data for new release courses
const newReleaseCourses = [
  {
    id: '6',
    title: 'Google Cloud Platform Essentials',
    category: 'Cloud Computing',
    courseType: 'Course' as const,
    provider: 'Google Cloud',
    providerLogo: 'https://logo.clearbit.com/cloud.google.com',
    thumbnail: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=400&h=300&fit=crop',
    rating: 4.8,
    price: 'Free' as const
  },
  {
    id: '7',
    title: 'WordPress Development from Scratch',
    category: 'Web Development',
    courseType: 'Course' as const,
    provider: 'WordPress',
    providerLogo: 'https://logo.clearbit.com/wordpress.com',
    thumbnail: 'https://images.unsplash.com/photo-1547658719-da2b51169166?w=400&h=300&fit=crop',
    rating: 4.6,
    price: 39
  },
  {
    id: '8',
    title: 'Professional Networking Skills',
    category: 'Career Development',
    courseType: 'Short Course' as const,
    provider: 'LinkedIn',
    providerLogo: 'https://logo.clearbit.com/linkedin.com',
    thumbnail: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=400&h=300&fit=crop',
    rating: 4.7,
    price: 49
  },
  {
    id: '9',
    title: 'Data Analysis with Python',
    category: 'Data Science',
    courseType: 'Course' as const,
    provider: 'Google',
    providerLogo: 'https://logo.clearbit.com/google.com',
    thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop',
    rating: 4.9,
    price: 59
  },
  {
    id: '10',
    title: 'Mobile App Design Principles',
    category: 'Design',
    courseType: 'Short Course' as const,
    provider: 'Figma',
    providerLogo: 'https://logo.clearbit.com/figma.com',
    thumbnail: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=300&fit=crop',
    rating: 4.8,
    price: 'Free' as const
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
