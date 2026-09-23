from sqlalchemy.orm import Session

from app.services.sql_generation_service import generate_sql_query
from app.services.sql_query_service import execute_sql_query
from app.services.sql_answer_service import generate_sql_answer


def process_sql_question(
    question: str,
    schema: str,
    db: Session
):

    # Natural language → SQL
    sql_query = generate_sql_query(
        question=question,
        schema=schema
    )

    # SQL → PostgreSQL
    results = execute_sql_query(
        query=sql_query,
        db=db
    )

    # Database results → Natural language answer
    answer = generate_sql_answer(
        question=question,
        results=results
    )

    return {
        "question": question,
        "sql": sql_query,
        "results": results,
        "answer": answer
    }

