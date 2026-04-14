"use client"

import { useState } from "react"
import { Upload, FileText, Loader2, ChevronDown } from "lucide-react" 
import { ApplicantData } from "@/app/page"

interface SidebarProps {
  onAnalyze: (data: ApplicantData) => void
  isAnalyzing: boolean
}

export function Sidebar({ onAnalyze, isAnalyzing }: SidebarProps) {
  // Starting empty so you can type fresh data
  const [name, setName] = useState("")
  const [applicationId, setApplicationId] = useState("")
  const [income, setIncome] = useState("")
  const [loanAmount, setLoanAmount] = useState("")
  const [loanPurpose, setLoanPurpose] = useState("Home Renovation")
  const [fileName, setFileName] = useState<string | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Magic formatting: If you type "7", it becomes "APP-2026-007"
    const paddedNumber = applicationId.padStart(3, '0')
    const formattedId = `APP-2026-${paddedNumber}`

    onAnalyze({
      name,
      applicationId: formattedId, 
      income,
      loanAmount,
      loanPurpose,
      fileName
    })
  }

  return (
    <aside className="w-80 border-r border-white/10 bg-black/40 backdrop-blur-xl flex flex-col z-20">
      <div className="p-6 border-b border-white/10">
        <h1 className="text-xl font-bold tracking-tight">Applicant Intake</h1>
        <p className="text-xs text-muted-foreground mt-1">Enter details to initiate analysis</p>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <form id="analyze-form" onSubmit={handleSubmit} className="space-y-6">
          
          {/* 1. APPLICANT NAME */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
              Applicant Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full h-10 px-3 rounded-lg bg-black/20 border border-white/10 text-sm focus:outline-none focus:border-primary transition-colors"
              required
            />
          </div>

          {/* 2. APPLICATION ID (Number Only) */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
              System ID (Number Only)
            </label>
            <div className="relative flex items-center">
               <span className="absolute left-3 text-muted-foreground text-sm font-mono pointer-events-none">
                 APP-2026-
               </span>
               <input
                 type="text"
                 value={applicationId}
                 onChange={(e) => setApplicationId(e.target.value)}
                 className="w-full h-10 pl-24 pr-3 rounded-lg bg-black/20 border border-white/10 text-sm font-mono focus:outline-none focus:border-primary transition-colors"
                 placeholder="001"
                 required
               />
            </div>
          </div>

          {/* 3. ANNUAL INCOME */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
              Annual Income (₹)
            </label>
            <input
              type="text"
              value={income}
              onChange={(e) => setIncome(e.target.value)}
              className="w-full h-10 px-3 rounded-lg bg-black/20 border border-white/10 text-sm focus:outline-none focus:border-primary transition-colors"
              required
            />
          </div>

          {/* 4. LOAN AMOUNT */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
              Loan Amount (₹)
            </label>
            <input
              type="text"
              value={loanAmount}
              onChange={(e) => setLoanAmount(e.target.value)}
              className="w-full h-10 px-3 rounded-lg bg-black/20 border border-white/10 text-sm focus:outline-none focus:border-primary transition-colors"
              required
            />
          </div>

          {/* 5. LOAN PURPOSE */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
              Loan Purpose
            </label>
            <div className="relative">
              <select
                value={loanPurpose}
                onChange={(e) => setLoanPurpose(e.target.value)}
                className="w-full h-10 pl-3 pr-10 rounded-lg bg-black/20 border border-white/10 text-sm focus:outline-none focus:border-primary transition-colors appearance-none cursor-pointer"
              >
                <option value="Home Renovation" className="bg-zinc-900">Home Renovation</option>
                <option value="Debt Consolidation" className="bg-zinc-900">Debt Consolidation</option>
                <option value="Auto" className="bg-zinc-900">Auto</option>
                <option value="Business Start-up" className="bg-zinc-900">Business Start-up</option>
                <option value="Medical Emergency" className="bg-zinc-900">Medical Emergency</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            </div>
          </div>

          {/* 6. BANK STATEMENTS */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
              Bank Statements (PDF)
            </label>
            <div className="relative group border-2 border-dashed border-white/10 rounded-xl p-6 transition-colors hover:border-primary/50 bg-black/20 text-center cursor-pointer">
              <input 
                type="file" 
                accept=".pdf"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setFileName(e.target.files[0].name)
                  }
                }}
              />
              <div className="flex flex-col items-center gap-2">
                <Upload className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors" />
                {fileName ? (
                  <div className="flex items-center gap-2 text-primary">
                    <FileText className="w-3.5 h-3.5" />
                    <span className="text-xs font-medium truncate max-w-[150px]">{fileName}</span>
                  </div>
                ) : (
                  <div>
                    <span className="text-xs font-medium text-primary">Click to upload</span>
                    <span className="text-xs text-muted-foreground"> or drag and drop</span>
                  </div>
                )}
              </div>
            </div>
          </div>

        </form>
      </div>

      <div className="p-6 border-t border-white/10">
        <button
          form="analyze-form"
          type="submit"
          disabled={isAnalyzing}
          className="w-full h-12 rounded-lg bg-primary text-primary-foreground font-semibold flex items-center justify-center gap-2 transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(var(--primary),0.3)]"
        >
          {isAnalyzing ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Initializing Agents...
            </>
          ) : (
            "Analyze Application"
          )}
        </button>
      </div>
    </aside>
  )
}