from pydantic import BaseModel


class CreateDepartmentRequest(BaseModel):
    name: str
    description: str | None = None