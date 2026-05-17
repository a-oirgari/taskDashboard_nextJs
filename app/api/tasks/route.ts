import { NextResponse } from 'next/server'
import pool from '@/lib/db'
import { getSession } from '@/lib/auth'

// GET /api/tasks — Récupérer les tâches de l'utilisateur (exclut les soft-deleted)
export async function GET() {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const [rows] = await pool.execute(
    'SELECT * FROM tasks WHERE user_id = ? AND deleted_at IS NULL ORDER BY created_at DESC',
    [session.userId]
  ) as any[]

  return NextResponse.json({ data: rows })
}

// POST /api/tasks — Ajouter une tâche
export async function POST(req: Request) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { title, priority = 'medium' } = await req.json()

  if (!title || title.trim().length === 0) {
    return NextResponse.json({ error: 'Title is required' }, { status: 400 })
  }
  if (title.length > 255) {
    return NextResponse.json({ error: 'Title is too long' }, { status: 400 })
  }
  if (!['low', 'medium', 'high'].includes(priority)) {
    return NextResponse.json({ error: 'Invalid priority' }, { status: 400 })
  }

  const [result] = await pool.execute(
    'INSERT INTO tasks (title, priority, user_id) VALUES (?, ?, ?)',
    [title.trim(), priority, session.userId]
  ) as any[]

  const [newTask] = await pool.execute(
    'SELECT * FROM tasks WHERE id = ?',
    [(result as any).insertId]
  ) as any[]

  return NextResponse.json({ data: (newTask as any[])[0] }, { status: 201 })
}
