from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import User, Loan, FinancialProfile
from app.auth import get_current_user
from app.financial_engine import FinancialEngine

router = APIRouter()


# ======================================
# Dashboard Data
# ======================================

@router.get("/dashboard-data")
def dashboard_data(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    profile = (
    db.query(FinancialProfile)
    .filter(
        FinancialProfile.user_id == current_user.user_id
    )
    .first()
)

    if not profile:
     profile = FinancialProfile(
        user_id=current_user.user_id,
        monthly_income=0,
        monthly_expenses=0,
        existing_debts=0,
        lump_sum_available=0,
        financial_health_score=0
    )

    db.add(profile)
    db.commit()
    db.refresh(profile)

    loans = (
        db.query(Loan)
        .filter(
            Loan.user_id == current_user.user_id
        )
        .all()
    )

    financial_health = (
        FinancialEngine.calculate_financial_health(
            profile.monthly_income  or 0,
            profile.monthly_expenses or 0,
            loans
        )
    )

    return {

        "user": {
            "name": current_user.name,
            "email": current_user.email
        },

        "financial_profile": {

            "monthly_income":
                profile.monthly_income,

            "monthly_expenses":
                profile.monthly_expenses,

            "existing_debts":
                profile.existing_debts,

            "lump_sum_available":
                profile.lump_sum_available
        },
"financial_health":
    financial_health,

"loans": [
    {
        "loan_id": loan.loan_id,
        "lender_name": loan.lender_name,
        "loan_type": loan.loan_type,
        "loan_amount": loan.loan_amount,
        "outstanding_amount": loan.outstanding_amount,
        "interest_rate": loan.interest_rate,
        "emi": loan.emi,
        "overdue_months": loan.overdue_months
    }
    for loan in loans
],

"loan_summary": {
            "total_loans": len(loans),

            "active_loans": len(loans),

            "total_outstanding":
                financial_health["total_outstanding"],

            "total_emi":
                financial_health["total_emi"]

        }

    }


# ======================================
# Financial Health
# ======================================

@router.get("/financial-health")
def financial_health(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    profile = (
        db.query(FinancialProfile)
        .filter(
            FinancialProfile.user_id == current_user.user_id
        )
        .first()
    )

    if not profile:
        profile = FinancialProfile(
            user_id=current_user.user_id,
            monthly_income=0,
            monthly_expenses=0,
            existing_debts=0,
            lump_sum_available=0,
            financial_health_score=0
        )

        db.add(profile)
        db.commit()
        db.refresh(profile)

    loans = (
        db.query(Loan)
        .filter(
            Loan.user_id == current_user.user_id
        )
        .all()
    )

    return FinancialEngine.calculate_financial_health(
        profile.monthly_income,
        profile.monthly_expenses,
        loans
    )

# ======================================
# Loan Priority
# ======================================

@router.get("/loan-priority")
def loan_priority(
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

    return FinancialEngine.analyze_loan_priority(
        loans
    )


# ======================================
# Debt Timeline
# ======================================

@router.get("/debt-timeline/{loan_id}")
def repayment_timeline(
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

    timeline = (
        FinancialEngine.simulate_repayment(
            loan.outstanding_amount,
            loan.emi
        )
    )

    return {
        "loan_id": loan.loan_id,
        "lender_name": loan.lender_name,
        "timeline": timeline
    }
@router.post("/financial-health")
def update_financial_health(
    data: dict,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    profile = (
        db.query(FinancialProfile)
        .filter(
            FinancialProfile.user_id == current_user.user_id
        )
        .first()
    )

    if not profile:
        profile = FinancialProfile(
            user_id=current_user.user_id
        )
        db.add(profile)

    profile.monthly_income = data.get("monthly_income", 0)
    profile.monthly_expenses = data.get("monthly_expenses", 0)
    profile.existing_debts = data.get("existing_debts", 0)
    profile.lump_sum_available = data.get("lump_sum_available", 0)

    db.commit()

    return {
        "message": "Financial profile updated successfully."
    }