"use client"

import { 
  Database, 
  ShieldAlert, 
  TrendingUp, 
  CheckCircle2, 
  AlertCircle,
  Briefcase,
  History,
  Scale
} from "lucide-react"

interface AnalysisResultsProps {
  data: any
  riskAssessment: any
  compliance: any
}

export function AnalysisResults({ data, riskAssessment, compliance }: AnalysisResultsProps) {
  if (!data || !riskAssessment || !compliance) return null

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in duration-1000">
      
      {/* 1. Data Agent Section (Bureau Data) */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-primary/30 transition-colors">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-blue-500/10 rounded-lg">
            <Database className="w-5 h-5 text-blue-400" />
          </div>
          <h3 className="font-semibold text-lg">Bureau Insights</h3>
        </div>

        <div className="space-y-4">
          <DataRow label="CIBIL Score" value={data.cibil_score} icon={<TrendingUp className="w-4 h-4" />} />
          <DataRow label="Credit Age" value={`${data.credit_history_years} Years`} icon={<History className="w-4 h-4" />} />
          <DataRow label="Total Inquiries" value={data.recent_inquiries} />
          <div className="pt-2">
            <span className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Account Health</span>
            <div className="mt-2 flex items-center gap-2">
              <div className={`px-2 py-1 rounded text-xs font-bold ${data.existing_delinquencies ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'}`}>
                {data.existing_delinquencies ? 'Delinquencies Detected' : 'No Delinquencies'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Risk Agent Section (Scoring) */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-primary/30 transition-colors">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-orange-500/10 rounded-lg">
            <TrendingUp className="w-5 h-5 text-orange-400" />
          </div>
          <h3 className="font-semibold text-lg">Risk Assessment</h3>
        </div>

        <div className="space-y-4">
          <div className="p-4 bg-white/5 rounded-xl border border-white/5">
            <span className="text-sm text-muted-foreground block mb-1">Dynamic Risk Score</span>
            <div className="text-3xl font-bold text-primary">{riskAssessment.dynamic_risk_score}</div>
          </div>
          <DataRow label="DTI Ratio" value={`${riskAssessment.debt_to_income_ratio}%`} />
          <DataRow label="Market Risk" value={riskAssessment.macro_economic_factor} />
          <DataRow label="Employment" value="Stable" icon={<Briefcase className="w-4 h-4" />} />
        </div>
      </div>

      {/* 3. Compliance Agent Section (Auditing) */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-primary/30 transition-colors">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-purple-500/10 rounded-lg">
            <ShieldAlert className="w-5 h-5 text-purple-400" />
          </div>
          <h3 className="font-semibold text-lg">Compliance Check</h3>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/5">
            <div className="flex items-center gap-2">
              <Scale className="w-4 h-4 text-purple-400" />
              <span className="text-sm">Fair Lending (ECOA)</span>
            </div>
            {compliance.fair_lending_flag ? (
              <CheckCircle2 className="w-5 h-5 text-green-500" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-500" />
            )}
          </div>

          <div className="p-3">
            <span className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Auditor Notes</span>
            <p className="mt-2 text-sm text-gray-300 leading-relaxed italic">
              "{compliance.compliance_reasoning}"
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

// Small helper component for consistent data rows
function DataRow({ label, value, icon }: { label: string; value: any; icon?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between py-1">
      <div className="flex items-center gap-2 text-muted-foreground text-sm">
        {icon}
        <span>{label}</span>
      </div>
      <span className="text-sm font-semibold">{value}</span>
    </div>
  )
}