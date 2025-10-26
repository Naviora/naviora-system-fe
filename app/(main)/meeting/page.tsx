'use client'
import WebRTCRoom from '@/components/meeting/room'
import { Suspense } from 'react'

export default function MeetingPage() {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <WebRTCRoom signalingUrl='http://localhost:3000' />
      </Suspense>
    </div>
  )
}
