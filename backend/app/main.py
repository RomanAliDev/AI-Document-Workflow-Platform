from fastapi import FastAPI
from app.database.database import engine, Base

from app.routers.users import router as users_router
from app.routers.auth import router as auth_router
from app.routers.documents import router as documents_router
from app.routers.chat import router as chat_router
from app.routers.departments import router as department_router
from app.routers.analytics import router as analytics_router
from app.routers.semantic_search import router as semantic_router 


from app.models.document import Document
from app.models.invoice import Invoice
from app.models.purchase_order import PurchaseOrder
from app.models.goods_receipt import GoodsReceipt
from app.models.contract import Contract
from app.models.manual_review import ManualReview
from app.models.document_extraction import DocumentExtraction 
from app.models.chat_history import ChatHistory
from app.models.user import User
from app.models.chat_session import ChatSession
from app.models.departments import Department


from fastapi.middleware.cors import CORSMiddleware

Base.metadata.create_all(bind=engine)

app = FastAPI(title="AI Document Workflow Platform")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {
        "message": "API is running"
    }

app.include_router(users_router)
app.include_router(auth_router)
app.include_router(documents_router)
app.include_router(chat_router)
app.include_router(department_router)
app.include_router(analytics_router)
app.include_router(semantic_router)