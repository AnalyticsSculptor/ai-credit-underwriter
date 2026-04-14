import streamlit as st
from pypdf import PdfReader
from schema import ApplicantInfo
from graph import underwriting_app

# Configure the Streamlit page
st.set_page_config(page_title="AI Underwriter Demo", page_icon="🏦", layout="wide")

st.title("🏦 Multi-Agent AI Credit Underwriter")
st.markdown("""
Welcome to the AI-driven underwriting portal. This system uses a LangGraph multi-agent architecture 
to dynamically assess loan applications using structured DB queries and unstructured document parsing. 
* **Agents working in parallel:** Data Aggregation, Market Context, Dynamic Scoring, and Regulatory Compliance.
""")

st.divider()

# --- SIDEBAR: APPLICANT INTAKE ---
with st.sidebar:
    st.header("📝 Applicant Intake")
    app_id = st.text_input("Applicant ID (APP-2026-001 to 030)", "APP-2026-015")
    name = st.text_input("Full Name", "Rahul Sharma")
    age = st.number_input("Age", min_value=18, max_value=100, value=30)
    
    # Updated to INR values and steps
    income = st.number_input("Annual Income (₹)", min_value=100000.0, value=1200000.0, step=50000.0)
    loan_amt = st.number_input("Requested Loan Amount (₹)", min_value=10000.0, value=500000.0, step=50000.0)
    
    purpose = st.selectbox("Loan Purpose", ["Home Renovation", "Debt Consolidation", "Auto", "Business Start-up", "Medical Emergency"])
    
    st.divider()
    
    st.subheader("📄 Unstructured Data")
    uploaded_file = st.file_uploader("Upload Bank Statement (PDF)", type="pdf")
    
    run_button = st.button("🚀 Run Multi-Agent Analysis", use_container_width=True, type="primary")
# --- MAIN SCREEN: EXECUTION & RESULTS ---
if run_button:
    with st.spinner("Agents are analyzing the application..."):
        
        # 1. Extract text from PDF if it exists
        pdf_text = None
        if uploaded_file is not None:
            try:
                reader = PdfReader(uploaded_file)
                pdf_text = "\n".join([page.extract_text() for page in reader.pages if page.extract_text()])
            except Exception as e:
                st.error(f"Error reading PDF: {e}")
        
        # 2. Format the data into our Pydantic schema (passing the PDF text)
        applicant = ApplicantInfo(
            applicant_id=app_id,
            name=name,
            age=age,
            annual_income=income,
            loan_amount=loan_amt,
            loan_purpose=purpose,
            raw_pdf_text=pdf_text
        )
        
        # 3. Initialize the LangGraph State
        initial_state = {"applicant_info": applicant}
        
        # 4. Execute the Graph
        final_state = underwriting_app.invoke(initial_state)
        
    # --- DISPLAY FINAL VERDICT ---
    st.header("Final Decision Dashboard")
    
    decision = final_state.get("final_decision")
    reasoning = final_state.get("decision_reasoning")
    
    # Use different colors based on the outcome
    if decision == "Approved":
        st.success(f"### Verdict: {decision}")
    elif decision == "Declined":
        st.error(f"### Verdict: {decision}")
    else:
        st.warning(f"### Verdict: {decision} (Human Review Required)")
        
    st.info(f"**Coordinator Reasoning:** {reasoning}")
    
    st.divider()
    
    # --- DISPLAY AI THOUGHT PROCESS (The "Wow" Factor) ---
    st.subheader("🔍 Audit Trail: Agent Inter-communications")
    
    col1, col2 = st.columns(2)
    
    with col1:
        with st.expander("📊 Data & Market Agents"):
            st.markdown("**Aggregated Bureau Data (From SQLite DB):**")
            st.json(final_state.get("bureau_data", {}))
            
            st.markdown("**Alternative Data Summary (From Uploaded PDF):**")
            st.write(final_state.get("bank_statement_summary", ""))
            
            st.markdown("**Macro-Economic Context:**")
            st.write(final_state.get("market_context", ""))

    with col2:
        with st.expander("🧠 Scoring & Compliance Agents"):
            st.markdown("**Dynamic Risk Assessment:**")
            risk = final_state.get("risk_assessment")
            if risk:
                # Handle dictionary or Pydantic object safely
                st.json(risk.model_dump() if hasattr(risk, "model_dump") else risk)
            
            st.markdown("**Regulatory Audit:**")
            passed = final_state.get("compliance_passed")
            st.write(f"**Passed ECOA Rules:** {'✅ Yes' if passed else '❌ No'}")
            
            flags = final_state.get("compliance_flags", [])
            if flags:
                st.write("**Violation Flags:**")
                for flag in flags:
                    st.write(f"- {flag}")
else:
    # Instructions to show before running
    st.info("👈 Enter applicant details in the sidebar and click 'Run Multi-Agent Analysis' to start the underwriting process.")