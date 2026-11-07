import time
from typing import Dict, Any, List, Optional, Callable
from app.flow_agent.roles import (
    PlannerRole,
    ExecutorRole,
    VerifierRole,
    GeneratorRole,
    NextStepPlan,
    VerificationVerdict,
)

class FlowSolver:
    """
    Multi-turn AgentFlow Solver implementing the 4-Role Cognitive Loop
    (Planner -> Executor -> Verifier -> Generator) inspired by lupantech/AgentFlow.
    """
    def __init__(
        self,
        provider_name: str = "gemini",
        model_name: str = "gemini-2.0-flash",
        max_turns: int = 5,
        available_tools: Optional[List[str]] = None,
        system_role: str = "Autonomous Research Agent",
    ):
        self.provider_name = provider_name
        self.model_name = model_name
        self.max_turns = max(1, min(max_turns, 10))
        self.available_tools = available_tools or [
            "calculator",
            "wikipedia_search",
            "http_request",
            "python_interpreter",
        ]
        self.system_role = system_role

        # Instantiate 4 specialized roles
        self.planner = PlannerRole(provider_name=provider_name, model_name=model_name)
        self.executor = ExecutorRole()
        self.verifier = VerifierRole(provider_name=provider_name, model_name=model_name)
        self.generator = GeneratorRole(provider_name=provider_name, model_name=model_name)

    async def solve(
        self,
        query: str,
        log_callback: Optional[Callable[[str, str], None]] = None,
    ) -> Dict[str, Any]:
        """
        Execute multi-turn 4-role loop.
        """
        trajectory: List[Dict[str, Any]] = []
        start_time = time.perf_counter()

        def _log(level: str, msg: str):
            if log_callback:
                log_callback(level, msg)

        _log("INFO", f"Starting Flow-4Role Agent solver for query: '{query[:100]}...'")
        _log("INFO", f"Tools available: {', '.join(self.available_tools)}")

        finished_early = False

        for turn in range(1, self.max_turns + 1):
            _log("INFO", f"[Turn {turn}/{self.max_turns}] 🧭 PLANNER: Formulating sub-goal and next step...")

            # 1. PLANNER
            plan: NextStepPlan = await self.planner.plan_step(
                query=query,
                trajectory=trajectory,
                available_tools=self.available_tools,
                turn_number=turn,
                max_turns=self.max_turns,
            )

            _log("INFO", f"[Turn {turn}] Planner sub-goal: '{plan.subgoal}' (Action: {plan.action})")

            # Check if planner decided we have enough evidence to finish
            if plan.action == "finish" or not plan.tool_name:
                _log("INFO", f"[Turn {turn}] Planner decided task is complete. Proceeding to GENERATOR.")
                finished_early = True
                break

            # 2. EXECUTOR
            _log("INFO", f"[Turn {turn}] 🛠 EXECUTOR: Running '{plan.tool_name}' with args {plan.tool_args}...")
            exec_result = await self.executor.execute(plan.tool_name, plan.tool_args)
            observation = exec_result.get("output") if exec_result.get("success") else exec_result.get("error")

            _log("INFO", f"[Turn {turn}] Observation received (Success: {exec_result.get('success')})")

            # 3. VERIFIER
            _log("INFO", f"[Turn {turn}] ✓ VERIFIER: Critiquing output against sub-goal...")
            verdict: VerificationVerdict = await self.verifier.verify(
                query=query,
                subgoal=plan.subgoal,
                tool_name=plan.tool_name,
                tool_args=plan.tool_args,
                observation=observation,
            )

            _log(
                "INFO" if verdict.is_valid else "WARNING",
                f"[Turn {turn}] Verifier verdict: Valid={verdict.is_valid} (Confidence={verdict.confidence:.2f}) | Feedback: {verdict.feedback}",
            )

            # Record turn in trajectory
            step_record = {
                "turn": turn,
                "analysis": plan.analysis,
                "subgoal": plan.subgoal,
                "action": plan.tool_name,
                "args": plan.tool_args,
                "observation": observation,
                "is_valid": verdict.is_valid,
                "verifier_feedback": verdict.feedback,
                "confidence": verdict.confidence,
                "duration_ms": exec_result.get("duration_ms", 0),
            }
            trajectory.append(step_record)

        # 4. GENERATOR
        _log("INFO", "✍️ GENERATOR: Synthesizing final verified response from trajectory...")
        final_solution = await self.generator.generate(
            query=query,
            trajectory=trajectory,
            system_role=self.system_role,
        )

        total_duration_ms = (time.perf_counter() - start_time) * 1000
        _log("INFO", f"Flow Agent solver finished in {total_duration_ms:.1f}ms across {len(trajectory)} tool turns.")

        return {
            "status": "completed",
            "final_output": final_solution,
            "turns_executed": len(trajectory),
            "finished_early": finished_early,
            "trajectory": trajectory,
            "duration_ms": total_duration_ms,
        }
