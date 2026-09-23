from langchain_google_genai import ChatGoogleGenerativeAI
import os
from dotenv import load_dotenv

load_dotenv()


llm = ChatGoogleGenerativeAI(
    model="gemini-3.6-flash",
    temperature=0,
    api_key=os.getenv("GOOGLE_API_KEY")
)


def generate_sql_query(
    question: str,
    schema: str
) -> str:

    response = llm.invoke(
        f"""
        You are a PostgreSQL SQL query generator for an
        AI-powered financial document system.

        Your task is to convert the user's question into
        one valid PostgreSQL SELECT query.

        DATABASE SCHEMA:
        {schema}

        IMPORTANT DATA MODEL:

        Some document types have dedicated structured tables.

        Examples:

        invoices:
        - id
        - document_id
        - invoice_number
        - vendor_name
        - invoice_date
        - total_amount
        - currency
        - tax_amount

        purchase_orders:
        - id
        - document_id
        - po_number
        - vendor_name
        - po_date
        - total_amount
        - currency

        Other document types may be stored in:

        document_extractions:
        - id
        - document_id
        - document_type
        - extracted_data

        The extracted_data column contains JSON/JSONB data.

        For Bank Statement documents, extracted_data can contain:

        {{
            "summary": {{
                "ending_balance": "...",
                "total_deposits": "...",
                "previous_balance": "...",
                "total_withdrawals": "..."
            }},
            "bank_details": {{
                "name": "...",
                "phone": "...",
                "address": "..."
            }},
            "transactions": [
                {{
                    "date": "...",
                    "balance": "...",
                    "deposits": "...",
                    "description": "...",
                    "withdrawals": "..."
                }}
            ],
            "account_details": {{
                "account_type": "...",
                "account_number": "...",
                "account_holder_name": "...",
                "statement_period_start": "...",
                "statement_period_end": "..."
            }}
        }}

        IMPORTANT:

        When querying individual Bank Statement transactions,
        use PostgreSQL jsonb_array_elements() on:

        extracted_data->'transactions'

        Example:

        SELECT
            transaction->>'date' AS date,
            transaction->>'description' AS description,
            (transaction->>'withdrawals')::numeric AS withdrawals
        FROM document_extractions,
             jsonb_array_elements(
                 extracted_data->'transactions'
             ) AS transaction
        WHERE transaction->>'withdrawals' IS NOT NULL;

        If a numeric value is stored as a string inside JSON,
        cast it using ::numeric.

        If a date is stored as a string inside JSON,
        cast it to date when date comparison is required.

        IMPORTANT SOURCE SELECTION:

        - Questions about invoices → use invoices table.
        - Questions about purchase orders → use purchase_orders table.
        - Questions about goods receipts → use goods_receipts table.
        - Questions about contracts → use contracts table.
        - Questions about Bank Statement transactions →
          use document_extractions and its transactions JSON.
        - Do not use invoices table for Bank Statement questions.
        - Do not invent a bank_transactions table if it does not
          exist in the schema.

        QUERY RULES:

        - Generate only SELECT queries.
        - Do not generate INSERT, UPDATE, DELETE, DROP,
          ALTER, CREATE or TRUNCATE queries.
        - Use only tables and columns available in the schema.
        - Do not invent tables or columns.
        - Use JSON operators/functions when querying JSON/JSONB data.
        - Return only the SQL query.
        - Do not include markdown.
        - Do not include explanations.
        - Do not include ```sql.
        - Make sure the generated SQL starts with SELECT.

        ACCESS:

        - USER and SUPERADMIN can access all available document data.
        - Do not add any user_id or ownership filtering.
        - Do not restrict queries based on the current user.

        User Question:
        {question}
        """
    )

    sql_query = response.content[0]["text"].strip()

    return sql_query

