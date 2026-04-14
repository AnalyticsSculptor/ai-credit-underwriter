from typing import TypedDict, List, Optional, Dict, Any
from pydantic import BaseModel, Field

# 1. Input Schema: What the applicant submits via the UI
class ApplicantInfo(BaseModel):
    applicant_id: str
    name: str
    age: int
    annual_income: float
    loan_amount: float
    loan_purpose: str
    credit_score_provided: Optional[int] = None
    raw_pdf_text: Optional[str] = None  # NEW: Holds the extracted PDF text

# 2. Output Schema: What the Scoring Agent produces
class RiskAssessment(BaseModel):
    dynamic_risk_score: int = Field(description="Score from 0 to 1000")
    risk_tier: str = Field(description="Low, Medium, High")
    key_factors: List[str] = Field(description="Reasons for the score")
    simulated_repayment_capacity: str = Field(description="Assessment under stress conditions")

# 3. The Graph State: The "Shared Memory" for our Agents
class UnderwritingState(TypedDict):
    """
    This dictionary is passed between all agents. 
    Each agent reads from it and appends its findings.
    """
    applicant_info: ApplicantInfo
    
    # Aggregated Data (Filled by Data Agent)
    bureau_data: Dict[str, Any]
    bank_statement_summary: str
    
    # Context (Filled by Market Agent)
    market_context: str
    
    # Risk (Filled by Scoring Agent)
    risk_assessment: Optional[RiskAssessment]
    
    # Compliance (Filled by Regulatory Agent)
    compliance_passed: bool
    compliance_flags: List[str]
    
    # Final Outcome (Filled by Orchestrator)
    final_decision: str # "Approved", "Declined", or "Escalated"
    decision_reasoning: str