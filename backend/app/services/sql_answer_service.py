from langchain_google_genai import ChatGoogleGenerativeAI
import os
from dotenv import load_dotenv

load_dotenv()

llm = ChatGoogleGenerativeAI(
    model="gemini-3.6-flash",
    temperature=0,
    api_key=os.getenv("GOOGLE_API_KEY")
)


def generate_sql_answer(
    question: str,
    results
) -> str:

    response = llm.invoke(
        f"""
        You are an AI assistant answering questions
        using PostgreSQL database results.

        User Question:
        {question}

        Database Results:
        {results}

        Instructions:
        - Answer the user's question using only the database results.
        - Do not invent information.
        - Keep the answer clear and concise.
        - If no records are found, clearly say that no matching records were found.
        - Return only the final answer.
        """
    )

    return response.content[0]["text"].strip()