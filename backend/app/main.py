from fastapi import FastAPI
from app.database.database import engine, Base

from app.models.user import User

from app.routers.auth import router as auth_router
from app.routers.user import router as users_router
from app.routers.documents import router as documents_router
from app.routers.ai import router as ai_router

from app.models.document import Document
from app.models.invoice import Invoice
from app.models.purchase_order import PurchaseOrder
from app.models.goods_receipt import GoodsReceipt
from app.models.contract import Contract
from app.models.manual_review import ManualReview
from app.models.document_extraction import DocumentExtraction 


Base.metadata.create_all(bind=engine)

app = FastAPI(title="AI Document Workflow Platform")


@app.get("/")
def root():
    return {
        "message": "API is running"
    }


app.include_router(auth_router)
app.include_router(users_router)
app.include_router(documents_router)
app.include_router(ai_router)

@app.get("/db-test")
def database_test():
    try:
        with engine.connect():
            return {
                "message": "PostgreSQL connected successfully"
            }
    except Exception as e:
        return {
            "error": str(e)
        }