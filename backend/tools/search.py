import os
import httpx
from typing import List, Dict

SERPER_API_KEY = os.getenv("SERPER_API_KEY")

async def search_web(query: str, num_results: int = 5) -> List[Dict]:
    """Execute a Google Search via Serper.dev API"""
    if not SERPER_API_KEY:
        print("Warning: SERPER_API_KEY is not set. Using mock search results.")
        return [{"title": f"Mock Title for {query}", "snippet": f"Mock snippet about {query}", "url": "http://example.com"}]
        
    url = "https://google.serper.dev/search"
    payload = {
        "q": query,
        "num": num_results
    }
    headers = {
        'X-API-KEY': SERPER_API_KEY,
        'Content-Type': 'application/json'
    }

    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(url, headers=headers, json=payload, timeout=10.0)
            response.raise_for_status()
            data = response.json()
            
            results = []
            for item in data.get("organic", [])[:num_results]:
                results.append({
                    "title": item.get("title", ""),
                    "snippet": item.get("snippet", ""),
                    "url": item.get("link", "")
                })
            return results
    except Exception as e:
        print(f"Web search error: {e}")
        return []
