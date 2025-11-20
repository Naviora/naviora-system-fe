import { CheckCircle2, Circle } from 'lucide-react'
import Image from 'next/image'
import { useGetStreak } from '@/hooks/api/use-streaks'
import { startOfWeek, addDays, parseISO, subDays, startOfDay } from 'date-fns'

const DayCheckbox = ({ day, checked }: { day: string; checked: boolean }) => (
  <div className='flex flex-col items-center gap-1'>
    {checked ? (
      <CheckCircle2 className='text-gray-900 dark:text-gray-400' />
    ) : (
      <Circle className='text-gray-300 dark:text-gray-600' />
    )}
    <span className='text-sm font-medium text-gray-500 dark:text-gray-400'>{day}</span>
  </div>
)

export const DayStreak = () => {
  const { data: streakData } = useGetStreak()
  const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S']

  const today = new Date()
  const startOfCurrentWeek = startOfWeek(today, { weekStartsOn: 0 }) // Sunday

  const checkedDays = days.map((_, index) => {
    if (!streakData) return false

    const currentDay = startOfDay(addDays(startOfCurrentWeek, index))
    const lastActivityDate = startOfDay(parseISO(streakData.last_activity_date))

    // If current streak is 0, no days are checked
    if (streakData.current_streak <= 0) return false

    const streakStartDate = subDays(lastActivityDate, streakData.current_streak - 1)

    // Check if currentDay is within [streakStartDate, lastActivityDate]
    return currentDay >= streakStartDate && currentDay <= lastActivityDate
  })

  const currentStreak = streakData?.current_streak ?? 0

  return (
    <div className='flex flex-col gap-6 rounded-lg border border-gray-200 bg-white p-4 min-w-[300px]  w-full dark:bg-gray-800 dark:border-gray-700'>
      <div className='flex items-center justify-between'>
        <div className='flex flex-col'>
          <span className='text-base font-medium text-gray-900 dark:text-gray-100'>Day Streak</span>
          <span className='text-2xl font-medium text-gray-900 dark:text-gray-100'>{currentStreak} Day</span>
        </div>
        <Image
          src='/icons/day-streak-icon.svg'
          alt='Day streak icon'
          width={55}
          height={55}
          className='dark:brightness-90 dark:saturate-90'
        />
      </div>
      <div className='rounded-lg bg-gray-50 p-3 dark:bg-gray-700'>
        <div className='flex justify-between'>
          {days.map((day, index) => (
            <DayCheckbox key={index} day={day} checked={checkedDays[index]} />
          ))}
        </div>
      </div>
    </div>
  )
}
