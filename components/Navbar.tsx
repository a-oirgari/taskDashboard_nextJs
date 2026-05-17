import { LogOut } from 'lucide-react'
import LogoutButton from './LogoutButton'

interface NavbarProps {
  userName: string
}

export default function Navbar({ userName }: NavbarProps) {
  const initials = userName.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between px-6 lg:px-8 py-4"
      style={{background:'rgba(10,10,15,0.8)',borderBottom:'1px solid rgba(255,255,255,0.05)',backdropFilter:'blur(20px)'}}>

      {/* Mobile logo */}
      <div className="flex items-center gap-2.5 lg:hidden">
        <div className="w-7 h-7 rounded-lg bg-accent flex items-center justify-center">
          <svg width="14" height="14" viewBox="0 0 20 20" fill="white"><path d="M3 10l5 5L17 4" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/></svg>
        </div>
        <span style={{fontFamily:'var(--font-syne)',fontWeight:700,fontSize:'1rem',color:'#fff'}}>TaskFlow</span>
      </div>

      <div className="hidden lg:block" />

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent to-accent-light flex items-center justify-center flex-shrink-0">
            <span style={{fontFamily:'var(--font-syne)',fontWeight:700,fontSize:'12px',color:'#fff'}}>{initials}</span>
          </div>
          <span className="hidden sm:block text-ink-200" style={{fontFamily:'var(--font-dm-sans)',fontSize:'14px',fontWeight:500}}>
            {userName}
          </span>
        </div>
        <div className="w-px h-5 bg-white/10" />
        <LogoutButton />
      </div>
    </header>
  )
}
