from langchain_google_genai import ChatGoogleGenerativeAI
import os
from dotenv import load_dotenv

load_dotenv()

llm = ChatGoogleGenerativeAI(
    model="gemini-3.7-flash",
    temperature=0,
    api_key=os.getenv("GOOGLE_API_KEY")
)


def generate_semantic_answer(
    question: str,
    chunks
) -> str:

    context = "\n\n".join(
        chunk.content
        for chunk in chunks
    )

    response = llm.invoke(
        f"""
        You are an AI assistant answering questions
        from document content.

        User Question:
        {question}

        Relevant Document Context:
        {context}

        Instructions:
    - Answer the user's question using only the provided context.
    - You may add short natural words or phrases to make the answer
      clear and easy to understand.
    - Do not invent, assume, or change any factual information.
    - If the answer is not available in the context,
      clearly say that the information was not found.
    - Keep the answer clear, concise, and accurate.
    - Return only the final answer.
    - Do not start the answer with bullets, *, **, #, headings, or other
      Markdown formatting.
    - Do not use Markdown formatting such as *, **, bullets, numbered lists,
      or tables.
    - Keep names, dates, amounts, and other factual information
      from the document context unchanged.
        """
    )

    return response.content[0]["text"].strip()