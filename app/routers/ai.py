from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import (
    User,
    Loan,
    FinancialProfile,
    AIHistory
)

from app.auth import get_current_user
from app.financial_engine import FinancialEngine
from app.ai_engine import AIEngine

router = APIRouter()


# ==========================================
# AI Negotiation Strategy
# ==========================================

@router.get("/ai-negotiation-strategy")
def ai_negotiation_strategy(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    profile = (
        db.query(FinancialProfile)
        .filter(
            FinancialProfile.user_id ==
            current_user.user_id
        )
        .first()
    )

    if not profile:
        return {
            "message": "Financial profile not found."
        }

    loans = (
        db.query(Loan)
        .filter(
            Loan.user_id ==
            current_user.user_id
        )
        .all()
    )

    if not loans:
        return {
            "message": "No loans found."
        }

    financial_health = (
        FinancialEngine.calculate_financial_health(
            profile.monthly_income,
            profile.monthly_expenses,
            loans
        )
    )

    strategy = AIEngine.generate_strategy(
        current_user,
        loans,
        financial_health
    )

    history = AIHistory(
        user_id=current_user.user_id,
        negotiation_strategy=strategy,
        settlement_letter="",
        ai_response=strategy
    )

    db.add(history)
    db.commit()

    return {
        "strategy": strategy
    }


# ==========================================
# Generate Negotiation Letter
# ==========================================

@router.get("/generate-negotiation-email/{loan_id}")
def generate_email(
    loan_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    loan = (
        db.query(Loan)
        .filter(
            Loan.loan_id == loan_id,
            Loan.user_id == current_user.user_id
        )
        .first()
    )

    if not loan:
        return {
            "message": "Loan not found."
        }

    letter = AIEngine.generate_email(
        current_user,
        loan
    )

    history = AIHistory(
        user_id=current_user.user_id,
        negotiation_strategy="Email Generated",
        settlement_letter=letter,
        ai_response=letter
    )

    db.add(history)
    db.commit()

    return {
        "loan": loan.lender_name,
        "email": letter
    }


# ==========================================
# AI History
# ==========================================

@router.get("/ai-history")
def ai_history(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    history = (
        db.query(AIHistory)
        .filter(
            AIHistory.user_id ==
            current_user.user_id
        )
        .order_by(
            AIHistory.generated_at.desc()
        )
        .all()
    )

    return history


# ==========================================
# Delete AI History
# ==========================================

@router.delete("/delete-ai-history/{history_id}")
def delete_ai_history(
    history_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    record = (
        db.query(AIHistory)
        .filter(
            AIHistory.history_id == history_id,
            AIHistory.user_id == current_user.user_id
        )
        .first()
    )

    if not record:
        return {
            "message": "History not found."
        }

    db.delete(record)
    db.commit()

    return {
        "message": "AI history deleted successfully."
    }