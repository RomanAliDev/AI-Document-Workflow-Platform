from langchain_google_genai import ChatGoogleGenerativeAI
import os
from dotenv import load_dotenv

load_dotenv()

llm = ChatGoogleGenerativeAI(
    model="gemini-3.6-flash",
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
        - Answer only using the provided context.
        - Do not invent information.
        - If the answer is not available in the context,
          clearly say that the information was not found.
        - Keep the answer clear and concise.
        - Return only the final answer.
        """
    )

    return response.content[0]["text"].strip()