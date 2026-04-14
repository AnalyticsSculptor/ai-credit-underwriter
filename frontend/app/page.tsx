"use client"

import { useState } from "react"
import { Sidebar } from "@/components/underwriter/sidebar"
import { EmptyState } from "@/components/underwriter/empty-state"
import { AnalysisResults } from "@/components/underwriter/analysis-results"

export interface ApplicantData {
  name: string
  applicationId: string
  income: string
  loanAmount: string
  loanPurpose: string // Added to interface
  fileName: string | null
}

export default function UnderwriterDashboard() {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<any>(null)

  const handleAnalyze = async (data: ApplicantData) => {
    setIsAnalyzing(true)
    
    try {
      // Connecting to your FastAPI Backend
      const response = await fetch('https://ai-underwriter-api.onrender.com/api/underwrite', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          applicant_id: data.applicationId,
          name: data.name,
          age: 30, 
          annual_income: Number(data.income.toString().replace(/[^0-9.]/g, '')),
          loan_amount: Number(data.loanAmount.toString().replace(/[^0-9.]/g, '')),
          
          // THE FIX: Add a fallback so it is NEVER undefined
          loan_purpose: data.loanPurpose || "Home Renovation", 
          
          raw_pdf_text: null
        }),
      })

      if (!response.ok) {
        // NEW: Read the exact error message from FastAPI
        const errorDetail = await response.text();
        console.error("🔥 Detailed Backend Error:", errorDetail);
        throw new Error(`Server returned ${response.status}: ${errorDetail}`);
      }

      const result = await response.json()
      setAnalysisResult(result)
      
    } catch (error) {
      console.error("AI Agent Error:", error)
      alert("Could not connect to AI Agents. Make sure main.py is running on port 8000.")
    } finally {
      setIsAnalyzing(false)
    }
  }

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      {/* Background grid pattern */}
      <div
        className="fixed inset-0 pointer-events-none opacity-30"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255,255,255,0.02) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,255,255,0.02) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Ambient glow effects */}
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-0 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

      {/* Sidebar */}
      <Sidebar onAnalyze={handleAnalyze} isAnalyzing={isAnalyzing} />

      {/* Main Content */}
      <main className="flex-1 flex flex-col relative z-10">
        {/* Header */}
        <header className="h-16 border-b border-white/10 bg-black/20 backdrop-blur-xl flex items-center justify-between px-8">
          <div>
            <h2 className="text-lg font-semibold">Underwriting Dashboard</h2>
            <p className="text-xs text-muted-foreground">Multi-Agent AI Analysis System</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs text-emerald-500 font-medium">All Agents Online</span>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        {isAnalyzing ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="relative w-24 h-24 mx-auto mb-6">
                <div className="absolute inset-0 rounded-full border-4 border-white/5" />
                <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin" />
                <div className="absolute inset-4 rounded-full bg-card border border-white/10 flex items-center justify-center">
                  <div className="w-3 h-3 rounded-full bg-primary animate-ping" />
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-2">Analyzing Application</h3>
              <p className="text-sm text-muted-foreground">Consulting specialized AI agents via Llama 3.3...</p>
              
              <div className="flex items-center justify-center gap-4 mt-6">
                {["Data Agent", "Risk Agent", "Compliance", "Coordinator"].map((agent, i) => (
                  <div
                    key={agent}
                    className="flex items-center gap-2 text-xs text-muted-foreground animate-pulse"
                    style={{ animationDelay: `${i * 200}ms` }}
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                    {agent}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : analysisResult ? (
          <div className="p-8 overflow-y-auto">
             <AnalysisResults data={analysisResult} />
          </div>
        ) : (
          <EmptyState />
        )}
      </main>
    </div>
  )
}