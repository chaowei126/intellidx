import asyncio
from agents.state import ResearchState
from tools.search import search_web
from tools.news import fetch_news
from tools.citation import track_citation


async def research_single_topic(query: str) -> dict:
    """Execute asynchronous research for a single subtopic"""
    print(f"  Researching: {query}")

    results = await asyncio.gather(
        search_web(query, num_results=3),
        fetch_news(query, days=30),
        return_exceptions=True
    )

    findings, citations = [], []
    for result_set in results:
        if isinstance(result_set, Exception):
            print(f"  Tool error: {result_set}")
            continue

        for item in result_set:
            if not item.get("url"):
                continue
            citation = await track_citation(item["url"], item.get("title", ""))
            findings.append({
                "content": item.get("snippet", ""),
                "source_id": citation["id"]
            })
            citations.append(citation)

    return {"findings": findings, "citations": citations}


async def researcher_node(state: ResearchState) -> dict:
    """Parallel execution of all search queries"""
    queries = state.get("search_queries", [])
    if not queries:
        return {"error": "No search queries provided"}

    print(f"Executing {len(queries)} parallel research tasks...")

    tasks = [research_single_topic(q) for q in queries]
    results = await asyncio.gather(*tasks, return_exceptions=True)

    all_findings, all_citations = [], []
    for r in results:
        if not isinstance(r, Exception):
            all_findings.extend(r["findings"])
            all_citations.extend(r["citations"])

    print(f"  → {len(all_findings)} findings, {len(all_citations)} citations collected")
    return {"findings": all_findings, "citations": all_citations}
