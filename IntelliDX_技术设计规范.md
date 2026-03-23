# IntelliDX — 技术设计规范文档 v1.0

> **项目定位：** 面向日本 DX 推进部门的产业特化型 AI 调研 & 报告自动生成引擎
> **一句话描述：** 将竞品分析、市场调研、技术选型报告的制作时间，从 3 天压缩到 15 分钟。

---

## 目录

1. [项目概述](#1-项目概述)
2. [功能需求](#2-功能需求)
3. [技术架构](#3-技术架构)
4. [数据库设计](#4-数据库设计)
5. [API 接口规范](#5-api-接口规范)
6. [现有项目整合](#6-现有项目整合)
7. [部署架构](#7-部署架构)
8. [核心代码实现指南](#8-核心代码实现指南)
9. [开发路线图](#9-开发路线图)
10. [面试包装策略](#10-面试包装策略)

---

## 1. 项目概述

### 1.1 基本信息

| 属性 | 内容 |
|------|------|
| 项目类型 | AI SaaS 平台 |
| 目标市场 | 日本 DX 推进部门 |
| 主要技术栈 | Python / FastAPI / Next.js |
| AI 框架 | LangGraph + Gemini API |
| 预计开发周期 | 6～8 周 |
| 文档语言 | 中文（技术规范）|

### 1.2 日本市场痛点分析

日本企业 DX 推进现场存在以下典型问题：

| # | 痛点 | 现状应对方式 | IntelliDX 解决方案 |
|---|------|------------|------------------|
| ① | 调研报告制作需要 3～5 天 | 由负责人手动进行网络调研 | Multi-Agent 并行自动采集与结构化 |
| ② | 引用来源管理繁琐 | 用 Excel 管理来源、手动复制粘贴 | 自动追踪全部来源并生成引用格式 |
| ③ | 格式不统一、质量参差不齐 | 每次手动修改模板 | 自动生成 Word / PDF / HTML（统一格式）|
| ④ | 竞争动态与行业资讯难以持续监控 | 由负责人每天手动检查 | 调度器自动按周 / 月发送报告 |
| ⑤ | ChatGPT 等通用 AI 不适合日语商务文档 | 输出内容需大量手动修改 | 针对敬语和商务文体进行系统提示优化 |

### 1.3 目标用户

**主要用户（Primary）**
- 大型制造业、金融、零售企业的 DX 推进部门
- IT 咨询公司、系统集成商
- 初创公司的业务拓展与市场团队

**次要用户（Secondary）**
- 经营企划部（高管周报）
- 研发部门（技术趋势调研）
- 销售部门（竞品对比资料自动生成）

---

## 2. 功能需求

### 2.1 核心功能清单

| 优先级 | 功能名称 | 功能说明 | 是否纳入 MVP | 依赖技术 |
|--------|---------|---------|------------|---------|
| P0 | 调研自动执行 | 主题输入 → 网络搜索 → 信息采集 → AI 分析全自动化 | ✅ 是 | LangGraph / Serper API |
| P0 | 结构化报告生成 | 将分析结果输出为 Word / PDF / HTML | ✅ 是 | python-docx / ReportLab |
| P0 | 引用来源自动管理 | 自动追踪所有信息来源并格式化 | ✅ 是 | 自定义 Citation Tool |
| P1 | AI 语音摘要 | 将报告摘要生成 MP3 音频 | ✅ 是 | Gemini TTS（复用现有项目）|
| P1 | 定时自动配送 | 按周 / 月将报告通过邮件发送 | ✅ 是 | Cloud Scheduler / SMTP |
| P1 | 多行业模板 | 制造 / 金融 / 零售行业专属模板 | ⬜ v2 | 模板引擎 |
| P2 | 团队共享看板 | 历史报告的搜索、共享与评论 | ⬜ v2 | PostgreSQL + React |
| P2 | PPT 自动生成 | 从报告生成高管汇报用幻灯片 | ⬜ v2 | python-pptx |

### 2.2 用户操作流程（MVP）

```
Step 1  登录 → 进入看板首页
Step 2  点击「新建报告」
Step 3  输入调研主题（例：「2025年日本电商竞品分析」）
Step 4  选择行业类别（制造业 / 金融 / 零售 / IT / 其他）
Step 5  选择调研深度（Quick: 5分钟 / Standard: 15分钟 / Deep: 30分钟）
Step 6  选择输出格式（Word / PDF / HTML / 语音摘要）
Step 7  点击「开始调研」→ 实时进度条显示当前处理阶段
Step 8  完成通知 → 预览确认 → 下载 or 邮件发送
Step 9  设置定期执行（可选）→ 按周/月自动生成并发送报告
```

### 2.3 报告结构规范

自动生成的报告包含以下章节：

| # | 章节名称 | 内容说明 | AI 生成方式 |
|---|---------|---------|-----------|
| 1 | 执行摘要 | 300字以内概述全文要点 | Writer Agent（摘要）|
| 2 | 调研背景与目的 | 梳理调研背景与调研范围 | Planner Agent 输出 |
| 3 | 市场概况 | 行业规模、增长率、主要趋势 | Researcher Agent + 图表 |
| 4 | 竞争对手分析 | 主要5家公司的产品、定价、战略对比 | Analyst Agent + 表格 |
| 5 | 技术趋势 | 关注技术、应用案例、未来预测 | Researcher Agent |
| 6 | SWOT 分析 | 针对目标企业/行业的 SWOT | Analyst Agent |
| 7 | 推荐行动方案 | 具体的下一步行动建议 | Writer Agent |
| 8 | 参考文献与引用来源 | 全部出处的 URL、获取时间、摘要 | Citation Tracker |

---

## 3. 技术架构

### 3.1 整体架构概览

```
┌─────────────────────────────────────────────────────────────┐
│                     前端层 (Frontend)                         │
│   Next.js 14 (App Router) + React Query + Zustand           │
│   TailwindCSS + shadcn/ui                                    │
│                                                              │
│  ┌────────────┐  ┌──────────────────┐  ┌─────────────────┐ │
│  │ 报告创建    │  │ 实时进度追踪      │  │ 报告预览/下载    │ │
│  │ 四步向导    │  │ (SSE 推送)       │  │ 历史看板        │ │
│  └─────┬──────┘  └────────┬─────────┘  └────────┬────────┘ │
└────────┼─────────────────┼──────────────────────┼──────────┘
         │    REST API / WebSocket / SSE            │
         ▼                                         ▼
┌─────────────────────────────────────────────────────────────┐
│                  后端 API 层 (Backend)                        │
│   FastAPI (Python 3.11) + JWT 认证 + Rate Limiter            │
│   Celery Worker + Redis 消息队列                              │
└──────────────────────────┬──────────────────────────────────┘
                           │
          ┌────────────────┼────────────────┐
          ▼                ▼                ▼
┌──────────────┐  ┌─────────────────┐  ┌────────────────┐
│  AI 引擎层    │  │   存储层         │  │  外部服务层     │
│  LangGraph   │  │  PostgreSQL     │  │  Serper API    │
│  Multi-Agent │  │  GCS (文件)     │  │  NewsAPI       │
│  Gemini API  │  │  Redis (缓存)   │  │  Gemini TTS    │
└──────────────┘  └─────────────────┘  │  SMTP 邮件     │
                                        └────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                  部署层 (GCP)                                  │
│   Cloud Run（容器自动扩缩） + Cloud Scheduler（定时任务）       │
│   Cloud Storage（文件持久化）+ Nginx（反向代理）               │
└─────────────────────────────────────────────────────────────┘
```

### 3.2 Multi-Agent 流水线详解

使用 LangGraph 构建的 4-Agent 状态机，每个 Agent 职责明确：

| Agent 名称 | 职责范围 | 使用工具 | 输出格式 |
|-----------|---------|---------|---------|
| 🗂️ **Planner Agent** | 将调研主题拆解为 5～10 个具体子话题；生成搜索查询；制定并行执行计划 | 仅 LLM | `JSON: { subtopics[], queries[] }` |
| 🔍 **Researcher Agent**（并行 ×3～5）| 负责各子话题的网络搜索、新闻 API 调用、引用追踪，并行采集原始数据 | search_web, fetch_news, extract_content, track_citation | `JSON: { findings[], citations[] }` |
| 🧠 **Analyst Agent** | 对全部 Researcher 输出进行交叉验证；检测矛盾；给出可信度评分；生成 SWOT 与洞察 | compare_sources, generate_chart_data | `JSON: { analysis{}, charts[], insights[] }` |
| ✍️ **Writer Agent** | 将结构化数据转换为商务日语报告；遵守敬语与格式规范；生成 Word/PDF 文件 | generate_docx, generate_pdf, call_tts | `File: report.docx / .pdf / .mp3` |

### 3.3 LangGraph 状态机流转

```
START
  │
  ▼
[planner_node]        ← 接收用户输入，拆解为子任务
  │
  ▼
[research_node]       ← 并行执行 (asyncio.gather)
  │  ├── researcher_1（子话题①）
  │  ├── researcher_2（子话题②）
  │  └── researcher_N（子话题N）
  │
  ▼
[analysis_node]       ← 整合全部 findings，进行分析
  │
  ├──[quality_check]  ← 质量分 < 0.7 → 返回 research_node 重试
  │
  ▼
[writer_node]         ← 生成报告文档
  │
  ▼
[output_node]         ← 文件保存 + TTS 生成 + 邮件配送
  │
  ▼
END
```

### 3.4 目录结构

```
intellidx/
├── frontend/                        # Next.js 14
│   ├── app/
│   │   ├── dashboard/               # 报告列表看板
│   │   ├── reports/[id]/            # 报告详情页
│   │   └── new/                     # 新建报告向导
│   ├── components/
│   │   ├── ReportWizard.tsx         # 四步输入表单
│   │   ├── ProgressTracker.tsx      # SSE 实时进度组件
│   │   └── ReportViewer.tsx         # 报告预览组件
│   └── lib/
│       ├── api.ts                   # 后端 API 客户端
│       └── types.ts                 # 共享类型定义
│
├── backend/                         # FastAPI
│   ├── main.py                      # 入口文件
│   ├── api/
│   │   ├── reports.py               # 报告 CRUD 接口
│   │   ├── auth.py                  # JWT 认证
│   │   └── health.py                # 健康检查
│   ├── agents/                      # LangGraph Agents
│   │   ├── graph.py                 # 状态机定义
│   │   ├── planner.py               # Planner Agent
│   │   ├── researcher.py            # Researcher Agent
│   │   ├── analyst.py               # Analyst Agent
│   │   └── writer.py                # Writer Agent
│   ├── tools/                       # Agent 工具集
│   │   ├── search.py                # Serper API 封装
│   │   ├── news.py                  # NewsAPI（复用 AI-News-Daily）
│   │   ├── citation.py              # 引用来源追踪器
│   │   ├── chart.py                 # 图表数据生成
│   │   └── tts.py                   # Gemini TTS（复用 Gemini-Batch-TTS）
│   ├── services/
│   │   ├── docx_service.py          # python-docx 文档生成
│   │   ├── pdf_service.py           # ReportLab PDF 生成
│   │   ├── storage.py               # GCS 云存储连接
│   │   └── mailer.py                # SMTP 邮件发送（复用 AI-News-Daily）
│   ├── models/                      # SQLAlchemy ORM
│   │   ├── user.py
│   │   └── report.py
│   ├── celery_app.py                # 异步任务定义
│   └── scheduler.py                 # Cloud Scheduler 钩子
│
├── docker/
│   ├── Dockerfile.frontend
│   ├── Dockerfile.backend
│   └── Dockerfile.worker            # Celery Worker 容器
│
├── docker-compose.yml               # 本地开发环境
├── docker-compose.prod.yml          # 生产环境
└── nginx/
    └── nginx.conf                   # 反向代理配置（复用现有项目）
```

---

## 4. 数据库设计

### 4.1 `users` 表

| 字段名 | 类型 | 约束 | 说明 |
|-------|------|------|------|
| id | UUID | PK, NOT NULL | 主键 |
| email | VARCHAR(255) | NOT NULL, UNIQUE | 登录邮箱 |
| hashed_password | VARCHAR(255) | NOT NULL | bcrypt 哈希 |
| display_name | VARCHAR(100) | NULL | 显示名称 |
| plan | ENUM(free, pro, enterprise) | NOT NULL | 订阅方案 |
| created_at | TIMESTAMPTZ | NOT NULL | 创建时间 |

### 4.2 `reports` 表

| 字段名 | 类型 | 约束 | 说明 |
|-------|------|------|------|
| id | UUID | PK, NOT NULL | 报告 ID |
| user_id | UUID | FK → users.id | 所属用户 |
| title | VARCHAR(500) | NOT NULL | 报告标题 |
| topic | TEXT | NOT NULL | 调研主题 |
| industry | VARCHAR(100) | NULL | 行业分类 |
| depth | ENUM(quick, standard, deep) | NOT NULL | 调研深度 |
| status | ENUM(pending, running, done, failed) | NOT NULL | 处理状态 |
| agent_log | JSONB | NULL | Agent 执行日志（调试用）|
| output_url | TEXT | NULL | GCS 文件 URL |
| audio_url | TEXT | NULL | TTS 音频 URL |
| created_at | TIMESTAMPTZ | NOT NULL | 创建时间 |
| completed_at | TIMESTAMPTZ | NULL | 完成时间 |

### 4.3 `citations` 表

| 字段名 | 类型 | 约束 | 说明 |
|-------|------|------|------|
| id | UUID | PK, NOT NULL | 引用 ID |
| report_id | UUID | FK → reports.id | 所属报告 |
| url | TEXT | NOT NULL | 来源 URL |
| title | VARCHAR(500) | NULL | 页面标题 |
| snippet | TEXT | NULL | 引用文字摘录 |
| fetched_at | TIMESTAMPTZ | NOT NULL | 获取时间 |
| reliability_score | FLOAT | NULL | 可信度评分（0～1）|

### 4.4 建表 SQL

```sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TYPE user_plan     AS ENUM ('free', 'pro', 'enterprise');
CREATE TYPE report_depth  AS ENUM ('quick', 'standard', 'deep');
CREATE TYPE report_status AS ENUM ('pending', 'running', 'done', 'failed');

CREATE TABLE users (
    id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email            VARCHAR(255) NOT NULL UNIQUE,
    hashed_password  VARCHAR(255) NOT NULL,
    display_name     VARCHAR(100),
    plan             user_plan NOT NULL DEFAULT 'free',
    created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE reports (
    id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id        UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title          VARCHAR(500) NOT NULL,
    topic          TEXT NOT NULL,
    industry       VARCHAR(100),
    depth          report_depth NOT NULL DEFAULT 'standard',
    status         report_status NOT NULL DEFAULT 'pending',
    agent_log      JSONB,
    output_url     TEXT,
    audio_url      TEXT,
    created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    completed_at   TIMESTAMPTZ
);

CREATE TABLE citations (
    id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    report_id         UUID NOT NULL REFERENCES reports(id) ON DELETE CASCADE,
    url               TEXT NOT NULL,
    title             VARCHAR(500),
    snippet           TEXT,
    fetched_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    reliability_score FLOAT CHECK (reliability_score BETWEEN 0 AND 1)
);

-- 常用查询索引
CREATE INDEX idx_reports_user_id  ON reports(user_id);
CREATE INDEX idx_reports_status   ON reports(status);
CREATE INDEX idx_citations_report ON citations(report_id);
```

---

## 5. API 接口规范

### 5.1 端点列表

| 方法 | 路径 | 说明 | 请求体 / 响应示例 |
|------|------|------|----------------|
| POST | `/auth/register` | 用户注册 | `{email, password}` → `{user_id, token}` |
| POST | `/auth/login` | 登录并颁发 JWT | `{email, password}` → `{access_token}` |
| POST | `/reports` | 新建报告，启动异步处理 | `{topic, industry, depth, formats[]}` → `{report_id, status}` |
| GET | `/reports` | 获取当前用户的报告列表 | `?page=1&limit=20` → `[{report}]` |
| GET | `/reports/{id}` | 获取报告详情与处理状态 | → `{report, agent_log, citations[]}` |
| GET | `/reports/{id}/download` | 下载报告文件 | `?format=docx\|pdf\|html` → file |
| DELETE | `/reports/{id}` | 删除报告 | → `{deleted: true}` |
| GET | `/reports/{id}/stream` | SSE 实时进度流 | `text/event-stream` |
| POST | `/schedules` | 注册定期报告任务 | `{report_config, cron, email}` → `{schedule_id}` |
| GET | `/schedules` | 获取定时任务列表 | → `[{schedule}]` |
| DELETE | `/schedules/{id}` | 删除定时任务 | → `{deleted: true}` |

### 5.2 SSE 进度事件规范

客户端连接 `/reports/{id}/stream` 后，实时接收如下格式的事件：

```
data: {"step": "planner",    "progress": 10, "message": "正在制定调研计划..."}
data: {"step": "researcher", "progress": 35, "message": "正在并行采集5个信息来源..."}
data: {"step": "researcher", "progress": 60, "message": "正在验证12条引用来源..."}
data: {"step": "analyst",    "progress": 75, "message": "正在分析数据并交叉验证..."}
data: {"step": "writer",     "progress": 90, "message": "正在生成 Word / PDF 文档..."}
data: {"step": "tts",        "progress": 95, "message": "正在生成语音摘要..."}
data: {"step": "done",       "progress": 100, "download_url": "https://storage.googleapis.com/..."}
```

### 5.3 Pydantic 模型定义

```python
# schemas/report.py
from pydantic import BaseModel
from typing import List, Optional
from enum import Enum

class ReportDepth(str, Enum):
    quick    = "quick"
    standard = "standard"
    deep     = "deep"

class OutputFormat(str, Enum):
    docx  = "docx"
    pdf   = "pdf"
    html  = "html"
    audio = "audio"

class CreateReportRequest(BaseModel):
    topic:    str
    industry: Optional[str] = None
    depth:    ReportDepth = ReportDepth.standard
    formats:  List[OutputFormat] = [OutputFormat.docx]
    email_on_complete: bool = False

class ReportResponse(BaseModel):
    id:           str
    title:        str
    status:       str
    output_url:   Optional[str]
    audio_url:    Optional[str]
    created_at:   str
    completed_at: Optional[str]
```

---

## 6. 现有项目整合

### 6.1 代码复用映射表

| 现有项目 | 复用模块 | 在 IntelliDX 中的用途 | 改动量 |
|---------|---------|---------------------|--------|
| **Gemini-Batch-TTS** | `tts_client.py`（Gemini TTS API 调用） | 迁移至 `tools/tts.py`，用于生成报告语音摘要 | ⭐ 极小 |
| **Gemini-Batch-TTS** | MP3 文件处理与 GCS 上传逻辑 | 集成至 `services/storage.py` | ⭐ 极小 |
| **AI-News-Daily** | 新闻抓取与过滤逻辑 | 作为 `tools/news.py`，嵌入 Researcher Agent 的搜索工具集 | ⭐⭐ 中等 |
| **AI-News-Daily** | 邮件发送与 HTML 模板模块 | 迁移至 `services/mailer.py`，用于报告配送邮件 | ⭐ 极小 |
| **AI-News-Daily** | 调度器配置（Cron / Cloud Scheduler）| 复用至 `scheduler.py`，支持按周/月自动执行 | ⭐⭐ 中等 |
| **Resume Platform** | Nginx 反向代理配置 | 在 `nginx/nginx.conf` 基础上追加 SSE 缓冲配置 | ⭐ 极小 |
| **Resume Platform** | Docker Compose 部署结构 | 扩展为多服务（增加 Redis + Celery Worker）| ⭐⭐ 中等 |

> 💡 **效率说明：** 通过复用现有项目，预计可节省 35～40% 的开发工时。TTS 模块与邮件配送是获益最大的两个部分，几乎无需重新开发。

### 6.2 Nginx SSE 配置补充

基于 Resume Platform 现有 Nginx 配置，需为 SSE 追加以下配置块：

```nginx
# nginx/nginx.conf — 在现有 location /api 块中追加
location /api/reports/stream {
    proxy_pass         http://backend:8000;
    proxy_http_version 1.1;

    # SSE 关键配置
    proxy_set_header   Connection '';
    proxy_buffering    off;          # 禁用缓冲，确保实时推送
    proxy_cache        off;
    proxy_read_timeout 3600s;        # 超时设为1小时
    chunked_transfer_encoding on;
}
```

---

## 7. 部署架构

### 7.1 GCP 生产环境配置

| GCP 服务 | 用途 | 配置参考 | 备注 |
|---------|------|---------|------|
| Cloud Run（Frontend）| Next.js 容器运行 | 1 vCPU / 512MB | 最小实例数: 0 |
| Cloud Run（Backend）| FastAPI 容器运行 | 2 vCPU / 1GB | 最小实例数: 1 |
| Cloud Run（Worker）| Celery 工作进程 | 2 vCPU / 2GB | AI 处理需较大内存 |
| Cloud SQL（PostgreSQL）| 主数据库 | db-f1-micro（开发）| 生产: db-n1-standard-1 |
| Cloud Storage | 报告文件存储 | 按量计费 | Lifecycle: 90天后删除 |
| Cloud Memorystore | Redis（Celery 消息代理）| 1GB | 同时作为 Celery 结果后端 |
| Cloud Scheduler | 定期报告执行 | Cron 任务 | 使用 UTC 时区设置 |
| Artifact Registry | Docker 镜像管理 | 按量计费 | 与 CI/CD 流水线集成 |

### 7.2 本地开发 docker-compose.yml

```yaml
version: "3.9"

x-backend-env: &backend-env
  DATABASE_URL: postgresql://user:pass@db:5432/intellidx
  REDIS_URL: redis://redis:6379/0
  GEMINI_API_KEY: ${GEMINI_API_KEY}
  SERPER_API_KEY: ${SERPER_API_KEY}
  NEWS_API_KEY: ${NEWS_API_KEY}
  GCS_BUCKET: ${GCS_BUCKET}
  SECRET_KEY: ${SECRET_KEY}

services:
  frontend:
    build:
      context: .
      dockerfile: docker/Dockerfile.frontend
    ports: ["3000:3000"]
    environment:
      NEXT_PUBLIC_API_URL: http://localhost:8000
    depends_on: [backend]

  backend:
    build:
      context: .
      dockerfile: docker/Dockerfile.backend
    ports: ["8000:8000"]
    environment: *backend-env
    depends_on: [db, redis]

  worker:
    build:
      context: .
      dockerfile: docker/Dockerfile.worker
    command: celery -A celery_app worker --loglevel=info --concurrency=4
    environment: *backend-env
    depends_on: [backend, redis]

  db:
    image: postgres:15
    environment:
      POSTGRES_DB: intellidx
      POSTGRES_USER: user
      POSTGRES_PASSWORD: pass
    volumes: ["pgdata:/var/lib/postgresql/data"]
    ports: ["5432:5432"]

  redis:
    image: redis:7-alpine
    ports: ["6379:6379"]

  nginx:
    image: nginx:alpine
    ports: ["80:80"]
    volumes: ["./nginx/nginx.conf:/etc/nginx/nginx.conf:ro"]
    depends_on: [frontend, backend]

volumes:
  pgdata:
```

### 7.3 环境变量清单（.env.example）

```bash
# AI 服务
GEMINI_API_KEY=your_gemini_api_key
SERPER_API_KEY=your_serper_api_key
NEWS_API_KEY=your_newsapi_key

# 数据库
DATABASE_URL=postgresql://user:pass@localhost:5432/intellidx

# Redis
REDIS_URL=redis://localhost:6379/0

# GCP
GCS_BUCKET=intellidx-reports
GOOGLE_APPLICATION_CREDENTIALS=/path/to/service-account.json

# 邮件
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your@email.com
SMTP_PASS=your_app_password

# 应用
SECRET_KEY=your_jwt_secret_key_here
ENVIRONMENT=development
```

---

## 8. 核心代码实现指南

### 8.1 LangGraph 状态机定义

```python
# agents/graph.py
from langgraph.graph import StateGraph, END
from typing import TypedDict, List, Annotated
import operator

class ResearchState(TypedDict):
    topic:          str
    industry:       str
    depth:          str
    subtopics:      List[str]
    search_queries: List[str]
    findings:       Annotated[List[dict], operator.add]  # 并行结果自动合并
    citations:      Annotated[List[dict], operator.add]
    analysis:       dict
    report_content: str
    quality_score:  float
    output_files:   dict
    error:          str

def build_research_graph():
    graph = StateGraph(ResearchState)

    graph.add_node("planner",    planner_node)
    graph.add_node("researcher", researcher_node)
    graph.add_node("analyst",    analyst_node)
    graph.add_node("writer",     writer_node)
    graph.add_node("output",     output_node)

    graph.set_entry_point("planner")
    graph.add_edge("planner",    "researcher")
    graph.add_edge("researcher", "analyst")
    graph.add_conditional_edges(
        "analyst",
        # 质量分低于 0.7 时，退回重新调研
        lambda s: "writer" if s["quality_score"] >= 0.7 else "researcher",
        {"writer": "writer", "researcher": "researcher"}
    )
    graph.add_edge("writer", "output")
    graph.add_edge("output", END)

    return graph.compile()
```

### 8.2 并行 Researcher Agent

```python
# agents/researcher.py
import asyncio
from langchain_google_genai import ChatGoogleGenerativeAI
from tools.search import search_web
from tools.news   import fetch_news       # 直接复用 AI-News-Daily 模块
from tools.citation import track_citation

async def research_single_topic(query: str) -> dict:
    """对单个子话题执行异步调研"""
    results = await asyncio.gather(
        search_web(query, num_results=5),
        fetch_news(query, days=30),       # 复用现有新闻抓取逻辑
        return_exceptions=True
    )
    findings, citations = [], []
    for r in results:
        if isinstance(r, Exception):
            continue
        for item in r:
            citation = await track_citation(item["url"], item["title"])
            findings.append({
                "content": item["snippet"],
                "source_id": citation["id"]
            })
            citations.append(citation)
    return {"findings": findings, "citations": citations}

async def researcher_node(state: ResearchState) -> ResearchState:
    """并行执行所有搜索查询"""
    tasks = [research_single_topic(q) for q in state["search_queries"]]
    results = await asyncio.gather(*tasks, return_exceptions=True)

    all_findings, all_citations = [], []
    for r in results:
        if not isinstance(r, Exception):
            all_findings.extend(r["findings"])
            all_citations.extend(r["citations"])

    return {**state, "findings": all_findings, "citations": all_citations}
```

### 8.3 Analyst Agent（含质量评分）

```python
# agents/analyst.py
from langchain_google_genai import ChatGoogleGenerativeAI
import json

llm = ChatGoogleGenerativeAI(model="gemini-1.5-pro")

ANALYST_PROMPT = """
あなたはビジネスアナリストです。以下の調査データを分析してください。

調査データ:
{findings}

以下をJSON形式で出力してください:
{{
  "market_overview": "市場概況の分析",
  "competitor_analysis": [{{
    "company": "社名",
    "strengths": ["強み"],
    "weaknesses": ["弱み"]
  }}],
  "swot": {{
    "strengths": [], "weaknesses": [],
    "opportunities": [], "threats": []
  }},
  "key_insights": ["重要洞察"],
  "quality_score": 0.0  // データの充足度 0.0〜1.0
}}
"""

async def analyst_node(state: ResearchState) -> ResearchState:
    findings_text = "\n".join([f["content"] for f in state["findings"]])
    response = await llm.ainvoke(
        ANALYST_PROMPT.format(findings=findings_text)
    )
    analysis = json.loads(response.content)
    return {
        **state,
        "analysis": analysis,
        "quality_score": analysis.get("quality_score", 0.5)
    }
```

### 8.4 Writer Agent（日语商务文体）

```python
# agents/writer.py
from services.docx_service import generate_docx
from services.pdf_service  import generate_pdf
from tools.tts import generate_audio_summary   # 复用 Gemini-Batch-TTS

WRITER_SYSTEM_PROMPT = """
あなたは日本のビジネス文書の専門家です。
以下のルールを厳守してください：
1. 常に丁寧語・ビジネス敬語を使用すること
2. 数値データは必ず引用元とともに記載すること
3. 各セクションは明確な見出しで区分すること
4. 推奨アクションは具体的かつ実行可能なものにすること
5. エグゼクティブサマリーは300字以内にまとめること
"""

async def writer_node(state: ResearchState) -> ResearchState:
    # 生成报告文本
    content = await generate_report_text(state["analysis"], state["citations"])

    # 生成各格式文档
    docx_path = await generate_docx(content, state["topic"])
    pdf_path  = await generate_pdf(content, state["topic"])

    # 生成语音摘要（复用 Gemini-Batch-TTS）
    audio_path = await generate_audio_summary(content["executive_summary"])

    return {
        **state,
        "report_content": content,
        "output_files": {
            "docx":  docx_path,
            "pdf":   pdf_path,
            "audio": audio_path
        }
    }
```

### 8.5 Celery 异步任务

```python
# celery_app.py
from celery import Celery
from agents.graph   import build_research_graph
from services.storage import upload_to_gcs
from services.mailer  import send_report_email   # 复用 AI-News-Daily 邮件模块
from db import update_report_status

app = Celery("intellidx", broker="redis://localhost:6379/0",
             backend="redis://localhost:6379/1")

@app.task(bind=True, max_retries=3, default_retry_delay=60)
def generate_report_task(self, report_id: str, config: dict):
    try:
        # 执行 LangGraph 流水线
        graph  = build_research_graph()
        result = graph.invoke({
            "topic":    config["topic"],
            "industry": config.get("industry", ""),
            "depth":    config["depth"],
        })

        # 上传至 GCS
        doc_url   = upload_to_gcs(result["output_files"]["docx"],  report_id, "docx")
        audio_url = upload_to_gcs(result["output_files"]["audio"], report_id, "audio")

        # 完成后发送邮件通知（可选）
        if config.get("email_on_complete"):
            send_report_email(
                to=config["user_email"],
                report_title=config["topic"],
                download_url=doc_url,
                audio_url=audio_url
            )

        update_report_status(report_id, "done", doc_url, audio_url)

    except Exception as exc:
        update_report_status(report_id, "failed", error=str(exc))
        raise self.retry(exc=exc)
```

### 8.6 FastAPI 报告接口（含 SSE）

```python
# api/reports.py
from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse
from celery_app import generate_report_task
from schemas.report import CreateReportRequest
import asyncio, json

router = APIRouter(prefix="/reports", tags=["reports"])

@router.post("/")
async def create_report(req: CreateReportRequest, user=Depends(get_current_user)):
    # 写入数据库，状态为 pending
    report = await db.create_report(user.id, req)
    # 异步投入 Celery 队列
    generate_report_task.delay(str(report.id), req.dict())
    return {"report_id": str(report.id), "status": "pending"}

@router.get("/{report_id}/stream")
async def stream_progress(report_id: str, user=Depends(get_current_user)):
    """SSE 实时进度推送"""
    async def event_generator():
        while True:
            report = await db.get_report(report_id)
            log    = report.agent_log or {}

            data = json.dumps({
                "step":     log.get("current_step", "pending"),
                "progress": log.get("progress", 0),
                "message":  log.get("message", "処理待ち...")
            })
            yield f"data: {data}\n\n"

            if report.status in ("done", "failed"):
                break
            await asyncio.sleep(2)

    return StreamingResponse(event_generator(), media_type="text/event-stream")
```

---

## 9. 开发路线图

### 9.1 分阶段计划（6～8 周）

| 周次 | 阶段 | 主要任务 | 完成标准 |
|-----|------|---------|---------|
| Week 1 | **基础建设** | Docker 环境搭建 / PostgreSQL 设计与建表 / FastAPI 骨架 / Nginx 配置复用 | 所有容器本地启动成功 |
| Week 2 | **Agent 开发①** | Planner Agent / Researcher Agent（Serper API 对接）/ AI-News-Daily 模块迁移 | 单一主题的搜索与采集正常运行 |
| Week 3 | **Agent 开发②** | Analyst Agent / Writer Agent / LangGraph 状态机集成 / 质量评分逻辑 | 端到端报告生成流程跑通 |
| Week 4 | **文档生成** | python-docx Word 生成 / 引用格式化 / Gemini TTS 语音摘要迁移 | Word、PDF、MP3 输出文件验证通过 |
| Week 5 | **API 层** | FastAPI 全部端点实现 / Celery 异步化 / SSE 进度流实现 | API 测试全部通过 |
| Week 6 | **前端开发** | Next.js UI（向导 / 看板 / 预览）/ JWT 认证联调 | 可通过浏览器操作并完整生成报告 |
| Week 7 | **部署上线** | GCP Cloud Run 部署 / Cloud Scheduler 配置 / 环境变量管理 / 域名绑定 | 可通过公网 URL 访问并正常使用 |
| Week 8 | **收尾打磨** | README 中英双语 / Demo 视频录制 / Qiita 技术文章撰写 / Portfolio 整理 | GitHub 公开 + Demo URL 上线 |

### 9.2 技术栈版本锁定

```
# requirements.txt
fastapi==0.111.0
uvicorn==0.29.0
sqlalchemy==2.0.30
alembic==1.13.1
celery==5.4.0
redis==5.0.4
langgraph==0.1.5
langchain-google-genai==1.0.5
python-docx==1.1.2
reportlab==4.2.2
pydantic==2.7.1
python-jose==3.3.0        # JWT
passlib==1.7.4            # 密码哈希
httpx==0.27.0
google-cloud-storage==2.17.0
```

---

## 10. 面试包装策略

### 10.1 简历英文描述

```
• Architected IntelliDX, an AI-powered research automation SaaS using LangGraph 
  multi-agent orchestration (Planner → Researcher → Analyst → Writer) deployed on GCP Cloud Run.

• Implemented a parallel async web research pipeline (asyncio.gather) with automatic 
  citation tracking and quality scoring, reducing report creation from 3 days to ~15 minutes.

• Integrated Gemini TTS for audio report summaries and reused existing news-aggregation 
  and email-delivery modules, achieving ~40% code reuse and demonstrating systems thinking.

• Designed a Celery + Redis async task queue with SSE real-time progress streaming, 
  providing responsive UX for long-running AI workloads.

• Containerized the full stack (Next.js + FastAPI + PostgreSQL + Celery Worker) with Docker 
  and deployed to GCP Cloud Run with automated scheduled delivery via Cloud Scheduler.
```

### 10.2 面试常见问题参考答案

| 面试问题 | 要点回答方向 |
|---------|------------|
| 为什么选择 LangGraph？ | 可以用状态机显式管理 Agent 间依赖关系与条件分支（质量不足时重新触发调研循环）。对比 AutoGen 和 CrewAI 后，LangGraph 在复杂流程控制上最为适合。 |
| 如何应对 AI 幻觉问题？ | ① Citation Tracker 追踪全部来源并显示引用出处；② Analyst Agent 进行交叉验证（多来源矛盾检测）；③ 质量评分低于 0.7 时触发 Researcher 重新调研的反馈循环。 |
| 并行处理如何实现？ | 使用 `asyncio.gather()` 并行执行多个 Researcher Agent；通过 Celery Worker 将 AI 主处理流程从主进程中解耦；用 SSE 向前端实时推送进度。 |
| 如何体现现有项目的价值？ | AI-News-Daily 的新闻采集与邮件发送模块直接复用；Gemini-Batch-TTS 的语音生成逻辑转用于音频摘要功能；Resume Platform 的 Nginx 配置扩展为支持 SSE。合计节省约 40% 工时。 |
| 对日本市场有何特别考量？ | 日语商务文档的敬语适配；面向日本企业「エビデンス重視」文化的引用来源管理；针对「DX推進部」这一日本特有组织结构的功能设计；后续规划按行业（制造/金融）的专属模板。 |
| 如果系统扩展到多租户怎么设计？ | 在 users 表追加 `organization_id` 字段，报告表做行级隔离；Celery 任务队列按租户优先级分队列；存储层用 GCS 目录前缀隔离文件。 |

### 10.3 GitHub README 结构建议

```markdown
# IntelliDX

> AI-powered research & report generation engine for Japan's DX teams

## 🎯 What it does
（一段英文简介，附 Demo GIF）

## 🏗️ Architecture
（架构图）

## 🤖 Multi-Agent Pipeline
（Agent 流程图）

## 🚀 Quick Start
（Docker Compose 启动命令）

## 📁 Project Structure
（目录结构）

## 🔗 Live Demo
（部署链接）

## 📝 Technical Article
（Qiita/Zenn 文章链接）
```

---

> **结语**
> 
> 这份规范文档即可直接交给 AI（Claude / GPT-4）逐模块生成代码。
> 建议从 `agents/graph.py` 开始，按照 Planner → Researcher → Analyst → Writer 的顺序逐步构建，每个 Agent 完成后即可独立测试。
> 
> *代码是世界通用语言，19年的工程经验，一定会被看见。*
