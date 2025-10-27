import Chat from '@/components/meeting/chat'
import MeetingControls from '@/components/meeting/meeting-control'
import { useWebRTC } from '@/hooks/singleton/use-webrtc'
import { useEffect, useRef, useState } from 'react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Monitor, Mic, MicOff, Video, VideoOff } from 'lucide-react'

type Props = {
  signalingUrl: string
}

export default function WebRTCRoom({ signalingUrl }: Props) {
  const [roomId, setRoomId] = useState('demo-room')
  const [userId, setUserId] = useState(() => `user-${Math.random().toString(36).slice(2, 8)}`)
  const [joined, setJoined] = useState(false)
  const [started, setStarted] = useState(false)
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [isHandRaised, setIsHandRaised] = useState(false)
  const [isRecording, setIsRecording] = useState(false)

  const localVideoRef = useRef<HTMLVideoElement | null>(null)

  const {
    socket,
    localStreamRef,
    remoteStreams,
    connectedPeers,
    isScreenSharing,
    screenShareStream,
    remoteScreenShares,
    isAudioEnabled,
    isVideoEnabled,
    joinRoom,
    leaveRoom,
    startLocalMedia,
    startCallWith,
    stopLocalTracks,
    toggleAudio,
    toggleVideo,
    startScreenShare,
    stopScreenShare
  } = useWebRTC(roomId, userId, { signalingUrl })

  useEffect(() => {
    if (localVideoRef.current) {
      // Prioritize screen share stream for local view
      const streamToShow = isScreenSharing && screenShareStream ? screenShareStream : localStreamRef.current

      if (streamToShow) {
        console.log('🎥 Setting local video stream:', streamToShow)
        localVideoRef.current.srcObject = streamToShow
      }
    }
  }, [localStreamRef, isScreenSharing, screenShareStream])

  // Debug remote streams
  useEffect(() => {
    console.log('📹 Remote streams updated:', Object.keys(remoteStreams))
    Object.entries(remoteStreams).forEach(([peerId, stream]) => {
      console.log(`📹 Remote stream for ${peerId}:`, stream)
      console.log(
        `📹 Stream tracks:`,
        stream.getTracks().map((t) => ({
          kind: t.kind,
          enabled: t.enabled,
          muted: t.muted,
          readyState: t.readyState
        }))
      )
    })
  }, [remoteStreams])

  const handleJoin = async () => {
    console.log('Joining room...', { roomId, userId })
    await joinRoom()
    setJoined(true)
    console.log('Socket after join:', socket?.current?.id)
  }

  const handleStartMedia = async () => {
    console.log('🎥 Starting local media...')
    const stream = await startLocalMedia()
    console.log('🎥 Local stream obtained:', stream)
    console.log('🎥 Stream tracks:', stream.getTracks())

    // Ensure local video is set up immediately
    if (localVideoRef.current && stream) {
      console.log('🎥 Setting local video immediately')
      localVideoRef.current.srcObject = stream
      // autoPlay attribute on video element will handle playback
      // Only call play() if autoPlay fails due to user gesture requirement
      localVideoRef.current.play().catch((error) => {
        // Silently handle AbortError - it's a race condition when updating srcObject
        if (error.name !== 'AbortError') {
          console.warn('⚠️ Could not autoplay local video immediately:', error)
        }
      })
    }

    setStarted(true)

    // Auto-call existing peers
    for (const peerId of connectedPeers) {
      await startCallWith(peerId)
    }
  }

  const handleCallAll = async () => {
    for (const peerId of connectedPeers) {
      await startCallWith(peerId)
    }
  }

  const handleLeave = async () => {
    stopLocalTracks()
    leaveRoom()
    setJoined(false)
    setStarted(false)
  }

  return (
    <div className='fixed inset-0 bg-[#202124] overflow-hidden'>
      {/* Screen Share Notification */}
      {isScreenSharing && (
        <div className='fixed top-4 left-1/2 -translate-x-1/2 z-50'>
          <Card className='bg-red-500 text-white px-6 py-3 rounded-full shadow-lg'>
            <div className='flex items-center gap-3'>
              <Monitor className='size-5' />
              <span className='font-semibold text-sm'>You are sharing your screen</span>
              <Button
                variant='ghost'
                size='sm'
                onClick={stopScreenShare}
                className='text-white hover:bg-white/20 h-6 px-3 text-xs font-semibold'
              >
                Stop Sharing
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* Remote Screen Share Notifications */}
      {Object.entries(remoteScreenShares).length > 0 && (
        <div className='fixed top-4 right-4 flex flex-col gap-2 z-50'>
          {Object.entries(remoteScreenShares).map(([peerId, isSharing]) =>
            isSharing ? (
              <Card key={peerId} className='bg-green-500 px-4 py-2 rounded-full shadow-lg'>
                <div className='flex items-center gap-2'>
                  <Monitor className='size-4' />
                  <span className='text-sm font-semibold'>{peerId} is presenting</span>
                </div>
              </Card>
            ) : null
          )}
        </div>
      )}

      {/* Waiting Room - Pre-join Screen */}
      {!joined && (
        <div className='absolute inset-0 bg-white flex items-center justify-center p-8'>
          <div className='flex gap-8 max-w-7xl w-full'>
            {/* Left: Video Preview */}
            <div className='flex-1 max-w-2xl'>
              <Card className='bg-[#3c4043] aspect-video rounded-lg overflow-hidden relative group'>
                {/* Video Preview */}
                <video
                  ref={localVideoRef}
                  autoPlay
                  playsInline
                  muted
                  className='w-full h-full object-cover'
                  style={{
                    filter: !isVideoEnabled ? 'blur(8px) grayscale(100%)' : 'none'
                  }}
                />

                {/* No Video Placeholder */}
                {!isVideoEnabled && (
                  <div className='absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-600 to-purple-700'>
                    <Avatar className='size-24'>
                      <AvatarFallback className='bg-white/20 text-white text-4xl font-semibold'>You</AvatarFallback>
                    </Avatar>
                  </div>
                )}

                {/* User Badge */}
                <div className='absolute top-4 left-4 z-10'>
                  <Card className='bg-black/50 backdrop-blur-sm text-white px-4 py-2 rounded-full border-0'>
                    <div className='flex items-center gap-2 text-sm font-semibold'>You</div>
                  </Card>
                </div>

                {/* Media Controls */}
                <div className='absolute bottom-4 left-1/2 -translate-x-1/2 z-10'>
                  <Card className='bg-[#2d2e30] border border-gray-600 px-3 py-2 rounded-full'>
                    <div className='flex items-center gap-3'>
                      <Button
                        onClick={toggleAudio}
                        className={`rounded-full size-12 transition-all ${
                          isAudioEnabled
                            ? 'bg-white hover:bg-gray-100 text-gray-700'
                            : 'bg-red-500 hover:bg-red-600 text-white'
                        }`}
                        title={isAudioEnabled ? 'Mute Microphone' : 'Unmute Microphone'}
                      >
                        {isAudioEnabled ? <Mic className='size-5' /> : <MicOff className='size-5' />}
                      </Button>

                      <Button
                        onClick={toggleVideo}
                        className={`rounded-full size-12 transition-all ${
                          isVideoEnabled
                            ? 'bg-white hover:bg-gray-100 text-gray-700'
                            : 'bg-red-500 hover:bg-red-600 text-white'
                        }`}
                        title={isVideoEnabled ? 'Turn Off Camera' : 'Turn On Camera'}
                      >
                        {isVideoEnabled ? <Video className='size-5' /> : <VideoOff className='size-5' />}
                      </Button>

                      <div className='w-px h-10 bg-gray-600' />

                      <Button
                        className='rounded-full size-12 bg-white hover:bg-gray-100 text-gray-700'
                        title='Settings'
                      >
                        ⚙️
                      </Button>
                    </div>
                  </Card>
                </div>

                {/* Camera Status */}
                {!isVideoEnabled && (
                  <div className='absolute inset-0 flex items-center justify-center'>
                    <div className='text-white text-xl font-medium'>Máy ảnh đang tắt</div>
                  </div>
                )}
              </Card>

              {/* Device Selection */}
              <div className='mt-4 flex gap-3'>
                <select className='flex-1 px-4 py-2 rounded-lg border border-gray-300 bg-white text-sm outline-none focus:border-blue-500'>
                  <option>Microphone</option>
                </select>
                <select className='flex-1 px-4 py-2 rounded-lg border border-gray-300 bg-white text-sm outline-none focus:border-blue-500'>
                  <option>Headphone</option>
                </select>
                <select className='flex-1 px-4 py-2 rounded-lg border border-gray-300 bg-white text-sm outline-none focus:border-blue-500'>
                  <option>Camera</option>
                </select>
              </div>
            </div>

            {/* Right: Join Controls */}
            <div className='flex-1 max-w-md flex flex-col justify-center gap-6'>
              <div>
                <h1 className='text-3xl font-semibold text-gray-900 mb-2'>Sẵn sàng tham gia?</h1>
                <p className='text-gray-600'>Thiết lập âm thanh và video trước khi tham gia</p>
              </div>

              <div className='space-y-4'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>Mã phòng</label>
                  <input
                    value={roomId}
                    onChange={(e) => setRoomId(e.target.value)}
                    placeholder='Nhập mã phòng'
                    className='w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
                  />
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>ID của bạn</label>
                  <input
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                    placeholder='Nhập ID của bạn'
                    className='w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
                  />
                </div>
              </div>

              <div className='space-y-3'>
                <Button
                  onClick={handleJoin}
                  className='w-full h-12 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg'
                  size='lg'
                >
                  Yêu cầu tham gia
                </Button>

                <Button variant='outline' className='w-full h-12 border-gray-300 hover:bg-gray-50' size='lg'>
                  Những cách tham gia khác
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Meeting Controls */}
      {joined && (
        <div className='absolute top-4 right-4 z-30'>
          <Button onClick={handleLeave} variant='destructive' size='sm'>
            Leave
          </Button>
        </div>
      )}

      {/* Start Media Button */}
      {joined && !started && (
        <div className='absolute top-4 left-4 z-30'>
          <Button onClick={handleStartMedia} variant='default'>
            Start Camera
          </Button>
        </div>
      )}

      {/* Call Peers Button */}
      {joined && started && connectedPeers.length > 0 && (
        <div className='absolute top-16 right-4 z-30'>
          <Button onClick={handleCallAll} variant='secondary' size='sm'>
            Call Peers
          </Button>
        </div>
      )}

      {/* Video Grid - Google Meet Style */}
      {joined && (
        <div
          className='h-full p-4 pb-24'
          style={{
            display: 'grid',
            gridTemplateColumns:
              Object.keys(remoteStreams).length === 0
                ? '1fr'
                : Object.keys(remoteStreams).length === 1
                  ? 'repeat(2, 1fr)'
                  : Object.keys(remoteStreams).length === 2
                    ? 'repeat(2, 1fr)'
                    : Object.keys(remoteStreams).length <= 4
                      ? 'repeat(2, 1fr)'
                      : 'repeat(3, 1fr)',
            gap: 8
          }}
        >
          {/* Local Video */}
          <div className='relative bg-black rounded-lg overflow-hidden group hover:shadow-xl transition-shadow'>
            {/* Header Badge */}
            <div className='absolute top-3 left-3 z-10'>
              <Card className='bg-black/50 backdrop-blur-sm text-white px-3 py-1.5 rounded-full border-0'>
                <div className='flex items-center gap-2 text-xs font-semibold'>
                  {isScreenSharing ? <Monitor className='size-3.5' /> : 'You'}
                </div>
              </Card>
            </div>

            {/* Media Status Indicators */}
            <div className='absolute top-3 right-3 z-10 flex gap-2'>
              {!isAudioEnabled && (
                <Card className='bg-red-500 size-7 rounded-full border-0'>
                  <div className='flex items-center justify-center h-full'>
                    <MicOff className='size-3.5 text-white' />
                  </div>
                </Card>
              )}
              {!isVideoEnabled && (
                <Card className='bg-red-500 size-7 rounded-full border-0'>
                  <div className='flex items-center justify-center h-full'>
                    <VideoOff className='size-3.5 text-white' />
                  </div>
                </Card>
              )}
            </div>

            <video
              ref={localVideoRef}
              autoPlay
              playsInline
              muted
              className='w-full h-full object-cover'
              style={{
                filter: !isVideoEnabled ? 'blur(8px) grayscale(100%)' : 'none'
              }}
              onLoadedMetadata={() => {
                console.log('✅ Local video loaded')
              }}
              onError={(e) => {
                console.error('❌ Local video error:', e)
              }}
            />

            {/* No Video Placeholder */}
            {!isVideoEnabled && (
              <div className='absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600'>
                <Avatar className='size-16'>
                  <AvatarFallback className='bg-white/20 text-white text-2xl'>You</AvatarFallback>
                </Avatar>
              </div>
            )}
          </div>

          {/* Remote Videos Waiting State */}
          {Object.entries(remoteStreams).length === 0 && connectedPeers.length > 0 && (
            <div className='relative bg-gradient-to-br from-pink-500 to-red-500 rounded-lg overflow-hidden flex items-center justify-center min-h-[400px] border-2 border-dashed border-white/30'>
              <div className='flex flex-col items-center gap-4 text-white'>
                <div className='animate-pulse text-6xl'>⏳</div>
                <div className='text-lg font-semibold'>Waiting for remote video...</div>
              </div>
            </div>
          )}
          {Object.entries(remoteStreams).map(([peerId, stream]) => {
            const isRemoteScreenSharing = remoteScreenShares[peerId]
            return (
              <div
                key={peerId}
                className='relative bg-black rounded-lg overflow-hidden group hover:shadow-xl transition-shadow'
              >
                {/* Header Badge */}
                <div className='absolute top-3 left-3 z-10'>
                  <Card className='bg-black/50 backdrop-blur-sm text-white px-3 py-1.5 rounded-full border-0'>
                    <div className='flex items-center gap-2 text-xs font-semibold'>
                      {isRemoteScreenSharing ? <Monitor className='size-3.5' /> : peerId}
                    </div>
                  </Card>
                </div>

                {/* Screen Share Badge */}
                {isRemoteScreenSharing && (
                  <div className='absolute top-3 right-3 z-10 animate-pulse'>
                    <Card className='bg-yellow-400 text-gray-800 px-3 py-1.5 rounded-full border-0'>
                      <div className='flex items-center gap-1.5 text-xs font-bold'>
                        <Monitor className='size-3.5' />
                        Presenting
                      </div>
                    </Card>
                  </div>
                )}

                <video
                  autoPlay
                  playsInline
                  className='w-full h-full bg-black'
                  style={{
                    objectFit: isRemoteScreenSharing ? 'contain' : 'cover'
                  }}
                  ref={(el) => {
                    if (el && stream) {
                      // Only set srcObject if it's different to avoid interrupting playback
                      if (el.srcObject !== stream) {
                        console.log(`🎥 Setting remote video for ${peerId}:`, stream)
                        console.log(`🎥 Stream details:`, {
                          id: stream.id,
                          active: stream.active,
                          tracks: stream.getTracks().length,
                          videoTracks: stream.getVideoTracks().length,
                          audioTracks: stream.getAudioTracks().length
                        })
                        el.srcObject = stream
                        // Don't manually call play() - autoPlay attribute handles it
                        // This avoids conflicts when stream updates rapidly
                      }
                    }
                  }}
                  onLoadedMetadata={() => {
                    console.log(`✅ Remote video loaded for ${peerId}`)
                  }}
                  onError={(e) => {
                    console.error(`❌ Remote video error for ${peerId}:`, e)
                  }}
                />
              </div>
            )
          })}
        </div>
      )}

      {/* Meeting Controls */}
      {joined && started && (
        <MeetingControls
          roomId={roomId}
          userId={userId}
          socket={socket?.current}
          isHandRaised={isHandRaised}
          onToggleHand={() => setIsHandRaised(!isHandRaised)}
          isRecording={isRecording}
          onToggleRecording={() => setIsRecording(!isRecording)}
          onStartScreenShare={startScreenShare}
          onStopScreenShare={stopScreenShare}
          isScreenSharing={isScreenSharing}
          isAudioEnabled={isAudioEnabled}
          isVideoEnabled={isVideoEnabled}
          onToggleAudio={toggleAudio}
          onToggleVideo={toggleVideo}
        />
      )}

      {/* Chat */}
      {joined && (
        <Chat
          roomId={roomId}
          userId={userId}
          socket={socket?.current}
          isOpen={isChatOpen}
          onToggle={() => setIsChatOpen(!isChatOpen)}
        />
      )}
    </div>
  )
}
