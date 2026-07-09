import os
from dotenv import load_dotenv

load_dotenv()

GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")


class AIEngine:

    @staticmethod
    def _call_gemini(prompt: str):

        if not GOOGLE_API_KEY:
            return None

        try:
            import google.generativeai as genai

            genai.configure(api_key=GOOGLE_API_KEY)

            model = genai.GenerativeModel("gemini-1.5-flash")

            response = model.generate_content(prompt)

            return response.text

        except ImportError:
            print("google-generativeai package not installed")
            return None

        except Exception as e:
            print("Gemini Error:", e)
            return None

    @staticmethod
    def generate_strategy(user, loans, financial_health):

        prompt = f"""
You are an expert financial advisor.

Borrower Name: {user.name}

Monthly Income: {financial_health['monthly_income']}

Monthly Expenses: {financial_health['monthly_expenses']}

Monthly Surplus: {financial_health['monthly_surplus']}

Debt To Income Ratio:
{financial_health['debt_to_income_ratio']}%

Stress Level:
{financial_health['stress_level']}

Loans:

"""

        for loan in loans:

            prompt += f"""

Lender: {loan.lender_name}

Loan Type: {loan.loan_type}

Outstanding:
₹{loan.outstanding_amount}

Interest:
{loan.interest_rate}%

EMI:
₹{loan.emi}

Overdue Months:
{loan.overdue_months}

"""

        prompt += """

Generate:

1. Best negotiation strategy

2. Financial recovery advice

3. Settlement recommendation

Return in professional format.

"""

        ai = AIEngine._call_gemini(prompt)

        if ai:
            return ai

        # Rule-based fallback
        return """
Settlement Strategy

• Contact lenders before legal action.

• Request settlement after explaining hardship.

• Negotiate interest waiver.

• Ask for EMI restructuring.

• Prioritize high-interest loans first.

• Maintain regular communication.

• Request written settlement confirmation.

"""

    @staticmethod
    def generate_email(user, loan):

        prompt = f"""
Write a professional debt settlement request letter.

Borrower:
{user.name}

Lender:
{loan.lender_name}

Loan Type:
{loan.loan_type}

Outstanding:
₹{loan.outstanding_amount}

Be polite.

Request settlement.

Request interest waiver.

Mention financial hardship.

"""

        email = AIEngine._call_gemini(prompt)

        if email:
            return email

        # Rule-based fallback

        return f"""
Subject: Request for Loan Settlement

Dear {loan.lender_name},

I hope you are doing well.

Due to financial hardship, I am unable to continue regular repayment of my {loan.loan_type} loan.

I kindly request your support in providing a one-time settlement option and, if possible, a waiver of additional interest or penalties.

I am committed to resolving my outstanding balance and sincerely appreciate your consideration.

Thank you.

Regards,

{user.name}
"""
