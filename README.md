# IntelliDX

[English](README.md) | [中文](README_CN.md) | [日本語](README_JP.md)

An industry-specific AI Research & Report Generation engine designed to accelerate Digital Transformation (DX).

## Project Overview
IntelliDX is a platform that automates the repetitive and time-intensive "Research, Analysis, and Reporting" tasks faced by DX promotion departments in Japanese enterprises. 
**"Compress 3 days of competitive analysis, market research, and technology selection reporting into 3 minutes."**

## Core Features
- **Multi-Agent Research**: Powered by LangGraph, coordinating specialized agents (Planner, Researcher, Analyst, Writer).
- **Neo-Brutalist UI**: A distinctive, high-contrast professional interface designed for focus and impact.
- **Multi-Format Export**: Generate professional reports in DOCX, PDF, and SWOT analysis formats.
- **Internationalization (i18n)**: Native support for English, Japanese, and Chinese.

## Tech Stack
- **Frontend**: Next.js 14 (App Router) + TailwindCSS + Lucide Icons
- **Backend API**: FastAPI (Python 3.11)
- **Worker**: Celery + Redis
- **Database**: PostgreSQL
- **AI Engine**: LangGraph + Google Gemini 2.5/3.1

## Getting Started

### 1. Environment Configuration
Create a `.env` file in the project root:

```ini
GEMINI_API_KEY=your_gemini_api_key
SERPER_API_KEY=your_serper_api_key
NEWS_API_KEY=your_news_api_key
GCS_BUCKET=your_gcs_bucket_name
```

### 2. Run with Docker Compose
```bash
docker-compose up --build
```

### 3. Accessing the Platform
- **Frontend**: http://localhost:8080 (Proxied via Nginx)
- **Backend API**: http://localhost:8080/api/
- **Interactive Documentation**: http://localhost:8080/api/docs

## License
MIT License
