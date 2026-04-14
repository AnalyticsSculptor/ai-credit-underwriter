from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse

import json
import asyncio
import sqlite3
import os
from datetime import datetime

from schema import ApplicantInfo
from graph import underwriting_app
import uvicorn

app = FastAPI(title="AI Underwriter API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- 1. THE SILVER BULLET SERIALIZER ---
# This safely converts ANY AI object (like RiskAssessment) into JSON
def custom_serializer(obj):
    if hasattr(obj, 'model_dump'):
        return obj.model_dump()  # Pydantic v2
    if hasattr(obj, 'dict'):
        return obj.dict()        # Pydantic v1
    return str(obj)              # Fallback to string if completely unrecognized

# --- 2. Helper function to save the AI's decision ---
def save_audit_log(app_id: str, verdict: str, reasoning: str, full_state: dict):
    try:
        conn = sqlite3.connect("underwriting.db")
        cursor = conn.cursor()
        
        # Create the table if it doesn't exist yet
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS audit_logs (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                timestamp TEXT,
                applicant_id TEXT,
                verdict TEXT,
                reasoning TEXT,
                full_json TEXT
            )
        ''')
        
        # Insert the AI's final decision
        cursor.execute('''
            INSERT INTO audit_logs (timestamp, applicant_id, verdict, reasoning, full_json)
            VALUES (?, ?, ?, ?, ?)
        ''', (
            datetime.now().isoformat(),
            app_id,
            verdict,
            reasoning,
            # Use the custom serializer here too, so the DB doesn't crash!
            json.dumps(full_state, default=custom_serializer) 
        ))
        
        conn.commit()
        conn.close()
    except Exception as e:
        print(f"Database Logging Error: {e}")

@app.get("/")
async def root():
    return {"message": "AI Underwriter API is online and orchestrating agents."}

@app.post("/api/underwrite")
async def process_application(applicant: ApplicantInfo):
    async def event_generator():
        initial_state = {"applicant_info": applicant}
        
        try:
            # We use the .stream method to get updates as each node finishes
            async for event in underwriting_app.astream(initial_state, stream_mode="updates"):
                # Extract the node name and the data produced
                node_name = list(event.keys())[0]
                data = event[node_name]
                
                # Formulate a small "chunk" to send to the UI
                chunk = {
                    "node": node_name,
                    "data": data,
                    "status": "processing"
                }
                
                # THE FIX: Safely dump the JSON using the custom serializer
                safe_json = json.dumps(chunk, default=custom_serializer)
                yield f"data: {safe_json}\n\n"
                
                await asyncio.sleep(0.05) # Small delay for UI smoothness
                
        except Exception as e:
            # THE SAFETY NET: If the AI crashes, tell the UI so it stops spinning
            error_chunk = {"error": f"Agent Error: {str(e)}"}
            yield f"data: {json.dumps(error_chunk)}\n\n"

    return StreamingResponse(event_generator(), media_type="text/event-stream")

if __name__ == "__main__":
    # Get the port from the cloud provider, or default to 8000 locally
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port)