import { NextResponse } from 'next/server'
import pool from '@/lib/db'
import { getSession } from '@/lib/auth'

// PUT /api/tasks/:id — Modifier une tâche
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params  // Next.js 15 : params est une Promise
  const taskId = parseInt(id)
  if (isNaN(taskId)) return NextResponse.json({ error: 'Invalid ID' }, { status: 400 })

  // Verify ownership (exclude soft-deleted)
  const [ownerCheck] = await pool.execute(
    'SELECT id FROM tasks WHERE id = ? AND user_id = ? AND deleted_at IS NULL',
    [taskId, session.userId]
  ) as any[]

  if ((ownerCheck as any[]).length === 0) {
    return NextResponse.json({ error: 'Task not found' }, { status: 404 })
  }

  const body = await req.json()
  const { title, completed, priority } = body

  const updates: string[] = []
  const values: any[] = []

  if (title !== undefined) {
    if (!title.trim()) return NextResponse.json({ error: 'Title cannot be empty' }, { status: 400 })
    updates.push('title = ?')
    values.push(title.trim())
  }
  if (completed !== undefined) {
    updates.push('completed = ?')
    values.push(completed ? 1 : 0)
  }
  if (priority !== undefined) {
    if (!['low', 'medium', 'high'].includes(priority)) {
      return NextResponse.json({ error: 'Invalid priority' }, { status: 400 })
    }
    updates.push('priority = ?')
    values.push(priority)
  }

  if (updates.length === 0) {
    return NextResponse.json({ error: 'Nothing to update' }, { status: 400 })
  }

  values.push(taskId)
  await pool.execute(`UPDATE tasks SET ${updates.join(', ')} WHERE id = ?`, values)

  const [updated] = await pool.execute(
    'SELECT * FROM tasks WHERE id = ? AND deleted_at IS NULL',
    [taskId]
  ) as any[]
  return NextResponse.json({ data: (updated as any[])[0] })
}

// DELETE /api/tasks/:id — Soft delete
export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params  // Next.js 15 : params est une Promise
  const taskId = parseInt(id)
  if (isNaN(taskId)) return NextResponse.json({ error: 'Invalid ID' }, { status: 400 })

  // Soft delete : on met deleted_at à NOW() au lieu de supprimer la ligne
  const [result] = await pool.execute(
    'UPDATE tasks SET deleted_at = NOW() WHERE id = ? AND user_id = ? AND deleted_at IS NULL',
    [taskId, session.userId]
  ) as any[]

  if ((result as any).affectedRows === 0) {
    return NextResponse.json({ error: 'Task not found or already deleted' }, { status: 404 })
  }

  return NextResponse.json({ message: 'Task deleted', id: taskId })
}
