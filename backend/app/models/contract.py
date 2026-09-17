from sqlalchemy import Column, Integer, String, Date, ForeignKey
from app.database.database import Base


class Contract(Base):
    __tablename__ = "contracts"

    id = Column(Integer, primary_key=True, index=True)
    document_id = Column(Integer, ForeignKey("documents.id"), nullable=False)

    contract_number = Column(String, nullable=True)
    party_name = Column(String, nullable=True)
    start_date = Column(Date, nullable=True)
    end_date = Column(Date, nullable=True)
    contract_status = Column(String, nullable=True)