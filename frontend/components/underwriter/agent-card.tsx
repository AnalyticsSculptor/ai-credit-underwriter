"use client"

import { type LucideIcon } from "lucide-react"

interface AgentCardProps {
  title: string
  icon: LucideIcon
  status: "success" | "warning" | "error" | "info"
  children: React.ReactNode
}

const statusColors = {
  success: {
    dot: "bg-success",
    border: "border-success/20",
    glow: "shadow-success/10",
  },
  warning: {
    dot: "bg-warning",
    border: "border-warning/20",
    glow: "shadow-warning/10",
  },
  error: {
    dot: "bg-destructive",
    border: "border-destructive/20",
    glow: "shadow-destructive/10",
  },
  info: {
    dot: "bg-primary",
    border: "border-primary/20",
    glow: "shadow-primary/10",
  },
}

export function AgentCard({ title, icon: Icon, status, children }: AgentCardProps) {
  const colors = statusColors[status]

  return (
    <div
      className={`relative overflow-hidden rounded-xl border ${colors.border} bg-card/30 backdrop-blur-xl p-5 hover:bg-card/50 transition-all duration-300 shadow-lg ${colors.glow}`}
    >
      {/* Glass effect overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-secondary/50 flex items-center justify-center border border-border/50">
              <Icon className="w-4.5 h-4.5 text-primary" />
            </div>
            <h3 className="font-semibold text-foreground">{title}</h3>
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${colors.dot} animate-pulse`} />
            <span className="text-xs text-muted-foreground capitalize">{status}</span>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-3">{children}</div>
      </div>
    </div>
  )
}
