import os
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfbase import pdfmetrics

def generate_pdf(content: str, output_path: str):
    """Generate a PDF file from the report content using reportlab"""
    print(f"Generating PDF at {output_path}")
    
    try:
        # Ensuring the directory setup
        os.makedirs(os.path.dirname(output_path), exist_ok=True)
        
        doc = SimpleDocTemplate(output_path, pagesize=letter)
        styles = getSampleStyleSheet()
        Story = []
        
        # NOTE: Handling Japanese text in ReportLab requires registering a Japanese font (like IPAexMincho)
        # For simplicity in this base implementation, we are using the default style which might 
        # not render Japanese characters perfectly if font isn't installed. 
        # In a production container, you'd add `COPY ipaexm.ttf /usr/share/fonts/` 
        # For MVP, we proceed with standard paragraph generation.
        
        style = styles["Normal"]
        
        # Very basic markdown parsing
        for line in content.split('\n'):
            if line.startswith('## '):
                Story.append(Paragraph(f"<b>{line[3:]}</b>", styles["Heading2"]))
            elif line.startswith('# '):
                Story.append(Paragraph(f"<b>{line[2:]}</b>", styles["Heading1"]))
            elif line.strip() == "":
                Story.append(Spacer(1, 12))
            else:
                Story.append(Paragraph(line, style))
        
        doc.build(Story)
        print("PDF generated successfully.")
    except Exception as e:
        print(f"Error generating PDF: {e}")
