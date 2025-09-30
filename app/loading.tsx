'use client'

import { motion } from 'framer-motion'

export default function Loading() {
  return (
    <div className='min-h-screen bg-background flex items-center justify-center'>
      <div className='flex flex-col items-center space-y-8 p-8'>
        {/* Logo Loading Animation */}
        <motion.div
          className='relative'
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className='w-20 h-20 rounded-full bg-gradient-to-r from-primary to-primary-200 shadow-container-large'
            animate={{
              rotate: 360
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'linear'
            }}
          >
            <div className='absolute inset-2 rounded-full bg-background shadow-inner flex items-center justify-center'>
              <motion.div
                className='w-8 h-8 rounded-full bg-primary'
                animate={{
                  scale: [1, 1.2, 1]
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: 'easeInOut'
                }}
              />
            </div>
          </motion.div>
        </motion.div>

        {/* Brand Name */}
        <motion.div
          className='text-center space-y-2'
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <h1 className='heading-4 text-foreground font-primary'>Naviora</h1>
          <div className='flex items-center space-x-2'>
            <motion.div
              className='w-2 h-2 bg-primary rounded-full'
              animate={{
                opacity: [0.3, 1, 0.3]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: 0
              }}
            />
            <motion.div
              className='w-2 h-2 bg-primary rounded-full'
              animate={{
                opacity: [0.3, 1, 0.3]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: 0.2
              }}
            />
            <motion.div
              className='w-2 h-2 bg-primary rounded-full'
              animate={{
                opacity: [0.3, 1, 0.3]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: 0.4
              }}
            />
          </div>
        </motion.div>

        {/* Loading Text */}
        <motion.p
          className='body-small-regular text-muted-foreground'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          Đang tải...
        </motion.p>

        {/* Progress Bar */}
        <motion.div
          className='w-64 h-1 bg-secondary rounded-full overflow-hidden'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <motion.div
            className='h-full bg-gradient-to-r from-primary to-primary-200 rounded-full'
            animate={{
              x: ['-100%', '100%']
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
          />
        </motion.div>
      </div>
    </div>
  )
}
