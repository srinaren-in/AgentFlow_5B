from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_health_check_endpoint():
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert data["service"] == "AgentFlow Engine"

def test_workflow_validation_endpoint():
    payload = {
        "id": "api_test_wf",
        "name": "API Test",
        "nodes": [
            {"id": "n1", "type": "inputNode", "data": {"nodeType": "inputNode", "label": "Start"}},
            {"id": "n2", "type": "outputNode", "data": {"nodeType": "outputNode", "label": "End"}},
        ],
        "edges": [
            {"id": "e1", "source": "n1", "target": "n2"},
        ],
    }
    response = client.post("/api/workflows/validate", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["is_valid"] is True
    assert data["execution_order"] == ["n1", "n2"]

def test_workflow_execution_endpoint():
    payload = {
        "workflow": {
            "id": "exec_api_test",
            "name": "Execution API Test",
            "nodes": [
                {
                    "id": "in_1",
                    "type": "inputNode",
                    "data": {"nodeType": "inputNode", "label": "Input", "config": {"variableName": "msg", "defaultValue": "Hello"}},
                },
                {
                    "id": "out_1",
                    "type": "outputNode",
                    "data": {"nodeType": "outputNode", "label": "Output", "config": {"responseKey": "echo"}},
                },
            ],
            "edges": [
                {"id": "e1", "source": "in_1", "target": "out_1", "sourceHandle": "output", "targetHandle": "input"},
            ],
        },
        "inputs": {"msg": "Hello AgentFlow!"},
    }

    response = client.post("/api/workflows/execute", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "completed"
    assert data["result"]["echo"] == "Hello AgentFlow!"
    assert "execution_id" in data

