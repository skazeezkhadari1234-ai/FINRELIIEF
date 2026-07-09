from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import User, Loan
from app.schemas import LoanCreate, LoanResponse
from app.auth import get_current_user

router = APIRouter()


# ==========================
# Add Loan
# ==========================

@router.post("/add-loan", response_model=LoanResponse)
def add_loan(
    loan: LoanCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    new_loan = Loan(
        user_id=current_user.user_id,
        lender_name=loan.lender_name,
        loan_type=loan.loan_type,
        loan_amount=loan.loan_amount,
        outstanding_amount=loan.outstanding_amount,
        interest_rate=loan.interest_rate,
        emi=loan.emi,
        overdue_months=loan.overdue_months,
        due_date=loan.due_date
    )

    db.add(new_loan)
    db.commit()
    db.refresh(new_loan)

    return new_loan


# ==========================
# Get All Loans
# ==========================

@router.get("/loans")
def get_loans(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    loans = (
        db.query(Loan)
        .filter(Loan.user_id == current_user.user_id)
        .all()
    )

    return loans


# ==========================
# Get Loan by ID
# ==========================

@router.get("/loan/{loan_id}")
def get_loan(
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
        raise HTTPException(
            status_code=404,
            detail="Loan not found"
        )

    return loan


# ==========================
# Update Loan
# ==========================

@router.put("/update-loan/{loan_id}")
def update_loan(
    loan_id: int,
    updated: LoanCreate,
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
        raise HTTPException(
            status_code=404,
            detail="Loan not found"
        )

    loan.lender_name = updated.lender_name
    loan.loan_type = updated.loan_type
    loan.loan_amount = updated.loan_amount
    loan.outstanding_amount = updated.outstanding_amount
    loan.interest_rate = updated.interest_rate
    loan.emi = updated.emi
    loan.overdue_months = updated.overdue_months
    loan.due_date = updated.due_date

    db.commit()
    db.refresh(loan)

    return {
        "message": "Loan updated successfully",
        "loan": loan
    }


# ==========================
# Delete Loan
# ==========================

@router.delete("/delete-loan/{loan_id}")
def delete_loan(
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
        raise HTTPException(
            status_code=404,
            detail="Loan not found"
        )

    db.delete(loan)
    db.commit()

    return {
        "message": "Loan deleted successfully"
    }