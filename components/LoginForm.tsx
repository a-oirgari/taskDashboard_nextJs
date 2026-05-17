'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, Loader2, AlertTriangle, LogIn } from 'lucide-react'

export default function LoginForm() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPwd, setShowPwd] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const json = await res.json()
      if (!res.ok) { setError(json.error || 'Login failed'); return }
      router.push('/dashboard')
      router.refresh()
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="label">Email address</label>
        <input type="email" className="input-field" placeholder="you@example.com"
          value={email} onChange={e => setEmail(e.target.value)} required autoComplete="email" />
      </div>

      <div>
        <label className="label">Password</label>
        <div className="relative">
          <input type={showPwd ? 'text' : 'password'} className="input-field pr-12"
            placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)}
            required autoComplete="current-password" />
          <button type="button" onClick={() => setShowPwd(v => !v)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-ink-400 hover:text-ink-200 transition-colors">
            {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-rose-flow/10 border border-rose-flow/20">
          <AlertTriangle size={14} className="text-rose-flow flex-shrink-0" />
          <p className="text-rose-flow text-sm" style={{fontFamily:'var(--font-dm-sans)'}}>{error}</p>
        </div>
      )}

      <button type="submit" disabled={loading} className="btn-primary w-full text-center py-3.5 mt-2">
        {loading
          ? <span className="flex items-center justify-center gap-2"><Loader2 size={14} className="animate-spin" />Signing in...</span>
          : <span className="flex items-center justify-center gap-2"><LogIn size={14} />Sign in</span>
        }
      </button>
    </form>
  )
}
