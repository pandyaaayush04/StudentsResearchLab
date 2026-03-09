import os
import asyncio
import httpx
from dotenv import load_dotenv

load_dotenv("backend/.env")
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

HEADERS = {
    "apikey": SUPABASE_KEY,
    "Authorization": f"Bearer {SUPABASE_KEY}"
}

async def test():
    async with httpx.AsyncClient() as client:
        urls = [
            f"{SUPABASE_URL}/rest/v1/attendance?select=enrollment_no,date,hours",
            f"{SUPABASE_URL}/rest/v1/srl_sessions?select=session_date",
            f"{SUPABASE_URL}/rest/v1/debate_scores?select=enrollment_no,student_name,total_points",
            f"{SUPABASE_URL}/rest/v1/students_details?select=enrollment_no,student_name",
        ]
        for url in urls:
            res = await client.get(url, headers=HEADERS)
            print(f"{url} -> {res.status_code}")
            if res.status_code >= 400:
                print(res.text)

asyncio.run(test())
