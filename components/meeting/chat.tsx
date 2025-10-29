import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { X, Send } from 'lucide-react'

interface Message {
  userId: string
  message: string
  timestamp: number
}

interface Props {
  roomId: string
  userId: string
  socket: any // eslint-disable-line @typescript-eslint/no-explicit-any
  isOpen: boolean
  onToggle: () => void
}

export default function Chat({ roomId, userId, socket, isOpen, onToggle }: Props) {
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (!socket) return

    const handleNewMessage = (data: Message) => {
      console.log('New message event received:', data)
      setMessages((prev) => {
        const newMessages = [...prev, data]
        console.log('Updated messages:', newMessages)
        return newMessages
      })
    }

    socket.on('new-message', handleNewMessage)

    return () => {
      socket.off('new-message', handleNewMessage)
    }
  }, [socket])

  const sendMessage = () => {
    console.log('Send message clicked', {
      socket: !!socket,
      newMessage: newMessage.trim()
    })
    if (!newMessage.trim() || !socket) {
      console.error('Cannot send message:', {
        hasMessage: !!newMessage.trim(),
        hasSocket: !!socket
      })
      return
    }

    const messageData = {
      roomId,
      userId,
      message: newMessage.trim(),
      timestamp: Date.now()
    }

    console.log('Emitting send-message:', messageData)
    socket.emit('send-message', messageData)
    setNewMessage('')
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (!isOpen) {
    return (
      <Button
        onClick={onToggle}
        className='fixed bottom-20 right-4 size-14 rounded-full bg-gray-600 hover:bg-gray-700 text-white shadow-lg z-50'
      >
        💬
      </Button>
    )
  }

  return (
    <div className='fixed bottom-20 right-4 w-80 h-[500px] z-50'>
      <Card className='h-full flex flex-col bg-white border border-gray-200 shadow-2xl'>
        {/* Header */}
        <div className='px-4 py-3 border-b border-gray-200 flex justify-between items-center bg-gray-50 rounded-t-xl'>
          <h3 className='text-base font-semibold text-gray-900'>Chat</h3>
          <Button onClick={onToggle} variant='ghost' size='icon' className='size-8 rounded-full hover:bg-gray-200'>
            <X className='size-4' />
          </Button>
        </div>

        {/* Messages */}
        <div className='flex-1 overflow-y-auto p-3 flex flex-col gap-2'>
          {messages.map((msg, index) => (
            <div
              key={index}
              className='flex flex-col'
              style={{
                alignItems: msg.userId === userId ? 'flex-end' : 'flex-start'
              }}
            >
              <div
                className={`px-3 py-2 rounded-2xl max-w-[80%] text-sm ${
                  msg.userId === userId ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-900'
                }`}
              >
                {msg.message}
              </div>
              <div
                className='text-xs text-gray-500 mt-1'
                style={{
                  marginLeft: msg.userId === userId ? 0 : '12px',
                  marginRight: msg.userId === userId ? '12px' : 0
                }}
              >
                {msg.userId === userId ? 'You' : msg.userId} • {formatTime(msg.timestamp)}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className='px-3 py-3 border-t border-gray-200 flex gap-2'>
          <input
            type='text'
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder='Type a message...'
            className='flex-1 px-3 py-2 border border-gray-300 rounded-full text-sm outline-none focus:border-blue-500'
          />
          <Button
            onClick={sendMessage}
            disabled={!newMessage.trim()}
            className='size-9 rounded-full bg-blue-500 hover:bg-blue-600 text-white border-0'
          >
            <Send className='size-4' />
          </Button>
        </div>
      </Card>
    </div>
  )
}
