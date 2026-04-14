import os
from dotenv import load_dotenv
from langchain_groq import ChatGroq
from langchain_core.prompts import ChatPromptTemplate
from schema import UnderwritingState
from pydantic import BaseModel, Field

load_dotenv()

class ComplianceCheck(BaseModel):
    passed: bool = Field(description="True if no discriminatory or high-risk factors were used")
    flags: list[str] = Field(description="List of any regulatory warnings or violations found")

def regulatory_alignment_node(state: UnderwritingState) -> dict:
    """
    Simulates the Regulatory Alignment Agent.
    Reviews the AI's risk assessment to ensure fair lending laws (ECOA) were respected.
    """
    print("--- ⚖️ COMPLIANCE AGENT: Running Regulatory Checks ---")
    
    # 1. FIXED: Using the new versatile model
    llm = ChatGroq(model="llama-3.3-70b-versatile", temperature=0)
    structured_llm = llm.with_structured_output(ComplianceCheck)
    
    prompt = ChatPromptTemplate.from_messages([
        ("system", "You are a strict compliance auditor for a bank. Ensure fair lending laws (ECOA) are followed."),
        ("human", """
        Review this risk assessment: {assessment}
        Applicant Age: {age}
        
        Rules for Compliance:
        1. AGE: If age is explicitly listed as a negative factor in the 'key_factors', you MUST fail compliance and flag it.
        2. LOW SCORES: If the dynamic score is below 500, check the 'key_factors'. If concrete financial reasons (like delinquencies, high debt, or thin file) are provided, the application IS COMPLIANT. Do NOT flag it.
        3. UNEXPLAINED LOW SCORES: Only flag a low score if the 'key_factors' fail to mention a valid financial reason.
        
        If the application follows these rules, output passed: True and leave the flags list completely empty [].
        """)
    ])
    
    chain = prompt | structured_llm
    
    # 2. FIXED: Safely handle data whether it is a Pydantic model or a dict
    assessment_data = state["risk_assessment"].model_dump() if hasattr(state["risk_assessment"], "model_dump") else state["risk_assessment"]
    applicant_data = state["applicant_info"].model_dump() if hasattr(state["applicant_info"], "model_dump") else state["applicant_info"]
    
    result = chain.invoke({
        "assessment": assessment_data,
        "age": applicant_data.get("age") if isinstance(applicant_data, dict) else applicant_data.age
    })
    
    return {
        "compliance_passed": result.passed if hasattr(result, "passed") else result.get("passed", False),
        "compliance_flags": result.flags if hasattr(result, "flags") else result.get("flags", [])
    }