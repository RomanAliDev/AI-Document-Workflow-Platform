from sqlalchemy.orm import Session

from app.services.semantic_search_service import semantic_search
from app.services.semantic_answer_service import generate_semantic_answer


def process_semantic_question(
    question: str,
    db: Session
):

    # User question → relevant chunks
    chunks = semantic_search(
        query=question,
        db=db,
        top_k=5
    )

    # Relevant chunks → final answer
    answer = generate_semantic_answer(
        question=question,
        chunks=chunks
    )

    return {
        "question": question,
        "chunks": chunks,
        "answer": answer
    }