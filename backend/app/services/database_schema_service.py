from sqlalchemy import inspect
from sqlalchemy.orm import Session


EXCLUDED_COLUMNS = {
    "embedding",
    "password",
}


TABLE_DESCRIPTIONS = {
    "documents": (
        "Stores uploaded documents and their ownership. "
        "Use uploaded_by to identify the user who uploaded the document."
    ),

    "invoices": (
        "Stores structured invoice information such as "
        "invoice number, vendor, invoice date, total amount, "
        "currency and tax amount."
    ),

    "purchase_orders": (
        "Stores structured purchase order information."
    ),

    "goods_receipts": (
        "Stores structured goods receipt information."
    ),

    "contracts": (
        "Stores structured contract information."
    ),

    "document_extractions": (
        "Stores extracted JSON/JSONB data for document types "
        "that do not have a dedicated structured table."
    ),
}


JSON_DESCRIPTIONS = {
    "document_extractions": """
Special JSON structure:

The extracted_data column contains JSON/JSONB.

For Bank Statement documents, extracted_data can contain:

summary:
- ending_balance
- total_deposits
- previous_balance
- total_withdrawals

bank_details:
- name
- phone
- address

transactions:
An array of transaction objects containing:
- date
- balance
- deposits
- withdrawals
- description

account_details:
- page
- account_type
- account_number
- account_holder_name
- statement_period_start
- statement_period_end
- account_holder_address

To query individual transactions inside the JSON array,
use:

jsonb_array_elements(extracted_data->'transactions')

Example:

SELECT
    transaction->>'date' AS date,
    transaction->>'description' AS description,
    (transaction->>'withdrawals')::numeric AS withdrawals
FROM document_extractions,
     jsonb_array_elements(
         extracted_data->'transactions'
     ) AS transaction;

Do NOT assume a bank_transactions table exists.
""",
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

        table_schema = (
            f"Table: {table}\n"
            f"Purpose: {TABLE_DESCRIPTIONS.get(table, 'Stores application data.')}\n"
            "Columns:\n"
            + "\n".join(
                f"- {column_name}"
                for column_name in column_names
            )
        )

        if table in JSON_DESCRIPTIONS:
            table_schema += (
                "\n\n"
                + JSON_DESCRIPTIONS[table]
            )

        schema_parts.append(table_schema)

    return "\n\n".join(schema_parts)