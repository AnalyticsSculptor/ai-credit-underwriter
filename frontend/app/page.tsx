"use client"

import { useState } from "react"
import { Sidebar } from "@/components/underwriter/sidebar"
import { AnalysisResults } from "@/components/underwriter/analysis-results"
import { VerdictCard } from "@/components/underwriter/verdict-card"
import { BrainCircuit, Activity } from "lucide-react"

export interface ApplicantData {
  name: string
  applicationId: string
  income: string
  loanAmount: string
  loanPurpose: string
  fileName: string | null
}

export default function UnderwriterPage() {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisResults, setAnalysisResults] = useState<any>(null)
  const [activeNode, setActiveNode] = useState<string | null>(null)
  const [submittedData, setSubmittedData] = useState<ApplicantData | null>(null)

  const handleAnalyze = async (data: ApplicantData) => {
    setIsAnalyzing(true)
    setAnalysisResults(null)
    setSubmittedData(data)
    setActiveNode("initializing")

    try {
      // REPLACE with your actual Render URL
      const response = await fetch('https://ai-credit-underwriter.onrender.com/api/underwrite', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          applicant_id: data.applicationId,
          name: data.name,
          age: 30,
          annual_income: Number(data.income.replace(/[^0-9.]/g, '')),
          loan_amount: Number(data.loanAmount.replace(/[^0-9.]/g, '')),
          loan_purpose: data.loanPurpose,
          raw_pdf_text: null
        }),
      })

      if (!response.ok) throw new Error('Backend failed to respond')

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()
      if (!reader) return

      while (true) {
        const { value, done } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value)
        const lines = chunk.split('\n')

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const payload = JSON.parse(line.replace('data: ', ''))
              setActiveNode(payload.node)

              // Check for the final coordinator node to show results
              if (payload.node === "coordinator_node" || payload.node === "coordinator") {
                setAnalysisResults(payload.data)
              }
            } catch (e) {
              console.error("Stream parse error", e)
            }
          }
        }
      }
    } catch (error) {
      console.error("Analysis Error:", error)
      alert("Connection Error: Check if the backend is live.")
    } finally {
      setIsAnalyzing(false)
      setActiveNode(null)
    }
  }

  return (
    <div className="flex h-screen bg-[#050505] text-white overflow-hidden font-sans">
      <Sidebar onAnalyze={handleAnalyze} isAnalyzing={isAnalyzing} />

      <main className="flex-1 flex flex-col relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 blur-[120px] rounded-full -mr-64 -mt-64" />
        
        <div className="flex-1 overflow-y-auto p-8 relative z-10">
          {!analysisResults && !isAnalyzing ? (
            <div className="h-full flex flex-col items-center justify-center text-center max-w-2xl mx-auto">
              <div className="w-20 h-20 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6">
                <BrainCircuit className="w-10 h-10 text-primary" />
              </div>
              <h2 className="text-3xl font-bold mb-4 tracking-tight">AI Underwriting Mesh</h2>
              <p className="text-muted-foreground leading-relaxed">
                Start the agentic workflow by entering applicant details in the sidebar.
              </p>
            </div>
          ) : isAnalyzing && !analysisResults ? (
            <div className="h-full flex flex-col items-center justify-center space-y-8">
              <div className="relative">
                <div className="w-24 h-24 rounded-full border-2 border-primary/20 border-t-primary animate-spin" />
                <Activity className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-primary w-8 h-8 animate-pulse" />
              </div>
              <h3 className="text-xl font-semibold text-primary tracking-widest uppercase italic animate-pulse">
                {activeNode === 'data_agent' && "📡 Data Agent: Searching Bureau..."}
                {activeNode === 'risk_agent' && "⚖️ Risk Agent: Scoring Profile..."}
                {activeNode === 'compliance_agent' && "🛡️ Compliance Agent: Auditing..."}
                {activeNode === 'coordinator_node' && "🤖 Coordinator: Finalizing..."}
                {activeNode === 'initializing' && "Initializing Agents..."}
              </h3>
            </div>
          ) : (
            <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <VerdictCard 
                applicantName={submittedData?.name || "Applicant"}
                applicationId={submittedData?.applicationId || "N/A"}
                verdict={analysisResults.final_decision}
                confidence={analysisResults.risk_assessment?.dynamic_risk_score ? +(analysisResults.risk_assessment.dynamic_risk_score / 10).toFixed(1) : 0}
                reasoning={analysisResults.decision_reasoning}
              />
              
              <AnalysisResults 
                data={analysisResults.bureau_data}
                riskAssessment={analysisResults.risk_assessment}
                compliance={analysisResults.compliance_check}
              />
            </div>
          )}
        </div>
      </main>
    </div>
  )
}