import Chat from '@/components/meeting/chat'
import MeetingControls from '@/components/meeting/meeting-control'
import WaitingRoom from '@/components/meeting/waiting-room'
import { useWebRTC } from '@/hooks/singleton/use-webrtc'
import { useEffect, useRef, useState } from 'react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Monitor, MicOff, VideoOff } from 'lucide-react'
import { toast } from 'sonner'

type Props = {
  signalingUrl: string
  initialRoomId?: string
}

export default function WebRTCRoom({ signalingUrl, initialRoomId }: Props) {
  const [roomId, setRoomId] = useState(() => initialRoomId || 'demo-room')
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
        const video = localVideoRef.current
        if (video.srcObject !== streamToShow) {
          video.srcObject = streamToShow
          // Ensure video plays
          video.play().catch((error) => {
            if (error.name !== 'AbortError') {
              console.warn('⚠️ Could not play local video:', error)
            }
          })
        }
      } else if (localVideoRef.current.srcObject) {
        // Clear video if no stream
        localVideoRef.current.srcObject = null
      }
    }
  }, [isScreenSharing, screenShareStream, localStreamRef])

  // Separate effect to watch for stream changes - use interval to check
  useEffect(() => {
    if (!localVideoRef.current || isScreenSharing) return

    const checkAndUpdateStream = () => {
      if (localVideoRef.current && localStreamRef.current) {
        const video = localVideoRef.current
        const stream = localStreamRef.current

        if (video.srcObject !== stream) {
          console.log('🎥 Updating local video stream')
          video.srcObject = stream
          video.play().catch((error) => {
            if (error.name !== 'AbortError') {
              console.warn('⚠️ Could not play local video:', error)
            }
          })
        }
      }
    }

    // Check immediately
    checkAndUpdateStream()

    // Check periodically (in case stream is set asynchronously)
    const interval = setInterval(checkAndUpdateStream, 500)

    return () => clearInterval(interval)
  }, [isScreenSharing, isVideoEnabled, localStreamRef])

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

    // Auto-start if already have media from waiting room
    // If no media, still set started=true to show meeting UI (user can toggle audio/video in controls)
    setStarted(true)

    // Auto-call existing peers if we have media
    if (localStreamRef.current) {
      setTimeout(async () => {
        for (const peerId of connectedPeers) {
          try {
            await startCallWith(peerId)
          } catch (error) {
            console.error(`❌ Error calling peer ${peerId}:`, error)
          }
        }
      }, 500) // Small delay to ensure socket events are processed
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
        <WaitingRoom
          roomId={roomId}
          userId={userId}
          onRoomIdChange={setRoomId}
          onUserIdChange={setUserId}
          onJoin={handleJoin}
          isAudioEnabled={isAudioEnabled}
          isVideoEnabled={isVideoEnabled}
          onToggleAudio={toggleAudio}
          onToggleVideo={toggleVideo}
          localVideoRef={localVideoRef as React.RefObject<HTMLVideoElement>}
          onRequestMedia={async () => {
            try {
              if (localStreamRef.current) {
                localStreamRef.current.getTracks().forEach((track) => track.stop())
                localStreamRef.current = null
              }
              const stream = await startLocalMedia({
                audio: isAudioEnabled,
                video: isVideoEnabled
              })
              if (localVideoRef.current && stream) {
                localVideoRef.current.srcObject = stream
                localVideoRef.current.play().catch((error) => {
                  if (error.name !== 'AbortError') {
                    console.warn('⚠️ Could not autoplay video:', error)
                  }
                })
              }
            } catch (error: unknown) {
              console.error('❌ Error requesting media:', error)
              let errorMessage = 'Không thể truy cập camera/microphone'
              if (error instanceof DOMException) {
                switch (error.name) {
                  case 'NotReadableError':
                    errorMessage =
                      'Camera/microphone đang được sử dụng bởi ứng dụng khác. Vui lòng đóng các ứng dụng khác và thử lại.'
                    break
                  case 'NotAllowedError':
                    errorMessage =
                      'Bạn đã từ chối quyền truy cập camera/microphone. Vui lòng cấp quyền trong cài đặt trình duyệt.'
                    break
                  case 'NotFoundError':
                    errorMessage = 'Không tìm thấy camera/microphone. Vui lòng kiểm tra thiết bị của bạn.'
                    break
                  default:
                    errorMessage = `Lỗi: ${error.message || 'Không thể truy cập thiết bị'}`
                }
              }
              toast.error(errorMessage, { duration: 5000 })
            }
          }}
        />
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
              <div className='absolute inset-0 flex items-center justify-center  bg-linear-to-br from-blue-500 to-purple-600'>
                <Avatar className='size-16'>
                  <AvatarFallback className='bg-white/20 text-white text-2xl'>You</AvatarFallback>
                </Avatar>
              </div>
            )}
          </div>

          {/* Remote Videos Waiting State */}
          {Object.entries(remoteStreams).length === 0 && connectedPeers.length > 0 && (
            <div className='relative bg-linear-to-br from-pink-500 to-red-500 rounded-lg overflow-hidden flex items-center justify-center min-h-[400px] border-2 border-dashed border-white/30'>
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
          onLeave={handleLeave}
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
