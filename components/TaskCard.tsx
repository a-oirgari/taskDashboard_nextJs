'use client'

import { Task } from '@/types'
import { useState } from 'react'
import { Pencil, Trash2, Check, AlertCircle, ArrowUp, Minus } from 'lucide-react'

interface TaskCardProps {
  task: Task
  onToggle: (id: number, completed: boolean) => void
  onDelete: (id: number) => void
  onEdit: (task: Task) => void
}

const priorityConfig = {
  high:   { label: 'High',   icon: AlertCircle, className: 'tag-high' },
  medium: { label: 'Medium', icon: ArrowUp,     className: 'tag-medium' },
  low:    { label: 'Low',    icon: Minus,        className: 'tag-low' },
}

export default function TaskCard({ task, onToggle, onDelete, onEdit }: TaskCardProps) {
  const [isDeleting, setIsDeleting] = useState(false)

  async function handleDelete() {
    setIsDeleting(true)
    onDelete(task.id)
  }

  const date = new Date(task.created_at).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })
  const p = priorityConfig[task.priority || 'medium']
  const PriorityIcon = p.icon

  return (
    <div className={`glass-card glass-card-hover p-4 flex items-start gap-4 group transition-all duration-300 ${isDeleting ? 'opacity-50 scale-95' : ''}`}>

      
      <button
        onClick={() => onToggle(task.id, task.completed)}
        className={`mt-0.5 w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all duration-300 ${
          task.completed
            ? 'bg-emerald-flow border-emerald-flow shadow-glow-emerald'
            : 'border-ink-500 hover:border-accent'
        }`}
        aria-label={task.completed ? 'Mark as incomplete' : 'Mark as complete'}
      >
        {task.completed && <Check size={10} color="white" strokeWidth={3} />}
      </button>

      
      <div className="flex-1 min-w-0">
        <p className={`transition-all duration-200 ${task.completed ? 'line-through text-ink-400' : 'text-ink-100'}`}
          style={{fontFamily:'var(--font-dm-sans)',fontSize:'14.5px',lineHeight:'1.5'}}>
          {task.title}
        </p>
        <div className="flex items-center gap-3 mt-2">
          <span className={`tag ${p.className} flex items-center gap-1`}>
            <PriorityIcon size={10} />
            {p.label}
          </span>
          <span className="text-ink-500" style={{fontSize:'11px',fontFamily:'var(--font-dm-sans)'}}>{date}</span>
        </div>
      </div>

      
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <button
          onClick={() => onEdit(task)}
          className="w-8 h-8 rounded-lg flex items-center justify-center text-ink-400 hover:text-white hover:bg-white/10 transition-all duration-200"
          aria-label="Edit task"
          title="Edit"
        >
          <Pencil size={13} />
        </button>
        <button
          onClick={handleDelete}
          className="w-8 h-8 rounded-lg flex items-center justify-center text-ink-400 hover:text-rose-flow hover:bg-rose-flow/10 transition-all duration-200"
          aria-label="Delete task"
          title="Delete"
        >
          <Trash2 size={13} />
        </button>
      </div>
    </div>
  )
}
