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
    
    try:
        document_type = (
            classification.document_type.lower().strip()
        )

        data = extracted_result.extracted_data

        # Ensure extracted data is a dictionary
        if not isinstance(data, dict):
            if hasattr(data, "model_dump"):
                data = data.model_dump()
            else:
                raise ValueError(
                    "Extracted data must be a dictionary."
                )

        document.document_type = (
            classification.document_type
        )

        is_valid = validation["is_valid"]

        if is_valid:
            document.status = "processed"
        else:
            document.status = "needs_review"

        # Save complete extracted JSON for every document
        extraction = DocumentExtraction(
            document_id=document.id,
            document_type=classification.document_type,
            extracted_data=data,
            validation_status=(
                "valid" if is_valid else "needs_review"
            )
        )

        db.add(extraction)

        # Save common invoice fields
        if "invoice" in document_type:

            sender = data.get("sender") or {}
            taxes = data.get("taxes") or []

            # Support both old and new extraction formats
            vendor_name = (
                data.get("vendor_name")
                or sender.get("name")
            )


            total_amount = (
                data.get("total_amount")
                if data.get("total_amount") is not None
                else data.get("total_due")
            )  
            invoice_date = (
                data.get("invoice_date")
                or data.get("issue_date")
            )

            tax_amount = data.get("tax_amount")

            if tax_amount is None and isinstance(taxes, list):
                tax_amount = sum(
                    tax.get("amount", 0) or 0
                    for tax in taxes
                    if isinstance(tax, dict)
                )


            invoice = Invoice(
                document_id=document.id,
                invoice_number=data.get("invoice_number"),
                vendor_name=vendor_name,
                invoice_date=invoice_date,
                total_amount=total_amount,
                currency=data.get("currency"),
                tax_amount=tax_amount
            )

            db.add(invoice)

        # Save common purchase order fields
        elif document_type in [
            "purchase order",
            "purchase_order",
            "po"
        ]:

            purchase_order = PurchaseOrder(
                document_id=document.id,
                po_number=data.get("po_number"),
                vendor_name=data.get("vendor_name"),
                po_date=data.get("po_date"),
                total_amount=data.get("total_amount"),
                currency=data.get("currency")
            )

            db.add(purchase_order)

        # Save common goods receipt fields
        elif document_type in [
            "goods receipt",
            "goods_receipt",
            "receipt"

        ]:

            goods_receipt = GoodsReceipt(
                document_id=document.id,
                receipt_number=data.get("receipt_number"),
                received_date=data.get("received_date"),
                vendor_name=data.get("vendor_name"),
                received_by=data.get("received_by")
            )

            db.add(goods_receipt)

        # Save common contract fields
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

        # Create manual review when validation fails
        if not is_valid:

            review = ManualReview(
                document_id=document.id,
                status="pending",
                reason="; ".join(
                    validation.get("errors", [])
                ),
                created_at=datetime.utcnow()
            )

            db.add(review)

        db.commit()
        db.refresh(document)

        return document

    except Exception:
        db.rollback()
        raise