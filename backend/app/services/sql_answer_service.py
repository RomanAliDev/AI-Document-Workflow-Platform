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
    results,
    
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
        - You may add short natural words or phrases to make the answer
        clear and easy to understand.
        - Do not invent, assume, or change any factual information.
        - Keep the answer clear, concise, and accurate.
        - If no records are found, clearly say that no matching records were found.
        - Return only the final answer.
        - Do not start the answer with bullets, *, **, #, headings, or other
        Markdown formatting.
        - Do not use Markdown formatting such as *, **, bullets, numbered lists,
         or tables.
        - Keep the original values from the database results unchanged.
        """
    )

    return response.content[0]["text"].strip()