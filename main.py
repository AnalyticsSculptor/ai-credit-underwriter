from fastapi.responses import StreamingResponse
import json
import asyncio
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware


from schema import ApplicantInfo
from graph import underwriting_app
import uvicorn
import sqlite3
import json
from datetime import datetime

app = FastAPI(title="AI Underwriter API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- NEW: Helper function to save the AI's decision ---
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
            json.dumps(full_state) # Save the whole dictionary as a string
        ))
        
        conn.commit()
        conn.close()
    except Exception as e:
        print(f"Database Logging Error: {e}")

@app.post("/api/underwrite")
async def process_application(applicant: ApplicantInfo):
    async def event_generator():
        initial_state = {"applicant_info": applicant}
        
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
            yield f"data: {json.dumps(chunk)}\n\n"
            await asyncio.sleep(0.1) # Small delay for UI smoothness

    return StreamingResponse(event_generator(), media_type="text/event-stream")

if __name__ == "__main__":
    import uvicorn
    import os
    # Get the port from the cloud provider, or default to 8000 locally
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port)