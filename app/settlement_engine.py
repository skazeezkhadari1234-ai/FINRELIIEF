from app.models import Loan


class SettlementEngine:

    @staticmethod
    def calculate_settlement(
        loan: Loan,
        financial_health: dict
    ):
        """
        Calculate settlement recommendation for a loan.
        """

        settlement_percent = 50
        risk_score = 0

        # -------------------------
        # Overdue Analysis
        # -------------------------
        if loan.overdue_months >= 6:
            settlement_percent += 10
            risk_score += 30

        elif loan.overdue_months >= 3:
            settlement_percent += 5
            risk_score += 20

        # -------------------------
        # EMI Ratio
        # -------------------------
        if financial_health["emi_ratio"] > 50:
            settlement_percent += 5
            risk_score += 15

        # -------------------------
        # Interest Rate
        # -------------------------
        if loan.interest_rate >= 15:
            settlement_percent += 5
            risk_score += 15

        elif loan.interest_rate >= 10:
            risk_score += 10

        # -------------------------
        # Debt-to-Income Ratio
        # -------------------------
        if financial_health["debt_to_income_ratio"] > 80:
            settlement_percent += 5
            risk_score += 20

        # -------------------------
        # Monthly Surplus
        # -------------------------
        if financial_health["monthly_surplus"] < 0:
            settlement_percent += 5
            risk_score += 10

        # Keep percentage realistic
        settlement_percent = max(
            40,
            min(settlement_percent, 75)
        )

        recommended_amount = round(
            loan.outstanding_amount *
            (settlement_percent / 100),
            2
        )

        # -------------------------
        # Risk Category
        # -------------------------
        if risk_score >= 60:
            risk = "High"

        elif risk_score >= 30:
            risk = "Medium"

        else:
            risk = "Low"

        return {

            "loan_id": loan.loan_id,

            "lender_name": loan.lender_name,

            "loan_type": loan.loan_type,

            "outstanding_amount": loan.outstanding_amount,

            "interest_rate": loan.interest_rate,

            "emi": loan.emi,

            "settlement_percentage": settlement_percent,

            "recommended_amount": recommended_amount,

            "risk_score": risk_score,

            "risk_category": risk

        }

    @staticmethod
    def analyze_all_loans(
        loans,
        financial_health
    ):

        result = []

        for loan in loans:

            settlement = (
                SettlementEngine.calculate_settlement(
                    loan,
                    financial_health
                )
            )

            result.append(settlement)

        result.sort(
            key=lambda x: x["risk_score"],
            reverse=True
        )

        return result