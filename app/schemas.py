from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import date, datetime


# ==========================
# User Schemas
# ==========================

class UserRegister(BaseModel):
    name: str
    email: EmailStr
    password: str


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserResponse(BaseModel):
    user_id: int
    name: str
    email: EmailStr

    class Config:
        from_attributes = True


# ==========================
# Token Schemas
# ==========================

class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    email: Optional[str] = None


# ==========================
# Loan Schemas
# ==========================

class LoanCreate(BaseModel):

    lender_name: str

    loan_type: str

    loan_amount: float

    outstanding_amount: float

    interest_rate: float

    emi: float

    overdue_months: int = 0

    due_date: date


class LoanResponse(LoanCreate):

    loan_id: int

    class Config:
        from_attributes = True


# ==========================
# Financial Profile
# ==========================

class FinancialProfileCreate(BaseModel):

    monthly_income: float

    monthly_expenses: float

    existing_debts: float

    lump_sum_available: float


class FinancialProfileResponse(
    FinancialProfileCreate
):

    profile_id: int

    financial_health_score: float

    class Config:
        from_attributes = True


# ==========================
# Settlement
# ==========================

class SettlementResponse(BaseModel):

    settlement_id: int

    settlement_prediction: str

    recommended_amount: float

    priority_level: str

    created_at: datetime

    class Config:
        from_attributes = True


# ==========================
# AI Response
# ==========================

class AIResponse(BaseModel):

    negotiation_strategy: str

    settlement_letter: str

    ai_response: str


# ==========================
# Dashboard
# ==========================

class DashboardResponse(BaseModel):

    monthly_income: float

    monthly_expenses: float

    monthly_surplus: float

    total_emi: float

    total_outstanding: float

    debt_to_income_ratio: float

    emi_ratio: float

    stress_level: str