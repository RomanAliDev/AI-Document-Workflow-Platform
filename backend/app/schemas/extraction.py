from pydantic import BaseModel
from typing import Any


class ExtractionResult(BaseModel):
    document_type: str
    extracted_data: dict[str, Any]