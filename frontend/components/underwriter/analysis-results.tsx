"use client"

import { Database, TrendingUp, ShieldCheck, AlertCircle, CheckCircle2 } from "lucide-react"

interface AnalysisResultsProps {
  data: any;
  riskAssessment: any;
  compliance: any;
}

export function AnalysisResults({ data = {}, riskAssessment = {}, compliance = {} }: AnalysisResultsProps) {
  // 1. SMART MAPPING: Look for common AI output names and provide safe fallbacks
  
  // Bureau Data Fallbacks
  const cibilScore = data?.bureau_score || data?.cibil_score || data?.score || "N/A";
  const creditAge = data?.credit_history_length_years || data?.credit_age_years || data?.credit_age || "N/A";
  const inquiries = data?.total_inquiries || data?.recent_inquiries || 0;
  
  // Safely check delinquencies (since 0 is technically a "falsy" value in JavaScript)
  const delinquencies = data?.recent_delinquencies ?? data?.delinquencies;
  const accountHealth = data?.account_health || (delinquencies === 0 ? "No Delinquencies" : (delinquencies > 0 ? "Review Required" : "Pending Audit"));

  // Risk Assessment Fallbacks
  const dynamicRisk = riskAssessment?.dynamic_risk_score || riskAssessment?.risk_score || "N/A";
  const dtiRatio = riskAssessment?.dti_ratio || riskAssessment?.debt_to_income || riskAssessment?.dti || "N/A";
  const marketRisk = riskAssessment?.market_risk || riskAssessment?.macro_risk || "Moderate";
  const employmentStatus = riskAssessment?.employment_stability || riskAssessment?.employment || "Unverified";

  // Compliance Fallbacks
  const ecoaStatus = compliance?.fair_lending_ecoa || compliance?.ecoa_check || compliance?.fair_lending || "Pending Audit";
  const auditorNotes = compliance?.auditor_notes || compliance?.notes || compliance?.summary || "No specific auditor notes generated for this profile.";

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* 1. BUREAU INSIGHTS */}
      <div className="bg-[#111111] rounded-2xl p-6 border border-white/5">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 bg-blue-500/10 rounded-lg border border-blue-500/20">
            <Database className="w-5 h-5 text-blue-400" />
          </div>
          <h3 className="text-lg font-bold text-white">Bureau Insights</h3>
        </div>

        <div className="space-y-5">
          <div className="flex justify-between items-center">
            <span className="text-sm text-slate-400">CIBIL Score</span>
            <span className="font-mono text-lg text-white">{cibilScore}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-slate-400">Credit Age</span>
            <span className="font-medium text-white">{creditAge} {creditAge !== "N/A" && "Years"}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-slate-400">Total Inquiries</span>
            <span className="font-medium text-white">{inquiries}</span>
          </div>
          
          <div className="pt-4 mt-2 border-t border-white/5">
            <span className="block text-[10px] uppercase tracking-widest text-slate-500 mb-2">Account Health</span>
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold ${accountHealth.includes("No") ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'}`}>
              {accountHealth}
            </span>
          </div>
        </div>
      </div>

      {/* 2. RISK ASSESSMENT */}
      <div className="bg-[#111111] rounded-2xl p-6 border border-white/5">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 bg-orange-500/10 rounded-lg border border-orange-500/20">
            <TrendingUp className="w-5 h-5 text-orange-400" />
          </div>
          <h3 className="text-lg font-bold text-white">Risk Assessment</h3>
        </div>

        <div className="space-y-5">
          <div className="bg-black/30 p-3 rounded-lg border border-white/5 flex justify-between items-center mb-2">
             <span className="text-sm text-slate-400">Dynamic Risk Score</span>
             <span className="font-mono text-xl text-orange-400 font-bold">{dynamicRisk}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm text-slate-400">DTI Ratio</span>
            <span className="font-mono text-white">{dtiRatio}{dtiRatio !== "N/A" && "%"}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-slate-400">Market Risk</span>
            <span className="font-medium text-white">{marketRisk}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-slate-400">Employment</span>
            <span className="font-medium text-white">{employmentStatus}</span>
          </div>
        </div>
      </div>

      {/* 3. COMPLIANCE CHECK */}
      <div className="bg-[#111111] rounded-2xl p-6 border border-white/5">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 bg-purple-500/10 rounded-lg border border-purple-500/20">
            <ShieldCheck className="w-5 h-5 text-purple-400" />
          </div>
          <h3 className="text-lg font-bold text-white">Compliance Check</h3>
        </div>

        <div className="space-y-5">
          <div className="bg-black/30 p-3 rounded-lg border border-white/5 flex justify-between items-center">
             <span className="text-sm text-slate-300">Fair Lending (ECOA)</span>
             {ecoaStatus.toLowerCase().includes("pass") || ecoaStatus.toLowerCase().includes("compliant") ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
             ) : (
                <AlertCircle className="w-5 h-5 text-rose-400" />
             )}
          </div>

          <div className="pt-2">
            <span className="block text-[10px] uppercase tracking-widest text-slate-500 mb-2">Auditor Notes</span>
            <p className="text-sm text-slate-400 leading-relaxed italic bg-white/[0.02] p-3 rounded-lg border border-white-[0.02]">
              "{auditorNotes}"
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}