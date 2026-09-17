from sqlalchemy import Column, Integer, String, Float, Date, ForeignKey
from app.database.database import Base


class Invoice(Base):
    __tablename__ = "invoices"

    id = Column(Integer, primary_key=True, index=True)
    document_id = Column(Integer, ForeignKey("documents.id"), nullable=False)

    invoice_number = Column(String, nullable=True)
    vendor_name = Column(String, nullable=True)
    invoice_date = Column(Date, nullable=True)
    total_amount = Column(Float, nullable=True)
    currency = Column(String, nullable=True)
    tax_amount = Column(Float, nullable=True)