from langchain_google_genai import ChatGoogleGenerativeAI
from agents.state import ResearchState

# llm is now initialized per node to support model selection

WRITER_PROMPTS = {
    "ja": """
あなたは日本のビジネス文書の専門家です。
以下の分析データに基づいて、プロフェッショナルなリサーチレポートを作成してください。

調査テーマ: {topic}
業界: {industry}

分析データ:
{analysis}

以下のルールを厳守してください：
1. 常に丁寧語・ビジネス敬語を使用すること
2. 各セクションは明確な見出しで区分すること（# 見出し1, ## 見出し2 など）
3. 以下の構成で記載すること:
   - エグゼクティブサマリー（300字以内）
   - 調査背景と目的
   - 市場概況
   - 競合プレイヤー分析
   - SWOT分析
   - キーインサイト
   - 推奨アクション（具体的かつ実行可能なもの）
""",
    "en": """
You are an expert in business documentation.
Based on the following analysis data, please create a professional research report.

Investigation Theme: {topic}
Industry: {industry}

Analysis Data:
{analysis}

Please strictly adhere to the following rules:
1. Always use professional business language.
2. Clearly separate each section with headings (# Heading 1, ## Heading 2, etc.)
3. Include the following sections:
   - Executive Summary (within 300 words)
   - Background and Objectives
   - Market Overview
   - Competitive Analysis
   - SWOT Analysis
   - Key Insights
   - Recommended Actions (concrete and actionable)
""",
    "zh": """
你是商业文档专家。
请根据以下分析数据编写一份专业的调研报告。

调查主题: {topic}
行业: {industry}

分析数据:
{analysis}

请严格遵守以下规则：
1. 始终使用专业的商务用语。
2. 使用清晰的标题区分各个部分（# 标题 1, ## 标题 2 等）。
3. 报告应包含以下部分：
   - 执行摘要（300 字以内）
   - 调查背景与目的
   - 市场概况
   - 竞争对手分析
   - SWOT 分析
   - 核心洞察
   - 建议措施（具体且具有可操作性）
"""
}

CITATION_HEADERS = {
    "ja": "## 参考文献・引用元",
    "en": "## References & Citations",
    "zh": "## 参考文献与引用来源"
}


async def writer_node(state: ResearchState) -> dict:
    model_name = state.get("model_name", "gemini-2.5-flash")
    language = state.get("language", "ja")
    
    print(f"Drafting the final report in {language} using {model_name}...")
    
    llm = ChatGoogleGenerativeAI(model=model_name)

    prompt_template = WRITER_PROMPTS.get(language, WRITER_PROMPTS["ja"])
    prompt = prompt_template.format(
        topic=state.get("topic"),
        industry=state.get("industry", "General"),
        analysis=state.get("analysis", {})
    )

    response = await llm.ainvoke(prompt)
    report_content = response.content

    # Append deduplicated citations
    citations = state.get("citations", [])
    if citations:
        header = CITATION_HEADERS.get(language, CITATION_HEADERS["ja"])
        report_content += f"\n\n{header}\n"
        seen = {}
        for item in citations:
            url = item.get("url", "")
            if url and url not in seen:
                seen[url] = item
        for idx, item in enumerate(seen.values(), 1):
            title = item.get("title", "リンク")
            url = item.get("url", "")
            report_content += f"{idx}. [{title}]({url})\n"

    return {"report_content": report_content}
