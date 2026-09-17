from pydantic import BaseModel, Field


class ClassificationResult(BaseModel):
    document_type: str = Field(
        description="The type of the document"
    )

    confidence: float = Field(
        ge=0,
        le=1,
        description="Confidence score between 0 and 1"
    )