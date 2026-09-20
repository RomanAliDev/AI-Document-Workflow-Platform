from fastapi import APIRouter,Depends
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.database import sessionLocal
from app.models.chat_history import ChatHistory

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
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    schema = get_database_schema(db)

    result = process_question(
        question=question,
        schema=schema,
        db=db
    )

    chat_history = ChatHistory(
        user_id=current_user.id,
        question=question,
        answer=result["answer"],
        route=result["route"],
        sources=result.get("sources", []),
        results=result.get("results", [])
    )

    db.add(chat_history)
    db.commit()
    db.refresh(chat_history)

    return result

@router.get("/history")
def get_chat_history(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    history = (
        db.query(ChatHistory)
        .filter(ChatHistory.user_id == current_user.id)
        .order_by(ChatHistory.created_at.desc())
        .all()
    )

    return history