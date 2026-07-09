from typing import List
from app.models import Loan


class FinancialEngine:

    @staticmethod
    def calculate_financial_health(
        monthly_income: float,
        monthly_expenses: float,
        loans: List[Loan]
    ):

        total_emi = sum(loan.emi or 0 for loan in loans)

        total_outstanding = sum(
            loan.outstanding_amount or 0 for loan in loans
        )

        monthly_surplus = (
            monthly_income
            - monthly_expenses
            - total_emi
        )

        if monthly_income > 0:
            emi_ratio = round(
                (total_emi / monthly_income) * 100,
                2
            )

            debt_to_income_ratio = round(
                (total_outstanding / monthly_income) * 100,
                2
            )
        else:
            emi_ratio = 0
            debt_to_income_ratio = 0

        if emi_ratio < 30:
            stress = "Low"

        elif emi_ratio < 50:
            stress = "Medium"

        else:
            stress = "High"

        return {
            "monthly_income": monthly_income,
            "monthly_expenses": monthly_expenses,
            "monthly_surplus": monthly_surplus,
            "total_emi": total_emi,
            "total_outstanding": total_outstanding,
            "emi_ratio": emi_ratio,
            "debt_to_income_ratio": debt_to_income_ratio,
            "stress_level": stress
        }

    @staticmethod
    def analyze_loan_priority(loans: List[Loan]):

        priority_list = []

        for loan in loans:

            score = 0

            if loan.overdue_months >= 6:
                score += 40

            elif loan.overdue_months >= 3:
                score += 25

            if loan.interest_rate >= 15:
                score += 30

            elif loan.interest_rate >= 10:
                score += 15

            if loan.emi >= 15000:
                score += 30

            elif loan.emi >= 7000:
                score += 15

            if score >= 70:
                priority = "High"

            elif score >= 40:
                priority = "Medium"

            else:
                priority = "Low"

            priority_list.append({

                "loan_id": loan.loan_id,

                "lender_name": loan.lender_name,

                "loan_type": loan.loan_type,

                "priority": priority,

                "priority_score": score,

                "outstanding_amount": loan.outstanding_amount,

                "interest_rate": loan.interest_rate,

                "emi": loan.emi

            })

        priority_list.sort(
            key=lambda x: x["priority_score"],
            reverse=True
        )

        return priority_list

    @staticmethod
    def simulate_repayment(
        outstanding: float,
        monthly_payment: float,
        extra_payment: float = 0
    ):

        balance = outstanding

        timeline = []

        month = 1

        payment = monthly_payment + extra_payment

        while balance > 0:

            balance -= payment

            if balance < 0:
                balance = 0

            timeline.append({

                "month": month,

                "remaining_balance": round(balance, 2)

            })

            month += 1

            if month > 600:
                break

        return timeline