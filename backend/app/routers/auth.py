from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import session

from app.database.database import sessionLocal
from app.models.user import User
from app.schemas.auth import RegisterRequest, LoginRequest, TokenResponse
from app.core.security import hash_password, verify_password, create_access_token

router = APIRouter(
    prefix="/api/v1/auth",
    tags=["Authentication"]
)

def get_db():
    db = sessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/register")
def register(user_data: RegisterRequest, db: session = Depends(get_db)):
    existing_user = db.query(User).filter(User.email == user_data.email).first()
    if existing_user:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered")

    hashed_password = hash_password(user_data.password)
    new_user = User(
        full_name=user_data.full_name,
        email=user_data.email,
        password=hashed_password,
        role=user_data.role,
        department=user_data.department
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return {"message": "User registered successfully", "user_id": new_user.id}

@router.post("/login", response_model=TokenResponse)
def login(login_data: LoginRequest, db: session = Depends(get_db)):
    user = db.query(User).filter(User.email == login_data.email).first()
    if not user or not verify_password(login_data.password, user.password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email or password")

    access_token = create_access_token(data={"user_id": user.id, "email": user.email, "role": user.role})
    return {"access_token": access_token, "token_type": "bearer"}