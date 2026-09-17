from sqlalchemy import inspect
from sqlalchemy.orm import Session


EXCLUDED_COLUMNS = {
    "embedding",
     "password",
}


def get_database_schema(db: Session) -> str:

    inspector = inspect(db.bind)

    tables = inspector.get_table_names()

    schema_parts = []

    for table in tables:

        columns = inspector.get_columns(table)

        column_names = [
            column["name"]
            for column in columns
            if column["name"] not in EXCLUDED_COLUMNS
        ]

        schema_parts.append(
            f"Table: {table}\n"
            "Columns:\n"
            + "\n".join(
                f"- {column_name}"
                for column_name in column_names
            )
        )

    return "\n\n".join(schema_parts)