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
        if isinstance(result_set, Exception) or result_set is None:
            print(f"  Tool error or empty result: {result_set}")
            continue

        if not isinstance(result_set, list):
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
    iterations = state.get("iterations", 0) + 1
    
    if not queries:
        return {"error": "No search queries provided", "iterations": iterations}

    print(f"Executing {len(queries)} parallel research tasks (Iteration {iterations})...")

    # Add a small delay between iterations to avoid NewsAPI rate limits
    if iterations > 1:
        await asyncio.sleep(2.0)

    tasks = [research_single_topic(q) for q in queries]
    results = await asyncio.gather(*tasks, return_exceptions=True)

    all_findings, all_citations = [], []
    for r in results:
        if isinstance(r, dict):
            all_findings.extend(r.get("findings", []))
            all_citations.extend(r.get("citations", []))
        elif isinstance(r, Exception):
            print(f"  Topic research failed: {r}")

    print(f"  → {len(all_findings)} findings, {len(all_citations)} citations collected")
    return {
        "findings": all_findings, 
        "citations": all_citations,
        "iterations": iterations
    }
