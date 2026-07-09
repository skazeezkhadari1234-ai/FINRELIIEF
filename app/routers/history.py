from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import (
    User,
    AIHistory,
    SettlementRecord,
    Loan
)

from app.auth import get_current_user

router = APIRouter()


# ==========================================
# Complete User History
# ==========================================

@router.get("/history")
def get_history(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    ai_history = (
        db.query(AIHistory)
        .filter(
            AIHistory.user_id == current_user.user_id
        )
        .order_by(
            AIHistory.generated_at.desc()
        )
        .all()
    )

    settlement_history = (
        db.query(SettlementRecord)
        .filter(
            SettlementRecord.user_id == current_user.user_id
        )
        .order_by(
            SettlementRecord.created_at.desc()
        )
        .all()
    )

    loans = (
        db.query(Loan)
        .filter(
            Loan.user_id == current_user.user_id
        )
        .all()
    )

    return {

        "total_loans": len(loans),

        "total_ai_requests": len(ai_history),

        "total_settlement_predictions": len(settlement_history),

        "loan_history": loans,

        "settlement_history": settlement_history,

        "ai_history": ai_history

    }


# ==========================================
# Dashboard Analytics
# ==========================================

@router.get("/analytics")
def analytics(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    loans = (
        db.query(Loan)
        .filter(
            Loan.user_id == current_user.user_id
        )
        .all()
    )

    outstanding = sum(
        loan.outstanding_amount
        for loan in loans
    )

    emi = sum(
        loan.emi
        for loan in loans
    )

    return {

        "total_loans": len(loans),

        "total_outstanding": outstanding,

        "total_emi": emi

    }


# ==========================================
# Clear AI History
# ==========================================

@router.delete("/clear-history")
def clear_history(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    history = (
        db.query(AIHistory)
        .filter(
            AIHistory.user_id ==
            current_user.user_id
        )
        .all()
    )

    for item in history:
        db.delete(item)

    db.commit()

    return {
        "message": "History cleared successfully."
    }