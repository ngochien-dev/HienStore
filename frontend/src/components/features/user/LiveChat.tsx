import { useState, useEffect, useRef } from 'react'
import { MessageCircle, X, Send } from 'lucide-react'
import { useAppSelector } from '../../../app/hooks'
import { Client } from '@stomp/stompjs'
import SockJS from 'sockjs-client'
import api from '../../../api/axiosClient'

interface ChatMessage {
  id?: number
  senderEmail: string
  senderName: string
  recipientEmail: string
  content: string
  timestamp: string
  isRead: boolean
}

export const LiveChat = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [newMessage, setNewMessage] = useState('')
  const { user, isAuthenticated, token } = useAppSelector(state => state.auth)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const stompClient = useRef<Client | null>(null)

  useEffect(() => {
    if (isOpen && isAuthenticated) {
      loadHistory()
      connectWebSocket()
    }

    return () => {
      if (stompClient.current) {
        stompClient.current.deactivate()
      }
    }
  }, [isOpen, isAuthenticated])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const loadHistory = async () => {
    try {
      const res = await api.get('/api/chat/history/admin')
      setMessages(res.data)
    } catch (error) {
      console.error('Failed to load chat history', error)
    }
  }

  const connectWebSocket = () => {
    if (!token) return

    const socket = new SockJS('http://localhost:8080/ws')
    const client = new Client({
      webSocketFactory: () => socket,
      connectHeaders: {
        Authorization: `Bearer ${token}`
      },
      debug: (str) => {
        // console.log(new Date(), str);
      },
      onConnect: () => {
        // Subscribe to user specific queue
        client.subscribe(`/user/queue/messages`, (message) => {
          const receivedMessage = JSON.parse(message.body) as ChatMessage
          setMessages(prev => [...prev, receivedMessage])
        })
      },
      onStompError: (frame) => {
        console.error('Broker reported error: ' + frame.headers['message'])
        console.error('Additional details: ' + frame.body)
      },
    })

    client.activate()
    stompClient.current = client
  }

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || !stompClient.current || !stompClient.current.connected) return

    stompClient.current.publish({
      destination: '/app/chat',
      body: JSON.stringify({
        recipientEmail: '', // Empty means send to admin
        content: newMessage
      })
    })

    setNewMessage('')
  }

  // Admin doesn't need floating chat button, they have a dedicated dashboard page
  if (user?.role === 'ADMIN') return null

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 p-4 bg-indigo-600 text-white rounded-full shadow-lg hover:bg-indigo-700 hover:scale-105 transition-all z-50 animate-bounce-soft"
        >
          <MessageCircle size={28} />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-80 sm:w-96 bg-white dark:bg-slate-900 rounded-2xl shadow-premium border border-slate-200 dark:border-slate-800 flex flex-col z-50 overflow-hidden animate-slide-up h-[500px] max-h-[80vh]">
          {/* Header */}
          <div className="p-4 bg-indigo-600 text-white flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-bold text-lg">
                  H
                </div>
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-indigo-600 rounded-full"></div>
              </div>
              <div>
                <h3 className="font-bold">Hỗ trợ trực tuyến</h3>
                <p className="text-xs text-indigo-100">Chúng tôi luôn sẵn sàng hỗ trợ</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-white hover:bg-white/20 p-2 rounded-xl transition-colors">
              <X size={20} />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-4 overflow-y-auto bg-slate-50 dark:bg-slate-900/50 space-y-4">
            {!isAuthenticated ? (
              <div className="h-full flex flex-col items-center justify-center text-center text-slate-500 p-4">
                <MessageCircle size={48} className="mb-4 opacity-20" />
                <p>Vui lòng đăng nhập để trò chuyện với chúng tôi.</p>
              </div>
            ) : messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center text-slate-500 p-4">
                <p>Hãy gửi tin nhắn đầu tiên để bắt đầu trò chuyện!</p>
              </div>
            ) : (
              messages.map((msg, index) => {
                const isMe = msg.senderEmail === user?.email
                return (
                  <div key={msg.id || index} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                    <div 
                      className={`max-w-[80%] p-3 rounded-2xl ${
                        isMe 
                          ? 'bg-indigo-600 text-white rounded-tr-sm' 
                          : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-100 dark:border-slate-700 rounded-tl-sm'
                      }`}
                    >
                      <p className="text-sm">{msg.content}</p>
                    </div>
                    <span className="text-[10px] text-slate-400 mt-1">
                      {new Date(msg.timestamp).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                )
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          {isAuthenticated && (
            <div className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
              <form onSubmit={sendMessage} className="flex gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Nhập tin nhắn..."
                  className="flex-1 bg-slate-100 dark:bg-slate-800 border-none rounded-xl px-4 py-2 focus:ring-2 focus:ring-indigo-500 text-sm dark:text-white"
                />
                <button 
                  type="submit"
                  disabled={!newMessage.trim()}
                  className="p-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                >
                  <Send size={18} />
                </button>
              </form>
            </div>
          )}
        </div>
      )}
    </>
  )
}
