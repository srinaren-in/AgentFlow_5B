from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Dict, Any
import uuid
from datetime import datetime

from app.database.session import get_db
from app.models.workflow import WorkflowModel
from app.schemas.workflow import (
    WorkflowCreate,
    WorkflowUpdate,
    WorkflowDefinitionSchema,
    WorkflowValidationResponse,
)
from app.workflow.validator import validate_workflow

router = APIRouter()

@router.get("", response_model=List[Dict[str, Any]])
def list_workflows(db: Session = Depends(get_db)):
    workflows = db.query(WorkflowModel).order_by(WorkflowModel.updated_at.desc()).all()
    results = []
    for wf in workflows:
        flow_data = wf.flow_data or {}
        results.append({
            "id": wf.id,
            "name": wf.name,
            "description": wf.description,
            "status": wf.status,
            "projectId": wf.project_id,
            "tags": wf.tags or [],
            "nodeCount": len(flow_data.get("nodes", [])),
            "edgeCount": len(flow_data.get("edges", [])),
            "createdAt": wf.created_at.isoformat() if wf.created_at else "",
            "updatedAt": wf.updated_at.isoformat() if wf.updated_at else "",
            "flowData": flow_data,
        })
    return results

@router.post("", status_code=status.HTTP_201_CREATED)
def create_workflow(payload: WorkflowCreate, db: Session = Depends(get_db)):
    wf_id = f"wf-{uuid.uuid4().hex[:8]}"
    flow_data = payload.flowData.model_dump() if payload.flowData else {
        "id": wf_id,
        "name": payload.name,
        "description": payload.description,
        "nodes": [],
        "edges": [],
        "metadata": {"createdAt": datetime.utcnow().isoformat() + "Z"},
    }

    db_wf = WorkflowModel(
        id=wf_id,
        name=payload.name,
        description=payload.description or "",
        status="draft",
        project_id=payload.projectId,
        tags=payload.tags or [],
        flow_data=flow_data,
    )
    db.add(db_wf)
    db.commit()
    db.refresh(db_wf)

    return {
        "id": db_wf.id,
        "name": db_wf.name,
        "description": db_wf.description,
        "status": db_wf.status,
        "projectId": db_wf.project_id,
        "tags": db_wf.tags,
        "nodeCount": len(flow_data.get("nodes", [])),
        "edgeCount": len(flow_data.get("edges", [])),
        "createdAt": db_wf.created_at.isoformat(),
        "updatedAt": db_wf.updated_at.isoformat(),
        "flowData": flow_data,
    }

@router.get("/{id}")
def get_workflow(id: str, db: Session = Depends(get_db)):
    wf = db.query(WorkflowModel).filter(WorkflowModel.id == id).first()
    if not wf:
        raise HTTPException(status_code=404, detail=f"Workflow '{id}' not found.")
    flow_data = wf.flow_data or {}
    return {
        "id": wf.id,
        "name": wf.name,
        "description": wf.description,
        "status": wf.status,
        "projectId": wf.project_id,
        "tags": wf.tags or [],
        "nodeCount": len(flow_data.get("nodes", [])),
        "edgeCount": len(flow_data.get("edges", [])),
        "createdAt": wf.created_at.isoformat() if wf.created_at else "",
        "updatedAt": wf.updated_at.isoformat() if wf.updated_at else "",
        "flowData": flow_data,
    }

@router.put("/{id}")
def update_workflow(id: str, payload: WorkflowUpdate, db: Session = Depends(get_db)):
    wf = db.query(WorkflowModel).filter(WorkflowModel.id == id).first()
    if not wf:
        raise HTTPException(status_code=404, detail=f"Workflow '{id}' not found.")

    if payload.name is not None:
        wf.name = payload.name
    if payload.description is not None:
        wf.description = payload.description
    if payload.status is not None:
        wf.status = payload.status
    if payload.tags is not None:
        wf.tags = payload.tags
    if payload.flowData is not None:
        wf.flow_data = payload.flowData.model_dump()

    wf.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(wf)

    flow_data = wf.flow_data or {}
    return {
        "id": wf.id,
        "name": wf.name,
        "description": wf.description,
        "status": wf.status,
        "projectId": wf.project_id,
        "tags": wf.tags or [],
        "nodeCount": len(flow_data.get("nodes", [])),
        "edgeCount": len(flow_data.get("edges", [])),
        "createdAt": wf.created_at.isoformat(),
        "updatedAt": wf.updated_at.isoformat(),
        "flowData": flow_data,
    }

@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_workflow(id: str, db: Session = Depends(get_db)):
    wf = db.query(WorkflowModel).filter(WorkflowModel.id == id).first()
    if not wf:
        raise HTTPException(status_code=404, detail=f"Workflow '{id}' not found.")
    db.delete(wf)
    db.commit()
    return None

@router.post("/validate", response_model=WorkflowValidationResponse)
def validate_workflow_endpoint(workflow: WorkflowDefinitionSchema):
    return validate_workflow(workflow)
