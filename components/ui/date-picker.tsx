'use client'

import * as React from 'react'
import { format, setHours, setMinutes, startOfDay } from 'date-fns'
import { Calendar as CalendarIcon, Clock } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

interface DatePickerProps {
  value?: Date | null
  onChange?: (date: Date | undefined) => void
  placeholder?: string
  className?: string
  showTimeSelect?: boolean
  // Disable dates matching these rules (passed to underlying Calendar/DayPicker)
  disabled?: React.ComponentProps<typeof Calendar>['disabled']
  // Convenience: minimum selectable date (inclusive). Past days before startOfDay(minDate) are disabled
  minDate?: Date
}

export function DatePicker({
  value,
  onChange,
  placeholder = 'Chọn ngày',
  className,
  showTimeSelect = false,
  disabled,
  minDate
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false)
  const [time, setTime] = React.useState(() => {
    if (value) {
      const h = value.getHours().toString().padStart(2, '0')
      const m = value.getMinutes().toString().padStart(2, '0')
      return `${h}:${m}`
    }
    return '00:00'
  })

  const handleDateChange = (date: Date | undefined) => {
    if (!date) {
      onChange?.(undefined)
      return
    }

    if (showTimeSelect) {
      const [h, m] = time.split(':').map(Number)
      const newDate = setMinutes(setHours(date, h), m)
      onChange?.(newDate)
    } else {
      onChange?.(date)
    }

    if (!showTimeSelect) setOpen(false)
  }

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = e.target.value
    setTime(newTime)
    if (value) {
      const [h, m] = newTime.split(':').map(Number)
      const newDate = setMinutes(setHours(value, h), m)
      onChange?.(newDate)
    }
  }

  const formattedDate = value ? format(value, 'PPP') : null

  const computedDisabled = React.useMemo(() => {
    const rules: NonNullable<React.ComponentProps<typeof Calendar>['disabled']> extends any[] ? any[] : any[] = []
    if (disabled) {
      if (Array.isArray(disabled)) rules.push(...disabled)
      else rules.push(disabled)
    }
    if (minDate) {
      rules.push({ before: startOfDay(minDate) })
    }
    return rules.length > 0 ? rules : undefined
  }, [disabled, minDate])

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant='outline'
            className={cn(
              'justify-start text-left font-normal hover:bg-accent hover:text-accent-foreground transition-colors',
              !value && 'text-muted-foreground'
            )}
            disabled={disabled}
            tabIndex={disabled ? -1 : 0}
          >
            <CalendarIcon className='mr-2 h-4 w-4 opacity-70' />
            {formattedDate ? (
              <>
                {formattedDate}
                {showTimeSelect && <span className='ml-1 text-muted-foreground text-sm'>{time}</span>}
              </>
            ) : (
              <span>{placeholder}</span>
            )}
          </Button>
        </PopoverTrigger>

        <PopoverContent className='w-auto p-0 rounded-xl shadow-md border bg-popover' align='start'>
          <Calendar
            mode='single'
            selected={value ?? undefined}
            onSelect={handleDateChange}
            initialFocus
            disabled={computedDisabled}
          />

          {showTimeSelect && (
            <div className='p-3 border-t flex items-center gap-2 bg-background/50'>
              <Clock className='h-4 w-4 text-muted-foreground' />
              <input
                type='time'
                value={time}
                onChange={handleTimeChange}
                className={cn(
                  'flex-1 rounded-md border border-input bg-background px-2 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition',
                  disabled && 'bg-muted text-muted-foreground cursor-not-allowed'
                )}
                disabled={disabled}
              />
              <Button size='sm' variant='secondary' onClick={() => setOpen(false)} className='text-xs px-3'>
                OK
              </Button>
            </div>
          )}
        </PopoverContent>
      </Popover>
    </div>
  )
}
