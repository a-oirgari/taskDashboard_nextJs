import RegisterForm from '@/components/RegisterForm'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'

export default async function RegisterPage() {
  const session = await getSession()
  if (session) redirect('/dashboard')

  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md animate-slide-up">
        <div className="text-center mb-10">
          <Link href="/" className="inline-flex items-center gap-2.5 mb-8 group">
            <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center group-hover:shadow-glow-accent transition-all duration-300">
              <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                <path d="M4 10L8 14L16 6" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span style={{fontFamily:'var(--font-syne)',fontWeight:700,fontSize:'1.1rem'}} className="text-white">
              TaskFlow
            </span>
          </Link>
          <h1 className="page-title text-3xl mb-2">Create your account</h1>
          <p className="text-ink-400" style={{fontSize:'14.5px'}}>Start organizing your work today</p>
        </div>

        <div className="glass-card p-8">
          <RegisterForm />
        </div>

        <p className="text-center text-ink-400 mt-6" style={{fontSize:'14px'}}>
          Already have an account?{' '}
          <Link href="/login" className="text-accent hover:text-accent-light transition-colors font-medium">
            Sign in
          </Link>
        </p>
      </div>
    </main>
  )
}
