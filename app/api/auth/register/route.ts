import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import pool from '@/lib/db'
import { signToken } from '@/lib/auth'

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json()

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 })
    }
    if (password.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 })
    }

    
    const [existing] = await pool.execute('SELECT id FROM users WHERE email = ?', [email]) as any[]
    if ((existing as any[]).length > 0) {
      return NextResponse.json({ error: 'Email already in use' }, { status: 409 })
    }

    const hashedPassword = await bcrypt.hash(password, 12)
    const [result] = await pool.execute(
      'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
      [name, email, hashedPassword]
    ) as any[]

    const userId = (result as any).insertId
    const token = await signToken({ userId, email })

    const response = NextResponse.json({ message: 'Account created successfully' }, { status: 201 })
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, 
      path: '/',
    })
    return response
  } catch (error) {
    console.error('Register error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
