from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.database import sessionLocal
from app.core.dependencies import get_current_user
from app.services.semantic_agent_service import process_semantic_question


router = APIRouter(
    prefix="/api/v1/semantic-search",
    tags=["Semantic Search"]
)


def get_db():
    db = sessionLocal()

    try:
        yield db
    finally:
        db.close()


@router.post("/")
def semantic_search(
    question: str,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    try:
        result = process_semantic_question(
            question=question,
            db=db
        )

        return {
            "question": question,
            "answer": result["answer"],
            "sources": [
                {
                    "chunk_id": chunk.id,
                    "document_id": chunk.document_id,
                    "content": chunk.content
                }
                for chunk in result["chunks"]
            ]
        }

    except Exception as error:
        db.rollback()

        print("SEMANTIC SEARCH ERROR TYPE:", type(error).__name__)
        print("SEMANTIC SEARCH ERROR:", error)

        raise Exception(str(error))