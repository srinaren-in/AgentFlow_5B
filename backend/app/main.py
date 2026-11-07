from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from contextlib import asynccontextmanager

from app.core.config import settings
from app.core.logging import logger
from app.database.session import engine
from app.database.base import Base
# Import models to ensure they register on Base.metadata
from app.models.workflow import WorkflowModel
from app.models.execution import ExecutionModel

from app.api.v1.workflows import router as workflows_router
from app.api.v1.executions import router as executions_router
from app.api.v1.providers import router as providers_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: create SQLite / PostgreSQL database tables
    logger.info("Initializing database schema...")
    Base.metadata.create_all(bind=engine)
    logger.info("Database schema initialized.")
    yield
    # Shutdown
    logger.info("Shutting down AgentFlow API engine.")

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Production-oriented execution engine and DAG orchestrator for AgentFlow visual AI builder.",
    lifespan=lifespan,
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Exception handlers
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled error on {request.method} {request.url}: {str(exc)}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal execution engine error", "error": str(exc)},
    )

# Routers
app.include_router(workflows_router, prefix="/api/workflows", tags=["Workflows"])
app.include_router(executions_router, prefix="/api/workflows", tags=["Workflow Executions"])
app.include_router(executions_router, prefix="/api/executions", tags=["Executions"])
app.include_router(providers_router, prefix="/api/providers", tags=["Providers"])

@app.get("/api/health", tags=["Health"])
def health_check():
    return {
        "status": "healthy",
        "service": "AgentFlow Engine",
        "version": settings.VERSION,
        "engine": "DAG Topological Orchestrator",
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="127.0.0.1", port=8000, reload=True)
