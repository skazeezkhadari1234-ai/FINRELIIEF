from datetime import timedelta

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import User,FinancialProfile
from app.schemas import (
    UserRegister,
    UserLogin,
    UserResponse,
    Token
)
from app.auth import (
    hash_password,
    authenticate_user,
    create_access_token,
    get_current_user
)

router = APIRouter()


# ===============================
# Register User
# ===============================

@router.post("/register", response_model=UserResponse)
def register(
    user: UserRegister,
    db: Session = Depends(get_db)
):
    try:
        existing = db.query(User).filter(
            User.email == user.email
        ).first()

        if existing:
            raise HTTPException(
                status_code=400,
                detail="Email already registered."
            )

        new_user = User(
            name=user.name,
            email=user.email,
            password=hash_password(user.password)
        )

        db.add(new_user)
        db.commit()
        db.refresh(new_user)

        profile = FinancialProfile(
            user_id=new_user.user_id,
            monthly_income=0,
            monthly_expenses=0,
            existing_debts=0,
            lump_sum_available=0,
            financial_health_score=0
        )

        db.add(profile)
        db.commit()

        return new_user

    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )
# ===============================
# Login User
# ===============================

@router.post("/login", response_model=Token)
def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    db_user = authenticate_user(
        db,
        form_data.username,
        form_data.password
    )

    if not db_user:
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    access_token = create_access_token(
        data={"sub": db_user.email}
    )

    return {
        "access_token": access_token,
        "token_type": "bearer"
    }