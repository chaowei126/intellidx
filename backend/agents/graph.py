from langgraph.graph import StateGraph, END

from agents.state import ResearchState
from agents.planner import planner_node
from agents.researcher import researcher_node
from agents.analyst import analyst_node
from agents.writer import writer_node
from agents.output import output_node


def build_research_graph():
    graph = StateGraph(ResearchState)
    graph.add_node("planner",    planner_node)
    graph.add_node("researcher", researcher_node)
    graph.add_node("analyst",    analyst_node)
    graph.add_node("writer",     writer_node)
    graph.add_node("output",     output_node)

    graph.set_entry_point("planner")
    graph.add_edge("planner", "researcher")
    graph.add_edge("researcher", "analyst")
    graph.add_conditional_edges(
        "analyst",
        lambda s: "writer" if (s.get("quality_score", 0) >= 0.7 or s.get("iterations", 0) >= 3) else "researcher",
        {"writer": "writer", "researcher": "researcher"},
    )
    graph.add_edge("writer", "output")
    graph.add_edge("output", END)
    return graph.compile()
