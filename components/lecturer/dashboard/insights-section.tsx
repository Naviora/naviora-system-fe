'use client'

import { AlertTriangle, CheckCircle2 } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

type Insight = {
  id: number
  title: string
  description: string
  status: 'positive' | 'warning'
}

interface InsightsSectionProps {
  insights?: Insight[]
}

const DEFAULT_INSIGHTS: Insight[] = [
  {
    id: 1,
    title: 'Lớp CNTT K18A duy trì 96% chuyên cần',
    description: 'Tốt hơn mức trung bình của khoa 8 điểm phần trăm.',
    status: 'positive'
  },
  {
    id: 2,
    title: '3 sinh viên chưa hoàn thành bài tập tuần 6',
    description: 'Gợi ý gửi lời nhắc trước 05/11 để kịp tiến độ.',
    status: 'warning'
  }
]

export function InsightsSection({ insights = DEFAULT_INSIGHTS }: InsightsSectionProps) {
  return (
    <Card className='border-greyscale-200'>
      <CardHeader className='px-6 pb-0'>
        <CardTitle className='text-xl text-greyscale-900'>Ghi chú quan trọng</CardTitle>
        <CardDescription>Bắt kịp những điểm cần lưu ý từ lớp và sinh viên.</CardDescription>
      </CardHeader>
      <CardContent className='px-6 pt-6'>
        <div className='flex flex-col gap-3'>
          {insights.map((insight) => (
            <div
              key={insight.id}
              className='rounded-lg border border-greyscale-200/70 bg-greyscale-50/60 p-3 text-sm shadow-[0_1px_0_rgba(15,23,42,0.04)]'
            >
              <div className='flex items-start gap-3'>
                <span
                  className={cn(
                    'mt-0.5 inline-flex size-8 items-center justify-center rounded-full',
                    insight.status === 'positive' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                  )}
                >
                  {insight.status === 'positive' ? (
                    <CheckCircle2 className='size-4' />
                  ) : (
                    <AlertTriangle className='size-4' />
                  )}
                </span>
                <div className='flex-1 space-y-1'>
                  <p className='font-medium text-greyscale-900'>{insight.title}</p>
                  <p className='text-sm text-muted-foreground'>{insight.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
