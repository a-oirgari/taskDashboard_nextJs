'use client'

import { useState } from 'react'
import { Task, Priority } from '@/types'
import { Plus, Loader2, AlertTriangle, TrendingUp, Minus } from 'lucide-react'

interface TaskFormProps {
  onAdd: (task: Task) => void
}

const priorities: { value: Priority; label: string; activeClass: string; hoverClass: string }[] = [
  { value: 'low',    label: 'Low',    activeClass: 'border-emerald-flow/60 text-emerald-flow bg-emerald-flow/10', hoverClass: 'hover:border-emerald-flow/40 hover:text-emerald-flow' },
  { value: 'medium', label: 'Med',    activeClass: 'border-amber-flow/60 text-amber-flow bg-amber-flow/10',       hoverClass: 'hover:border-amber-flow/40 hover:text-amber-flow' },
  { value: 'high',   label: 'High',   activeClass: 'border-rose-flow/60 text-rose-flow bg-rose-flow/10',          hoverClass: 'hover:border-rose-flow/40 hover:text-rose-flow' },
]

const PriorityIcons = { low: Minus, medium: TrendingUp, high: AlertTriangle }

export default function TaskForm({ onAdd }: TaskFormProps) {
  const [title, setTitle] = useState('')
  const [priority, setPriority] = useState<Priority>('medium')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim()) return
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: title.trim(), priority }),
      })
      const json = await res.json()
      if (!res.ok) { setError(json.error || 'Failed to add task'); return }
      onAdd(json.data)
      setTitle('')
      setPriority('medium')
    } catch {
      setError('Network error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="glass-card p-5">
      <div className="flex items-center gap-3">
        <div className="flex-1">
          <input
            type="text"
            className="input-field"
            placeholder="Add a new task..."
            value={title}
            onChange={e => setTitle(e.target.value)}
            maxLength={255}
            disabled={loading}
            autoFocus
          />
        </div>

        {/* Priority selector */}
        <div className="flex gap-1.5">
          {priorities.map(p => {
            const Icon = PriorityIcons[p.value]
            return (
              <button key={p.value} type="button" onClick={() => setPriority(p.value)}
                className={`px-3 py-2.5 rounded-lg border text-xs font-medium transition-all duration-200 flex items-center gap-1.5 ${
                  priority === p.value
                    ? p.activeClass
                    : 'border-white/10 text-ink-400 ' + p.hoverClass
                }`}
                style={{fontFamily:'var(--font-dm-sans)'}}>
                <Icon size={11} />
                {p.label}
              </button>
            )
          })}
        </div>

        <button type="submit" disabled={loading || !title.trim()} className="btn-primary flex-shrink-0">
          {loading ? (
            <span className="flex items-center gap-2"><Loader2 size={14} className="animate-spin" />Adding...</span>
          ) : (
            <span className="flex items-center gap-2"><Plus size={14} />Add task</span>
          )}
        </button>
      </div>

      {error && (
        <p className="mt-3 text-rose-flow text-sm flex items-center gap-1.5" style={{fontFamily:'var(--font-dm-sans)'}}>
          <AlertTriangle size={13} /> {error}
        </p>
      )}
    </form>
  )
}
