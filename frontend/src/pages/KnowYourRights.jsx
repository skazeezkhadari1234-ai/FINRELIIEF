import { useNavigate } from "react-router-dom";

import "../styles/KnowYourRights.css";

export default function KnowYourRights() {

    const navigate = useNavigate();

    return (

        <div className="rights-page">

            {/* Sidebar */}

            <aside className="sidebar">

                <h2>FinRelief AI</h2>

                <ul>

                    <li onClick={() => navigate("/dashboard")}>
                        Dashboard
                    </li>

                    <li onClick={() => navigate("/financial-health")}>
                        Financial Health
                    </li>

                    <li onClick={() => navigate("/settlement")}>
                        Settlement Predictor
                    </li>

                    <li onClick={() => navigate("/negotiation")}>
                        Negotiation Letter
                    </li>

                    <li onClick={() => navigate("/history")}>
                        History
                    </li>

                    <li className="active">
                        Know Your Rights
                    </li>

                </ul>

            </aside>

            {/* Main Content */}

            <main className="content">

                <h1>

                    Borrower Rights & Financial Guidance

                </h1>

                <div className="rights-grid">

                    <div className="rights-card">

                        <h2>
                            RBI Guidelines
                        </h2>

                        <p>
                            Borrowers have the right to fair,
                            transparent and respectful loan
                            recovery practices.
                        </p>

                    </div>

                    <div className="rights-card">

                        <h2>
                            Recovery Agents
                        </h2>

                        <p>
                            Recovery agents cannot threaten,
                            harass or intimidate borrowers.
                            Complaints may be filed against
                            violations.
                        </p>

                    </div>

                    <div className="rights-card">

                        <h2>
                            Loan Settlement
                        </h2>

                        <p>
                            Always request a written settlement
                            agreement and No Due Certificate
                            after completing payment.
                        </p>

                    </div>

                    <div className="rights-card">

                        <h2>
                            Banking Ombudsman
                        </h2>

                        <p>
                            Borrowers may approach the RBI
                            Integrated Ombudsman Scheme for
                            unresolved complaints against
                            banks and financial institutions.
                        </p>

                    </div>

                    <div className="rights-card">

                        <h2>
                            Financial Planning
                        </h2>

                        <ul>

                            <li>
                                Maintain emergency savings.
                            </li>

                            <li>
                                Pay high-interest loans first.
                            </li>

                            <li>
                                Avoid unnecessary borrowing.
                            </li>

                            <li>
                                Track monthly expenses.
                            </li>

                            <li>
                                Build a positive repayment
                                history.
                            </li>

                        </ul>

                    </div>

                    <div className="rights-card">

                        <h2>
                            AI Recommendations
                        </h2>

                        <p>

                            FinRelief AI recommends:

                        </p>

                        <ul>

                            <li>
                                Negotiate early with lenders.
                            </li>

                            <li>
                                Request EMI restructuring if
                                income has reduced.
                            </li>

                            <li>
                                Consider one-time settlement
                                for long overdue loans.
                            </li>

                            <li>
                                Keep all communication in
                                writing.
                            </li>

                        </ul>

                    </div>

                </div>

                <section className="help-section">

                    <h2>

                        Emergency Financial Help

                    </h2>

                    <div className="help-card">

                        <h3>

                            Useful Contacts

                        </h3>

                        <p>

                            • RBI Integrated Ombudsman

                        </p>

                        <p>

                            • National Consumer Helpline

                        </p>

                        <p>

                            • Legal Aid Services

                        </p>

                        <p>

                            • Certified Financial Counsellors

                        </p>

                    </div>

                </section>

            </main>

        </div>

    );

}