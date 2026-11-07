from typing import Dict, Any
from app.workflow.nodes.base import BaseNodeExecutor, ExecutionContext
from app.agent.graph import agent_workflow
from app.agent.state import AgentState
from app.flow_agent.solver import FlowSolver

class AgentNodeExecutor(BaseNodeExecutor):
    async def execute(
        self,
        node_id: str,
        inputs: Dict[str, Any],
        config: Dict[str, Any],
        context: ExecutionContext,
    ) -> Dict[str, Any]:
        role = config.get("role", "Autonomous AI Researcher")
        model = config.get("model", "gemini-2.0-flash")
        provider = config.get("provider", "gemini" if "gemini" in model else "ollama")
        max_steps = int(config.get("maxIterations", 5))
        tool_names = config.get("toolsEnabled", ["calculator", "wikipedia_search", "http_request", "python_interpreter"])
        architecture = config.get("architecture", "flow" if "4-role" in role.lower() or "flow" in role.lower() else "react")

        # Determine goal from inputs
        goal = inputs.get("goal") or inputs.get("input") or config.get("goal")
        if not goal and inputs:
            goal = str(next(iter(inputs.values())))

        if not goal:
            goal = "Solve user task using appropriate tools."

        # If architecture is 4-role Flow (inspired by lupantech/AgentFlow)
        if architecture in ["flow", "flow_4role", "planner_verifier"]:
            context.log("INFO", f"Initializing AgentFlow 4-Role Cognitive Engine (Planner->Executor->Verifier->Generator)", node_id)
            context.log("INFO", f"Model: {model} ({provider}) | Tools: {', '.join(tool_names)} | Max turns: {max_steps}", node_id)
            context.log("INFO", f"Agent Objective: '{goal}'", node_id)

            solver = FlowSolver(
                provider_name=provider,
                model_name=model,
                max_turns=max_steps,
                available_tools=tool_names,
                system_role=role,
            )

            result = await solver.solve(
                query=str(goal),
                log_callback=lambda level, msg: context.log(level, msg, node_id),
            )

            final_answer = result.get("final_output", "Task completed.")
            trajectory = result.get("trajectory", [])

            return {
                "result": final_answer,
                "final_output": final_answer,
                "architecture": "flow_4role",
                "trajectory": trajectory,
                "turns_executed": result.get("turns_executed", 0),
                "duration_ms": result.get("duration_ms", 0),
                "thought_steps": [
                    f"Turn {t['turn']} [{t['subgoal']}]: {t['action']}({t['args']}) -> Valid: {t['is_valid']}"
                    for t in trajectory
                ],
            }

        # Otherwise execute standard LangGraph ReAct loop
        context.log("INFO", f"Initializing LangGraph ReAct Agent (Role: {role}, Model: {model}, Max steps: {max_steps})", node_id)
        context.log("INFO", f"Agent Goal: '{goal}'", node_id)

        initial_state: AgentState = {
            "goal": str(goal),
            "system_instructions": f"You are a professional {role}. Use your tools strategically to answer questions accurately.",
            "messages": [],
            "current_step": 0,
            "max_steps": max_steps,
            "tool_names": tool_names,
            "tool_calls": [],
            "intermediate_steps": [],
            "final_output": None,
            "status": "running",
            "logs": [],
            "provider_name": provider,
            "model_name": model,
        }

        # Run compiled LangGraph state machine
        final_state = await agent_workflow.ainvoke(initial_state)

        # Log observations into workflow stream
        for step in final_state.get("intermediate_steps", []):
            context.log(
                "INFO",
                f"[Tool Call] Invoked '{step['action']}' with inputs: {step['args']} => Observation: {str(step['observation'])[:200]}",
                node_id,
            )

        final_answer = final_state.get("final_output") or "Agent completed execution."
        context.log("INFO", f"Agent completed with {len(final_state.get('intermediate_steps', []))} tool executions.", node_id)

        return {
            "result": final_answer,
            "final_output": final_answer,
            "architecture": "react",
            "intermediate_steps": final_state.get("intermediate_steps", []),
            "thought_steps": [
                f"Step {s['step']}: {s['action']}({s['args']}) -> {s['observation']}"
                for s in final_state.get("intermediate_steps", [])
            ],
        }
