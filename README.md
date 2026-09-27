# AI-Powered Document Workflow Automation Platform

An AI-powered document processing and workflow automation platform designed to transform unstructured business documents into structured, searchable, and actionable information.

The platform uses **LLMs, document extraction, validation, semantic search, RAG, PostgreSQL, and pgvector** to automate the complete document-to-insight workflow.

### Key Capabilities

* Intelligent document classification and data extraction
* Automated document validation
* Structured financial data storage
* Semantic search using vector embeddings
* RAG-based question answering
* SQL-based querying of structured data
* AI-powered document insights
* JWT authentication and role-based access control
* Support for multiple business document formats
* Scalable architecture designed for future AWS deployment

### Technology Stack

**Backend:** FastAPI, Python, SQLAlchemy
**Frontend:** React, Vite, Tailwind CSS
**Database:** PostgreSQL, pgvector
**AI:** Gemini, LLMs, LangChain, LangGraph
**Authentication:** JWT, RBAC
**Document Processing:** OCR, PDF, Excel, CSV and DOCX processing

### Workflow

```text
Document Upload
      ↓
Text / Data Extraction
      ↓
AI Classification
      ↓
Information Extraction
      ↓
Validation
      ↓
PostgreSQL + Vector Storage
      ↓
SQL / Semantic Search
      ↓
AI-Powered Insights
```
