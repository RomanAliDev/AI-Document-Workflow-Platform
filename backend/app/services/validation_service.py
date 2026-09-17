from datetime import datetime


def validate_document(extracted_data: dict, document_type: str):

    errors = []

    # Extraction result empty hai?
    if not extracted_data:
        errors.append("No data extracted")
        return {
            "is_valid": False,
            "errors": errors
        }

    #  Keys valid hain?
    if not isinstance(extracted_data, dict):
        errors.append("Extracted data must be a dictionary")

    #  Empty values check
    for key, value in extracted_data.items():

        if value is None:
            continue

        if isinstance(value, str) and not value.strip():
            errors.append(
                f"Field '{key}' is empty"
            )

    # Nested data check
    for key, value in extracted_data.items():

        if isinstance(value, list):

            if len(value) == 0:
                errors.append(
                    f"Field '{key}' contains no records"
                )

    return {
        "is_valid": len(errors) == 0,
        "errors": errors
    }