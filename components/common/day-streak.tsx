'use client'

import { CheckCircle2, Circle, Loader2 } from 'lucide-react'
import Image from 'next/image'
import { useGetStreak } from '@/hooks/api/use-streak'
import { useState } from 'react'
import { motion } from 'framer-motion'

const DayCheckbox = ({ day, checked }: { day: string; checked: boolean }) => (
  <motion.div
    className='flex flex-col items-center gap-1'
    animate={checked ? { scale: [1, 1.2, 1] } : {}}
    transition={{ duration: 0.6 }}
  >
    {checked ? (
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 15 }}
      >
        <CheckCircle2 className='text-gray-900 dark:text-gray-400' />
      </motion.div>
    ) : (
      <Circle className='text-gray-300 dark:text-gray-600' />
    )}
    <span className='text-sm font-medium text-gray-500 dark:text-gray-400'>{day}</span>
  </motion.div>
)

export const DayStreak = () => {
  const { data: streakData, isLoading } = useGetStreak()
  const [isHovering, setIsHovering] = useState(false)
  const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S']

  const currentStreak = streakData?.current_streak || 0
  const longestStreak = streakData?.longest_streak || 0

  // Get today's day of week (0 = Sunday, 1 = Monday, ..., 2 = Tuesday, ...)
  const today = new Date().getDay()

  // Logic: Show checked days from today going backwards based on current streak
  // For example: if today is Tuesday (2) and currentStreak = 3, check Tuesday, Monday, Sunday
  const checkedDays = days.map((_, index) => {
    if (currentStreak === 0) return false
    // Calculate how many days back from today
    let daysBack = 0
    if (index <= today) {
      daysBack = today - index
    } else {
      // Wrap around (e.g., if today is Monday and index is Saturday)
      daysBack = 7 - (index - today)
    }
    return daysBack < currentStreak
  })

  if (isLoading) {
    return (
      <motion.div
        className='flex flex-col gap-6 rounded-lg border border-gray-200 bg-white p-4 min-w-[300px] w-full dark:bg-gray-800 dark:border-gray-700'
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className='flex items-center justify-center h-40'>
          <Loader2 className='w-6 h-6 animate-spin text-gray-400' />
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      className='flex flex-col gap-6 rounded-lg border border-gray-200 bg-white p-4 min-w-[300px] w-full dark:bg-gray-800 dark:border-gray-700'
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className='flex items-center justify-between'>
        <motion.div
          className='flex flex-col'
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <span className='text-base font-medium text-gray-900 dark:text-gray-100'>Day Streak</span>
          <motion.span
            className='text-2xl font-medium text-gray-900 dark:text-gray-100'
            key={currentStreak}
            initial={{ scale: 1.2 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200 }}
          >
            {currentStreak} Day
          </motion.span>
          <span className='text-xs text-gray-500 dark:text-gray-400'>Longest: {longestStreak} days</span>
        </motion.div>
        <motion.div
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
          className='cursor-pointer'
          animate={isHovering ? { scale: 1.3 } : { scale: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        >
          <motion.div
            animate={isHovering ? { y: [0, -8, 0] } : { y: 0 }}
            transition={{
              duration: 0.6,
              repeat: isHovering ? Infinity : 0,
              repeatType: 'loop'
            }}
          >
            <Image
              src='/icons/day-streak-icon.svg'
              alt='Day streak icon'
              width={55}
              height={55}
              className='dark:brightness-90 dark:saturate-90'
            />
          </motion.div>
        </motion.div>
      </div>
      <motion.div
        className='rounded-lg bg-gray-50 p-3 dark:bg-gray-700'
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className='flex justify-between'>
          {days.map((day, index) => (
            <DayCheckbox key={index} day={day} checked={checkedDays[index]} />
          ))}
        </div>
      </motion.div>
    </motion.div>
  )
}
