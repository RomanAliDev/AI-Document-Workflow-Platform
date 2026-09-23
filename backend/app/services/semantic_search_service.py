from sqlalchemy.orm import Session
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from app.models.document_chunk import DocumentChunk
import os
from dotenv import load_dotenv

load_dotenv()


embeddings = GoogleGenerativeAIEmbeddings(
    model="models/gemini-embedding-001",
    google_api_key=os.getenv("GOOGLE_API_KEY")
)


def semantic_search(
    query: str,
    db: Session,
    top_k: int = 3
):
    #  User question ka embedding
    query_embedding = embeddings.embed_query(query)

    # pgvector mein similarity search
    results = (
        db.query(DocumentChunk)
        .order_by(
            DocumentChunk.embedding.cosine_distance(query_embedding)
        )
        .limit(top_k)
        .all()
    )

    return results