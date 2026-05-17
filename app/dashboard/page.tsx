import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import pool from '@/lib/db'
import { ListTodo } from 'lucide-react'
import { Task, Stats } from '@/types'
import Sidebar from '@/components/Sidebar'
import Navbar from '@/components/Navbar'
import StatsCard from '@/components/StatsCard'
import Link from 'next/link'

async function getStats(userId: number): Promise<Stats> {
  const [rows] = await pool.execute(
    'SELECT COUNT(*) as total, SUM(completed) as completed FROM tasks WHERE user_id = ? AND deleted_at IS NULL',
    [userId]
  ) as any[]
  const { total, completed } = rows[0]
  const active = total - (completed || 0)
  const completionRate = total > 0 ? Math.round(((completed || 0) / total) * 100) : 0
  return { total: Number(total), completed: Number(completed || 0), active: Number(active), completionRate }
}

async function getRecentTasks(userId: number): Promise<Task[]> {
  const [rows] = await pool.execute(
    'SELECT * FROM tasks WHERE user_id = ? AND deleted_at IS NULL ORDER BY created_at DESC LIMIT 5',
    [userId]
  ) as any[]
  return rows as Task[]
}

async function getUserName(userId: number): Promise<string> {
  const [rows] = await pool.execute('SELECT name FROM users WHERE id = ?', [userId]) as any[]
  return (rows as any[])[0]?.name || 'User'
}

export default async function DashboardPage() {
  const session = await getSession()
  if (!session) redirect('/login')

  const [stats, recentTasks, userName] = await Promise.all([
    getStats(session.userId),
    getRecentTasks(session.userId),
    getUserName(session.userId),
  ])

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening'

  return (
    <div className="min-h-screen flex">
      <Sidebar active="dashboard" />
      <div className="flex-1 flex flex-col min-h-screen ml-0 lg:ml-64">
        <Navbar userName={userName} />
        <main className="flex-1 p-6 lg:p-8 space-y-8">

          
          <div className="animate-slide-up">
            <p className="text-ink-400 text-sm font-medium mb-1" style={{ fontFamily: 'var(--font-dm-sans)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
              {greeting}
            </p>
            <h1 className="page-title">
              {userName.split(' ')[0]}<span className="text-accent"> ↗</span>
            </h1>
          </div>

          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="animate-slide-up stagger-1">
              <StatsCard label="Total Tasks" value={stats.total} icon="accent" color="accent" />
            </div>
            <div className="animate-slide-up stagger-2">
              <StatsCard label="Completed" value={stats.completed} icon="emerald" color="emerald" />
            </div>
            <div className="animate-slide-up stagger-3">
              <StatsCard label="In Progress" value={stats.active} icon="amber" color="amber" />
            </div>
            <div className="animate-slide-up stagger-4">
              <StatsCard label="Completion" value={`${stats.completionRate}%`} icon="rose" color="rose" />
            </div>
          </div>

          
          <div className="glass-card p-6 animate-slide-up stagger-2">
            <div className="flex items-center justify-between mb-4">
              <span className="section-title">Overall Progress</span>
              <span className="text-accent font-display font-bold text-lg" style={{ fontFamily: 'var(--font-syne)' }}>
                {stats.completionRate}%
              </span>
            </div>
            <div className="h-2.5 bg-ink-700 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-1000"
                style={{
                  width: `${stats.completionRate}%`,
                  background: 'linear-gradient(90deg, #6C63FF, #A59DFF)',
                  boxShadow: '0 0 10px rgba(108,99,255,0.5)',
                }}
              />
            </div>
            <div className="flex justify-between mt-3 text-xs text-ink-400" style={{ fontFamily: 'var(--font-dm-sans)' }}>
              <span>{stats.completed} completed</span>
              <span>{stats.active} remaining</span>
            </div>
          </div>

          
          <div className="animate-slide-up stagger-3">
            <div className="flex items-center justify-between mb-5">
              <h2 className="section-title">Recent Tasks</h2>
              <Link href="/tasks" className="text-accent text-sm hover:text-accent-light transition-colors font-medium">
                View all →
              </Link>
            </div>


            {recentTasks.length === 0 ? (
              <div className="glass-card p-12 text-center">
                <div className="w-14 h-14 rounded-2xl mx-auto mb-5 flex items-center justify-center"
                  style={{ background: 'rgba(108,99,255,0.12)', border: '1px solid rgba(108,99,255,0.2)' }}>
                  <ListTodo size={26} style={{ color: '#6C63FF' }} strokeWidth={1.5} />
                </div>
                <p className="text-ink-300 mb-5" style={{ fontFamily: 'var(--font-dm-sans)', fontSize: '14.5px' }}>
                  No tasks yet. Ready to get started?
                </p>
                <Link href="/tasks" className="btn-primary inline-block">
                  Create your first task
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {recentTasks.map((task, i) => (
                  <div key={task.id} className="glass-card glass-card-hover p-4 flex items-center gap-4"
                    style={{ animationDelay: `${i * 0.05}s` }}>
                    <div className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all duration-200 ${task.completed
                      ? 'bg-emerald-flow border-emerald-flow'
                      : 'border-ink-500'
                      }`}>
                      {task.completed && (
                        <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                          <path d="M2 5L4 7L8 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </div>
                    <span className={`flex-1 text-sm ${task.completed ? 'line-through text-ink-400' : 'text-ink-100'}`}
                      style={{ fontFamily: 'var(--font-dm-sans)' }}>
                      {task.title}
                    </span>
                    <span className={`tag ${(task.priority || 'medium') === 'high' ? 'tag-high' :
                      (task.priority || 'medium') === 'medium' ? 'tag-medium' : 'tag-low'
                      }`}>
                      {task.priority || 'medium'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

        </main>
      </div>
    </div>
  )
}
