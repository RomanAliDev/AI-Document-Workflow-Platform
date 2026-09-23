import pytesseract
from PIL import Image
from pypdf import PdfReader
from docx import Document as DocxDocument
import pandas as pd
import os
from app.models.document import Document

from app.services.document_save_service import save_extracted_data
from app.services.classification_service import classify_document
from app.services.extraction_service import extract_document_data
from app.services.validation_service import validate_document
from app.services.vector_service import save_document_chunks

pytesseract.pytesseract.tesseract_cmd = (
    r"D:\OCR Software\tesseract.exe"
)

def extract_text_from_image(file_path: str):

    image = Image.open(file_path)

    text = pytesseract.image_to_string(image)

    return text


def extract_text_from_pdf(file_path: str):
    reader = PdfReader(file_path)

    text = ""

    for page in reader.pages:
        page_text = page.extract_text()

        if page_text:
            text += page_text + "\n"

    return text

def extract_text_from_docx(file_path: str):
    document = DocxDocument(file_path)

    text = ""

    for paragraph in document.paragraphs:
        text += paragraph.text + "\n"

    return text


def extract_data_from_xlsx(file_path: str):
    excel_file = pd.ExcelFile(file_path)

    data = {}

    for sheet_name in excel_file.sheet_names:
        df = pd.read_excel(
            file_path,
            sheet_name=sheet_name
        )

        data[sheet_name] = df.to_dict(
            orient="records"
        )

    return data


def extract_data_from_csv(file_path: str):
    df = pd.read_csv(file_path)

    return df.to_dict(orient="records")


def process_document(file_path: str, db , document: Document):

    print(f"Processing document: {file_path}")
    extension = os.path.splitext(file_path)[1].lower()

    # Step 1: Extract document content
    if extension == ".pdf":

        text = extract_text_from_pdf(file_path)

    elif extension in [".png", ".jpg", ".jpeg", ".tiff", ".tif"]:

        text = extract_text_from_image(file_path)

    elif extension == ".docx":

        text = extract_text_from_docx(file_path)

    elif extension in [".xlsx", ".xls"]:

        data = extract_data_from_xlsx(file_path)
        text = str(data)

    elif extension == ".csv":

        data = extract_data_from_csv(file_path)
        text = str(data)

    else:
        raise ValueError("Unsupported file type")

    #  Classification
    classification = classify_document(text)
    save_document_chunks(
    db=db,
    document_id=document.id,
    text=text
)

    #Extraction
    extracted_result = extract_document_data(
    text,
    classification.document_type
    )

    # Validation
    validation_result = validate_document(extracted_result.extracted_data, classification.document_type)

    #  Save to database
    saved_document = save_extracted_data(
        db=db,
        document=document,
        classification=classification,
        extracted_result=extracted_result,
        validation=validation_result
    )
    

    # Return result
    return {
        "file_type": extension,
        "classification": classification,
        "extracted_data": extracted_result.extracted_data,
        "extracted_text": text,
        "validation": validation_result,
        "status": saved_document.status
    }