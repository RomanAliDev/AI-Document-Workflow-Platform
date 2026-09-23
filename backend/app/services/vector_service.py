from sqlalchemy.orm import Session

from app.models.document_chunk import DocumentChunk
from app.services.chunking_service import chunk_document
from app.services.embedding_service import generate_embeddings


def save_document_chunks(
    db: Session,
    document_id: int,
    text: str
):

    print("Text :", text)
    chunks = chunk_document(text)

    if not chunks:
        return []

    embeddings = generate_embeddings(chunks)
    print("Chunks:", chunks)
    print("Total chunks:", len(chunks))
    saved_chunks = []

    for index, (chunk, embedding) in enumerate(
        zip(chunks, embeddings)
    ):
        document_chunk = DocumentChunk(
            document_id=document_id,
            chunk_index=index,
            content=chunk,
            embedding=embedding
        )

        db.add(document_chunk)
        saved_chunks.append(document_chunk)

    db.commit()

    return saved_chunks