# IntelliDX

[English](README.md) | [中文](README_CN.md) | [日本語](README_JP.md)

DX推進を加速する産業特化型AI リサーチ＆レポート自動生成エンジン。

## プロジェクト概要
IntelliDX は、日本企業の DX 推進部門が直面する「調査・分析・報告書作成」という反復的かつ時間集約的な業務を、Multi-Agent AI によって自動化するプラットフォームです。
**「競合分析・市場調査・技術選定レポートを、3日間かかる作業から3分に圧縮するDX専用AIリサーチエンジン」**

## 主な機能
- **Multi-Agent リサーチ**: LangGraph を活用し、Planner, Researcher, Analyst, Writer の各エージェントが自律的に連携。
- **堅牢性エンジン (Robustness Engine)**: 無限ループ防止や API レート制限への自動対応機能を搭載。
- **Neo-Brutalist UI**: 汎用的な AI デザインとは一線を画す、視認性とインパクトを重視した独自の技術的 UI。
- **マルチフォーマット出力**: DOCX, PDF 形式のレポート生成に加え、SWOT分析等の構造化データに対応。
- **国際化対応 (i18n)**: 日本語、英語、中国語をネイティブサポート。

## UI ショーケース

| ログイン画面 | ダッシュボード | レポート分析 |
| :---: | :---: | :---: |
| ![ログイン](docs/screenshots/login.png) | ![ダッシュボード](docs/screenshots/dashboard.png) | ![レポート](docs/screenshots/report_detail.png) |

## 技術構成
- **Frontend**: Next.js 14 (App Router) + TailwindCSS
- **Backend API**: FastAPI (Python 3.11)
- **Worker**: Celery + Redis
- **Database**: PostgreSQL
- **AI Engine**: LangGraph + Google Gemini 2.5/3.1

### エージェントの堅牢性とエラー処理
外部 API の異常時でもシステムを安定させるための機能：
- **反復制限**: リサーチフェーズは最大 3 回に制限。十分な結果が得られない場合でも、無限ループせず次の工程へ進みます。
- **API クレジット検知**: 具体的な失敗理由（例：Serper 400 "クレジット不足"）をログに明示。
- **レート制限回避**: NewsAPI 等の 429 エラーを回避するため、リサーチ間に自動ディレイを挿入。

## ローカル起動方法

### 1. 環境変数の設定
プロジェクトルートに `.env` ファイルを作成してください。

```ini
GEMINI_API_KEY=your_gemini_api_key
SERPER_API_KEY=your_serper_api_key
NEWS_API_KEY=your_news_api_key
GCS_BUCKET=your_gcs_bucket_name
```

### 2. Docker Compose で起動
```bash
docker-compose up --build
```

### 3. アクセス
- **Frontend**: http://localhost:8080 (Nginx プロキシ経由)
- **Backend API**: http://localhost:8080/api/
- **API ドキュメント**: http://localhost:8080/api/docs

## ライセンス
MIT License
