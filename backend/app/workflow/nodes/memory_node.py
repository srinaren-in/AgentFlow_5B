from typing import Dict, Any, List
from app.workflow.nodes.base import BaseNodeExecutor, ExecutionContext

# Global in-memory session store (or persistent in DB)
_SESSION_BUFFERS: Dict[str, List[Any]] = {}

class MemoryNodeExecutor(BaseNodeExecutor):
    async def execute(
        self,
        node_id: str,
        inputs: Dict[str, Any],
        config: Dict[str, Any],
        context: ExecutionContext,
    ) -> Dict[str, Any]:
        persist_key = config.get("persistKey", "default_session")
        window_size = int(config.get("windowSize", 10))

        if persist_key not in _SESSION_BUFFERS:
            _SESSION_BUFFERS[persist_key] = []

        # Store incoming message
        msg = inputs.get("message")
        if msg is not None:
            _SESSION_BUFFERS[persist_key].append(msg)
            # Maintain sliding window
            if len(_SESSION_BUFFERS[persist_key]) > window_size:
                _SESSION_BUFFERS[persist_key] = _SESSION_BUFFERS[persist_key][-window_size:]

        history = list(_SESSION_BUFFERS[persist_key])
        context.log("INFO", f"Memory buffer '{persist_key}' has {len(history)} turns", node_id)

        return {
            "history": history,
            "turns_count": len(history),
        }
