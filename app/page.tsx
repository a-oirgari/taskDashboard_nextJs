import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import Link from 'next/link'
import { Zap, ArrowRight } from 'lucide-react'

export default async function Home() {
  const session = await getSession()
  if (session) redirect('/dashboard')

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4">
      <div className="text-center max-w-2xl mx-auto animate-slide-up">
        <div className="flex items-center justify-center gap-3 mb-12">
          <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center shadow-glow-accent">
            <Zap size={20} color="white" fill="white" />
          </div>
          <span className="font-display text-xl font-700 tracking-tight text-white" style={{fontFamily:'var(--font-syne)',fontWeight:700}}>
            TaskFlow
          </span>
        </div>

        <h1 className="page-title text-5xl mb-6 leading-tight">
          Organize your work.<br />
          <span className="text-accent">Flow through</span> your day.
        </h1>
        <p className="text-ink-300 text-lg mb-12 max-w-lg mx-auto" style={{fontFamily:'var(--font-dm-sans)',fontWeight:300}}>
          A focused workspace for getting things done. Track tasks, measure progress, stay in the zone.
        </p>

        <div className="flex items-center justify-center gap-4">
          <Link href="/register" className="btn-primary text-base px-8 py-3.5 flex items-center gap-2">
            Get started — it&apos;s free <ArrowRight size={16} />
          </Link>
          <Link href="/login" className="btn-ghost text-base">
            Sign in
          </Link>
        </div>
      </div>

      <div className="fixed inset-0 bg-grid-pattern pointer-events-none opacity-50" />
    </main>
  )
}
