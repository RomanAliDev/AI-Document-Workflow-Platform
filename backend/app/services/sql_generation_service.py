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
        You are a PostgreSQL SQL query generator.

        Convert the user's question into a valid PostgreSQL
        SELECT query.

        Database schema:
        {schema}

        Rules:
        - Generate only SELECT queries.
        - Do not generate INSERT, UPDATE, DELETE, DROP,
          ALTER, CREATE or TRUNCATE queries.
        - Use only tables and columns available in the schema.
        - Do not invent tables or columns.
        - Return only the SQL query.
        - Do not include markdown or explanations.

        User Question:
        {question}
        """
    )

    return response.content[0]["text"].strip()
    