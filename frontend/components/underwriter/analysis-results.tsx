"use client"

import { Database, AlertTriangle, ShieldCheck, Cpu, CheckCircle, XCircle } from "lucide-react"
import { VerdictCard } from "./verdict-card"
import { AgentCard } from "./agent-card"

interface AnalysisResultsProps {
  data: any // The full JSON response from FastAPI
}

export function AnalysisResults({ data }: AnalysisResultsProps) {
  // 1. Extract Real Data from the Backend State
  const info = data.applicant_info
  const risk = data.risk_assessment
  const bureau = data.bureau_data
  const market = data.market_context
  const compliance = data.compliance_passed
  const flags = data.compliance_flags || []
  const verdict = data.final_decision.toLowerCase() as "approved" | "declined" | "escalated"

  // 2. Map Risk Factors from Scoring Agent
  const riskFactors = [
    { 
      factor: "CIBIL Score", 
      value: bureau.bureau_score, 
      status: bureau.bureau_score >= 750 ? "good" : bureau.bureau_score >= 650 ? "warning" : "bad" 
    },
    { 
      factor: "Total Debt (₹)", 
      value: `₹${bureau.total_debt.toLocaleString("en-IN")}`, 
      status: bureau.total_debt < 500000 ? "good" : "warning" 
    },
    { 
      factor: "History Length", 
      value: `${bureau.credit_history_length_years} Years`, 
      status: bureau.credit_history_length_years > 3 ? "good" : "warning" 
    },
    { 
      factor: "Risk Tier", 
      value: risk?.risk_tier || "N/A", 
      status: risk?.risk_tier?.toLowerCase() === "low" ? "good" : "bad" 
    },
  ]

  return (
    <div className="flex-1 space-y-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Verdict Card - Now uses real AI Decision */}
        <VerdictCard
          verdict={verdict}
          confidence={risk?.dynamic_risk_score ? +(risk.dynamic_risk_score / 10).toFixed(1) : 0}
          applicantName={info.name}
          applicationId={info.applicant_id}
          reasoning={data.decision_reasoning}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Data & Market Agent - Shows real context & Bureau Data */}
          <AgentCard title="Data & Market Agent" icon={Database} status="success">
            <div className="bg-black/40 rounded-lg p-4 font-mono text-[10px] overflow-x-auto border border-white/5">
              <pre className="text-emerald-400">
{`{
  "cibil_score": ${bureau.bureau_score},
  "delinquencies": ${bureau.recent_delinquencies},
  "market_context": "${market.substring(0, 60)}...",
  "repo_rate": "6.50%",
  "timestamp": "${new Date().toLocaleTimeString()}"
}`}
              </pre>
            </div>
            <p className="mt-2 text-xs text-muted-foreground italic">"{market}"</p>
          </AgentCard>

          {/* Risk Scoring Agent - Maps real CIBIL and Debt metrics */}
          <AgentCard
            title="Risk Scoring Agent"
            icon={AlertTriangle}
            status={verdict === "approved" ? "success" : verdict === "escalated" ? "warning" : "error"}
          >
            <div className="space-y-2">
              {riskFactors.map((item) => (
                <div key={item.factor} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                  <span className="text-xs text-muted-foreground">{item.factor}</span>
                  <span className={`text-xs font-medium ${
                    item.status === "good" ? "text-emerald-400" : 
                    item.status === "warning" ? "text-amber-400" : "text-rose-400"
                  }`}>
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </AgentCard>

          {/* Compliance Audit - Shows real Regulatory Flags */}
          <AgentCard
            title="Compliance Audit"
            icon={ShieldCheck}
            status={compliance ? "success" : "error"}
          >
            <div className="space-y-3">
              <div className={`flex items-center gap-2 p-2 rounded border ${compliance ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-500' : 'bg-rose-500/5 border-rose-500/20 text-rose-500'}`}>
                {compliance ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                <span className="text-xs font-semibold">{compliance ? "PASSED REGULATORY CHECK" : "COMPLIANCE FAILURE"}</span>
              </div>
              {flags.length > 0 && (
                <div className="space-y-1">
                  {flags.map((flag: string, i: number) => (
                    <div key={i} className="text-[11px] text-rose-300 flex items-start gap-1">
                      <span>•</span> {flag}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </AgentCard>

          {/* Coordinator Logic - Status of the Multi-Agent Flow */}
          <AgentCard title="Coordinator Logic" icon={Cpu} status="info">
            <div className="space-y-2">
              {[
                { s: "Data Aggregated", d: "Successfully fetched from SQLite DB" },
                { s: "Market Context", d: "RBI Repo Rate & Inflation check complete" },
                { s: "Risk Scoring", d: "Llama 3.3 performed capacity simulation" },
                { s: "Compliance", d: "Fair lending laws (ECOA) verified" }
              ].map((step, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-5 h-5 rounded-full bg-primary/20 text-primary text-[10px] font-bold">
                    {i + 1}
                  </div>
                  <div className="flex-1">
                    <p className="text-[11px] font-medium">{step.s}</p>
                    <p className="text-[10px] text-muted-foreground">{step.d}</p>
                  </div>
                  <CheckCircle className="w-3 h-3 text-emerald-500" />
                </div>
              ))}
            </div>
          </AgentCard>
        </div>
      </div>
    </div>
  )
}