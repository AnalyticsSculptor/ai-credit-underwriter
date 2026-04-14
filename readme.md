readme_content = """# 🚀 AI-Powered Credit Underwriter (Multi-Agent System)

![Project Status](https://img.shields.io/badge/Status-Active-success)
![Python](https://img.shields.io/badge/Python-3.10%2B-blue)
![FastAPI](https://img.shields.io/badge/FastAPI-0.100%2B-009688)
![Next.js](https://img.shields.io/badge/Next.js-14%2B-black)
![LangGraph](https://img.shields.io/badge/LangGraph-Multi--Agent-orange)

## 📌 Overview
A production-grade, decoupled microservice application designed to automate and explain complex credit underwriting decisions. This system leverages **Agentic AI Workflows** using LangGraph to orchestrate multiple specialized Large Language Models (LLMs) that evaluate loan applications, compute dynamic risk scores, and ensure strict regulatory compliance.

Designed to demonstrate enterprise-grade full-stack ML engineering, this architecture features an asynchronous FastAPI backend integrated with a highly polished, responsive Next.js frontend. 

## 🧠 Architecture & Multi-Agent Workflow
The "brain" of the application is built on LangGraph, utilizing **Llama 3.3 (via Groq)**. The workflow is divided into specialized nodes:

1. **Data & Market Agent:** Interfaces with the local SQLite database to retrieve historical credit data (CIBIL score, delinquencies, credit history length). 
2. **Risk Scoring Agent:** Evaluates the applicant's Debt-to-Income (DTI) ratio alongside macroeconomic factors to generate a dynamic risk score (0-1000).
3. **Compliance Agent:** Acts as a strict auditor. It ensures the decision respects Fair Lending Laws (ECOA), guaranteeing that protected classes (e.g., age) are not used negatively in the assessment.
4. **Coordinator Node (The Underwriter):** Synthesizes the outputs from all agents. It deterministically routes the application to a final state (`Approved`, `Escalated`, or `Declined`) and generates an Explainable AI (XAI) reasoning block for auditability.

## 💻 Tech Stack
* **Frontend:** Next.js (React), Tailwind CSS, Lucide Icons (Dark-mode, Enterprise SaaS UI)
* **Backend:** Python, FastAPI, Uvicorn
* **AI & Orchestration:** LangGraph, LangChain, Llama 3.3
* **Database:** SQLite (100 synthesized applicant profiles)

## 🚀 Local Development Setup

### 1. Clone the Repository
```bash
git clone [https://github.com/your-username/ai-credit-underwriter.git](https://github.com/your-username/ai-credit-underwriter.git)
cd ai-credit-underwriter