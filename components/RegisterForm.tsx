'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, AlertTriangle, UserPlus } from 'lucide-react'

export default function RegisterForm() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    if (password.length < 6) { setError('Password must be at least 6 characters.'); setLoading(false); return }
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      })
      const json = await res.json()
      if (!res.ok) { setError(json.error || 'Registration failed'); return }
      router.push('/dashboard')
      router.refresh()
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const strength = password.length === 0 ? 0 : password.length < 6 ? 1 : password.length < 10 ? 2 : 3
  const strengthColors = ['', '#F43F5E', '#F59E0B', '#10B981']
  const strengthLabels = ['', 'Weak', 'Good', 'Strong']

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="label">Full name</label>
        <input type="text" className="input-field" placeholder="Jane Smith"
          value={name} onChange={e => setName(e.target.value)} required autoComplete="name" />
      </div>
      <div>
        <label className="label">Email address</label>
        <input type="email" className="input-field" placeholder="you@example.com"
          value={email} onChange={e => setEmail(e.target.value)} required autoComplete="email" />
      </div>
      <div>
        <label className="label">Password</label>
        <input type="password" className="input-field" placeholder="At least 6 characters"
          value={password} onChange={e => setPassword(e.target.value)} required autoComplete="new-password" />
        {password.length > 0 && (
          <div className="flex items-center gap-3 mt-2.5">
            <div className="flex gap-1 flex-1">
              {[1,2,3].map(i => (
                <div key={i} className="h-1 flex-1 rounded-full transition-all duration-300"
                  style={{background: i <= strength ? strengthColors[strength] : '#2A2A40'}} />
              ))}
            </div>
            <span style={{fontSize:'11px',color:strengthColors[strength],fontFamily:'var(--font-dm-sans)',fontWeight:500}}>
              {strengthLabels[strength]}
            </span>
          </div>
        )}
      </div>

      {error && (
        <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-rose-flow/10 border border-rose-flow/20">
          <AlertTriangle size={14} className="text-rose-flow flex-shrink-0" />
          <p className="text-rose-flow text-sm" style={{fontFamily:'var(--font-dm-sans)'}}>{error}</p>
        </div>
      )}

      <button type="submit" disabled={loading} className="btn-primary w-full text-center py-3.5 mt-2">
        {loading
          ? <span className="flex items-center justify-center gap-2"><Loader2 size={14} className="animate-spin" />Creating account...</span>
          : <span className="flex items-center justify-center gap-2"><UserPlus size={14} />Create account</span>
        }
      </button>
    </form>
  )
}
