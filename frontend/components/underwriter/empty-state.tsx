"use client"

import { Brain, Cpu, Network, Shield } from "lucide-react"

export function EmptyState() {
  return (
    <div className="flex-1 flex items-center justify-center p-8">
      <div className="text-center max-w-lg">
        {/* Animated AI visualization */}
        <div className="relative w-48 h-48 mx-auto mb-8">
          {/* Outer ring */}
          <div className="absolute inset-0 rounded-full border-2 border-dashed border-border animate-spin-slow" />
          
          {/* Middle ring */}
          <div className="absolute inset-4 rounded-full border border-primary/30 animate-pulse" />
          
          {/* Inner circle */}
          <div className="absolute inset-8 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 flex items-center justify-center">
            <Brain className="w-12 h-12 text-primary animate-pulse" />
          </div>
          
          {/* Orbiting icons */}
          <div className="absolute inset-0 animate-spin-slow">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-lg bg-card border border-border flex items-center justify-center">
              <Cpu className="w-5 h-5 text-muted-foreground" />
            </div>
          </div>
          <div className="absolute inset-0 animate-spin-slow-reverse">
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-10 h-10 rounded-lg bg-card border border-border flex items-center justify-center">
              <Network className="w-5 h-5 text-muted-foreground" />
            </div>
          </div>
          <div className="absolute inset-0 animate-spin-slower">
            <div className="absolute top-1/2 right-0 translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-lg bg-card border border-border flex items-center justify-center">
              <Shield className="w-5 h-5 text-muted-foreground" />
            </div>
          </div>
        </div>

        <h2 className="text-2xl font-semibold text-foreground mb-3">Ready to Analyze</h2>
        <p className="text-muted-foreground leading-relaxed">
          Fill in the applicant details on the left and upload bank statements to begin the multi-agent underwriting analysis.
        </p>
        
        {/* Feature pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
          {["Data Analysis", "Risk Scoring", "Compliance Check", "AI Coordination"].map((feature) => (
            <span
              key={feature}
              className="px-3 py-1.5 text-xs font-medium text-muted-foreground bg-secondary/50 border border-border rounded-full"
            >
              {feature}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
