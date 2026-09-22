from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.database import sessionLocal
from app.models.document import Document
from app.models.departments import Department
from app.models.user import User
from app.core.dependencies import require_role


router = APIRouter(
    prefix="/api/v1/analytics",
    tags=["Analytics"],
)

def get_db():
    db = sessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get("/")
def get_analytics(
    db: Session = Depends(get_db),
    current_user=Depends(require_role("SUPERADMIN")),
):
    # Summary
    total_documents = db.query(Document).count()

    processed_documents = (
        db.query(Document)
        .filter(Document.status == "processed")
        .count()
    )

    pending_documents = (
        db.query(Document)
        .filter(Document.status.in_(["uploaded", "pending", "processing"]))
        .count()
    )

    failed_documents = (
        db.query(Document)
        .filter(Document.status == "failed")
        .count()
    )

    # Success rate
    success_rate = (
        (processed_documents / total_documents) * 100
        if total_documents > 0
        else 0
    )

    # Documents by type
    documents_by_type = []

    document_types = (
        db.query(Document.file_type)
        .filter(Document.file_type.isnot(None))
        .distinct()
        .all()
    )

    for document_type in document_types:
        file_type = document_type[0]

        count = (
            db.query(Document)
            .filter(Document.file_type == file_type)
            .count()
        )

        documents_by_type.append({
            "name": file_type,
            "count": count,
        })

    # Documents by department
    documents_by_department = []

    departments = (
        db.query(Department)
        .order_by(Department.id)
        .all()
    )

    for department in departments:

        count = (
            db.query(Document)
            .join(User, Document.uploaded_by == User.id)
            .filter(User.department_id == department.id)
            .count()
        )

        documents_by_department.append({
            "name": department.name,
            "count": count,
        })

    return {
        "summary": {
            "total_documents": total_documents,
            "processed_documents": processed_documents,
            "pending_documents": pending_documents,
            "failed_documents": failed_documents,
        },
        "success_rate": round(success_rate, 1),
        "documents_by_type": documents_by_type,
        "documents_by_department": documents_by_department,
    }