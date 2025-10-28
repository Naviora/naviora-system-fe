'use client'

import { useState } from 'react'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Book, ChevronDown, Clock, Hourglass, Menu, CheckCircle2, Circle } from 'lucide-react'
import { cn } from '@/lib/utils'

const CourseInfoHeader = () => (
  <div className='p-3'>
    <h2 className='text-2xl font-semibold text-gray-800 dark:text-gray-100'>Advanced UX Research</h2>
    <div className='mt-2 flex items-center text-sm text-gray-600 dark:text-gray-400'>
      <div className='flex items-center'>
        <Book className='mr-2 h-4 w-4' />
        <span>34 lectures</span>
      </div>
      <span className='mx-2'>-</span>
      <div className='flex items-center'>
        <Hourglass className='mr-2 h-4 w-4' />
        <span>6 hr 02 min</span>
      </div>
    </div>
    <div className='mt-4'>
      <div className='flex justify-between text-xs text-gray-500 dark:text-gray-400'>
        <span>In progress</span>
        <span>2%</span>
      </div>
      <div className='mt-1 h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700'>
        <div className='h-2 w-[2%] rounded-full bg-blue-600'></div>
      </div>
    </div>
  </div>
)

const lessons = [
  {
    title: 'Introduction to UX Research',
    duration: '06 : 12',
    completed: true
  },
  {
    title: 'Role of Research in Product Design',
    duration: '07 : 35',
    completed: false
  },
  {
    title: 'Download the Course Syllabus',
    duration: '00 : 15',
    completed: false
  },
  {
    title: 'Research Process Overview',
    duration: '09 : 40',
    completed: false
  },
  {
    title: 'Ethics & Best Practices in Research',
    duration: '08 : 22',
    completed: false
  },
  {
    title: 'Quiz: Introduction Checkpoint',
    duration: '08 : 55',
    completed: false
  }
]

const courseSections = [
  {
    title: 'Introduction to UX Research',
    lectures: 6,
    duration: '41min',
    lessons: lessons
  },
  {
    title: 'Qualitative Research',
    lectures: 7,
    duration: '1hr 02min',
    lessons: []
  },
  {
    title: 'Quantitative Research',
    lectures: 6,
    duration: '55min',
    lessons: []
  },
  {
    title: 'Usability Testing',
    lectures: 7,
    duration: '1hr 10min',
    lessons: []
  },
  {
    title: 'Analysis & Reporting',
    lectures: 5,
    duration: '52min',
    lessons: []
  },
  {
    title: 'Capstone Project',
    lectures: 4,
    duration: '1hr 20min',
    lessons: []
  }
]

const LessonItem = ({ title, duration, completed }: { title: string; duration: string; completed: boolean }) => (
  <div className='flex items-center justify-between p-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg'>
    <div className='flex items-center'>
      {completed ? (
        <CheckCircle2 className='mr-2 h-5 w-5 text-blue-600' />
      ) : (
        <Circle className='mr-2 h-5 w-5 text-gray-400' />
      )}
      <span className='text-sm text-gray-700 dark:text-gray-300'>{title}</span>
    </div>
    <div className='flex items-center text-xs text-gray-500 dark:text-gray-400'>
      <Clock className='mr-1 h-3 w-3' />
      <span>{duration}</span>
    </div>
  </div>
)

const CourseContentAccordion = () => (
  <Accordion type='single' collapsible className='w-full'>
    {courseSections.map((section, index) => (
      <AccordionItem value={`item-${index}`} key={index}>
        <AccordionTrigger>
          <div className='flex w-full items-center justify-between'>
            <div className='text-left'>
              <p className='font-semibold'>{section.title}</p>
              <div className='mt-1 flex items-center text-xs text-gray-500'>
                <span>{section.lectures} Lectures</span>
                <span className='mx-2'>-</span>
                <span>{section.duration}</span>
              </div>
            </div>
            <ChevronDown className='h-4 w-4 shrink-0 transition-transform duration-200' />
          </div>
        </AccordionTrigger>
        <AccordionContent>
          {section.lessons.map((lesson, lessonIndex) => (
            <LessonItem key={lessonIndex} {...lesson} />
          ))}
        </AccordionContent>
      </AccordionItem>
    ))}
  </Accordion>
)

export const ModuleDetailSidebar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div
      className={cn(
        "relative h-screen bg-gray-100 dark:bg-gray-900 transition-all duration-300 p-3",
        isSidebarOpen ? "w-[400px]" : "w-20"
      )}
    >
      {isSidebarOpen ? (
        <div className="flex flex-col gap-4">
          <button
            className='flex items-center gap-2 rounded-lg p-3 text-gray-700 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-800'
            onClick={() => setIsSidebarOpen(false)}
          >
            <Menu className='h-5 w-5' />
            <span className='font-medium'>Hide Menu</span>
          </button>
          <div className='rounded-xl bg-white dark:bg-gray-800'>
            <CourseInfoHeader />
            <div className='border-t border-gray-200 dark:border-gray-700 px-3'>
              <CourseContentAccordion />
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-4">
          <button
            className='flex items-center justify-center rounded-lg p-3 text-gray-700 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-800'
            onClick={() => setIsSidebarOpen(true)}
          >
            <Menu className='h-5 w-5' />
          </button>
        </div>
      )}
    </div>
  )
}
