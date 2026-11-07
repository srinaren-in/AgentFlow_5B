import asyncio
import sys
import json
from typing import Any
from pydantic import BaseModel, Field
from app.tools.base import BaseTool

class PythonSandboxInput(BaseModel):
    code: str = Field(
        ...,
        description="Python code to execute. Must set a variable named 'result' to return a value.",
    )

class PythonSandboxTool(BaseTool):
    name = "python_interpreter"
    description = "Executes pure Python data transformations and logic in an isolated subprocess. Set variable 'result' for output."
    args_schema = PythonSandboxInput

    async def execute(self, code: str, **kwargs) -> Any:
        # Wrap user code to capture 'result' and output JSON on stdout
        wrapper_script = f"""
import json, sys

result = None
try:
{chr(10).join('    ' + line for line in code.splitlines())}
    print("__AGENTFLOW_RESULT__" + json.dumps({{"result": result}}))
except Exception as e:
    print("__AGENTFLOW_ERROR__" + str(e), file=sys.stderr)
    sys.exit(1)
"""

        # Run in separate Python subprocess
        proc = await asyncio.create_subprocess_exec(
            sys.executable,
            "-c",
            wrapper_script,
            stdout=asyncio.subprocess.PIPE,
            stderr=asyncio.subprocess.PIPE,
        )

        try:
            stdout_bytes, stderr_bytes = await asyncio.wait_for(proc.communicate(), timeout=8.0)
        except asyncio.TimeoutError:
            try:
                proc.kill()
            except ProcessLookupError:
                pass
            raise TimeoutError("Python sandbox execution timed out after 8 seconds.")

        stdout = stdout_bytes.decode("utf-8", errors="replace")
        stderr = stderr_bytes.decode("utf-8", errors="replace")

        if proc.returncode != 0:
            err_line = stderr.replace("__AGENTFLOW_ERROR__", "").strip() or stdout.strip()
            raise RuntimeError(f"Python sandbox runtime error: {err_line}")

        for line in stdout.splitlines():
            if line.startswith("__AGENTFLOW_RESULT__"):
                payload = json.loads(line.replace("__AGENTFLOW_RESULT__", ""))
                return payload.get("result")

        return {"stdout": stdout.strip()}

