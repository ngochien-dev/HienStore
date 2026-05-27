import { useState, useRef, useEffect } from 'react'
import { X, Send, Bot, Sparkles, Loader2 } from 'lucide-react'
import api from '../../../api/axiosClient'

interface AiMessage {
  role: 'user' | 'model'
  content: string
}

export const AiChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<AiMessage[]>([
    { role: 'model', content: 'Xin chào! Tôi là Trợ lý AI của HienStore. Tôi có thể giúp bạn tìm kiếm trang phục nào hôm nay?' }
  ])
  const [newMessage, setNewMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || isTyping) return

    const userMsg = newMessage.trim()
    const newChatHistory: AiMessage[] = [...messages, { role: 'user', content: userMsg }]
    
    setMessages(newChatHistory)
    setNewMessage('')
    setIsTyping(true)

    try {
      const response = await api.post('/api/chat/ai', { messages: newChatHistory })
      
      setMessages(prev => [
        ...prev, 
        { role: 'model', content: response.data }
      ])
    } catch (error) {
      console.error("AI Error:", error)
      setMessages(prev => [
        ...prev, 
        { role: 'model', content: 'Xin lỗi, hiện tại tôi đang bận. Vui lòng thử lại sau một lát nhé!' }
      ])
    } finally {
      setIsTyping(false)
    }
  }

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-24 right-6 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white p-4 rounded-full shadow-lg hover:shadow-violet-500/30 hover:-translate-y-1 transition-all duration-300 z-40 group flex items-center gap-2"
          title="Chat với Trợ lý AI"
        >
          <Sparkles className="animate-pulse" size={24} />
          <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs transition-all duration-300 ease-in-out font-medium text-sm">
            Trợ lý AI
          </span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-80 md:w-96 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-violet-100 dark:border-slate-800 z-50 flex flex-col overflow-hidden animate-fade-in origin-bottom-right">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white p-4 flex justify-between items-center shadow-md">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30">
                <Bot size={20} className="text-white" />
              </div>
              <div>
                <h3 className="font-bold text-sm">Gemini AI Assistant</h3>
                <p className="text-[10px] text-violet-100 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
                  Luôn sẵn sàng tư vấn
                </p>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-violet-100 hover:text-white hover:bg-white/10 p-1.5 rounded-lg transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-4 h-[400px] overflow-y-auto bg-slate-50/50 dark:bg-slate-900/50 space-y-4">
            {messages.map((msg, index) => {
              const isUser = msg.role === 'user'
              return (
                <div key={index} className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
                  <div 
                    className={`max-w-[85%] p-3 rounded-2xl ${
                      isUser 
                        ? 'bg-violet-600 text-white rounded-tr-sm' 
                        : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-100 dark:border-slate-700 rounded-tl-sm shadow-sm'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                  </div>
                </div>
              )
            })}
            
            {isTyping && (
              <div className="flex flex-col items-start animate-pulse">
                <div className="max-w-[85%] p-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-tl-sm flex gap-1 items-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-bounce" style={{ animationDelay: '0ms' }}></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-bounce" style={{ animationDelay: '150ms' }}></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-bounce" style={{ animationDelay: '300ms' }}></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-3 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
            <form onSubmit={sendMessage} className="flex gap-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Hỏi AI về sản phẩm..."
                className="flex-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-violet-500 focus:border-violet-500 text-sm dark:text-white transition-all shadow-inner"
              />
              <button 
                type="submit"
                disabled={!newMessage.trim() || isTyping}
                className="p-2.5 bg-violet-600 text-white rounded-xl hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center shadow-md hover:shadow-lg active:scale-95"
              >
                {isTyping ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
              </button>
            </form>
            <div className="text-center mt-2">
              <span className="text-[9px] text-slate-400 flex items-center justify-center gap-1">
                Powered by <Sparkles size={8} /> Gemini 2.5 Flash
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
