import { LucideIcon, ClipboardList, CheckCircle2, Timer, TrendingUp } from 'lucide-react'

type ColorKey = 'accent' | 'emerald' | 'amber' | 'rose'

interface StatsCardProps {
  label: string
  value: number | string
  icon: ColorKey
  color: ColorKey
}

const colorMap = {
  accent:  { text: '#6C63FF', bg: 'rgba(108,99,255,0.12)', border: 'rgba(108,99,255,0.2)' },
  emerald: { text: '#10B981', bg: 'rgba(16,185,129,0.12)',  border: 'rgba(16,185,129,0.2)' },
  amber:   { text: '#F59E0B', bg: 'rgba(245,158,11,0.12)',  border: 'rgba(245,158,11,0.2)' },
  rose:    { text: '#F43F5E', bg: 'rgba(244,63,94,0.12)',   border: 'rgba(244,63,94,0.2)' },
}

const iconMap: Record<ColorKey, LucideIcon> = {
  accent:  ClipboardList,
  emerald: CheckCircle2,
  amber:   Timer,
  rose:    TrendingUp,
}

export default function StatsCard({ label, value, icon, color }: StatsCardProps) {
  const c = colorMap[color]
  const Icon = iconMap[icon]

  return (
    <div className="glass-card p-5 flex flex-col gap-4 glass-card-hover">
      <div className="flex items-center justify-between">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center"
          style={{ background: c.bg, border: `1px solid ${c.border}` }}
        >
          <Icon size={18} style={{ color: c.text }} strokeWidth={1.75} />
        </div>
        <div
          className="w-1.5 h-1.5 rounded-full"
          style={{ background: c.text, boxShadow: `0 0 8px ${c.text}` }}
        />
      </div>
      <div>
        <p
          className="text-ink-400 mb-1"
          style={{ fontFamily: 'var(--font-dm-sans)', fontSize: '12px', fontWeight: 500, letterSpacing: '0.05em', textTransform: 'uppercase' }}
        >
          {label}
        </p>
        <p style={{ fontFamily: 'var(--font-syne)', fontWeight: 700, fontSize: '2rem', color: c.text, lineHeight: 1 }}>
          {value}
        </p>
      </div>
    </div>
  )
}