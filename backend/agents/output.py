from agents.state import ResearchState
from services.docx_service import generate_docx
from services.pdf_service import generate_pdf
from tools.tts import generate_audio_summary
import os


async def output_node(state: ResearchState) -> dict:
    print("Generating output files...")

    content = state.get("report_content", "Error generating report.")
    topic = state.get("topic", "report").replace(" ", "_").replace("/", "-")

    output_dir = "/app/outputs"
    os.makedirs(output_dir, exist_ok=True)

    base_path = os.path.join(output_dir, topic)

    docx_path = f"{base_path}.docx"
    generate_docx(content, docx_path)

    pdf_path = f"{base_path}.pdf"
    generate_pdf(content, pdf_path)

    # Audio summary from first 300 chars of executive summary
    summary_text = content[:300]
    audio_path = generate_audio_summary(summary_text)

    print(f"  → Outputs: docx={docx_path}, pdf={pdf_path}, audio={audio_path}")

    return {
        "output_files": {
            "docx": docx_path,
            "pdf": pdf_path,
            "audio": audio_path,
        }
    }
