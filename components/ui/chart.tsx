'use client'

import * as React from 'react'
import type { TooltipProps } from 'recharts'
import { Tooltip } from 'recharts'
import type { Payload } from 'recharts/types/component/DefaultTooltipContent'

import { cn } from '@/lib/utils'

export type ChartConfig = Record<string, { label?: string; icon?: React.ComponentType }>

type ChartContainerProps = React.HTMLAttributes<HTMLDivElement> & {
  config: ChartConfig
}

const ChartContext = React.createContext<ChartConfig | null>(null)

export function ChartContainer({ config, className, children, ...props }: ChartContainerProps) {
  return (
    <ChartContext.Provider value={config}>
      <div className={cn('flex h-full w-full flex-col gap-4', className)} {...props}>
        {children}
      </div>
    </ChartContext.Provider>
  )
}

export function useChartConfig() {
  const context = React.useContext(ChartContext)

  if (!context) {
    throw new Error('useChartConfig must be used within a <ChartContainer />')
  }

  return context
}

type ChartTooltipProps = React.ComponentProps<typeof Tooltip>

export function ChartTooltip({ content, ...props }: ChartTooltipProps) {
  return <Tooltip {...props} content={content ?? <ChartTooltipContent />} />
}

type ChartTooltipContentProps = TooltipProps<number, string> & {
  active?: boolean
  payload?: Payload<number, string>[]
  label?: string
}

export function ChartTooltipContent({ active, payload, label }: ChartTooltipContentProps) {
  const config = React.useContext(ChartContext)

  if (!active || !payload?.length) {
    return null
  }

  const entries = payload as Payload<number, string>[]

  return (
    <div className='rounded-lg border bg-background/95 p-3 text-sm shadow-lg backdrop-blur-sm'>
      {label ? <div className='text-xs font-medium text-muted-foreground'>{label}</div> : null}
      <div className='mt-1 flex flex-col gap-1'>
        {entries.map((item, index) => {
          const key = (item?.dataKey as string) ?? item?.name ?? `item-${index}`
          const chartItem = config?.[key]

          return (
            <div key={`${key}-${index}`} className='flex items-center gap-2'>
              <span
                className='flex h-2 w-2 rounded-full'
                style={{ background: item?.color ?? 'hsl(var(--primary))' }}
              />
              <div className='flex flex-1 flex-col text-xs'>
                <span className='font-medium text-foreground'>{chartItem?.label ?? item?.name}</span>
                <span className='text-muted-foreground'>{item?.value}</span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
