import { ReactNode } from 'react'
import { Header } from './Header'
import { Footer } from './Footer'

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
    </div>
  )
}
