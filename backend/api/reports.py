import asyncio
import json
import uuid
from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from sqlalchemy.orm import Session

from api.auth import get_current_user
from celery_app import generate_report_task
from core.database import get_db
from models.report import Report
from models.user import User

router = APIRouter(prefix="/api/reports", tags=["reports"])


# ---------- Schemas ----------
class CreateReportRequest(BaseModel):
    topic: str
    industry: str = ""
    depth: str = "standard"  # "quick" | "standard" | "deep"
    language: str = "ja"    # "en" | "zh" | "ja"
    model_name: str = "gemini-2.5-flash"
    email_on_complete: bool = False


class ReportSummary(BaseModel):
    id: str
    topic: str
    status: str
    created_at: str


# ---------- Endpoints ----------
@router.post("/", status_code=status.HTTP_202_ACCEPTED)
def create_report(
    req: CreateReportRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    report = Report(
        id=uuid.uuid4(),
        user_id=current_user.id,
        title=req.topic,
        topic=req.topic,
        industry=req.industry,
        depth=req.depth,
        language=req.language,
        model_name=req.model_name,
        status="pending",
        agent_log={"current_step": "pending", "progress": 0, "message": "キューに追加されました"},
    )
    db.add(report)
    db.commit()
    db.refresh(report)

    # Fire off Celery task
    generate_report_task.delay(
        str(report.id),
        {
            "topic": req.topic,
            "industry": req.industry,
            "depth": req.depth,
            "language": req.language,
            "model_name": req.model_name,
            "user_email": current_user.email,
            "email_on_complete": req.email_on_complete,
        },
    )

    return {"report_id": str(report.id), "status": "pending"}


@router.get("/", response_model=List[ReportSummary])
def list_reports(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    reports = db.query(Report).filter(Report.user_id == current_user.id).order_by(Report.created_at.desc()).all()
    return [
        {
            "id": str(r.id),
            "topic": r.topic,
            "status": r.status,
            "created_at": str(r.created_at),
        }
        for r in reports
    ]


@router.get("/{report_id}")
def get_report(
    report_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    report = db.query(Report).filter(Report.id == report_id, Report.user_id == current_user.id).first()
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")

    return {
        "id": str(report.id),
        "topic": report.topic,
        "industry": report.industry,
        "depth": report.depth,
        "status": report.status,
        "content": report.content,
        "docx_url": report.docx_url,
        "pdf_url": report.pdf_url,
        "audio_url": report.audio_url,
        "created_at": str(report.created_at),
    }


@router.get("/{report_id}/stream")
def stream_report_progress(
    report_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """SSE real-time progress stream for frontend ProgressTracker"""

    async def event_generator():
        while True:
            # Fresh query each iteration to reflect latest DB state
            report = db.query(Report).filter(
                Report.id == report_id,
                Report.user_id == current_user.id,
            ).first()

            if not report:
                yield f"data: {json.dumps({'error': 'Report not found'})}\n\n"
                break

            log = report.agent_log or {}
            data = json.dumps(
                {
                    "step": log.get("current_step", "pending"),
                    "progress": log.get("progress", 0),
                    "message": log.get("message", "処理待ち..."),
                    "status": report.status,
                }
            )
            yield f"data: {data}\n\n"

            if report.status in ("done", "failed"):
                break

            await asyncio.sleep(2)

    return StreamingResponse(event_generator(), media_type="text/event-stream")


@router.delete("/{report_id}")
def delete_report(
    report_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    report = db.query(Report).filter(Report.id == report_id, Report.user_id == current_user.id).first()
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")
    
    db.delete(report)
    db.commit()
    return {"status": "deleted"}
