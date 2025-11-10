'use client'

import React from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import type { ScoreRangeDto } from '@/types/principal/entry-tests'

interface ScoreSpectrumChartProps {
  data: ScoreRangeDto[]
  title?: string
}

export function ScoreSpectrumChart({ data, title = 'Phổ điểm bài thi' }: ScoreSpectrumChartProps) {
  // Filter out zero entries for cleaner visualization
  const filteredData = data.filter((item) => item.count > 0)

  if (filteredData.length === 0) {
    return (
      <div className='rounded-lg border border-greyscale-100 bg-greyscale-50 p-12'>
        <div className='text-center'>
          <p className='text-sm text-greyscale-500'>Chưa có dữ liệu phổ điểm</p>
        </div>
      </div>
    )
  }

  return (
    <div className='space-y-3'>
      <div>
        <h3 className='text-lg font-semibold text-greyscale-900'>{title}</h3>
      </div>
      <div className='w-full overflow-hidden rounded-lg border border-greyscale-100 bg-greyscale-0 p-4 shadow-xs'>
        <div className='h-96 w-full'>
          <ResponsiveContainer width='100%' height='100%'>
            <BarChart data={filteredData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
              <CartesianGrid strokeDasharray='3 3' stroke='#e5e7eb' />
              <XAxis
                dataKey='score'
                label={{ value: 'Điểm số', position: 'insideBottom', offset: -10, style: { fontSize: '14px', fontWeight: 500 } }}
                style={{ fontSize: '12px' }}
                tick={{ fill: '#6b7280' }}
              />
              <YAxis
                label={{
                  value: 'Số lượng học sinh',
                  angle: -90,
                  position: 'insideLeft',
                  style: { fontSize: '14px', fontWeight: 500, textAnchor: 'middle' }
                }}
                style={{ fontSize: '12px' }}
                tick={{ fill: '#6b7280' }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '6px',
                  boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)'
                }}
                formatter={(value) => [value, 'Số lượng']}
                labelFormatter={(label) => `Điểm: ${label}`}
                cursor={{ fill: 'rgba(59, 130, 246, 0.1)' }}
              />
              <Legend wrapperStyle={{ paddingTop: '20px' }} />
              <Bar dataKey='count' fill='#3b82f6' name='Số lượng học sinh' radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
