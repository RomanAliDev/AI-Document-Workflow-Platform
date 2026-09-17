from sqlalchemy.orm import Session
from datetime import datetime

from app.models.document import Document
from app.models.invoice import Invoice
from app.models.purchase_order import PurchaseOrder
from app.models.goods_receipt import GoodsReceipt
from app.models.contract import Contract
from app.models.manual_review import ManualReview
from app.models.document_extraction import DocumentExtraction


def save_extracted_data(
    db: Session,
    document: Document,
    classification,
    extracted_result,
    validation
):
    print(f"Saving extracted data for document ID: {document.id}")
    document_type = classification.document_type.lower().strip()
    data = extracted_result.extracted_data

    # Update existing document
    document.document_type = classification.document_type

    if validation["is_valid"]:
        document.status = "processed"
    else:
        document.status = "needs_review"

    # Invoice
    if document_type == "invoice":

        invoice = Invoice(
            document_id=document.id,
            invoice_number=data.get("invoice_number"),
            vendor_name=data.get("vendor_name"),
            invoice_date=data.get("invoice_date"),
            total_amount=data.get("total_amount"),
            currency=data.get("currency"),
            tax_amount=data.get("tax_amount")
        )

        db.add(invoice)

    # Purchase Order
    elif document_type in ["purchase order", "purchase_order", "po"]:

        purchase_order = PurchaseOrder(
            document_id=document.id,
            po_number=data.get("po_number"),
            vendor_name=data.get("vendor_name"),
            po_date=data.get("po_date"),
            total_amount=data.get("total_amount"),
            currency=data.get("currency")
        )

        db.add(purchase_order)

    # Goods Receipt
    elif document_type in ["goods receipt", "goods_receipt"]:

        goods_receipt = GoodsReceipt(
            document_id=document.id,
            receipt_number=data.get("receipt_number"),
            received_date=data.get("received_date"),
            vendor_name=data.get("vendor_name"),
            received_by=data.get("received_by")
        )

        db.add(goods_receipt)

    # Contract
    elif document_type == "contract":

        contract = Contract(
            document_id=document.id,
            contract_number=data.get("contract_number"),
            party_name=data.get("party_name"),
            start_date=data.get("start_date"),
            end_date=data.get("end_date"),
            contract_status=data.get("contract_status")
        )

        db.add(contract)

    # Document Extraction
    else:
        generic_extraction = DocumentExtraction(
            document_id=document.id,
            document_type=classification.document_type,
            extracted_data=data,
            validation_status=(
                "valid"
                if validation["is_valid"]
                else "needs_review"
            )
        )

        db.add(generic_extraction)    

    # Validation failed → Manual Review
    if not validation["is_valid"]:

        review = ManualReview(
            document_id=document.id,
            status="pending",
            reason="; ".join(validation["errors"]),
            created_at=datetime.utcnow()
        )

        db.add(review)

    db.commit()
    db.refresh(document)

    return document