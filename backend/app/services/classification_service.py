from langchain_google_genai import ChatGoogleGenerativeAI
from app.schemas.classification import ClassificationResult
import os
from dotenv import load_dotenv

load_dotenv()

llm = ChatGoogleGenerativeAI(
    model="gemini-3.7-flash",
    temperature=0,
    api_key=os.getenv("GOOGLE_API_KEY")
)

structured_llm = llm.with_structured_output(
    ClassificationResult
)

def classify_document(text: str) -> ClassificationResult:

    result = structured_llm.invoke(
        f"""
        Classify the following document based on its content.

        Identify the most appropriate document type.
        The type can be any valid category.

        Examples:
        Invoice, Purchase Order, Contract, Receipt,
        Policy, Goods Receipt, Bank Statement, Report, etc.

        These are examples only, not fixed categories.

        Also provide a confidence score between 0 and 1.

        Document:
        {text}
        """
    )

    return result