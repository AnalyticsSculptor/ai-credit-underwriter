from langgraph.graph import StateGraph, END
from schema import UnderwritingState, ApplicantInfo

# Import our specialized agents
from agents.data_agent import data_aggregation_node
from agents.market_agent import market_context_node
from agents.scoring_agent import dynamic_scoring_node
from agents.compliance_agent import regulatory_alignment_node

def coordinator_node(state: UnderwritingState) -> dict:
    """
    The Orchestrator / Coordinator.
    Reviews the outputs from all agents and makes the final deterministic decision.
    """
    print("--- 👔 COORDINATOR: Finalizing Decision ---")
    
    risk = state.get("risk_assessment", {})
    compliance_passed = state.get("compliance_passed", False)
    compliance_flags = state.get("compliance_flags", [])
    
    bureau_data = state.get("bureau_data", {})
    compliance_check = state.get("compliance_check", {})
    applicant = state.get("applicant_info")
    
    # --- 🛠️ NEW: Failsafe DTI Calculator ---
    # If the AI forgot to calculate DTI, we catch it and do the math ourselves
    if isinstance(risk, dict) and risk.get("dti_ratio") is None:
        # Try to grab the debt number the AI generated
        raw_debt = risk.get("total_debt", bureau_data.get("total_debt", 0))
        
        # Safely grab the annual income
        annual_income = applicant.get("annual_income", 1) if isinstance(applicant, dict) else getattr(applicant, "annual_income", 1)
        
        if 0 < raw_debt < 100:
            # If the AI generated a number like "28.4", it's already a percentage
            risk["dti_ratio"] = round(float(raw_debt), 1)
        else:
            # Standard Math: (Monthly Debt / Monthly Income) * 100
            monthly_income = max(annual_income / 12, 1)
            calculated_dti = (float(raw_debt) / monthly_income) * 100
            
            # Cap it so it doesn't look crazy if the AI hallucinates a huge number
            risk["dti_ratio"] = min(round(calculated_dti, 1), 99.9)

    # Safely handle compliance flags
    if isinstance(compliance_flags, str):
        compliance_flags = [compliance_flags]
        
    risk_tier = risk.get("risk_tier", "Unknown") if isinstance(risk, dict) else getattr(risk, "risk_tier", "Unknown")
    key_factors = risk.get("key_factors", []) if isinstance(risk, dict) else getattr(risk, "key_factors", [])
    
    def build_final_payload(decision, reasoning):
        return {
            "final_decision": decision,
            "decision_reasoning": reasoning,
            "bureau_data": bureau_data,
            "risk_assessment": risk,
            "compliance_check": compliance_check
        }
    
    # Routing Rules
    if not compliance_passed:
        return build_final_payload("Escalated", f"Failed regulatory compliance. Flags: {', '.join(compliance_flags)}")
    
    if risk_tier.lower() == "high":
        return build_final_payload("Declined", f"Declined due to High Risk. Factors: {', '.join(key_factors)}")
    elif risk_tier.lower() == "medium":
        return build_final_payload("Escalated", "Medium risk profile requires human underwriter review.")
    else:
        return build_final_payload("Approved", "Approved. Low risk profile and passed all compliance checks.")

# ==========================================
# 🕸️ BUILD THE LANGGRAPH WORKFLOW
# ==========================================

# 1. Initialize the Graph with our schema
workflow = StateGraph(UnderwritingState)

# 2. Add all our agents as nodes
workflow.add_node("data_agent", data_aggregation_node)
workflow.add_node("market_agent", market_context_node)
workflow.add_node("scoring_agent", dynamic_scoring_node)
workflow.add_node("compliance_agent", regulatory_alignment_node)
workflow.add_node("coordinator", coordinator_node)

# 3. Define the flow (Edges)
workflow.set_entry_point("data_agent")
workflow.add_edge("data_agent", "market_agent")
workflow.add_edge("market_agent", "scoring_agent")
workflow.add_edge("scoring_agent", "compliance_agent")
workflow.add_edge("compliance_agent", "coordinator")
workflow.add_edge("coordinator", END) # The workflow stops here

# 4. Compile the graph into an executable application
underwriting_app = workflow.compile()


# ==========================================
# 🧪 TERMINAL TESTING BLOCK
# ==========================================
if __name__ == "__main__":
    # If you run this file directly in the terminal, it will test the graph
    print("🚀 Starting Underwriting Run...")
    
    # Mock input from a user
    test_applicant = ApplicantInfo(
        applicant_id="APP-101",
        name="John Doe",
        age=35,
        annual_income=85000.0,
        loan_amount=20000.0,
        loan_purpose="Home Renovation",
        credit_score_provided=720
    )
    
    # Initialize the state
    initial_state = {"applicant_info": test_applicant}
    
    # Run the graph
    final_state = underwriting_app.invoke(initial_state)
    
    print("\n" + "="*40)
    print("✅ FINAL DECISION:", final_state.get("final_decision"))
    print("📝 REASONING:", final_state.get("decision_reasoning"))
    print("="*40)