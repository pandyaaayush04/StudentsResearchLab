import os
import asyncio
import socket
from urllib.parse import urlparse
from dotenv import load_dotenv

load_dotenv()
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
FRONTEND_URL = os.getenv("FRONTEND_URL", "https://students-research-lab-srl.vercel.app")

# Allow both production and local development origins
origins = [
    FRONTEND_URL,
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

if SUPABASE_URL:
    try:
        supabase_host = urlparse(SUPABASE_URL).hostname
        old_getaddrinfo = socket.getaddrinfo
        def new_getaddrinfo(*args, **kwargs):
            if args[0] and supabase_host in str(args[0]):
                return old_getaddrinfo('104.18.38.10', *args[1:], **kwargs)
            return old_getaddrinfo(*args, **kwargs)
        socket.getaddrinfo = new_getaddrinfo
        print(f"Applied DNS patch for {supabase_host} to bypass local DNS blocks")
    except Exception as e:
        print(f"Failed to apply DNS patch: {e}")

import httpx
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

if not SUPABASE_URL or not SUPABASE_KEY:
    print("WARNING: Supabase credentials not found. Make sure to set SUPABASE_URL and SUPABASE_KEY in .env")

# Headers for PostgREST API
HEADERS = {
    "apikey": SUPABASE_KEY,
    "Authorization": f"Bearer {SUPABASE_KEY}"
}

@app.get("/")
def read_root():
    return {"status": "StudentsResearchLab backend running"}

@app.get("/api/attendance")
async def get_all_attendance():
    try:
        async with httpx.AsyncClient() as client:
            res = await client.get(f"{SUPABASE_URL}/rest/v1/attendance?select=*", headers=HEADERS)
            res.raise_for_status()
            return {"records": res.json()}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/attendance/{student_id}")
async def get_student_attendance(student_id: int):
    try:
        async with httpx.AsyncClient() as client:
            res = await client.get(
                f"{SUPABASE_URL}/rest/v1/attendance?select=date,status&student_id=eq.{student_id}&order=date",
                headers=HEADERS
            )
            res.raise_for_status()
            return {"records": res.json()}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/attendance/{enrollment_no}/percentage")
async def get_student_attendance_percentage(enrollment_no: str):
    try:
        async with httpx.AsyncClient() as client:
            res = await client.get(
                f"{SUPABASE_URL}/rest/v1/attendance?select=date,hours&enrollment_no=eq.{enrollment_no}",
                headers=HEADERS
            )
            res.raise_for_status()
            records = res.json()
            
            if not records:
                return {"attendance_percentage": 0.0}
                
            daily_hours = {}
            for r in records:
                date = r.get("date")
                hours = r.get("hours") or 0
                if date:
                    daily_hours[date] = daily_hours.get(date, 0) + float(hours)
                    
            total_recorded_days = len(daily_hours)
            if total_recorded_days == 0:
                return {"attendance_percentage": 0.0}
                
            present_days = sum(1 for h in daily_hours.values() if h > 0)
            percentage = (present_days / total_recorded_days) * 100.0
            
            return {"attendance_percentage": round(percentage, 2)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/attendance/{enrollment_no}/srl_percentage")
async def get_student_srl_attendance_percentage(enrollment_no: str):
    try:
        async with httpx.AsyncClient() as client:
            # Fetch srl_sessions dates
            srl_res = await client.get(
                f"{SUPABASE_URL}/rest/v1/srl_sessions?select=session_date",
                headers=HEADERS
            )
            srl_res.raise_for_status()
            srl_records = srl_res.json()
            srl_dates = {r.get("session_date") for r in srl_records if r.get("session_date")}

            # Fetch attendance for the student
            att_res = await client.get(
                f"{SUPABASE_URL}/rest/v1/attendance?select=date,hours&enrollment_no=eq.{enrollment_no}",
                headers=HEADERS
            )
            att_res.raise_for_status()
            att_records = att_res.json()
            
            daily_hours = {}
            for r in att_records:
                date = r.get("date")
                if date and date in srl_dates:
                    hours = r.get("hours") or 0
                    daily_hours[date] = daily_hours.get(date, 0) + float(hours)
                    
            total_recorded_srl_sessions = len(daily_hours)
            if total_recorded_srl_sessions == 0:
                return {"srl_attendance_percentage": 0.0}
                
            present_sessions = sum(1 for h in daily_hours.values() if h > 0)
            percentage = (present_sessions / total_recorded_srl_sessions) * 100.0
            
            return {"srl_attendance_percentage": round(percentage, 2)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/srl_sessions")
async def get_all_srl_sessions():
    try:
        async with httpx.AsyncClient() as client:
            res = await client.get(f"{SUPABASE_URL}/rest/v1/srl_sessions?select=session_date", headers=HEADERS)
            res.raise_for_status()
            return {"records": res.json()}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/scores")
async def get_all_scores():
    try:
        async with httpx.AsyncClient() as client:
            res = await client.get(f"{SUPABASE_URL}/rest/v1/debate_scores?select=*", headers=HEADERS)
            res.raise_for_status()
            return {"records": res.json()}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/scores/{student_id}")
async def get_student_scores(student_id: int):
    raise HTTPException(status_code=501, detail="Not Implemented securely for debate_scores yet")

@app.get("/api/students")
async def get_students():
    try:
        async with httpx.AsyncClient() as client:
            scores_res = await client.get(f"{SUPABASE_URL}/rest/v1/debate_scores?select=*", headers=HEADERS)
            scores_res.raise_for_status()

            scores = scores_res.json()

            result = []
            for sc in scores:
                result.append({
                    "id": sc["enrollment_no"],
                    "enrollment_no": sc["enrollment_no"],
                    "name": sc.get("student_name", "Unknown Student"),
                    "attendance_percentage": 0.0,
                    "total_score": sc.get("total_points", 0)
                })
                
            return {"students": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/leaderboard")
async def get_leaderboard():
    """
    Aggregated leaderboard endpoint.
    Fetches attendance, SRL sessions, debate scores, and student names from Supabase,
    computes attendance %, SRL attendance %, and rankings server-side.
    """
    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            # Fetch all 4 data sources in parallel
            att_req = client.get(
                f"{SUPABASE_URL}/rest/v1/attendance?select=enrollment_no,date,hours",
                headers=HEADERS
            )
            srl_req = client.get(
                f"{SUPABASE_URL}/rest/v1/srl_sessions?select=session_date",
                headers=HEADERS
            )
            scores_req = client.get(
                f"{SUPABASE_URL}/rest/v1/debate_scores?select=enrollment_no,total_points",
                headers=HEADERS
            )
            details_req = client.get(
                f"{SUPABASE_URL}/rest/v1/students_details?select=enrollment_no,student_name",
                headers=HEADERS
            )

            att_res, srl_res, scores_res, details_res = await asyncio.gather(
                att_req, srl_req, scores_req, details_req
            )

            att_res.raise_for_status()
            srl_res.raise_for_status()
            scores_res.raise_for_status()
            details_res.raise_for_status()

            attendance_records = att_res.json()
            srl_records = srl_res.json()
            score_records = scores_res.json()
            detail_records = details_res.json()

        # --- Build lookup maps ---

        # Score map: { "ENROLLMENT_NO": total_points }
        score_map = {}
        for rec in score_records:
            en = str(rec.get("enrollment_no", "")).strip().upper()
            score_map[en] = rec.get("total_points", 0) or 0

        # Name map from students_details (preferred) and debate_scores (fallback)
        name_map = {}
        for rec in score_records:
            en = str(rec.get("enrollment_no", "")).strip().upper()
            name_map[en] = rec.get("student_name", "")
        for rec in detail_records:
            en = str(rec.get("enrollment_no", "")).strip().upper()
            if rec.get("student_name"):
                name_map[en] = rec["student_name"]

        # Attendance map: { "ENROLLMENT_NO": { date: total_hours } }
        attendance_map = {}
        for rec in attendance_records:
            en = str(rec.get("enrollment_no", "")).strip().upper()
            date = rec.get("date")
            hours = float(rec.get("hours") or 0)
            if en and date:
                if en not in attendance_map:
                    attendance_map[en] = {}
                attendance_map[en][date] = attendance_map[en].get(date, 0) + hours

        # SRL session dates set
        srl_dates = {r.get("session_date") for r in srl_records if r.get("session_date")}

        # --- Compute per-student metrics ---

        # Get all unique enrollment numbers from debate_scores (the leaderboard source)
        all_enrollments = set(score_map.keys())

        students = []
        for en in all_enrollments:
            score = score_map.get(en, 0)
            name = name_map.get(en, "Unknown Student")

            # Overall attendance %
            attendance_pct = 0
            srl_pct = 0
            daily = attendance_map.get(en, {})
            if daily:
                total_days = len(daily)
                present_days = sum(1 for h in daily.values() if h > 0)
                if total_days > 0:
                    attendance_pct = round((present_days / total_days) * 100)

                # SRL attendance % (only dates that are SRL session dates)
                srl_valid = {d: h for d, h in daily.items() if d in srl_dates}
                total_srl = len(srl_valid)
                if total_srl > 0:
                    present_srl = sum(1 for h in srl_valid.values() if h > 0)
                    srl_pct = round((present_srl / total_srl) * 100)

            students.append({
                "enrollment_no": en,
                "name": name,
                "score": score,
                "attendance": attendance_pct,
                "srlAttendance": srl_pct,
            })

        # Sort by score desc, then attendance desc
        students.sort(key=lambda s: (-s["score"], -s["attendance"]))

        # Assign ranks (sequential, no ties)
        for idx, student in enumerate(students):
            student["rank"] = idx + 1

        return {"leaderboard": students}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

