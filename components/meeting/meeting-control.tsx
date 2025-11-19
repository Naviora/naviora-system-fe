import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Mic, MicOff, Video, VideoOff, Monitor, MonitorOff, Hand, Square, PhoneOff } from 'lucide-react'

interface Props {
  roomId: string
  userId: string
  socket: any // eslint-disable-line @typescript-eslint/no-explicit-any
  isHandRaised: boolean
  onToggleHand: () => void
  isRecording: boolean
  onToggleRecording: () => void
  onStartScreenShare: () => void
  onStopScreenShare: () => void
  isScreenSharing: boolean
  isAudioEnabled: boolean
  isVideoEnabled: boolean
  onToggleAudio: () => void
  onToggleVideo: () => void
  onLeave: () => void
}

export default function MeetingControls({
  roomId,
  userId,
  socket,
  isHandRaised,
  onToggleHand,
  isRecording,
  onToggleRecording,
  onStartScreenShare,
  onStopScreenShare,
  isScreenSharing,
  isAudioEnabled,
  isVideoEnabled,
  onToggleAudio,
  onToggleVideo,
  onLeave
}: Props) {
  const [raisedHands, setRaisedHands] = useState<string[]>([])

  useEffect(() => {
    if (!socket) return

    const handleHandRaised = (data: { userId: string; timestamp: number }) => {
      console.log('Hand raised event received:', data)
      setRaisedHands((prev) => {
        const newList = [...prev.filter((id) => id !== data.userId), data.userId]
        console.log('Updated raised hands:', newList)
        return newList
      })
    }

    const handleHandLowered = (data: { userId: string; timestamp: number }) => {
      console.log('Hand lowered event received:', data)
      setRaisedHands((prev) => {
        const newList = prev.filter((id) => id !== data.userId)
        console.log('Updated raised hands:', newList)
        return newList
      })
    }

    socket.on('hand-raised', handleHandRaised)
    socket.on('hand-lowered', handleHandLowered)

    return () => {
      socket.off('hand-raised', handleHandRaised)
      socket.off('hand-lowered', handleHandLowered)
    }
  }, [socket])

  const handleHandToggle = () => {
    console.log('Hand toggle clicked', {
      socket: !!socket,
      roomId,
      userId,
      isHandRaised
    })
    if (!socket) {
      console.error('Socket not available')
      return
    }

    if (isHandRaised) {
      socket.emit('lower-hand', { roomId, userId })
      console.log('Emitted lower-hand')
    } else {
      socket.emit('raise-hand', { roomId, userId })
      console.log('Emitted raise-hand')
    }
    onToggleHand()
  }

  const handleRecordingToggle = () => {
    if (!socket) return

    if (isRecording) {
      socket.emit('stop-recording', { roomId, userId })
    } else {
      socket.emit('start-recording', { roomId, userId })
    }
    onToggleRecording()
  }

  const handleScreenShareToggle = async () => {
    try {
      if (isScreenSharing) {
        onStopScreenShare()
      } else {
        await onStartScreenShare()
      }
    } catch (error) {
      console.error('Screen share error:', error)
    }
  }

  return (
    <>
      {/* Main Control Bar - Google Meet Style */}
      <div className='fixed bottom-6 left-1/2 -translate-x-1/2 z-50'>
        <Card className='bg-[#202124] border border-gray-600 rounded-full px-4 py-3 shadow-2xl'>
          <div className='flex items-center gap-2'>
            {/* Audio Toggle Button */}
            <Button
              onClick={onToggleAudio}
              className={`rounded-full size-12 ${
                isAudioEnabled ? 'bg-white hover:bg-gray-200 text-gray-700' : 'bg-red-500 hover:bg-red-600 text-white'
              } transition-all`}
              title={isAudioEnabled ? 'Mute Microphone' : 'Unmute Microphone'}
            >
              {isAudioEnabled ? <Mic className='size-5' /> : <MicOff className='size-5' />}
            </Button>

            {/* Video Toggle Button */}
            <Button
              onClick={onToggleVideo}
              className={`rounded-full size-12 ${
                isVideoEnabled ? 'bg-white hover:bg-gray-200 text-gray-700' : 'bg-red-500 hover:bg-red-600 text-white'
              } transition-all`}
              title={isVideoEnabled ? 'Turn Off Camera' : 'Turn On Camera'}
            >
              {isVideoEnabled ? <Video className='size-5' /> : <VideoOff className='size-5' />}
            </Button>

            {/* Divider */}
            <div className='w-px h-12 bg-gray-500' />

            {/* Screen Share Button */}
            <Button
              onClick={handleScreenShareToggle}
              className={`rounded-full size-12 ${
                isScreenSharing
                  ? 'bg-white hover:bg-gray-200 text-gray-700'
                  : 'bg-gray-600 hover:bg-gray-700 text-white'
              } transition-all`}
              title={isScreenSharing ? 'Stop Screen Share' : 'Start Screen Share'}
            >
              {isScreenSharing ? <MonitorOff className='size-5' /> : <Monitor className='size-5' />}
            </Button>

            {/* Hand Raise Button */}
            <Button
              onClick={handleHandToggle}
              className={`rounded-full size-12 ${
                isHandRaised
                  ? 'bg-yellow-500 hover:bg-yellow-600 text-white'
                  : 'bg-gray-600 hover:bg-gray-700 text-white'
              } transition-all`}
              title={isHandRaised ? 'Lower Hand' : 'Raise Hand'}
            >
              <Hand className='size-5' />
            </Button>

            {/* Recording Button */}
            <Button
              onClick={handleRecordingToggle}
              className={`rounded-full size-12 ${
                isRecording ? 'bg-red-500 hover:bg-red-600 animate-pulse' : 'bg-gray-600 hover:bg-gray-700'
              } text-white transition-all`}
              title={isRecording ? 'Stop Recording' : 'Start Recording'}
            >
              <Square className='size-4 fill-white' />
            </Button>

            {/* Leave Call Button */}
            <Button
              onClick={onLeave}
              className='rounded-full size-12 bg-red-600 hover:bg-red-700 text-white transition-all'
              title='End Call'
            >
              <PhoneOff className='size-5' />
            </Button>
          </div>
        </Card>
      </div>

      {/* Raised Hands Indicator */}
      {raisedHands.length > 0 && (
        <div className='fixed bottom-28 left-1/2 -translate-x-1/2 z-40 animate-bounce'>
          <Card className='bg-yellow-400 px-6 py-3 rounded-full shadow-lg border-0'>
            <div className='flex items-center gap-2'>
              <Hand className='size-5' />
              <span className='text-sm font-bold'>
                {raisedHands.length} hand{raisedHands.length > 1 ? 's' : ''} raised
              </span>
              <span className='text-xs opacity-75'>({raisedHands.join(', ')})</span>
            </div>
          </Card>
        </div>
      )}
    </>
  )
}
