from sqlalchemy import Column, Integer, Text, DateTime, ForeignKey
from pgvector.sqlalchemy import VECTOR
from datetime import datetime

from app.database.database import Base


class DocumentChunk(Base):
    __tablename__ = "document_chunks"

    id = Column(Integer, primary_key=True, index=True)

    document_id = Column(
        Integer,
        ForeignKey("documents.id"),
        nullable=False
    )

    chunk_index = Column(Integer, nullable=False)

    content = Column(Text, nullable=False)

    embedding = Column(VECTOR(3072), nullable=True)

    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )