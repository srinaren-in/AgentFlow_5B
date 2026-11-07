from abc import ABC, abstractmethod
from typing import Dict, Any, List
from datetime import datetime, timezone

class ExecutionContext:
    def __init__(self, inputs: Dict[str, Any], timeout_seconds: int = 60):
        self.inputs = inputs
        self.timeout_seconds = timeout_seconds
        self.logs: List[Dict[str, Any]] = []
        self.node_outputs: Dict[str, Dict[str, Any]] = {}
        self.node_states: Dict[str, Dict[str, Any]] = {}
        self.active_branches: set = set()

    def log(self, level: str, message: str, node_id: str = None):
        self.logs.append({
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "level": level,
            "message": message,
            "node_id": node_id,
        })

class BaseNodeExecutor(ABC):
    @abstractmethod
    async def execute(
        self,
        node_id: str,
        inputs: Dict[str, Any],
        config: Dict[str, Any],
        context: ExecutionContext,
    ) -> Dict[str, Any]:
        """
        Executes a single node.
        Returns a dictionary of output values keyed by handle name or variable.
        """
        pass
