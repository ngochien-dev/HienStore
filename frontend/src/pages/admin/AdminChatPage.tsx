import { useState, useEffect, useRef } from 'react'
import { AdminLayout } from '../../components/layout/AdminLayout'
import api from '../../api/axiosClient'
import { useAppSelector } from '../../app/hooks'
import { Client } from '@stomp/stompjs'
import SockJS from 'sockjs-client'
import { Send, User as UserIcon, MessageSquare } from 'lucide-react'

interface ChatMessage {
  id?: number
  senderEmail: string
  senderName: string
  recipientEmail: string
  content: string
  timestamp: string
  isRead: boolean
}

interface ChatUser {
  email: string
  fullName: string
  avatar: string
}

export const AdminChatPage = () => {
  const [users, setUsers] = useState<ChatUser[]>([])
  const [selectedUser, setSelectedUser] = useState<ChatUser | null>(null)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [newMessage, setNewMessage] = useState('')
  const { token, user } = useAppSelector(state => state.auth)
  
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const stompClient = useRef<Client | null>(null)

  useEffect(() => {
    fetchUsers()
    connectWebSocket()

    return () => {
      if (stompClient.current) {
        stompClient.current.deactivate()
      }
    }
  }, [])

  useEffect(() => {
    if (selectedUser) {
      loadHistory(selectedUser.email)
    }
  }, [selectedUser])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const fetchUsers = async () => {
    try {
      const res = await api.get('/api/chat/users')
      setUsers(res.data)
    } catch (error) {
      console.error('Error fetching chat users:', error)
    }
  }

  const loadHistory = async (userEmail: string) => {
    try {
      const res = await api.get(`/api/chat/history/${userEmail}`)
      setMessages(res.data)
    } catch (error) {
      console.error('Error fetching chat history:', error)
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
        // Subscribe to admin's specific queue
        client.subscribe(`/user/queue/messages`, (message) => {
          const receivedMessage = JSON.parse(message.body) as ChatMessage
          
          // Add to current open chat if it matches the selected user
          if (selectedUser && (receivedMessage.senderEmail === selectedUser.email || receivedMessage.recipientEmail === selectedUser.email)) {
             setMessages(prev => [...prev, receivedMessage])
          }
          
          // Refresh user list to bring new messages to top or add new users
          fetchUsers()
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
    if (!newMessage.trim() || !selectedUser || !stompClient.current || !stompClient.current.connected) return

    stompClient.current.publish({
      destination: '/app/chat',
      body: JSON.stringify({
        recipientEmail: selectedUser.email,
        content: newMessage
      })
    })

    setNewMessage('')
  }

  return (
    <AdminLayout>
      <div className="h-[calc(100vh-8rem)] flex bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
        
        {/* Users List Sidebar */}
        <div className="w-1/3 border-r border-slate-200 dark:border-slate-700 flex flex-col">
          <div className="p-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50">
            <h2 className="font-bold text-lg text-slate-800 dark:text-white flex items-center gap-2">
              <MessageSquare size={20} />
              Tin nhắn khách hàng
            </h2>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {users.length === 0 ? (
              <div className="text-center text-slate-500 mt-10">
                Chưa có cuộc trò chuyện nào
              </div>
            ) : (
              users.map(u => (
                <button
                  key={u.email}
                  onClick={() => setSelectedUser(u)}
                  className={`w-full text-left p-3 rounded-xl flex items-center gap-3 transition-colors ${
                    selectedUser?.email === u.email 
                      ? 'bg-indigo-50 dark:bg-indigo-900/40' 
                      : 'hover:bg-slate-50 dark:hover:bg-slate-700/50'
                  }`}
                >
                  <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center flex-shrink-0 text-slate-600 dark:text-slate-300">
                    <UserIcon size={20} />
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <p className={`font-semibold text-sm truncate ${selectedUser?.email === u.email ? 'text-indigo-700 dark:text-indigo-300' : 'text-slate-700 dark:text-slate-200'}`}>
                      {u.fullName || u.email}
                    </p>
                    <p className="text-xs text-slate-500 truncate">{u.email}</p>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className="w-2/3 flex flex-col bg-slate-50 dark:bg-slate-900/20">
          {selectedUser ? (
            <>
              {/* Chat Header */}
              <div className="p-4 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                  <UserIcon size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 dark:text-white">{selectedUser.fullName || selectedUser.email}</h3>
                  <p className="text-xs text-slate-500">{selectedUser.email}</p>
                </div>
              </div>

              {/* Messages Area */}
              <div className="flex-1 p-4 overflow-y-auto space-y-4">
                {messages.length === 0 ? (
                  <div className="h-full flex items-center justify-center text-slate-500">
                    <p>Bắt đầu trò chuyện với {selectedUser.fullName}</p>
                  </div>
                ) : (
                  messages.map((msg, idx) => {
                    const isMe = msg.senderEmail === user?.email
                    return (
                      <div key={msg.id || idx} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                        <div 
                          className={`max-w-[70%] p-3 rounded-2xl ${
                            isMe 
                              ? 'bg-indigo-600 text-white rounded-tr-sm' 
                              : 'bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-600 rounded-tl-sm shadow-sm'
                          }`}
                        >
                          <p className="text-sm">{msg.content}</p>
                        </div>
                        <span className="text-[10px] text-slate-400 mt-1 px-1">
                          {new Date(msg.timestamp).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    )
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="p-4 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700">
                <form onSubmit={sendMessage} className="flex gap-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Nhập tin nhắn hỗ trợ..."
                    className="flex-1 bg-slate-100 dark:bg-slate-700 border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 text-sm dark:text-white"
                  />
                  <button 
                    type="submit"
                    disabled={!newMessage.trim()}
                    className="px-4 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                  >
                    <Send size={20} />
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-500">
              <MessageSquare size={48} className="mb-4 opacity-20" />
              <p>Chọn một khách hàng để bắt đầu trò chuyện</p>
            </div>
          )}
        </div>
        
      </div>
    </AdminLayout>
  )
}
