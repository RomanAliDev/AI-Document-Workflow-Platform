from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.database import sessionLocal
from app.models.user import User
from app.core.dependencies import get_current_user, require_role
from app.core.security import hash_password
from app.schemas.user import CreateUserRequest

router = APIRouter(
    prefix="/api/v1/users",
    tags=["Users"]
)


def get_db():
    db = sessionLocal()

    try:
        yield db
    finally:
        db.close()


# Get all users
@router.get("/")
def get_users(
    db: Session = Depends(get_db),
    current_user=Depends(require_role("SUPERADMIN"))
):
    users = (
        db.query(User)
        .order_by(User.id.desc())
        .all()
    )

    return users


# Create user
@router.post("/")
def create_user(
    user_data: CreateUserRequest,
    db: Session = Depends(get_db),
    current_user=Depends(require_role("SUPERADMIN"))
):
    existing_user = (
        db.query(User)
        .filter(User.email == user_data.email)
        .first()
    )

    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="Email already registered."
        )


    new_user = User(
        full_name=user_data.full_name,
        email=user_data.email,
        password=hash_password(user_data.password),
        role="User",
        department_id=user_data.department_id,
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {
        "message": "User created successfully.",
        "user": new_user
    }


# Delete user
@router.delete("/{user_id}")
def delete_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(require_role("SUPERADMIN"))
):
    user = (
        db.query(User)
        .filter(User.id == user_id)
        .first()
    )
    
    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found."
        )

    # Prevent Superadmin from deleting himself
    if user.id == current_user.id:
        raise HTTPException(
            status_code=400,
            detail="You cannot delete your own account."
        )

    db.delete(user)
    db.commit()

    return {
        "message": "User deleted successfully."
    }

