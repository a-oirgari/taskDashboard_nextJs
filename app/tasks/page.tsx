import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import pool from '@/lib/db'
import { Task } from '@/types'
import Sidebar from '@/components/Sidebar'
import Navbar from '@/components/Navbar'
import TasksClient from '@/components/TasksClient'

async function getTasks(userId: number): Promise<Task[]> {
  const [rows] = await pool.execute(
    'SELECT * FROM tasks WHERE user_id = ? AND deleted_at IS NULL ORDER BY created_at DESC',
    [userId]
  ) as any[]
  return rows as Task[]
}

async function getUserName(userId: number): Promise<string> {
  const [rows] = await pool.execute('SELECT name FROM users WHERE id = ?', [userId]) as any[]
  return (rows as any[])[0]?.name || 'User'
}

export default async function TasksPage() {
  const session = await getSession()
  if (!session) redirect('/login')

  const [tasks, userName] = await Promise.all([
    getTasks(session.userId),
    getUserName(session.userId),
  ])

  return (
    <div className="min-h-screen flex">
      <Sidebar active="tasks" />
      <div className="flex-1 flex flex-col min-h-screen ml-0 lg:ml-64">
        <Navbar userName={userName} />
        <main className="flex-1 p-6 lg:p-8">
          <div className="animate-slide-up mb-8">
            <h1 className="page-title">My Tasks</h1>
            <p className="text-ink-400 mt-1" style={{fontSize:'14.5px'}}>
              Manage and track all your tasks in one place.
            </p>
          </div>
          {/* Client component handles all interactivity */}
          <TasksClient initialTasks={tasks} />
        </main>
      </div>
    </div>
  )
}
