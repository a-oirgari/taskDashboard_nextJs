'use client'

import { useRouter } from 'next/navigation'
import { LogOut } from 'lucide-react'

export default function LogoutButton() {
  const router = useRouter()

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/login')
    router.refresh()
  }

  return (
    <button onClick={handleLogout} className="btn-ghost text-sm py-2 px-4">
      <span className="flex items-center gap-2">
        <LogOut size={14} />
        Sign out
      </span>
    </button>
  )
}
