"""Shared state definition for the LangGraph research pipeline."""
from typing import TypedDict, List, Annotated
import operator


class ResearchState(TypedDict):
    topic: str
    industry: str
    depth: str
    subtopics: List[str]
    search_queries: List[str]
    findings: Annotated[List[dict], operator.add]   # merged across parallel branches
    citations: Annotated[List[dict], operator.add]
    analysis: dict
    language: str
    model_name: str
    report_content: str
    quality_score: float
    output_files: dict
    error: str
