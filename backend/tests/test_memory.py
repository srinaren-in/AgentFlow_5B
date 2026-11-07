import pytest
from app.memory.manager import memory_manager
from app.database.session import engine
from app.database.base import Base

def test_persistent_memory_session():
    # Ensure tables exist
    Base.metadata.create_all(bind=engine)

    session_id = "test_sess_001"
    memory_manager.clear_session(session_id)

    # Append turns
    memory_manager.append_message(session_id, "user", "What is LangGraph?")
    memory_manager.append_message(session_id, "assistant", "LangGraph is a library for building stateful agent workflows.")

    # Retrieve
    messages = memory_manager.get_messages(session_id)
    assert len(messages) == 2
    assert messages[0]["role"] == "user"
    assert messages[1]["role"] == "assistant"
    assert "LangGraph" in messages[0]["content"]

    # Clear
    memory_manager.clear_session(session_id)
    assert len(memory_manager.get_messages(session_id)) == 0
