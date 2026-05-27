import type { ReactNode } from 'react'
import { Header } from './Header'
import { Footer } from './Footer'
import { LiveChat } from '../features/user/LiveChat'
import { AiChatWidget } from '../features/user/AiChatWidget'

interface UserLayoutProps {
  children: ReactNode
}

export const UserLayout = ({ children }: UserLayoutProps) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 w-full bg-[var(--color-bg)]">
        {children}
      </main>
      <Footer />
      <LiveChat />
      <AiChatWidget />
    </div>
  )
}
