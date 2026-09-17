from langchain_google_genai import ChatGoogleGenerativeAI
import os
from dotenv import load_dotenv

load_dotenv()

llm = ChatGoogleGenerativeAI(
    model="gemini-3.6-flash",
    temperature=0,
    api_key=os.getenv("GOOGLE_API_KEY")
)


def route_question(question: str) -> str:

    response = llm.invoke(
        f"""
        You are an AI question router.

        Decide whether the user's question should be answered
        using the SQL database or document semantic search.

        Return ONLY one of these values:

        SQL
        RAG

        Use SQL when the question asks about:
        - database records
        - invoices
        - amounts
        - dates
        - vendors
        - filtering or counting structured data

        Use RAG when the question asks about:
        - document content
        - information contained in documents
        - policies
        - terms
        - explanations from document text

        User Question:
        {question}
        """
    )

    route = response.content[0]["text"].strip().upper()

    if route not in ["SQL", "RAG"]:
        raise ValueError(f"Invalid route returned by LLM: {route}")

    return route