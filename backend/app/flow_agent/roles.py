import json
import time
from typing import Dict, Any, List, Optional
from pydantic import BaseModel, Field

from app.tools.registry import tool_registry
from app.providers.ollama_provider import OllamaProvider
from app.providers.gemini_provider import GeminiProvider

class NextStepPlan(BaseModel):
    analysis: str = Field(..., description="Analysis of current progress and what remains to be solved.")
    action: str = Field(..., description="'call_tool' to execute a tool, or 'finish' if ready to synthesize final answer.")
    tool_name: Optional[str] = Field(None, description="Name of tool if action is 'call_tool'.")
    tool_args: Dict[str, Any] = Field(default_factory=dict, description="Arguments for tool.")
    subgoal: str = Field(..., description="The concrete intermediate hypothesis or sub-goal of this step.")

class VerificationVerdict(BaseModel):
    is_valid: bool = Field(..., description="Whether the tool output is satisfactory and valid.")
    feedback: str = Field(..., description="Critical evaluation and actionable advice for the next turn.")
    confidence: float = Field(default=1.0, description="Verification confidence score (0.0 to 1.0).")

class PlannerRole:
    """
    Planner Role (inspired by lupantech/AgentFlow):
    Analyzes the query and past multi-turn trajectory to determine the next sub-goal and tool action.
    """
    def __init__(self, provider_name: str = "gemini", model_name: str = "gemini-2.0-flash"):
        self.provider_name = provider_name
        self.model_name = model_name
        self.provider = GeminiProvider() if provider_name == "gemini" else OllamaProvider()

    async def plan_step(
        self,
        query: str,
        trajectory: List[Dict[str, Any]],
        available_tools: List[str],
        turn_number: int,
        max_turns: int,
    ) -> NextStepPlan:
        tool_schemas = [
            {"name": t["name"], "description": t["description"], "schema": t.get("schema", {})}
            for t in tool_registry.list_tools()
            if t["name"] in available_tools
        ]

        trajectory_text = "No previous steps executed yet."
        if trajectory:
            trajectory_lines = []
            for t in trajectory:
                trajectory_lines.append(
                    f"--- Turn {t.get('turn')} ---\n"
                    f"Sub-goal: {t.get('subgoal')}\n"
                    f"Action: {t.get('action')}({json.dumps(t.get('args', {}))})\n"
                    f"Observation: {json.dumps(t.get('observation', ''))[:400]}\n"
                    f"Verifier Feedback: {t.get('verifier_feedback', 'None')}\n"
                    f"Verified Valid: {t.get('is_valid', False)}"
                )
            trajectory_text = "\n".join(trajectory_lines)

        system_prompt = (
            "You are the PLANNER in a 4-role AgentFlow cognitive architecture (Planner, Executor, Verifier, Generator).\n"
            "Your objective: Break down the user problem, inspect past observations and verifier feedback, "
            "and choose the next concrete action.\n\n"
            "Respond ONLY with a valid JSON object matching this schema:\n"
            "{\n"
            '  "analysis": "string explaining current trajectory and what needs to be solved next",\n'
            '  "action": "call_tool" OR "finish",\n'
            '  "tool_name": "name of selected tool (if action is call_tool)",\n'
            '  "tool_args": {"arg_key": "arg_value"},\n'
            '  "subgoal": "clear sentence describing the sub-goal of this step"\n'
            "}"
        )

        user_prompt = (
            f"User Objective: {query}\n\n"
            f"Turn: {turn_number} of {max_turns}\n\n"
            f"Available Tools:\n{json.dumps(tool_schemas, indent=2)}\n\n"
            f"Current Execution Trajectory:\n{trajectory_text}\n\n"
            "What is your next plan? Output JSON only."
        )

        try:
            resp = await self.provider.generate_response(
                prompt=user_prompt,
                system_prompt=system_prompt,
                model=self.model_name,
            )
            raw = resp.get("content", "").strip()
            # Clean markdown codeblocks if model wraps json
            if raw.startswith("```"):
                raw = raw.split("```")[1]
                if raw.startswith("json"):
                    raw = raw[4:]
            raw = raw.strip()
            data = json.loads(raw)
            return NextStepPlan(**data)
        except Exception:
            # Fallback if LLM output JSON parsing fails or on final turn
            if turn_number >= max_turns or not available_tools:
                return NextStepPlan(
                    analysis="Maximum turns reached or no tools left; ready to synthesize final answer.",
                    action="finish",
                    subgoal="Synthesize results into final response.",
                )
            first_tool = available_tools[0] if available_tools else "calculator"
            return NextStepPlan(
                analysis="Initial planning step.",
                action="call_tool",
                tool_name=first_tool,
                tool_args={"expression": "1 + 1"} if first_tool == "calculator" else {"query": query},
                subgoal=f"Execute {first_tool} for preliminary evidence.",
            )

