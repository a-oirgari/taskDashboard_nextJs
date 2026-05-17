import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'TaskFlow — Dashboard',
  description: 'Professional task management dashboard',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className="antialiased">
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="relative z-10">{children}</div>
      </body>
    </html>
  )
}
