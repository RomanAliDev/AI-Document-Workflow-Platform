from sqlalchemy import Column, Integer, Text, String, DateTime, ForeignKey, JSON
from datetime import datetime

from app.database.database import Base


class ChatHistory(Base):
    __tablename__ = "chat_history"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False
    )

    question = Column(Text, nullable=False)

    answer = Column(Text, nullable=False)

    route = Column(String, nullable=True)

    sources = Column(JSON, nullable=True)

    results = Column(JSON, nullable=True)

    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )