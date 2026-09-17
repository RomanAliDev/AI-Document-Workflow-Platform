from fastapi import APIRouter, Depends
from app.core.dependencies import require_role
from app.core.dependencies import get_current_user
from app.models.user import User


router = APIRouter(
    prefix="/api/v1/users",
    tags=["Users"]
)


@router.get("/me")
def get_my_profile(
    current_user: User = Depends(get_current_user)
):
    return {
        "id": current_user.id,
        "full_name": current_user.full_name,
        "email": current_user.email,
        "role": current_user.role,
        "department": current_user.department,
        "is_active": current_user.is_active
    }

@router.get("/")
def get_users(
    current_user: User = Depends(require_role("admin"))
):
    return {
        "message": "User management endpoint"
    }