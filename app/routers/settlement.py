from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import (
    User,
    Loan,
    FinancialProfile,
    SettlementRecord
)

from app.auth import get_current_user
from app.financial_engine import FinancialEngine
from app.settlement_engine import SettlementEngine

router = APIRouter()


# ==========================================
# Settlement Prediction
# ==========================================

@router.get("/settlement-predictor")
def settlement_predictor(
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
            "message": "No loans available."
        }

    financial_health = (
        FinancialEngine.calculate_financial_health(
            profile.monthly_income,
            profile.monthly_expenses,
            loans
        )
    )

    settlements = (
        SettlementEngine.analyze_all_loans(
            loans,
            financial_health
        )
    )

    return {
        "financial_health": financial_health,
        "settlements": settlements
    }


# ==========================================
# Save Settlement Records
# ==========================================

@router.post("/save-settlement-records")
def save_settlement_records(
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

    financial_health = (
        FinancialEngine.calculate_financial_health(
            profile.monthly_income,
            profile.monthly_expenses,
            loans
        )
    )

    predictions = (
        SettlementEngine.analyze_all_loans(
            loans,
            financial_health
        )
    )

    saved = 0

    for prediction in predictions:

        record = SettlementRecord(
            user_id=current_user.user_id,
            loan_id=prediction["loan_id"],
            settlement_prediction=prediction["risk_category"],
            recommended_amount=prediction["recommended_amount"],
            priority_level=prediction["risk_category"]
        )

        db.add(record)
        saved += 1

    db.commit()

    return {
        "message": f"{saved} settlement records saved successfully."
    }


# ==========================================
# Settlement History
# ==========================================

@router.get("/settlement-history")
def settlement_history(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    history = (
        db.query(SettlementRecord)
        .filter(
            SettlementRecord.user_id ==
            current_user.user_id
        )
        .order_by(
            SettlementRecord.created_at.desc()
        )
        .all()
    )

    return history