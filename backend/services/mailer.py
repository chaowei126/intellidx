import os
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

SMTP_HOST = os.getenv("SMTP_HOST", "smtp.gmail.com")
SMTP_PORT = int(os.getenv("SMTP_PORT", "587"))
SMTP_USER = os.getenv("SMTP_USER", "")
SMTP_PASS = os.getenv("SMTP_PASS", "")
FROM_NAME = "IntelliDX"


def send_report_email(
    to: str,
    report_title: str,
    download_url: str,
    audio_url: str = "",
):
    """Send a notification email when a report is complete."""
    if not SMTP_USER or not SMTP_PASS:
        print("Warning: SMTP credentials not configured. Skipping email.")
        return

    msg = MIMEMultipart("alternative")
    msg["Subject"] = f"【IntelliDX】レポートが完成しました: {report_title}"
    msg["From"] = f"{FROM_NAME} <{SMTP_USER}>"
    msg["To"] = to

    html_body = f"""
    <html>
      <body style="font-family: Arial, sans-serif; padding: 20px;">
        <h2 style="color: #4A90E2;">📊 IntelliDX レポート完成のお知らせ</h2>
        <p>以下のレポートの作成が完了しました。</p>
        <table style="border-collapse: collapse; width: 100%; max-width: 600px;">
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd; background: #f9f9f9; font-weight: bold;">レポートタイトル</td>
            <td style="padding: 8px; border: 1px solid #ddd;">{report_title}</td>
          </tr>
        </table>
        <br>
        <a href="{download_url}" 
           style="background: #4A90E2; color: white; padding: 12px 24px; 
                  text-decoration: none; border-radius: 4px; display: inline-block; margin-right: 10px;">
          📄 Word 文書をダウンロード
        </a>
        {"" if not audio_url else f'<a href="{audio_url}" style="background: #27ae60; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">🔊 音声サマリーを聴く</a>'}
        <hr style="margin-top: 32px;">
        <p style="color: #888; font-size: 12px;">This email was sent by IntelliDX. Please do not reply.</p>
      </body>
    </html>
    """

    msg.attach(MIMEText(html_body, "html"))

    try:
        with smtplib.SMTP(SMTP_HOST, SMTP_PORT) as server:
            server.starttls()
            server.login(SMTP_USER, SMTP_PASS)
            server.sendmail(SMTP_USER, to, msg.as_string())
            print(f"Email sent to {to}")
    except Exception as e:
        print(f"Failed to send email: {e}")
