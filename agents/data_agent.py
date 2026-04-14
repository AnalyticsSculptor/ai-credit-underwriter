import sqlite3
from schema import UnderwritingState

def get_bureau_data(applicant_id: str) -> dict:
    """Helper function to run the SQL query against our SQLite database."""
    try:
        conn = sqlite3.connect("underwriting.db")
        cursor = conn.cursor()
        
        cursor.execute(
            "SELECT bureau_score, total_debt, recent_delinquencies, credit_history_years FROM credit_bureau WHERE applicant_id = ?",
            (applicant_id,)
        )
        row = cursor.fetchone()
        conn.close()

        if row:
            return {
                "bureau_score": row[0],
                "total_debt": row[1],
                "recent_delinquencies": row[2],
                "credit_history_length_years": row[3]
            }
        else:
            return {"error": "No bureau data found for this ID"}
            
    except Exception as e:
        return {"error": str(e)}

def data_aggregation_node(state: UnderwritingState) -> dict:
    """
    Simulates the Data Aggregation Agent.
    Queries the local SQLite database for real applicant history and parses uploaded PDFs.
    """
    print("--- 🔍 DATA AGENT: Querying Production DB & Parsing Docs ---")
    
    # Safely handle the applicant info whether it's a Pydantic model or a dict
    applicant_data = state["applicant_info"].model_dump() if hasattr(state["applicant_info"], "model_dump") else state["applicant_info"]
    app_id = applicant_data.get("applicant_id")
    
    # 1. Real SQL Database Query
    bureau_data = get_bureau_data(app_id)
    
    # If the recruiter types in a random ID that isn't in our DB, handle it gracefully
    if "error" in bureau_data:
         print(f"⚠️ Warning: {bureau_data['error']}. Defaulting to high-risk profile.")
         bureau_data = {
            "bureau_score": 500, # Poor CIBIL
            "total_debt": 1500000.0, # ₹15 Lakhs
            "recent_delinquencies": 2,
            "credit_history_length_years": 1.0
         }

    # 2. Unstructured Document Ingestion (PDF)
    raw_pdf = applicant_data.get("raw_pdf_text")
    if raw_pdf:
        bank_summary = f"[Extracted from Uploaded Bank Statement PDF]:\n{raw_pdf[:2000]}"
    else:
        ann_income = applicant_data.get("annual_income")
        bank_summary = f"No bank statement provided. User stated income: ₹{ann_income}."
    
    return {
        "bureau_data": bureau_data,
        "bank_statement_summary": bank_summary
    }