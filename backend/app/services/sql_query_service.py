from sqlalchemy.orm import Session
from sqlalchemy import text


def validate_sql_query(query: str) -> str:

    # Remove extra whitespace
    normalized_query = query.strip().lower()

    # Only SELECT queries are allowed
    if not normalized_query.startswith("select"):
        raise ValueError("Only SELECT queries are allowed.")

    # Block dangerous SQL operations
    forbidden_keywords = [
        "insert",
        "update",
        "delete",
        "drop",
        "alter",
        "create",
        "truncate",
    ]

    for keyword in forbidden_keywords:
        if keyword in normalized_query:
            raise ValueError(
                f"Forbidden SQL operation detected: {keyword}"
            )

    return query.strip()


def execute_sql_query(
    query: str,
    db: Session
):

    # Validate SQL before execution
    validated_query = validate_sql_query(query)

    # Execute query
    result = db.execute(
        text(validated_query)
    )

    # Convert rows into dictionaries
    rows = result.mappings().all()

    return rows