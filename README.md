# IntelliDX

DX推進を加速する産業特化型AI リサーチ＆レポート自動生成エンジン

## プロジェクト概要 (Project Overview)
IntelliDX は、日本企業の DX 推進部門が直面する「調査・分析・報告書作成」という反復的かつ時間集約的な業務を、Multi-Agent AI によって自動化するプラットフォームです。
「競合分析・市場調査・技術選定レポートを、3日間かかる作業から3分に圧縮するDX専用AIリサーチエンジン」

## 構成 (Architecture)
- **Frontend**: Next.js 14 (App Router) + TailwindCSS
- **Backend API**: FastAPI (Python 3.11)
- **Worker**: Celery + Redis
- **Database**: PostgreSQL
- **AI Engine**: LangGraph + Google Gemini

## ローカル起動方法 (Local Setup)

1. 環境変数の設定
プロジェクトルートに `.env` ファイルを作成してください。

```ini
GEMINI_API_KEY=your_gemini_api_key
SERPER_API_KEY=your_serper_api_key
NEWS_API_KEY=your_news_api_key
GCS_BUCKET=your_gcs_bucket_name
```

2. Docker Compose で起動
```bash
docker-compose up --build
```

3. アクセス
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs
