'use client'
import WebRTCRoom from '@/components/meeting/room'
import { Suspense } from 'react'

export default function MeetingPage() {
  return (
    <Suspense
      fallback={<div className='flex items-center justify-center h-full text-white bg-[#202124]'>Loading...</div>}
    >
      <WebRTCRoom signalingUrl='http://localhost:3000' />
    </Suspense>
  )
}
