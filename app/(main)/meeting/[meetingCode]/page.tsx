'use client'
import WebRTCRoom from '@/components/meeting/room'
import { Suspense } from 'react'

export default function MeetingByCodePage({ params }: { params: { meetingCode: string } }) {
  const meetingCode = params.meetingCode
  const signalingUrl = process.env.NEXT_PUBLIC_SIGNALING_URL || 'http://localhost:3000'

  return (
    <Suspense
      fallback={<div className='flex items-center justify-center h-full text-white bg-[#202124]'>Loading...</div>}
    >
      <WebRTCRoom signalingUrl={signalingUrl} initialRoomId={meetingCode} />
    </Suspense>
  )
}
