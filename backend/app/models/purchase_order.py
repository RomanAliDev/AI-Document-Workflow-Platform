from sqlalchemy import Column, Integer, String, Float, Date, ForeignKey
from app.database.database import Base


class PurchaseOrder(Base):
    __tablename__ = "purchase_orders"

    id = Column(Integer, primary_key=True, index=True)
    document_id = Column(Integer, ForeignKey("documents.id"), nullable=False)

    po_number = Column(String, nullable=True)
    vendor_name = Column(String, nullable=True)
    po_date = Column(Date, nullable=True)
    total_amount = Column(Float, nullable=True)
    currency = Column(String, nullable=True)