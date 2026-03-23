import os
import sys
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
import asyncio
from celery import Celery

from agents.graph import build_research_graph
from services.storage import upload_to_gcs
from services.mailer import send_report_email

REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379/0")

app = Celery("intellidx", broker=REDIS_URL, backend=REDIS_URL)

app.conf.update(
    task_serializer='json',
    accept_content=['json'],
    result_serializer='json',
    timezone='UTC',
    enable_utc=True,
)


def _update_report(db, report_id: str, **kwargs):
    """Helper to update report row in SQLAlchemy."""
    from core.database import SessionLocal
    from models.report import Report

    session = SessionLocal()
    try:
        report = session.query(Report).filter(Report.id == report_id).first()
        if report:
            for k, v in kwargs.items():
                setattr(report, k, v)
            session.commit()
    finally:
        session.close()


def _set_log(report_id: str, step: str, progress: int, message: str):
    _update_report(
        None,
        report_id,
        agent_log={"current_step": step, "progress": progress, "message": message},
    )


@app.task(bind=True, max_retries=3, default_retry_delay=60)
def generate_report_task(self, report_id: str, config: dict):
    """Main Celery task: runs the full LangGraph pipeline and saves results."""
    try:
        _set_log(report_id, "planning", 10, "📋 調査計画を策定中...")
        _update_report(None, report_id, status="processing")

        graph = build_research_graph()

        # LangGraph runs async, use asyncio.run inside Celery worker
        result = asyncio.run(
            graph.ainvoke({
                "topic": config["topic"],
                "industry": config.get("industry", ""),
                "depth": config.get("depth", "standard"),
                "language": config.get("language", "ja"),
                "model_name": config.get("model_name", "gemini-1.5-flash"),
                "subtopics": [],
                "search_queries": [],
                "findings": [],
                "citations": [],
                "analysis": {},
                "report_content": "",
                "quality_score": 0.0,
                "output_files": {},
                "error": "",
            })
        )

        _set_log(report_id, "uploading", 90, "☁️ ファイルをアップロード中...")

        # Upload / move outputs
        output_files = result.get("output_files", {})
        docx_url, pdf_url, audio_url = "", "", ""

        if output_files.get("docx"):
            docx_url = upload_to_gcs(output_files["docx"], report_id, "docx")
        if output_files.get("pdf"):
            pdf_url = upload_to_gcs(output_files["pdf"], report_id, "pdf")
        if output_files.get("audio"):
            audio_url = upload_to_gcs(output_files["audio"], report_id, "mp3")

        # Persist final result
        _update_report(
            None,
            report_id,
            status="done",
            content=result.get("report_content", ""),
            docx_url=docx_url,
            pdf_url=pdf_url,
            audio_url=audio_url,
            agent_log={"current_step": "done", "progress": 100, "message": "✅ レポートが完成しました"},
        )

        # Optional e-mail notification
        if config.get("email_on_complete") and config.get("user_email"):
            send_report_email(
                to=config["user_email"],
                report_title=config["topic"],
                download_url=docx_url,
                audio_url=audio_url,
            )

    except Exception as exc:
        _update_report(
            None,
            report_id,
            status="failed",
            agent_log={"current_step": "failed", "progress": 0, "message": f"❌ エラー: {str(exc)}"},
        )
        raise self.retry(exc=exc)
