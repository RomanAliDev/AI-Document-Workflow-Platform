from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.database import sessionLocal
from app.services.ai_agent_service import process_question
from app.services.database_schema_service import get_database_schema

router = APIRouter(
    prefix="/ai",
    tags=["AI"]
)


def get_db():
    db = sessionLocal()

    try:
        yield db
    finally:
        db.close()


@router.post("/ask")
def ask_question(
    question: str,
    db: Session = Depends(get_db)
):
    try:
        schema = get_database_schema(db)

        return process_question(
            question=question,
            schema=schema,
            db=db
        )

    except ValueError as e:
        raise HTTPException(
            status_code=400,
            detail=str(e)
        )

    except Exception:
        raise HTTPException(
            status_code=500,
            detail="An error occurred while processing your question."
        )