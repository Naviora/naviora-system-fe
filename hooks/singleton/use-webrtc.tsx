import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { io, Socket } from 'socket.io-client'

const envIceServerUrls =
  process.env.NEXT_PUBLIC_WEBRTC_CUSTOM_ICE_URLS?.split(',')
    .map((url) => url.trim())
    .filter(Boolean) ?? null

const managedEnvIceServer =
  envIceServerUrls && envIceServerUrls.length > 0
    ? ({
        urls: envIceServerUrls,
        ...(process.env.NEXT_PUBLIC_WEBRTC_CUSTOM_ICE_USERNAME
          ? { username: process.env.NEXT_PUBLIC_WEBRTC_CUSTOM_ICE_USERNAME }
          : {}),
        ...(process.env.NEXT_PUBLIC_WEBRTC_CUSTOM_ICE_CREDENTIAL
          ? { credential: process.env.NEXT_PUBLIC_WEBRTC_CUSTOM_ICE_CREDENTIAL }
          : {})
      } satisfies RTCIceServer)
    : null

type PeerId = string

type UseWebRTCOptions = {
  signalingUrl: string
  namespace?: string
  iceServers?: RTCIceServer[]
}

export function useWebRTC(roomId: string, userId: string, options: UseWebRTCOptions) {
  const { signalingUrl, namespace = '/webrtc', iceServers } = options

  const socketRef = useRef<Socket | null>(null)
  const pcRef = useRef<Map<PeerId, RTCPeerConnection>>(new Map())
  const localStreamRef = useRef<MediaStream | null>(null)
  const [remoteStreams, setRemoteStreams] = useState<Record<PeerId, MediaStream>>({})
  const [connectedPeers, setConnectedPeers] = useState<PeerId[]>([])
  const [isScreenSharing, setIsScreenSharing] = useState(false)
  const [screenShareStream, setScreenShareStream] = useState<MediaStream | null>(null)
  const [remoteScreenShares, setRemoteScreenShares] = useState<Record<PeerId, boolean>>({})
  const [isAudioEnabled, setIsAudioEnabled] = useState(true)
  const [isVideoEnabled, setIsVideoEnabled] = useState(true)

  const rtcConfig = useMemo<RTCConfiguration>(
    () => ({
      iceServers: iceServers ?? [
        // STUN servers
        { urls: ['stun:stun1.l.google.com:19302'] },
        { urls: ['stun:stun.l.google.com:19302'] },
        { urls: ['stun:stun2.l.google.com:19302'] },
        { urls: ['stun:stun3.l.google.com:19302'] },
        { urls: ['stun:stun4.l.google.com:19302'] },
        { urls: ['stun:stun.ekiga.net'] },
        { urls: ['stun:stun.ideasip.com'] },
        { urls: ['stun:stun.rixtelecom.se'] },

        // ExpressTurn TURN server with authentication
        // {
        //   urls: ["turn:relay1.expressturn.com:3480"],
        //   username: "000000002076717913",
        //   credential: "cjEo4cTEe3ANKISg4Dg8VbLxWEA="
        // },
        // {
        //   urls: ["turn:relay1.expressturn.com:3480?transport=tcp"],
        //   username: "000000002076717913",
        //   credential: "cjEo4cTEe3ANKISg4Dg8VbLxWEA="
        // }
        {
          urls: 'stun:stun.relay.metered.ca:80'
        },
        // {
        //   urls: 'turn:sg.relay.metered.ca:80',
        //   username: 'ce7e305ee5978a6e226b86c8',
        //   credential: 'hWphRx79NhBy3EXy'
        // },
        // {
        //   urls: 'turn:sg.relay.metered.ca:80?transport=tcp',
        //   username: 'ce7e305ee5978a6e226b86c8',
        //   credential: 'hWphRx79NhBy3EXy'
        // },
        // {
        //   urls: 'turn:sg.relay.metered.ca:443',
        //   username: 'ce7e305ee5978a6e226b86c8',
        //   credential: 'hWphRx79NhBy3EXy'
        // },
        ...(managedEnvIceServer
          ? [managedEnvIceServer]
          : [
              {
                urls: [
                  'stun:103.200.20.196:3478',
                  'turn:103.200.20.196:3478?transport=udp',
                  'turn:103.200.20.196:3478?transport=tcp'
                ],
                username: 'naviora',
                credential: 'strongturnpassword123'
              }
            ]),
        {
          urls: 'turns:sg.relay.metered.ca:443?transport=tcp',
          username: 'ce7e305ee5978a6e226b86c8',
          credential: 'hWphRx79NhBy3EXy'
        }
      ],
      iceCandidatePoolSize: 10
    }),
    [iceServers]
  )

  const ensureSocket = useCallback(() => {
    if (socketRef.current) return socketRef.current
    const socket = io(`${signalingUrl}${namespace}`, {
      transports: ['websocket']
    })

    socket.on('connect', () => {
      console.log('✅ Socket connected:', socket.id)
    })

    socket.on('disconnect', (reason) => {
      console.log('❌ Socket disconnected:', reason)
    })

    socket.on('connect_error', (error) => {
      console.error('❌ Socket connection error:', error)
    })

    socketRef.current = socket
    return socket
  }, [namespace, signalingUrl])

  const createPeerConnection = useCallback(
    (peerUserId: PeerId) => {
      console.log(`🔗 Creating peer connection with ${peerUserId}`)
      const pc = new RTCPeerConnection(rtcConfig)

      pc.onicecandidate = (e) => {
        if (e.candidate) {
          console.log(`📤 Sending ICE candidate to ${peerUserId}`)
          socketRef.current?.emit('ice-candidate', {
            roomId,
            targetUserId: peerUserId,
            candidate: e.candidate
          })
        }
      }

      pc.ontrack = (e) => {
        console.log(`📹 Received track from ${peerUserId}:`, e)
        console.log(`📹 Track details:`, {
          kind: e.track.kind,
          enabled: e.track.enabled,
          muted: e.track.muted,
          readyState: e.track.readyState,
          streams: e.streams.length
        })

        if (e.streams && e.streams.length > 0) {
          const stream = e.streams[0]
          console.log(`📹 Stream details:`, {
            id: stream.id,
            active: stream.active,
            tracks: stream.getTracks().length
          })

          setRemoteStreams((prev) => {
            const newStreams = { ...prev, [peerUserId]: stream }
            console.log(`✅ Remote stream set for ${peerUserId}`, newStreams)
            return newStreams
          })
        } else {
          console.error(`❌ No stream in ontrack event for ${peerUserId}`)
        }
      }

      pc.onconnectionstatechange = () => {
        console.log(`🔗 Connection state with ${peerUserId}:`, pc.connectionState)
      }

      pc.oniceconnectionstatechange = () => {
        const state = pc.iceConnectionState
        console.log(`🧊 ICE connection state with ${peerUserId}:`, state)

        // Log warnings for failed connections
        if (state === 'failed') {
          console.error(`❌ ICE connection failed with ${peerUserId}. This might be due to network issues or firewall.`)
        } else if (state === 'disconnected') {
          console.warn(`⚠️ ICE connection disconnected with ${peerUserId}`)
        } else if (state === 'connected') {
          console.log(`✅ ICE connection established with ${peerUserId}`)
        }
      }

      pc.onicegatheringstatechange = () => {
        console.log(`🧊 ICE gathering state with ${peerUserId}:`, pc.iceGatheringState)
      }

      pcRef.current.set(peerUserId, pc)
      return pc
    },
    [roomId, rtcConfig]
  )

  const joinRoom = useCallback(async () => {
    const socket = ensureSocket()
    console.log('🚪 Joining room:', { roomId, userId })
    socket.emit('join-room', { roomId, userId })
  }, [ensureSocket, roomId, userId])

  const leaveRoom = useCallback(() => {
    socketRef.current?.emit('leave-room', { roomId, userId })
    socketRef.current?.disconnect()
    socketRef.current = null
    pcRef.current.forEach((pc) => pc.close())
    pcRef.current.clear()
    setRemoteStreams({})
    setConnectedPeers([])
  }, [roomId, userId])

  const startLocalMedia = useCallback(async (constraints: MediaStreamConstraints = { audio: true, video: true }) => {
    console.log('🎥 Requesting local media with constraints:', constraints)

    try {
      const stream = await navigator.mediaDevices.getUserMedia(constraints)
      console.log('🎥 Local media obtained:', stream)
      console.log('🎥 Local stream tracks:', stream.getTracks())
      localStreamRef.current = stream
      return stream
    } catch (error) {
      console.error('❌ Error getting user media:', error)
      // Re-throw to let the caller handle it
      throw error
    }
  }, [])

  const startCallWith = useCallback(
    async (peerUserId: PeerId) => {
      console.log(`📞 Starting call with ${peerUserId}`)
      const socket = ensureSocket()
      const pc = createPeerConnection(peerUserId)

      // Add local tracks to the new peer connection
      if (localStreamRef.current) {
        console.log(`📹 Adding local tracks to ${peerUserId}`)
        console.log(
          `📹 Local stream tracks:`,
          localStreamRef.current.getTracks().map((t) => ({
            kind: t.kind,
            enabled: t.enabled,
            muted: t.muted,
            readyState: t.readyState
          }))
        )

        localStreamRef.current.getTracks().forEach((track) => {
          try {
            pc.addTrack(track, localStreamRef.current!)
            console.log(`✅ Added ${track.kind} track to ${peerUserId}`)
          } catch (error) {
            console.error(`❌ Error adding ${track.kind} track to ${peerUserId}:`, error)
          }
        })
      } else {
        console.warn(`⚠️ No local stream available for ${peerUserId}`)
      }

      try {
        const offer = await pc.createOffer()
        await pc.setLocalDescription(offer)
        console.log(`📤 Sending offer to ${peerUserId}`)
        socket.emit('offer', { roomId, targetUserId: peerUserId, offer })
      } catch (error) {
        console.error(`❌ Error creating offer for ${peerUserId}:`, error)
      }
    },
    [createPeerConnection, ensureSocket, roomId]
  )

  const stopLocalTracks = useCallback(() => {
    localStreamRef.current?.getTracks().forEach((t) => t.stop())
    localStreamRef.current = null
  }, [])

  const toggleAudio = useCallback(() => {
    if (localStreamRef.current) {
      const audioTracks = localStreamRef.current.getAudioTracks()
      audioTracks.forEach((track) => {
        track.enabled = !track.enabled
      })
      setIsAudioEnabled((prev) => !prev)
      console.log(`🎤 Audio ${!isAudioEnabled ? 'enabled' : 'disabled'}`)
    }
  }, [isAudioEnabled])

  const toggleVideo = useCallback(() => {
    if (localStreamRef.current) {
      const videoTracks = localStreamRef.current.getVideoTracks()
      videoTracks.forEach((track) => {
        track.enabled = !track.enabled
      })
      setIsVideoEnabled((prev) => !prev)
      console.log(`📹 Video ${!isVideoEnabled ? 'enabled' : 'disabled'}`)
    }
  }, [isVideoEnabled])

  useEffect(() => {
    const socket = ensureSocket()

    const onExistingUsers = async (payload: { userId: string; socketId: string }[]) => {
      console.log('👥 Existing users:', payload)
      for (const user of payload) {
        if (user.userId !== userId) {
          console.log(`➕ Adding existing user: ${user.userId}`)
          setConnectedPeers((prev) => (prev.includes(user.userId) ? prev : [...prev, user.userId]))

          // Auto-start call if we have local media
          if (localStreamRef.current) {
            console.log(`📞 Auto-calling existing user: ${user.userId}`)
            await startCallWith(user.userId)
          } else {
            console.log(`⏳ Waiting for local media to call ${user.userId}`)
          }
        }
      }
    }
    const onUserJoined = async (payload: { userId: string; socketId: string }) => {
      console.log('👋 New user joined:', payload)
      setConnectedPeers((prev) => {
        if (prev.includes(payload.userId)) {
          console.log(`ℹ️ User ${payload.userId} already in connected peers list`)
          return prev
        }
        return [...prev, payload.userId]
      })

      // Auto-start call if we have local media
      // Add small delay to avoid race condition when both users join simultaneously
      if (localStreamRef.current) {
        console.log(`📞 Auto-calling new user: ${payload.userId}`)
        // Small delay to ensure peer connection is ready
        setTimeout(async () => {
          try {
            await startCallWith(payload.userId)
          } catch (error) {
            console.error(`❌ Error auto-calling ${payload.userId}:`, error)
          }
        }, 100)
      } else {
        console.log(`⏳ Waiting for local media to call ${payload.userId}`)
      }
    }
    const onUserLeft = (payload: { userId: string }) => {
      console.log('👋 User left:', payload.userId)
      setConnectedPeers((prev) => prev.filter((p) => p !== payload.userId))
      const pc = pcRef.current.get(payload.userId)
      pc?.close()
      pcRef.current.delete(payload.userId)
      setRemoteStreams((prev) => {
        const next = { ...prev }
        delete next[payload.userId]
        return next
      })
    }
    const onOffer = async (payload: { offer: RTCSessionDescriptionInit; fromUserId: string }) => {
      console.log(`📥 Received offer from ${payload.fromUserId}`)
      let pc = pcRef.current.get(payload.fromUserId)

      if (!pc) {
        console.log(`🔗 Creating new peer connection for ${payload.fromUserId}`)
        pc = createPeerConnection(payload.fromUserId)
      }

      if (pc) {
        try {
          // Step 1: Set remote description first
          await pc.setRemoteDescription(new RTCSessionDescription(payload.offer))
          console.log(`✅ Set remote description for ${payload.fromUserId}`)

          // Step 2: Add local tracks if available and not already added
          if (localStreamRef.current) {
            const existingSenders = pc.getSenders()

            // Only add tracks if we don't have senders yet (new connection)
            if (existingSenders.length === 0) {
              console.log(`📹 Adding local tracks to PC for ${payload.fromUserId}`)
              localStreamRef.current.getTracks().forEach((track) => {
                try {
                  pc!.addTrack(track, localStreamRef.current!)
                  console.log(`✅ Added ${track.kind} track to PC for ${payload.fromUserId}`)
                } catch (error) {
                  console.error(`❌ Error adding ${track.kind} track to PC for ${payload.fromUserId}:`, error)
                }
              })
            } else {
              console.log(
                `ℹ️ Tracks already added for ${payload.fromUserId} (${existingSenders.length} senders), skipping`
              )
            }
          } else {
            console.warn(`⚠️ No local stream available for PC for ${payload.fromUserId}`)
          }

          // Step 3: Create and send answer
          const answer = await pc.createAnswer()
          await pc.setLocalDescription(answer)
          console.log(`📤 Sending answer to ${payload.fromUserId}`)
          socket.emit('answer', {
            roomId,
            targetUserId: payload.fromUserId,
            answer
          })
        } catch (error) {
          console.error(`❌ Error handling offer from ${payload.fromUserId}:`, error)
        }
      } else {
        console.error(`❌ No peer connection available for ${payload.fromUserId}`)
      }
    }
    const onAnswer = async (payload: { answer: RTCSessionDescriptionInit; fromUserId: string }) => {
      console.log(`📥 Received answer from ${payload.fromUserId}`)
      const pc = pcRef.current.get(payload.fromUserId)
      if (pc) {
        try {
          await pc.setRemoteDescription(new RTCSessionDescription(payload.answer))
          console.log(`✅ Answer processed for ${payload.fromUserId}`)
        } catch (error) {
          console.error(`❌ Error processing answer from ${payload.fromUserId}:`, error)
        }
      } else {
        console.warn(`⚠️ No peer connection found for ${payload.fromUserId}`)
      }
    }
    const onCandidate = async (payload: { candidate: RTCIceCandidateInit; fromUserId: string }) => {
      console.log(`🧊 Received ICE candidate from ${payload.fromUserId}`)
      const pc = pcRef.current.get(payload.fromUserId)
      if (pc) {
        try {
          await pc.addIceCandidate(new RTCIceCandidate(payload.candidate))
          console.log(`✅ ICE candidate added for ${payload.fromUserId}`)
        } catch (error) {
          console.error(`❌ Error adding ICE candidate from ${payload.fromUserId}:`, error)
        }
      } else {
        console.warn(`⚠️ No peer connection found for ICE candidate from ${payload.fromUserId}`)
      }
    }

    const onRoomStateDebug = (data: unknown) => {
      console.log('🔍 Room state debug:', data)
    }

    const onScreenShareStarted = (payload: { userId: string }) => {
      console.log(`🖥️ User ${payload.userId} started screen sharing`)
      setRemoteScreenShares((prev) => ({ ...prev, [payload.userId]: true }))
    }

    const onScreenShareStopped = (payload: { userId: string }) => {
      console.log(`🖥️ User ${payload.userId} stopped screen sharing`)
      setRemoteScreenShares((prev) => {
        const next = { ...prev }
        delete next[payload.userId]
        return next
      })
    }

    socket.on('existing-users', onExistingUsers)
    socket.on('user-joined', onUserJoined)
    socket.on('user-left', onUserLeft)
    socket.on('offer', onOffer)
    socket.on('answer', onAnswer)
    socket.on('ice-candidate', onCandidate)
    socket.on('room-state-debug', onRoomStateDebug)
    socket.on('start-screen-share', onScreenShareStarted)
    socket.on('stop-screen-share', onScreenShareStopped)

    return () => {
      socket.off('existing-users', onExistingUsers)
      socket.off('user-joined', onUserJoined)
      socket.off('user-left', onUserLeft)
      socket.off('offer', onOffer)
      socket.off('answer', onAnswer)
      socket.off('ice-candidate', onCandidate)
      socket.off('room-state-debug', onRoomStateDebug)
      socket.off('start-screen-share', onScreenShareStarted)
      socket.off('stop-screen-share', onScreenShareStopped)
    }
  }, [createPeerConnection, ensureSocket, roomId, startCallWith, userId])

  const startScreenShare = useCallback(async () => {
    try {
      // Check if getDisplayMedia is supported
      if (!navigator.mediaDevices || !navigator.mediaDevices.getDisplayMedia) {
        throw new Error('getDisplayMedia is not supported in this browser')
      }

      // Call getDisplayMedia directly on navigator.mediaDevices to maintain proper context
      const displayStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: false // Set to true if you want to capture system audio
      } as DisplayMediaStreamOptions)

      const screenTrack = displayStream.getVideoTracks()[0]

      // Replace video track in all peer connections
      pcRef.current.forEach((pc) => {
        const sender = pc.getSenders().find((s) => s.track && s.track.kind === 'video')
        if (sender) sender.replaceTrack(screenTrack)
      })

      setScreenShareStream(displayStream)
      setIsScreenSharing(true)

      // Notify other users
      socketRef.current?.emit('start-screen-share', { roomId, userId })

      // Handle when user stops screen sharing
      screenTrack.onended = () => {
        if (screenShareStream) {
          screenShareStream.getTracks().forEach((track) => track.stop())
          setScreenShareStream(null)
        }
        setIsScreenSharing(false)

        // Restore camera if available
        if (localStreamRef.current) {
          const videoTrack = localStreamRef.current.getVideoTracks()[0]
          if (videoTrack) {
            pcRef.current.forEach((pc) => {
              const sender = pc.getSenders().find((s) => s.track && s.track.kind === 'video')
              if (sender) sender.replaceTrack(videoTrack)
            })
          }
        }

        // Notify other users
        socketRef.current?.emit('stop-screen-share', { roomId, userId })
      }

      return displayStream
    } catch (error) {
      console.error('Error starting screen share:', error)
      throw error
    }
  }, [roomId, userId, screenShareStream])

  const stopScreenShare = useCallback(() => {
    if (screenShareStream) {
      screenShareStream.getTracks().forEach((track) => track.stop())
      setScreenShareStream(null)
    }
    setIsScreenSharing(false)

    // Restore camera if available
    if (localStreamRef.current) {
      const videoTrack = localStreamRef.current.getVideoTracks()[0]
      if (videoTrack) {
        pcRef.current.forEach((pc) => {
          const sender = pc.getSenders().find((s) => s.track && s.track.kind === 'video')
          if (sender) sender.replaceTrack(videoTrack)
        })
      }
    }

    // Notify other users
    socketRef.current?.emit('stop-screen-share', { roomId, userId })
  }, [screenShareStream, roomId, userId])

  return {
    socket: socketRef,
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
  }
}
