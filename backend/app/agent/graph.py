import time
import json
from typing import Dict, Any, List
from langgraph.graph import StateGraph, END

from app.agent.state import AgentState, IntermediateStep
from app.tools.registry import tool_registry
from app.providers.ollama_provider import OllamaProvider
from app.providers.gemini_provider import GeminiProvider

ollama_provider = OllamaProvider()
gemini_provider = GeminiProvider()

async def model_reasoning_node(state: AgentState) -> Dict[str, Any]:
    """
    Reasoning Node: LLM inspects goal and past tool observations to decide next tool or final response.
    """
    provider_name = state.get("provider_name", "ollama")
    model_name = state.get("model_name", "qwen2.5:7b" if provider_name == "ollama" else "gemini-2.0-flash")
    goal = state.get("goal", "")
    system_instructions = state.get("system_instructions", "")
    intermediate_steps = state.get("intermediate_steps", [])
    tool_names = state.get("tool_names", ["calculator", "http_request", "python_interpreter"])
    step_num = state.get("current_step", 0)

    # Convert tool schemas for LLM
    tool_declarations = tool_registry.get_function_declarations(tool_names)

    # Build prompt context with past steps
    prompt_sections = [f"User Goal / Problem: {goal}"]
    if intermediate_steps:
        prompt_sections.append("\nPrevious Tool Actions & Observations:")
        for step in intermediate_steps:
            prompt_sections.append(
                f"Step {step['step']}: Action '{step['action']}' with inputs {json.dumps(step['args'])}"
                f"\nObservation: {json.dumps(step['observation'])}"
            )
        prompt_sections.append("\nBased on these observations, either call another tool or formulate your final answer.")

    full_prompt = "\n".join(prompt_sections)

    provider = gemini_provider if provider_name == "gemini" else ollama_provider
    start = time.perf_counter()

    try:
        response = await provider.generate_response(
            prompt=full_prompt,
            system_prompt=system_instructions or "You are an autonomous AI problem-solving agent with tool execution capabilities.",
            model=model_name,
            tools=tool_declarations if tool_declarations else None,
        )
    except Exception as e:
        # Fallback if provider error
        return {
            "status": "failed",
            "final_output": f"LLM reasoning error: {str(e)}",
            "tool_calls": [],
        }

    duration = (time.perf_counter() - start) * 1000
    content = response.get("content", "").strip()
    tool_calls = response.get("tool_calls", [])

    # If the model produced tool calls, queue them
    if tool_calls and step_num < state.get("max_steps", 5):
        return {
            "tool_calls": tool_calls,
            "final_output": None,
        }
    else:
        # If no tool calls (or max steps reached), content is the final synthesis
        final_answer = content or "Task complete with observations."
        return {
            "tool_calls": [],
            "final_output": final_answer,
            "status": "completed",
        }

async def tool_execution_node(state: AgentState) -> Dict[str, Any]:
    """
    Action & Observation Node: Executes queued tool calls and collects results.
    """
    tool_calls = state.get("tool_calls", [])
    intermediate_steps = list(state.get("intermediate_steps", []))
    current_step = state.get("current_step", 0)

    for tc in tool_calls:
        current_step += 1
        tool_name = tc.get("name")
        tool_args = tc.get("args") or {}
        tool = tool_registry.get_tool(tool_name)

        start = time.perf_counter()
        if not tool:
            observation = f"Error: Tool '{tool_name}' is not registered."
        else:
            try:
                observation = await tool.execute(**tool_args)
            except Exception as e:
                observation = f"Error executing '{tool_name}': {str(e)}"

        duration = (time.perf_counter() - start) * 1000

        step_record: IntermediateStep = {
            "step": current_step,
            "action": tool_name or "unknown",
            "args": tool_args,
            "observation": observation,
            "duration_ms": duration,
        }
        intermediate_steps.append(step_record)

    return {
        "current_step": current_step,
        "tool_calls": [],  # Clear executed tool calls
        "intermediate_steps": intermediate_steps,
    }

def should_continue(state: AgentState) -> str:
    """
    Conditional Routing Function:
    If tool_calls exist and current_step < max_steps -> 'tool_execution'
    Otherwise -> END
    """
    if state.get("status") == "failed":
        return END

    if state.get("final_output"):
        return END

    if state.get("tool_calls") and state.get("current_step", 0) < state.get("max_steps", 5):
        return "tool_execution"

    return END

def build_agent_graph() -> StateGraph:
    graph = StateGraph(AgentState)

    graph.add_node("reasoning", model_reasoning_node)
    graph.add_node("tool_execution", tool_execution_node)

    graph.set_entry_point("reasoning")

    graph.add_conditional_edges(
        "reasoning",
        should_continue,
        {
            "tool_execution": "tool_execution",
            END: END,
        },
    )

    graph.add_edge("tool_execution", "reasoning")

    return graph

# Compiled reusable LangGraph agent runner
agent_workflow = build_agent_graph().compile()
