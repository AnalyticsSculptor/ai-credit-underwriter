import os
from dotenv import load_dotenv
from langchain_groq import ChatGroq
from langchain_core.prompts import ChatPromptTemplate
from schema import UnderwritingState, RiskAssessment

load_dotenv()

def dynamic_scoring_node(state: UnderwritingState) -> dict:
    """
    Simulates the Dynamic Scoring Agent.
    Uses Llama 3 to analyze all collected data and output a structured risk assessment.
    """
    print("--- 🧠 SCORING AGENT: Simulating Dynamic Risk ---")
    
    # 1. FIXED: Using the new versatile model
    llm = ChatGroq(model="llama-3.3-70b-versatile", temperature=0.2)
    structured_llm = llm.with_structured_output(RiskAssessment)
    
    prompt = ChatPromptTemplate.from_messages([
        ("system", "You are an expert AI Credit Underwriter. Analyze the provided data and output a precise risk assessment."),
        ("human", """
        Analyze the following loan application:
        
        Applicant Info: {applicant}
        Bureau Data: {bureau}
        Bank Summary: {bank}
        Market Context: {market}
        
        Calculate a dynamic risk score (0-1000) and provide your reasoning.
         When calculating the dynamic_risk_score (0-1000), penalize the score by 200 points for every recent delinquency, but boost it by 50 points if their credit history is longer than 5 years."
        """)
    ])
    
    chain = prompt | structured_llm
    
    # 2. FIXED: Safely handle the applicant info whether it's a Pydantic model or a dict
    applicant_data = state["applicant_info"].model_dump() if hasattr(state["applicant_info"], "model_dump") else state["applicant_info"]
    
    result = chain.invoke({
        "applicant": applicant_data,
        "bureau": state.get("bureau_data", {}),
        "bank": state.get("bank_statement_summary", ""),
        "market": state.get("market_context", "")
    })
    
    return {"risk_assessment": result}