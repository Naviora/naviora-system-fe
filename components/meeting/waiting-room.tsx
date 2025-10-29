'use client'

import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Mic, MicOff, Video, VideoOff } from 'lucide-react'

interface Props {
  roomId: string
  userId: string
  onRoomIdChange: (roomId: string) => void
  onUserIdChange: (userId: string) => void
  onJoin: () => void
  isAudioEnabled: boolean
  isVideoEnabled: boolean
  onToggleAudio: () => void
  onToggleVideo: () => void
  localVideoRef: React.RefObject<HTMLVideoElement>
}

export default function WaitingRoom({
  roomId,
  userId,
  onRoomIdChange,
  onUserIdChange,
  onJoin,
  isAudioEnabled,
  isVideoEnabled,
  onToggleAudio,
  onToggleVideo,
  localVideoRef
}: Props) {
  return (
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
                    onClick={onToggleAudio}
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
                    onClick={onToggleVideo}
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

                  <Button className='rounded-full size-12 bg-white hover:bg-gray-100 text-gray-700' title='Settings'>
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
                onChange={(e) => onRoomIdChange(e.target.value)}
                placeholder='Nhập mã phòng'
                className='w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
              />
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>ID của bạn</label>
              <input
                value={userId}
                onChange={(e) => onUserIdChange(e.target.value)}
                placeholder='Nhập ID của bạn'
                className='w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
              />
            </div>
          </div>

          <div className='space-y-3'>
            <Button
              onClick={onJoin}
              className='w-full h-12 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg'
              size='lg'
            >
              Yêu cầu tham gia
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
