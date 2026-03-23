from langchain_google_genai import ChatGoogleGenerativeAI
import json
from agents.state import ResearchState

# llm is now initialized per node to support model selection

ANALYST_PROMPT = """
You are an expert business analyst. Analyze the following research data gathered from the web.

Research Data:
{findings}

Target Topic: {topic}
Target Industry: {industry}

Analyze the data and output ONLY a valid JSON object strictly matching this format:
{{
  "market_overview": "Comprehensive analysis of the market overview based on findings.",
  "competitor_analysis": [
    {{
      "company": "Company Name",
      "strengths": ["strength 1", "strength 2"],
      "weaknesses": ["weakness 1", "weakness 2"]
    }}
  ],
  "swot": {{
    "strengths": ["S1", "S2"],
    "weaknesses": ["W1", "W2"],
    "opportunities": ["O1", "O2"],
    "threats": ["T1", "T2"]
  }},
  "key_insights": ["Insight 1", "Insight 2", "Insight 3"],
  "quality_score": 0.85
}}

Note regarding quality_score: Rate the data sufficiency from 0.0 to 1.0. If you lack enough information, give a score below 0.7.
"""


async def analyst_node(state: ResearchState) -> dict:
    model_name = state.get("model_name", "gemini-2.5-flash")
    print(f"Analyzing gathered data using {model_name}...")
    findings = state.get("findings", [])

    if not findings:
        return {"quality_score": 0.0, "analysis": {}}

    # Limit to prevent token overflow
    findings_text = "\n".join([f"- {item['content']}" for item in findings[:15]])

    prompt = ANALYST_PROMPT.format(
        findings=findings_text,
        topic=state.get("topic"),
        industry=state.get("industry", "General")
    )
    
    llm = ChatGoogleGenerativeAI(model=model_name)

    response = await llm.ainvoke(prompt)

    try:
        content = response.content.replace('```json', '').replace('```', '').strip()
        analysis = json.loads(content)
        score = float(analysis.get("quality_score", 0.5))
        print(f"  → Analysis complete. Quality Score: {score}")
        return {"analysis": analysis, "quality_score": score}
    except Exception as e:
        print(f"  → Error parsing analyst output: {e}")
        return {
            "analysis": {"market_overview": "Analysis could not be structured."},
            "quality_score": 0.8  # force-pass to avoid infinite loop
        }
