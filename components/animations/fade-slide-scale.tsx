'use client'

import { motion, type HTMLMotionProps, type Variants } from 'framer-motion'
import { forwardRef, type ReactNode } from 'react'

// Fade In Animation
interface FadeInProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
  children: ReactNode
  delay?: number
  duration?: number
  direction?: 'up' | 'down' | 'left' | 'right'
  distance?: number
}

const fadeVariants: Variants = {
  hidden: (custom) => ({
    opacity: 0,
    x: custom.direction === 'left' ? -custom.distance : custom.direction === 'right' ? custom.distance : 0,
    y: custom.direction === 'up' ? -custom.distance : custom.direction === 'down' ? custom.distance : 0
  }),
  visible: {
    opacity: 1,
    x: 0,
    y: 0,
    transition: {
      duration: 0.6,
      ease: 'easeOut'
    }
  }
}

export const FadeIn = forwardRef<HTMLDivElement, FadeInProps>(
  ({ children, delay = 0, duration = 0.6, direction = 'up', distance = 20, ...props }, ref) => (
    <motion.div
      ref={ref}
      custom={{ direction, distance }}
      variants={fadeVariants}
      initial='hidden'
      animate='visible'
      transition={{ delay, duration, ease: 'easeOut' }}
      {...props}
    >
      {children}
    </motion.div>
  )
)

FadeIn.displayName = 'FadeIn'

// Slide In Animation
interface SlideInProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
  children: ReactNode
  delay?: number
  duration?: number
  direction?: 'up' | 'down' | 'left' | 'right'
  distance?: number
}

const slideVariants: Variants = {
  hidden: (custom) => ({
    x: custom.direction === 'left' ? -custom.distance : custom.direction === 'right' ? custom.distance : 0,
    y: custom.direction === 'up' ? -custom.distance : custom.direction === 'down' ? custom.distance : 0
  }),
  visible: {
    x: 0,
    y: 0,
    transition: {
      type: 'spring',
      damping: 20,
      stiffness: 100
    }
  }
}

export const SlideIn = forwardRef<HTMLDivElement, SlideInProps>(
  ({ children, delay = 0, duration = 0.5, direction = 'up', distance = 50, ...props }, ref) => (
    <motion.div
      ref={ref}
      custom={{ direction, distance }}
      variants={slideVariants}
      initial='hidden'
      animate='visible'
      transition={{
        delay,
        duration,
        type: 'spring',
        damping: 20,
        stiffness: 100
      }}
      {...props}
    >
      {children}
    </motion.div>
  )
)

SlideIn.displayName = 'SlideIn'

// Scale In Animation
interface ScaleInProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
  children: ReactNode
  delay?: number
  duration?: number
  scale?: number
}

const scaleVariants: Variants = {
  hidden: (scale) => ({
    scale,
    opacity: 0
  }),
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      type: 'spring',
      damping: 15,
      stiffness: 200
    }
  }
}

export const ScaleIn = forwardRef<HTMLDivElement, ScaleInProps>(
  ({ children, delay = 0, duration = 0.4, scale = 0.8, ...props }, ref) => (
    <motion.div
      ref={ref}
      custom={scale}
      variants={scaleVariants}
      initial='hidden'
      animate='visible'
      transition={{
        delay,
        duration,
        type: 'spring',
        damping: 15,
        stiffness: 200
      }}
      {...props}
    >
      {children}
    </motion.div>
  )
)

ScaleIn.displayName = 'ScaleIn'

// Stagger Container
interface StaggerContainerProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
  children: ReactNode
  staggerChildren?: number
  delayChildren?: number
}

export const StaggerContainer = forwardRef<HTMLDivElement, StaggerContainerProps>(
  ({ children, staggerChildren = 0.1, delayChildren = 0, ...props }, ref) => (
    <motion.div
      ref={ref}
      initial='hidden'
      animate='visible'
      variants={{
        visible: {
          transition: {
            staggerChildren,
            delayChildren
          }
        }
      }}
      {...props}
    >
      {children}
    </motion.div>
  )
)

StaggerContainer.displayName = 'StaggerContainer'

// Stagger Item
interface StaggerItemProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
  children: ReactNode
}

const staggerItemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: 'easeOut'
    }
  }
}

export const StaggerItem = forwardRef<HTMLDivElement, StaggerItemProps>(({ children, ...props }, ref) => (
  <motion.div ref={ref} variants={staggerItemVariants} {...props}>
    {children}
  </motion.div>
))

StaggerItem.displayName = 'StaggerItem'
