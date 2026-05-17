'use client'

import { useState } from 'react'
import { Task, TaskFilter } from '@/types'
import TaskCard from './TaskCard'
import TaskForm from './TaskForm'
import { X, AlertTriangle, TrendingUp, Minus, PartyPopper, Sparkles, ListTodo } from 'lucide-react'

interface TasksClientProps {
  initialTasks: Task[]
}

export default function TasksClient({ initialTasks }: TasksClientProps) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks)
  const [filter, setFilter] = useState<TaskFilter>('all')
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [editTitle, setEditTitle] = useState('')
  const [editPriority, setEditPriority] = useState<Task['priority']>('medium')
  const [editLoading, setEditLoading] = useState(false)

  
  function handleAdd(task: Task) {
    setTasks(prev => [task, ...prev])
  }

  
  async function handleToggle(id: number, currentCompleted: boolean) {
    const updated = !currentCompleted
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: updated } : t))

    const res = await fetch(`/api/tasks/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completed: updated }),
    })
    if (!res.ok) {
      
      setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: currentCompleted } : t))
    }
  }

  
  async function handleDelete(id: number) {
    // Sauvegarde pour rollback si l'API échoue
    const taskBackup = tasks.find(t => t.id === id)
    // Optimistic UI : retire immédiatement de l'écran
    setTasks(prev => prev.filter(t => t.id !== id))

    try {
      const res = await fetch(`/api/tasks/${id}`, { method: 'DELETE' })
      if (!res.ok) {
        // Rollback : remet la tâche si l'API a échoué
        if (taskBackup) setTasks(prev => [taskBackup, ...prev].sort((a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        ))
      }
    } catch {
      
      if (taskBackup) setTasks(prev => [taskBackup, ...prev].sort((a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      ))
    }
  }

  
  function handleEditOpen(task: Task) {
    setEditingTask(task)
    setEditTitle(task.title)
    setEditPriority(task.priority || 'medium')
  }

  
  async function handleEditSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!editingTask || !editTitle.trim()) return
    setEditLoading(true)

    const res = await fetch(`/api/tasks/${editingTask.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: editTitle.trim(), priority: editPriority }),
    })

    if (res.ok) {
      const json = await res.json()
      setTasks(prev => prev.map(t => t.id === editingTask.id ? json.data : t))
      setEditingTask(null)
    }
    setEditLoading(false)
  }

  
  const filtered = tasks.filter(t => {
    if (filter === 'active') return !t.completed
    if (filter === 'completed') return t.completed
    return true
  })

  const completed = tasks.filter(t => t.completed).length
  const completionRate = tasks.length > 0 ? Math.round((completed / tasks.length) * 100) : 0

  const filters: { value: TaskFilter; label: string }[] = [
    { value: 'all', label: `All (${tasks.length})` },
    { value: 'active', label: `Active (${tasks.length - completed})` },
    { value: 'completed', label: `Done (${completed})` },
  ]

  return (
    <div className="space-y-6">
      
      <div className="animate-slide-up stagger-1">
        <TaskForm onAdd={handleAdd} />
      </div>

      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-slide-up stagger-2">
        
        {tasks.length > 0 && (
          <div className="flex items-center gap-3">
            <div className="w-32 h-1.5 bg-ink-700 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ width: `${completionRate}%`, background: 'linear-gradient(90deg,#6C63FF,#A59DFF)' }}
              />
            </div>
            <span className="text-ink-400" style={{ fontSize: '12px', fontFamily: 'var(--font-dm-sans)' }}>
              {completionRate}% complete
            </span>
          </div>
        )}

        
        <div className="flex gap-2">
          {filters.map(f => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${filter === f.value
                  ? 'bg-accent text-white'
                  : 'text-ink-400 hover:text-white hover:bg-white/5 border border-white/10'
                }`}
              style={{ fontFamily: 'var(--font-dm-sans)' }}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      
      <div className="space-y-3 animate-slide-up stagger-3">
        {filtered.length === 0 ? (
          <div className="glass-card p-16 text-center">
            <div
              className="w-14 h-14 rounded-2xl mx-auto mb-5 flex items-center justify-center"
              style={{
                background: filter === 'completed' ? 'rgba(16,185,129,0.12)' : filter === 'active' ? 'rgba(245,158,11,0.12)' : 'rgba(108,99,255,0.12)',
                border: filter === 'completed' ? '1px solid rgba(16,185,129,0.2)' : filter === 'active' ? '1px solid rgba(245,158,11,0.2)' : '1px solid rgba(108,99,255,0.2)',
              }}
            >
              {filter === 'completed' && <PartyPopper size={26} style={{ color: '#10B981' }} strokeWidth={1.5} />}
              {filter === 'active' && <Sparkles size={26} style={{ color: '#F59E0B' }} strokeWidth={1.5} />}
              {filter === 'all' && <ListTodo size={26} style={{ color: '#6C63FF' }} strokeWidth={1.5} />}
            </div>
            <p className="text-ink-300" style={{ fontFamily: 'var(--font-dm-sans)', fontSize: '14.5px' }}>
              {filter === 'completed'
                ? 'No completed tasks yet. Keep going!'
                : filter === 'active'
                  ? 'All done! Nothing left to do.'
                  : 'No tasks yet. Add your first one above!'}
            </p>
          </div>
        ) : (
          filtered.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onToggle={handleToggle}
              onDelete={handleDelete}
              onEdit={handleEditOpen}
            />
          ))
        )}
      </div>

      
      {editingTask && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}
          onClick={e => { if (e.target === e.currentTarget) setEditingTask(null) }}
        >
          <div className="glass-card w-full max-w-md p-6 animate-slide-up">
            <div className="flex items-center justify-between mb-6">
              <h2 className="section-title">Edit Task</h2>
              <button
                onClick={() => setEditingTask(null)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-ink-400 hover:text-white hover:bg-white/10 transition-all"
              >
                <X size={15} />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-5">
              <div>
                <label className="label">Task title</label>
                <input
                  type="text"
                  className="input-field"
                  value={editTitle}
                  onChange={e => setEditTitle(e.target.value)}
                  autoFocus
                  maxLength={255}
                />
              </div>

              <div>
                <label className="label">Priority</label>
                <div className="flex gap-2">
                  {([
                    { value: 'low', Icon: Minus, activeClass: 'border-emerald-flow/50 text-emerald-flow bg-emerald-flow/10' },
                    { value: 'medium', Icon: TrendingUp, activeClass: 'border-amber-flow/50 text-amber-flow bg-amber-flow/10' },
                    { value: 'high', Icon: AlertTriangle, activeClass: 'border-rose-flow/50 text-rose-flow bg-rose-flow/10' },
                  ] as const).map(({ value: p, Icon, activeClass }) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setEditPriority(p)}
                      className={`flex-1 py-2.5 rounded-xl border text-sm font-medium transition-all duration-200 capitalize flex items-center justify-center gap-1.5 ${editPriority === p ? activeClass : 'border-white/10 text-ink-400 hover:border-white/20'
                        }`}
                      style={{ fontFamily: 'var(--font-dm-sans)' }}
                    >
                      <Icon size={12} />
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setEditingTask(null)} className="btn-ghost flex-1">
                  Cancel
                </button>
                <button type="submit" disabled={editLoading || !editTitle.trim()} className="btn-primary flex-1">
                  {editLoading ? 'Saving...' : 'Save changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
