from langchain_google_genai import ChatGoogleGenerativeAI
from app.schemas.extraction import ExtractionResult
import os
from dotenv import load_dotenv

load_dotenv()

llm = ChatGoogleGenerativeAI(
    model="gemini-3.6-flash",
    temperature=0,
    api_key=os.getenv("GOOGLE_API_KEY")
)

structured_llm = llm.with_structured_output(
    ExtractionResult
)


def extract_document_data(
    text: str,
    document_type: str
) -> ExtractionResult:

    result = structured_llm.invoke(
        f"""
        Extract the important structured information
        from this document.

        Document Type:
        {document_type}

        Rules:
        - Identify the important fields based on the document content.
        - Do not assume fixed fields.
        - Extract only information actually present.
        - If a value is missing, do not invent it.
        - Return the extracted information as key-value pairs.
        - Preserve important numbers, dates, names and identifiers.

        Document:
        {text}
        """
    )

    return result