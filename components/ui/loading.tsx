'use client'

import { motion } from 'framer-motion'
import { Loader2, Zap } from 'lucide-react'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  variant?: 'default' | 'minimal' | 'dots' | 'pulse' | 'brand'
  message?: string
  className?: string
}

const sizeClasses = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-8 h-8',
  xl: 'w-12 h-12'
}

const containerSizeClasses = {
  sm: 'p-2',
  md: 'p-4',
  lg: 'p-6',
  xl: 'p-8'
}

export function LoadingSpinner({ size = 'md', variant = 'default', message, className = '' }: LoadingSpinnerProps) {
  if (variant === 'minimal') {
    return (
      <div className={`flex items-center justify-center ${containerSizeClasses[size]} ${className}`}>
        <Loader2 className={`${sizeClasses[size]} animate-spin text-primary`} />
        {message && <span className='ml-3 body-small-regular text-muted-foreground'>{message}</span>}
      </div>
    )
  }

  if (variant === 'dots') {
    return (
      <div className={`flex items-center justify-center space-x-1 ${containerSizeClasses[size]} ${className}`}>
        {[0, 1, 2].map((index) => (
          <motion.div
            key={index}
            className='w-2 h-2 bg-primary rounded-full'
            animate={{
              opacity: [0.3, 1, 0.3],
              scale: [1, 1.2, 1]
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              delay: index * 0.2
            }}
          />
        ))}
        {message && <span className='ml-4 body-small-regular text-muted-foreground'>{message}</span>}
      </div>
    )
  }

  if (variant === 'pulse') {
    return (
      <div className={`flex flex-col items-center justify-center space-y-3 ${containerSizeClasses[size]} ${className}`}>
        <motion.div
          className={`${sizeClasses[size]} bg-primary rounded-full`}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 1, 0.5]
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        />
        {message && <span className='body-small-regular text-muted-foreground text-center'>{message}</span>}
      </div>
    )
  }

  if (variant === 'brand') {
    return (
      <div className={`flex flex-col items-center justify-center space-y-4 ${containerSizeClasses[size]} ${className}`}>
        <motion.div
          className='relative'
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className='w-12 h-12 rounded-full bg-gradient-to-r from-primary to-primary-200 shadow-container'
            animate={{
              rotate: 360
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'linear'
            }}
          >
            <div className='absolute inset-1 rounded-full bg-background flex items-center justify-center'>
              <Zap className='w-4 h-4 text-primary' />
            </div>
          </motion.div>
        </motion.div>
        {message && (
          <motion.span
            className='body-small-regular text-muted-foreground text-center'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {message}
          </motion.span>
        )}
      </div>
    )
  }

  // Default variant
  return (
    <div className={`flex flex-col items-center justify-center space-y-4 ${containerSizeClasses[size]} ${className}`}>
      <div className='relative'>
        <motion.div
          className={`${sizeClasses[size]} border-2 border-primary-100 rounded-full border-t-primary`}
          animate={{ rotate: 360 }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: 'linear'
          }}
        />
      </div>
      {message && <span className='body-small-regular text-muted-foreground text-center'>{message}</span>}
    </div>
  )
}

interface LoadingPageProps {
  title?: string
  message?: string
  variant?: 'default' | 'minimal' | 'brand'
}

export function LoadingPage({ title = 'Đang tải', message = 'Vui lòng đợi...', variant = 'brand' }: LoadingPageProps) {
  return (
    <div className='min-h-[400px] flex items-center justify-center'>
      <motion.div
        className='flex flex-col items-center space-y-6'
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <LoadingSpinner variant={variant} size='lg' />

        <div className='text-center space-y-2'>
          <h2 className='heading-5 text-foreground'>{title}</h2>
          <p className='body-medium-regular text-muted-foreground'>{message}</p>
        </div>

        {/* Progress indicator */}
        <motion.div
          className='w-48 h-1 bg-secondary rounded-full overflow-hidden'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
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
      </motion.div>
    </div>
  )
}
