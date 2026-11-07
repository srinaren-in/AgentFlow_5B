import ast
import operator
import math
from typing import Any
from pydantic import BaseModel, Field
from app.tools.base import BaseTool

class CalculatorInput(BaseModel):
    expression: str = Field(
        ...,
        description="Mathematical expression to evaluate, e.g. '150 * 1.15' or 'sqrt(144) + 2^3'",
    )

class SafeMathEvaluator(ast.NodeVisitor):
    OPERATORS = {
        ast.Add: operator.add,
        ast.Sub: operator.sub,
        ast.Mult: operator.mul,
        ast.Div: operator.truediv,
        ast.FloorDiv: operator.floordiv,
        ast.Mod: operator.mod,
        ast.Pow: operator.pow,
        ast.USub: operator.neg,
        ast.UAdd: operator.pos,
    }

    FUNCTIONS = {
        "sqrt": math.sqrt,
        "sin": math.sin,
        "cos": math.cos,
        "tan": math.tan,
        "log": math.log,
        "abs": abs,
        "round": round,
        "floor": math.floor,
        "ceil": math.ceil,
    }

    def visit(self, node: ast.AST) -> Any:
        if isinstance(node, ast.Expression):
            return self.visit(node.body)
        elif isinstance(node, ast.Constant):
            if isinstance(node.value, (int, float)):
                return node.value
            raise ValueError(f"Non-numeric literal '{node.value}' is disallowed in calculator.")
        elif isinstance(node, ast.BinOp):
            left = self.visit(node.left)
            right = self.visit(node.right)
            op_type = type(node.op)
            if op_type in self.OPERATORS:
                return self.OPERATORS[op_type](left, right)
            raise ValueError(f"Unsupported binary operator: {op_type.__name__}")
        elif isinstance(node, ast.UnaryOp):
            operand = self.visit(node.operand)
            op_type = type(node.op)
            if op_type in self.OPERATORS:
                return self.OPERATORS[op_type](operand)
            raise ValueError(f"Unsupported unary operator: {op_type.__name__}")
        elif isinstance(node, ast.Call):
            if isinstance(node.func, ast.Name):
                fn_name = node.func.id.lower()
                if fn_name in self.FUNCTIONS:
                    args = [self.visit(arg) for arg in node.args]
                    return self.FUNCTIONS[fn_name](*args)
            raise ValueError(f"Function call '{ast.unparse(node.func)}' is not permitted in calculator.")
        else:
            raise ValueError(f"Expression type '{type(node).__name__}' is forbidden in safe calculator.")

class CalculatorTool(BaseTool):
    name = "calculator"
    description = "Useful for accurately performing mathematical calculations, arithmetic, formulas, and percentages."
    args_schema = CalculatorInput

    async def execute(self, expression: str, **kwargs) -> Any:
        clean_expr = expression.strip().replace("^", "**")
        try:
            tree = ast.parse(clean_expr, mode="eval")
            evaluator = SafeMathEvaluator()
            result = evaluator.visit(tree)
            return {"expression": expression, "result": result}
        except Exception as e:
            raise ValueError(f"Calculator evaluation failed for '{expression}': {str(e)}")

