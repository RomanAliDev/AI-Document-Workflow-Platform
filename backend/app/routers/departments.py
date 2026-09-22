from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.database import sessionLocal
from app.models.departments import Department
from app.core.dependencies import require_role
from app.schemas.departments import CreateDepartmentRequest
from app.models.user import User

router = APIRouter(
    prefix="/api/v1/departments",
    tags=["Departments"],
)

def get_db():
    db = sessionLocal()

    try:
        yield db
    finally:
        db.close()


@router.get("/")
def get_departments(
    db: Session = Depends(get_db),
    current_user=Depends(require_role("SUPERADMIN")),
):
    departments = (
        db.query(Department)
        .order_by(Department.id.desc())
        .all()
    )

    result=[]
    for department in departments:
        assigned_users = (
            db.query(User)
            .filter(User.department_id == department.id)
            .count()
        )

        result.append({
            "id": department.id,
            "name": department.name,
            "description": department.description,
            "users_count": assigned_users,
        })

    return result
        

    

@router.post("/")
def create_department(
    department_data: CreateDepartmentRequest,
    db: Session = Depends(get_db),
    current_user=Depends(require_role("SUPERADMIN")),
):
    existing_department = (
        db.query(Department)
        .filter(Department.name == department_data.name)
        .first()
    )

    if existing_department:
        raise HTTPException(
            status_code=400,
            detail="Department already exists.",
        )

    new_department = Department(
        name=department_data.name,
        description=department_data.description,
    )

    db.add(new_department)
    db.commit()
    db.refresh(new_department)

    return {
        "message": "Department created successfully.",
        "department": new_department,
    }


@router.delete("/{department_id}")
def delete_department(
    department_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(require_role("SUPERADMIN")),
):
    department = (
        db.query(Department)
        .filter(Department.id == department_id)
        .first()
    )

    if not department:
        raise HTTPException(
            status_code=404,
            detail="Department not found.",
        )
    assigned_users = (
        db.query(User)
        .filter(User.department_id == department_id)
        .count()
    )

    if assigned_users > 0:
        raise HTTPException(
            status_code=400,
            detail="Cannot delete department. Users are still assigned to this department."
        )

    # User assignment check will be added after
    # User.department_id relationship is implemented.

    db.delete(department)
    db.commit()

    return {
        "message": "Department deleted successfully.",
    }