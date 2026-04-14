import sqlite3
import os
import random

def setup_database():
    db_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), "underwriting.db")
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    cursor.execute('''
        CREATE TABLE IF NOT EXISTS credit_bureau (
            applicant_id TEXT PRIMARY KEY,
            bureau_score INTEGER,
            total_debt REAL,
            recent_delinquencies INTEGER,
            credit_history_years REAL
        )
    ''')
    cursor.execute('DELETE FROM credit_bureau')

    # CHANGED: Now generating 100 diverse applicant profiles
    sample_data = []
    for i in range(1, 101):
        app_id = f"APP-2026-{i:03d}"
        
        profile_type = random.choice(["excellent", "fair", "poor", "thin_file"])
        
        if profile_type == "excellent":
            score = random.randint(750, 900)
            debt = round(random.uniform(50000, 500000), 2)
            delinq = 0
            history = round(random.uniform(5.0, 15.0), 1)
        elif profile_type == "fair":
            score = random.randint(650, 749)
            debt = round(random.uniform(200000, 1000000), 2)
            delinq = random.randint(0, 1)
            history = round(random.uniform(3.0, 8.0), 1)
        elif profile_type == "poor":
            score = random.randint(300, 649)
            debt = round(random.uniform(800000, 2500000), 2)
            delinq = random.randint(1, 5)
            history = round(random.uniform(1.0, 6.0), 1)
        else: # thin_file
            score = random.randint(600, 700)
            debt = round(random.uniform(0, 50000), 2)
            delinq = 0
            history = round(random.uniform(0.5, 1.5), 1)

        sample_data.append((app_id, score, debt, delinq, history))

    cursor.executemany('''
        INSERT INTO credit_bureau (applicant_id, bureau_score, total_debt, recent_delinquencies, credit_history_years)
        VALUES (?, ?, ?, ?, ?)
    ''', sample_data)

    conn.commit()
    conn.close()
    print(f"✅ Production Database successfully populated with 100 INR records at {db_path}!")

if __name__ == "__main__":
    setup_database()