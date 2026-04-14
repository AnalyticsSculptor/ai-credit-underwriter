"use client"

import { CheckCircle2, XCircle, AlertTriangle, TrendingUp, Shield, Clock, Info } from "lucide-react"

type VerdictType = "approved" | "declined" | "escalated"

interface VerdictCardProps {
  verdict: VerdictType
  confidence: number
  applicantName: string
  applicationId: string
  reasoning?: string // Added reasoning prop
}

const verdictConfig = {
  approved: {
    icon: CheckCircle2,
    label: "Approved",
    color: "emerald-500", // Using explicit Tailwind colors for reliability
    glowColor: "rgba(16, 185, 129, 0.4)",
    bgGradient: "from-emerald-500/20 to-emerald-500/5",
    borderColor: "border-emerald-500/50",
    description: "Application meets all underwriting criteria.",
  },
  declined: {
    icon: XCircle,
    label: "Declined",
    color: "rose-500",
    glowColor: "rgba(244, 63, 94, 0.4)",
    bgGradient: "from-rose-500/20 to-rose-500/5",
    borderColor: "border-rose-500/50",
    description: "Application does not meet minimum requirements.",
  },
  escalated: {
    icon: AlertTriangle,
    label: "Escalated",
    color: "amber-500",
    glowColor: "rgba(245, 158, 11, 0.4)",
    bgGradient: "from-amber-500/20 to-amber-500/5",
    borderColor: "border-amber-500/50",
    description: "Requires manual review by a senior underwriter.",
  },
}

export function VerdictCard({ verdict, confidence, applicantName, applicationId, reasoning }: VerdictCardProps) {
  const config = verdictConfig[verdict]
  const Icon = config.icon

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border ${config.borderColor} bg-gradient-to-br ${config.bgGradient} p-6 backdrop-blur-xl transition-all duration-500`}
      style={{
        boxShadow: `0 0 60px -15px ${config.glowColor}, 0 0 30px -10px ${config.glowColor}`,
      }}
    >
      {/* Animated glow ring */}
      <div
        className="absolute inset-0 opacity-50"
        style={{
          background: `radial-gradient(circle at 50% 0%, ${config.glowColor}, transparent 70%)`,
        }}
      />

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] mb-2">Final Verdict</p>
            <div className="flex items-center gap-3">
              <Icon className={`w-10 h-10 text-${config.color}`} />
              <h2 className={`text-5xl font-black tracking-tight text-${config.color}`}>{config.label}</h2>
            </div>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Confidence</p>
            <p className="text-3xl font-black text-foreground">{confidence}%</p>
          </div>
        </div>

        {/* AI Reasoning Section - The "Brain" of the UI */}
        {reasoning && (
          <div className="mb-6 p-4 rounded-xl bg-black/40 border border-white/10 backdrop-blur-md">
            <div className="flex items-center gap-2 mb-2 text-primary">
              <Info className="w-3.5 h-3.5" />
              <span className="text-[10px] font-bold uppercase tracking-widest">AI Agent Reasoning</span>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed font-medium">
              {reasoning}
            </p>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-black/20 rounded-xl p-4 border border-white/5">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span className="text-[10px] font-bold uppercase tracking-wider">Risk Level</span>
            </div>
            <p className="text-lg font-bold text-foreground">
              {verdict === "approved" ? "Low" : verdict === "declined" ? "High" : "Medium"}
            </p>
          </div>
          <div className="bg-black/20 rounded-xl p-4 border border-white/5">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Shield className="w-3.5 h-3.5" />
              <span className="text-[10px] font-bold uppercase tracking-wider">Applicant</span>
            </div>
            <p className="text-lg font-bold text-foreground truncate">{applicantName}</p>
          </div>
          <div className="bg-black/20 rounded-xl p-4 border border-white/5">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Clock className="w-3.5 h-3.5" />
              <span className="text-[10px] font-bold uppercase tracking-wider">System ID</span>
            </div>
            <p className="text-lg font-bold text-foreground font-mono">{applicationId}</p>
          </div>
        </div>
      </div>
    </div>
  )
}