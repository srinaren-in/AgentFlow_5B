from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Dict, Any
from datetime import datetime

from app.database.session import get_db
from app.models.workflow import WorkflowModel
from app.models.execution import ExecutionModel
from app.schemas.execution import ExecutionRequest, ExecutionResponse
from app.schemas.workflow import WorkflowDefinitionSchema
from app.workflow.engine import workflow_engine

router = APIRouter()

@router.post("/execute", response_model=ExecutionResponse)
async def execute_workflow(request: ExecutionRequest, db: Session = Depends(get_db)):
    workflow_def = request.workflow

    # If workflow definition not provided directly in body, fetch from DB by workflow_id
    if not workflow_def and request.workflow_id:
        db_wf = db.query(WorkflowModel).filter(WorkflowModel.id == request.workflow_id).first()
        if not db_wf:
            raise HTTPException(status_code=404, detail=f"Workflow '{request.workflow_id}' not found.")
        workflow_def = WorkflowDefinitionSchema(**db_wf.flow_data)

    if not workflow_def:
        raise HTTPException(
            status_code=400,
            detail="Either 'workflow' definition or valid 'workflow_id' must be provided in request payload.",
        )

    # Execute workflow via the engine
    exec_result = await workflow_engine.execute(
        workflow=workflow_def,
        inputs=request.inputs,
        timeout_seconds=request.timeout_seconds,
    )

    # Persist execution log & states to database
    try:
        db_execution = ExecutionModel(
            id=exec_result.execution_id,
            workflow_id=exec_result.workflow_id,
            status=exec_result.status,
            inputs=request.inputs,
            result=exec_result.result,
            node_states={k: v.model_dump() for k, v in exec_result.node_states.items()},
            logs=[log.model_dump() for log in exec_result.logs],
            error=exec_result.error,
            start_time=datetime.fromisoformat(exec_result.start_time.replace("Z", "")),
            end_time=datetime.fromisoformat(exec_result.end_time.replace("Z", "")) if exec_result.end_time else None,
            duration_ms=exec_result.duration_ms,
        )
        db.add(db_execution)
        db.commit()
    except Exception as e:
        # Don't fail the response if db write has an issue
        pass

    return exec_result

@router.post("/{workflow_id}/execute", response_model=ExecutionResponse)
async def execute_workflow_by_id(
    workflow_id: str,
    inputs: Dict[str, Any] = None,
    db: Session = Depends(get_db)
):
    db_wf = db.query(WorkflowModel).filter(WorkflowModel.id == workflow_id).first()
    if not db_wf:
        raise HTTPException(status_code=404, detail=f"Workflow '{workflow_id}' not found.")
    
    workflow_def = WorkflowDefinitionSchema(**db_wf.flow_data)
    request = ExecutionRequest(workflow_id=workflow_id, workflow=workflow_def, inputs=inputs or {})
    return await execute_workflow(request=request, db=db)

@router.get("", response_model=List[Dict[str, Any]])
def list_executions(limit: int = 20, db: Session = Depends(get_db)):
    executions = db.query(ExecutionModel).order_by(ExecutionModel.start_time.desc()).limit(limit).all()
    return [
        {
            "execution_id": ex.id,
            "workflow_id": ex.workflow_id,
            "status": ex.status,
            "error": ex.error,
            "start_time": ex.start_time.isoformat() if ex.start_time else "",
            "end_time": ex.end_time.isoformat() if ex.end_time else "",
            "duration_ms": ex.duration_ms,
            "node_count": len(ex.node_states or {}),
        }
        for ex in executions
    ]

@router.get("/{id}")
def get_execution_detail(id: str, db: Session = Depends(get_db)):
    ex = db.query(ExecutionModel).filter(ExecutionModel.id == id).first()
    if not ex:
        raise HTTPException(status_code=404, detail=f"Execution '{id}' not found.")
    return {
        "execution_id": ex.id,
        "workflow_id": ex.workflow_id,
        "status": ex.status,
        "inputs": ex.inputs,
        "result": ex.result,
        "node_states": ex.node_states,
        "logs": ex.logs,
        "error": ex.error,
        "start_time": ex.start_time.isoformat() if ex.start_time else "",
        "end_time": ex.end_time.isoformat() if ex.end_time else "",
        "duration_ms": ex.duration_ms,
    }
