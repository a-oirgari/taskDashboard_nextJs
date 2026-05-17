export interface User {
  id: number
  name: string
  email: string
  created_at: string
}

export interface Task {
  id: number
  title: string
  description?: string
  completed: boolean
  priority: 'low' | 'medium' | 'high'
  user_id: number
  created_at: string
}

export type TaskFilter = 'all' | 'active' | 'completed'
export type Priority = 'low' | 'medium' | 'high'

export interface ApiResponse<T> {
  data?: T
  error?: string
  message?: string
}

export interface Stats {
  total: number
  completed: number
  active: number
  completionRate: number
}
