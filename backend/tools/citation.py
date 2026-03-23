import uuid
from typing import Dict

# Simple in-memory citation mapping for the run
_citations_store = {}

async def track_citation(url: str, title: str) -> Dict:
    """Track and format citations for researched data"""
    if url in _citations_store:
        return _citations_store[url]
        
    citation_id = str(uuid.uuid4())[:8] # Short clean ID
    
    metadata = {
        "id": citation_id,
        "url": url,
        "title": title
    }
    
    _citations_store[url] = metadata
    return metadata
