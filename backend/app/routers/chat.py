from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.database import sessionLocal
from app.models.chat_history import ChatHistory
from app.models.chat_session import ChatSession

from app.core.dependencies import get_current_user
from app.services.database_schema_service import get_database_schema
from app.services.ai_agent_service import process_question


router = APIRouter(
    prefix="/api/v1/chat",
    tags=["Chat"]
)


def get_db():
    db = sessionLocal()

    try:
        yield db
    finally:
        db.close()


@router.post("/")
def chat(
    question: str,
    session_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    chat_session = (
        db.query(ChatSession)
        .filter(
            ChatSession.id == session_id,
            ChatSession.user_id == current_user.id
        )
        .first()
    )

    if not chat_session:
        raise HTTPException(
            status_code=404,
            detail="Chat session not found."
        )

    schema = get_database_schema(db)

    result = process_question(
        question=question,
        schema=schema,
        db=db
    )
    if chat_session.title == "New Chat":
        chat_session.title = question[:50].strip()

    if len(question) > 50:
        chat_session.title += "..."

    chat_history = ChatHistory(
        user_id=current_user.id,
        session_id=session_id,
        question=question,
        answer=result["answer"],
        route=result["route"],
        sources=result.get("sources", []),
        results=result.get("results", [])
    )

    db.add(chat_history)

    chat_session.updated_at = __import__("datetime").datetime.utcnow()

    db.commit()
    db.refresh(chat_history)

    return result



@router.post("/sessions")
def create_chat_session(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    chat_session = ChatSession(
        user_id=current_user.id,
        title="New Chat"
    )

    db.add(chat_session)
    db.commit()
    db.refresh(chat_session)

    return chat_session


@router.get("/sessions")
def get_chat_sessions(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    sessions = (
        db.query(ChatSession)
        .filter(
            ChatSession.user_id == current_user.id
        )
        .order_by(
            ChatSession.updated_at.desc()
        )
        .all()
    )

    return sessions


@router.get("/sessions/{session_id}")
def get_chat_session_messages(
    session_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    session = (
        db.query(ChatSession)
        .filter(
            ChatSession.id == session_id,
            ChatSession.user_id == current_user.id
        )
        .first()
    )

    if not session:
        raise HTTPException(
            status_code=404,
            detail="Chat session not found."
        )

    history = (
        db.query(ChatHistory)
        .filter(
            ChatHistory.session_id == session_id
        )
        .order_by(
            ChatHistory.created_at.asc()
        )
        .all()
    )

    return {
        "session": session,
        "messages": history
    }


@router.delete("/sessions/{session_id}")
def delete_chat_session(
    session_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    session = (
        db.query(ChatSession)
        .filter(
            ChatSession.id == session_id,
            ChatSession.user_id == current_user.id
        )
        .first()
    )

    if not session:
        raise HTTPException(
            status_code=404,
            detail="Chat session not found."
        )

    db.query(ChatHistory).filter(
        ChatHistory.session_id == session_id
    ).delete(
        synchronize_session=False
    )

    db.delete(session)
    db.commit()

    return {
        "message": "Chat deleted successfully."
    }