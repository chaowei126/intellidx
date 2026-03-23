import os
import httpx
from typing import List, Dict
from datetime import datetime, timedelta

NEWS_API_KEY = os.getenv("NEWS_API_KEY")

async def fetch_news(query: str, days: int = 7) -> List[Dict]:
    """Fetch news articles from NewsAPI.org"""
    if not NEWS_API_KEY:
        print("Warning: NEWS_API_KEY is not set. Using mock news results.")
        return [{"title": f"Mock News for {query}", "snippet": f"Mock news snippet about {query}", "url": "http://news.example.com"}]
        
    url = f"https://newsapi.org/v2/everything"
    
    # Calculate date range
    from_date = (datetime.now() - timedelta(days=days)).strftime('%Y-%m-%d')
    
    params = {
        "q": query,
        "from": from_date,
        "sortBy": "relevancy",
        "apiKey": NEWS_API_KEY,
        "language": "en",   # Japanese ('ja') requires paid NewsAPI plan; use 'en' for free tier
    }
    
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(url, params=params, timeout=10.0)
            response.raise_for_status()
            data = response.json()
            
            results = []
            for item in data.get("articles", [])[:5]:
                results.append({
                    "title": item.get("title", ""),
                    "snippet": item.get("description", ""),
                    "url": item.get("url", "")
                })
            return results
    except Exception as e:
        print(f"News fetch error: {e}")
        return []