class ExecutorRole:
    """
    Executor Role:
    Safely executes the chosen tool and returns observations.
    """
    async def execute(self, tool_name: str, tool_args: Dict[str, Any]) -> Dict[str, Any]:
        tool = tool_registry.get_tool(tool_name)
        if not tool:
            return {
                "success": False,
                "error": f"Tool '{tool_name}' not found in registry.",
                "output": None,
            }

        start = time.perf_counter()
        try:
            result = await tool.execute(**tool_args)
            duration_ms = (time.perf_counter() - start) * 1000
            return {
                "success": True,
                "output": result,
                "duration_ms": duration_ms,
            }
        except Exception as e:
            return {
                "success": False,
                "error": str(e),
                "output": None,
            }

class VerifierRole:
    """
    Verifier Role (inspired by lupantech/AgentFlow):
    Critiques tool observations against sub-goals to validate if step was successful or needs revision.
    """
    def __init__(self, provider_name: str = "gemini", model_name: str = "gemini-2.0-flash"):
        self.provider_name = provider_name
        self.model_name = model_name
        self.provider = GeminiProvider() if provider_name == "gemini" else OllamaProvider()

    async def verify(
        self,
        query: str,
        subgoal: str,
        tool_name: str,
        tool_args: Dict[str, Any],
        observation: Any,
    ) -> VerificationVerdict:
        # Quick deterministic heuristic check
        if isinstance(observation, dict) and observation.get("error"):
            return VerificationVerdict(
                is_valid=False,
                feedback=f"Execution error observed: {observation.get('error')}. Revision needed.",
                confidence=0.0,
            )

        system_prompt = (
            "You are the VERIFIER in the 4-role AgentFlow architecture.\n"
            "Your job is to critically evaluate whether the tool execution succeeded and verified the sub-goal.\n"
            "Respond ONLY with a valid JSON object matching:\n"
            "{\n"
            '  "is_valid": true OR false,\n'
            '  "feedback": "constructive explanation of whether the sub-goal was achieved or what went wrong",\n'
            '  "confidence": 0.0 to 1.0\n'
            "}"
        )

        user_prompt = (
            f"Overall Objective: {query}\n"
            f"Sub-goal: {subgoal}\n"
            f"Tool Executed: {tool_name} with args {json.dumps(tool_args)}\n"
            f"Observation Produced:\n{json.dumps(observation, default=str)[:600]}\n\n"
            "Does this observation satisfactorily meet or advance the sub-goal? Output JSON only."
        )

        try:
            resp = await self.provider.generate_response(
                prompt=user_prompt,
                system_prompt=system_prompt,
                model=self.model_name,
            )
            raw = resp.get("content", "").strip()
            if raw.startswith("```"):
                raw = raw.split("```")[1]
                if raw.startswith("json"):
                    raw = raw[4:]
            data = json.loads(raw.strip())
            return VerificationVerdict(**data)
        except Exception:
            # Deterministic heuristic fallback
            valid = observation is not None and not (isinstance(observation, dict) and "error" in observation)
            return VerificationVerdict(
                is_valid=valid,
                feedback="Verified based on successful exit code and payload existence." if valid else "Output empty or invalid.",
                confidence=0.8 if valid else 0.2,
            )

class GeneratorRole:
    """
    Generator Role (inspired by lupantech/AgentFlow):
    Synthesizes the verified trajectory, intermediate steps, and reasoning into a cohesive final solution.
    """
    def __init__(self, provider_name: str = "gemini", model_name: str = "gemini-2.0-flash"):
        self.provider_name = provider_name
        self.model_name = model_name
        self.provider = GeminiProvider() if provider_name == "gemini" else OllamaProvider()

    async def generate(
        self,
        query: str,
        trajectory: List[Dict[str, Any]],
        system_role: str = "AI Research Agent",
    ) -> str:
        trajectory_summary = []
        for t in trajectory:
            trajectory_summary.append(
                f"- Turn {t.get('turn')}: Sub-goal '{t.get('subgoal')}'\n"
                f"  Action: {t.get('action')}({json.dumps(t.get('args', {}))})\n"
                f"  Observation: {json.dumps(t.get('observation', ''))[:300]}\n"
                f"  Verified: {t.get('is_valid')} (Feedback: {t.get('verifier_feedback')})"
            )
        trajectory_text = "\n".join(trajectory_summary) if trajectory_summary else "Direct reasoning without tools."

        system_prompt = (
            f"You are the GENERATOR in the AgentFlow 4-role architecture, acting as {system_role}.\n"
            "Your objective: Synthesize all verified trajectory findings, data points, and steps into a "
            "comprehensive, accurate, and professional final response addressing the original query."
        )

        user_prompt = (
            f"Original Query: {query}\n\n"
            f"Verified Execution Trajectory & Evidence:\n{trajectory_text}\n\n"
            "Synthesize the complete, verified answer."
        )

        try:
            resp = await self.provider.generate_response(
                prompt=user_prompt,
                system_prompt=system_prompt,
                model=self.model_name,
            )
            return resp.get("content", "").strip() or "Task completed based on verified trajectory."
        except Exception as e:
            return f"Solution synthesized from verified trajectory: {trajectory_text} (Generator notice: {str(e)})"
