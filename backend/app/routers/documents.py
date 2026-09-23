import os 
import shutil
from fastapi.responses import FileResponse
from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_user, require_role, get_db
from app.models.user import User
from app.models.document import Document
from app.services.document_processor import process_document

router = APIRouter(
    prefix="/api/v1/documents",
    tags=["Documents"]
)

UPLOAD_DIR = "uploads"

ALLOWED_EXTENSIONS = {
    ".pdf",
    ".docx",
    ".xlsx",
    ".xls",
    ".csv",
    ".txt",
    ".png",
    ".jpg",
    ".jpeg",
    ".tiff",
    ".tif"
}

@router.post("/upload")
async def upload_document(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    extension = os.path.splitext(file.filename)[1].lower()

    if extension not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"File type '{extension}' is not allowed."
        )

    existing_document = (
        db.query(Document)
        .filter(Document.filename == file.filename)
        .first()
    )

    if existing_document:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Document already exists."
        )


    os.makedirs(UPLOAD_DIR, exist_ok=True)

    file_path = os.path.join(UPLOAD_DIR, file.filename)

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    document = Document(
        filename=file.filename,
        file_type=extension,
        status="uploaded",
        file_path=file_path,
        uploaded_by=current_user.id
    )

    db.add(document)
    db.commit()
    db.refresh(document)

    print("PROCESSING STARTED")
    process_document(file_path, db, document)
    return {
        "message": "Document uploaded successfully",
        "document_id": document.id,
        "filename": document.filename,
        "status": document.status
    }
    print("PROCESSING COMPLETED")

@router.get("/")
def get_documents(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    query = db.query(Document)

    if current_user.role.lower() == "user":
        query = query.filter(
            Document.uploaded_by == current_user.id
        )

    documents = (
        query
        .order_by(Document.id.desc())
        .all()
    )

    return documents

@router.get("/{document_id}")
def get_document(
    document_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    document = db.query(Document).filter(
        Document.id == document_id
    ).first()

    if not document:
        raise HTTPException(
            status_code=404,
            detail="Document not found"
        )

    return document

@router.get("/{document_id}/view")
def view_document(
    document_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    document = (
        db.query(Document)
        .filter(Document.id == document_id)
        .first()
    )

    if not document:
        raise HTTPException(
            status_code=404,
            detail="Document not found"
        )

    if not os.path.exists(document.file_path):
        raise HTTPException(
            status_code=404,
            detail="Document file not found"
        )

    media_types = {
        ".pdf": "application/pdf",
        ".png": "image/png",
        ".jpg": "image/jpeg",
        ".jpeg": "image/jpeg",
        ".txt": "text/plain",

        ".xlsx": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        ".xls": "application/vnd.ms-excel",

        ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ".doc": "application/msword",

        ".csv": "text/csv",
    }

    extension = os.path.splitext(document.filename)[1].lower()

    media_type = media_types.get(
        extension,
        "application/octet-stream"
    )

    return FileResponse(
        path=document.file_path,
        media_type=media_type,
        filename=document.filename
    )