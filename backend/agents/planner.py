from langchain_google_genai import ChatGoogleGenerativeAI
import json
from agents.state import ResearchState

# llm is now initialized per node to support model selection

PLANNER_PROMPT = """
You are an expert research planner. Break down the given research topic into 3 specific, distinct subtopics that need to be researched to create a comprehensive report. 
Also, generate a precise web search query for each subtopic.

Topic: {topic}
Industry Strategy: {industry}
Depth Requirement: {depth}

Respond ONLY with a valid JSON object in this exact format:
{{
    "subtopics": ["subtopic 1", "subtopic 2", "subtopic 3"],
    "search_queries": ["search query 1", "search query 2", "search query 3"]
}}
"""

async def planner_node(state: ResearchState) -> dict:
    model_name = state.get("model_name", "gemini-2.5-flash")
    print(f"Planning for topic: {state.get('topic')} using {model_name}...")
    
    llm = ChatGoogleGenerativeAI(model=model_name)

    prompt = PLANNER_PROMPT.format(
        topic=state.get('topic'),
        industry=state.get('industry', 'General'),
        depth=state.get('depth', 'standard')
    )

    response = await llm.ainvoke(prompt)

    try:
        # response.content may be a string or a list of content parts
        raw = response.content
        if isinstance(raw, list):
            raw = "".join([p.get("text", "") if isinstance(p, dict) else str(p) for p in raw])
        content = raw.replace('```json', '').replace('```', '').strip()
        plan = json.loads(content)
        return {
            "subtopics": plan.get("subtopics", []),
            "search_queries": plan.get("search_queries", [])
        }
    except Exception as e:
        print(f"Error parsing planner output (raw={repr(response.content)[:200]}): {e}")
        return {
            "subtopics": [state.get('topic')],
            "search_queries": [state.get('topic')]
        }
