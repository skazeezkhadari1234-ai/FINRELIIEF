from sqlalchemy import (
    Column,
    Integer,
    String,
    Float,
    Date,
    DateTime,
    ForeignKey,
    Text
)

from sqlalchemy.orm import relationship
from datetime import datetime

from app.database import Base


# ==========================
# Users
# ==========================
class User(Base):
    __tablename__ = "users"

    user_id = Column(Integer, primary_key=True, index=True)

    name = Column(String(100), nullable=False)

    email = Column(String(150), unique=True, nullable=False)

    password = Column(String(255), nullable=False)

    created_at = Column(DateTime, default=datetime.utcnow)

    loans = relationship(
        "Loan",
        back_populates="user",
        cascade="all, delete-orphan"
    )

    financial_profile = relationship(
        "FinancialProfile",
        back_populates="user",
        uselist=False,
        cascade="all, delete"
    )

    settlements = relationship(
        "SettlementRecord",
        back_populates="user",
        cascade="all, delete"
    )

    ai_history = relationship(
        "AIHistory",
        back_populates="user",
        cascade="all, delete"
    )


# ==========================
# Loans
# ==========================
class Loan(Base):

    __tablename__ = "loans"

    loan_id = Column(Integer, primary_key=True, index=True)

    user_id = Column(
        Integer,
        ForeignKey("users.user_id")
    )

    lender_name = Column(String(100))

    loan_type = Column(String(50))

    loan_amount = Column(Float)

    outstanding_amount = Column(Float)

    interest_rate = Column(Float)

    emi = Column(Float)

    overdue_months = Column(Integer)

    due_date = Column(Date)

    user = relationship(
        "User",
        back_populates="loans"
    )

    settlements = relationship(
        "SettlementRecord",
        back_populates="loan",
        cascade="all, delete"
    )


# ==========================
# Financial Profile
# ==========================
class FinancialProfile(Base):

    __tablename__ = "financial_profiles"

    profile_id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    user_id = Column(
        Integer,
        ForeignKey("users.user_id"),
        unique=True
    )

    monthly_income = Column(Float, default=0)

    monthly_expenses = Column(Float, default=0)

    existing_debts = Column(Float, default=0)

    lump_sum_available = Column(Float, default=0)

    financial_health_score = Column(Float, default=0)

    user = relationship(
        "User",
        back_populates="financial_profile"
    )


# ==========================
# Settlement Records
# ==========================
class SettlementRecord(Base):

    __tablename__ = "settlement_records"

    settlement_id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    user_id = Column(
        Integer,
        ForeignKey("users.user_id")
    )

    loan_id = Column(
        Integer,
        ForeignKey("loans.loan_id")
    )

    settlement_prediction = Column(String(100))

    recommended_amount = Column(Float)

    priority_level = Column(String(20))

    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )

    user = relationship(
        "User",
        back_populates="settlements"
    )

    loan = relationship(
        "Loan",
        back_populates="settlements"
    )


# ==========================
# AI History
# ==========================
class AIHistory(Base):

    __tablename__ = "ai_history"

    history_id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    user_id = Column(
        Integer,
        ForeignKey("users.user_id")
    )

    negotiation_strategy = Column(Text)

    settlement_letter = Column(Text)

    ai_response = Column(Text)

    generated_at = Column(
        DateTime,
        default=datetime.utcnow
    )

    user = relationship(
        "User",
        back_populates="ai_history"
    )