from sqlalchemy import Column, Integer, String, Date, ForeignKey
from app.database.database import Base


class GoodsReceipt(Base):
    __tablename__ = "goods_receipts"

    id = Column(Integer, primary_key=True, index=True)
    document_id = Column(Integer, ForeignKey("documents.id"), nullable=False)

    receipt_number = Column(String, nullable=True)
    received_date = Column(Date, nullable=True)
    vendor_name = Column(String, nullable=True)
    received_by = Column(String, nullable=True)