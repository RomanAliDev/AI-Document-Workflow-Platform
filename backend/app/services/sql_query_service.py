from sqlalchemy.orm import Session
from sqlalchemy import text
from datetime import date, datetime

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
    validated_query = validate_sql_query(query)

    result = db.execute(
        text(validated_query)
    )

    rows = result.mappings().all()

    converted_rows = []

    for row in rows:
        row_data = dict(row)

        for key, value in row_data.items():
            if isinstance(value, (date, datetime)):
                row_data[key] = value.isoformat()

        converted_rows.append(row_data)

    return converted_rows