export default function LoanCard({

    loan

}) {

    return (

        <div className="loan-card">

            <h3>

                {loan.lender_name}

            </h3>

            <p>

                Loan Type :
                {loan.loan_type}

            </p>

            <p>

                Outstanding :
                ₹ {loan.outstanding_amount}

            </p>

            <p>

                Interest :
                {loan.interest_rate}%

            </p>

            <p>

                EMI :
                ₹ {loan.emi}

            </p>

            <p>

                Overdue :
                {loan.overdue_months} Months

            </p>

        </div>

    );

}