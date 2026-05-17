import Link from "next/link"
import { LayoutDashboard, CheckSquare, Zap } from "lucide-react"

interface SidebarProps {
  active: "dashboard" | "tasks"
}

const navItems = [
  { id: "dashboard", label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { id: "tasks", label: "My Tasks", href: "/tasks", icon: CheckSquare },
]

export default function Sidebar({ active }: SidebarProps) {
  return (
    <aside
      className="hidden lg:flex flex-col fixed left-0 top-0 h-full w-64 z-40"
      style={{
        background: "rgba(10,10,15,0.95)",
        borderRight: "1px solid rgba(255,255,255,0.05)",
        backdropFilter: "blur(20px)",
      }}
    >
      <div className="flex items-center gap-3 px-6 py-7 border-b border-white/5">
        <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center shadow-glow-accent flex-shrink-0">
          <Zap size={16} color="white" fill="white" />
        </div>
        <span style={{ fontFamily: "var(--font-syne)", fontWeight: 700, fontSize: "1.1rem", color: "#fff", letterSpacing: "-0.02em" }}>
          TaskFlow
        </span>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-1">
        <p className="text-ink-500 px-3 mb-3" style={{ fontSize: "10px", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", fontFamily: "var(--font-dm-sans)" }}>
          Navigation
        </p>
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = active === item.id
          return (
            <Link
              key={item.id}
              href={item.href}
              className={
                isActive
                  ? "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group bg-accent/15 text-accent border border-accent/20"
                  : "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group text-ink-300 hover:text-white hover:bg-white/5"
              }
            >
              <Icon
                size={17}
                className={
                  isActive
                    ? "transition-colors duration-200 flex-shrink-0 text-accent"
                    : "transition-colors duration-200 flex-shrink-0 text-ink-400 group-hover:text-white"
                }
              />
              <span style={{ fontFamily: "var(--font-dm-sans)", fontWeight: 500, fontSize: "14.5px" }}>
                {item.label}
              </span>
              {isActive && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-accent" />}
            </Link>
          )
        })}
      </nav>

      <div className="px-4 py-6 border-t border-white/5">
        <p className="px-3 text-ink-500" style={{ fontSize: "11px", fontFamily: "var(--font-dm-sans)" }}>
          v1.0.0 · TaskFlow Dashboard
        </p>
      </div>
    </aside>
  )
}
