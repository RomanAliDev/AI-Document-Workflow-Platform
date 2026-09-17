from sqlalchemy.orm import Session

from app.services.ai_router_service import route_question
from app.services.sql_agent_service import process_sql_question
from app.services.semantic_agent_service import process_semantic_question


def process_question(
    question: str,
    schema: str,
    db: Session
):

    route = route_question(question)

    if route == "SQL":

        result = process_sql_question(
            question=question,
            schema=schema,
            db=db
        )

        return {
            "route": "SQL",
            "question": question,
            "answer": result["answer"],
            "sql": result["sql"],
            "results": result["results"]
        }

    if route == "RAG":

        result = process_semantic_question(
            question=question,
            db=db
        )

        return {
        "route": "RAG",
        "question": question,
        "answer": result["answer"],
        "sources": [
            {
                "chunk_id": chunk.id,
                "content": chunk.content
            }
            for chunk in result["chunks"]
            ]
        }