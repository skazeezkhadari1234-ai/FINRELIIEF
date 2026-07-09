import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import "../styles/Dashboard.css";

export default function Dashboard() {

    const navigate = useNavigate();

    const [dashboard, setDashboard] = useState(null);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");

    const [showLoanModal, setShowLoanModal] = useState(false);

    const [loanForm, setLoanForm] = useState({
        lender_name: "",
        loan_type: "",
        loan_amount: "",
        outstanding_amount: "",
        interest_rate: "",
        emi: "",
        overdue_months: "",
        due_date: ""
    });

    useEffect(() => {
        loadDashboard();
    }, []);

    async function loadDashboard() {

        try {

            setLoading(true);

            const res = await api.get("/dashboard-data");

            setDashboard(res.data);

            setMessage("");

        } catch (err) {

            console.log(err);

            setMessage("Unable to load dashboard.");

        } finally {

            setLoading(false);

        }

    }

    async function addLoan() {

        try {

            await api.post("/add-loan", loanForm);

            setShowLoanModal(false);

            loadDashboard();

        } catch {

            alert("Unable to add loan.");

        }

    }

    function logout() {

        localStorage.removeItem("token");

        navigate("/login");

    }

    if (loading) {

        return (
            <div className="loading">
                <h2>Loading Dashboard...</h2>
            </div>
        );

    }

    if (!dashboard) {

        return (
            <div className="loading">
                <h2>No Dashboard Data Found</h2>
            </div>
        );

    }

    const user = dashboard.user || {};

    const profile = dashboard.financial_profile || {};

    const health = dashboard.financial_health || {};

    const loans = dashboard.loans || [];

    return (

        <div className="dashboard">

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

                    <li onClick={() => navigate("/rights")}>
                        Know Your Rights
                    </li>

                    <li onClick={logout}>
                        Logout
                    </li>

                </ul>

            </aside>

            <main className="content">

                {message && (
                    <p style={{ color: "red" }}>
                        {message}
                    </p>
                )}

                <header className="dashboard-header">

                    <div>

                        <h1>
                            Welcome {user.name || "User"}
                        </h1>

                        <p>
                            AI Powered Debt Recovery Dashboard
                        </p>

                    </div>

                    <button
                        className="primary-btn"
                        onClick={() => setShowLoanModal(true)}
                    >
                        + Add Loan
                    </button>

                </header>
                                {/* Financial Cards */}

                <section className="card-grid">

                    <div className="card">
                        <h3>Monthly Income</h3>
                        <h2>₹ {profile.monthly_income ?? 0}</h2>
                    </div>

                    <div className="card">
                        <h3>Monthly Expenses</h3>
                        <h2>₹ {profile.monthly_expenses ?? 0}</h2>
                    </div>

                    <div className="card">
                        <h3>Monthly Surplus</h3>
                        <h2>₹ {health.monthly_surplus ?? 0}</h2>
                    </div>

                    <div className="card">
                        <h3>Total EMI</h3>
                        <h2>₹ {health.total_emi ?? 0}</h2>
                    </div>

                    <div className="card">
                        <h3>Total Outstanding</h3>
                        <h2>₹ {health.total_outstanding ?? 0}</h2>
                    </div>

                    <div className="card">
                        <h3>Stress Level</h3>
                        <h2>{health.stress_level || "Low"}</h2>
                    </div>

                </section>

                {/* Financial Profile */}

                <section className="profile-card">

                    <h2>Financial Profile</h2>

                    <table>

                        <tbody>

                            <tr>
                                <td>Monthly Income</td>
                                <td>₹ {profile.monthly_income ?? 0}</td>
                            </tr>

                            <tr>
                                <td>Monthly Expenses</td>
                                <td>₹ {profile.monthly_expenses ?? 0}</td>
                            </tr>

                            <tr>
                                <td>Existing Debts</td>
                                <td>₹ {profile.existing_debts ?? 0}</td>
                            </tr>

                            <tr>
                                <td>Lump Sum Available</td>
                                <td>₹ {profile.lump_sum_available ?? 0}</td>
                            </tr>

                        </tbody>

                    </table>

                </section>
                                {/* Active Loans */}

                <section className="loan-section">

                    <div className="section-header">
                        <h2>Active Loans</h2>
                    </div>

                    <table className="loan-table">

                        <thead>

                            <tr>
                                <th>Lender</th>
                                <th>Type</th>
                                <th>Loan Amount</th>
                                <th>Outstanding</th>
                                <th>Interest</th>
                                <th>EMI</th>
                                <th>Overdue</th>
                            </tr>

                        </thead>

                        <tbody>

                            {loans.length === 0 ? (

                                <tr>
                                    <td colSpan="7" style={{ textAlign: "center" }}>
                                        No Loans Found
                                    </td>
                                </tr>

                            ) : (

                                loans.map((loan) => (

                                    <tr key={loan.loan_id}>

                                        <td>{loan.lender_name}</td>
                                        <td>{loan.loan_type}</td>
                                        <td>₹ {loan.loan_amount}</td>
                                        <td>₹ {loan.outstanding_amount}</td>
                                        <td>{loan.interest_rate}%</td>
                                        <td>₹ {loan.emi}</td>
                                        <td>{loan.overdue_months} Months</td>

                                    </tr>

                                ))

                            )}

                        </tbody>

                    </table>

                </section>

                {/* Add Loan Modal */}

                {showLoanModal && (

                    <div className="modal-overlay">

                        <div className="modal">

                            <h2>Add Loan</h2>

                            <input
                                placeholder="Lender Name"
                                onChange={(e) =>
                                    setLoanForm({
                                        ...loanForm,
                                        lender_name: e.target.value
                                    })
                                }
                            />

                            <input
                                placeholder="Loan Type"
                                onChange={(e) =>
                                    setLoanForm({
                                        ...loanForm,
                                        loan_type: e.target.value
                                    })
                                }
                            />

                            <input
                                type="number"
                                placeholder="Loan Amount"
                                onChange={(e) =>
                                    setLoanForm({
                                        ...loanForm,
                                        loan_amount: e.target.value
                                    })
                                }
                            />

                            <input
                                type="number"
                                placeholder="Outstanding Amount"
                                onChange={(e) =>
                                    setLoanForm({
                                        ...loanForm,
                                        outstanding_amount: e.target.value
                                    })
                                }
                            />

                            <input
                                type="number"
                                placeholder="Interest Rate"
                                onChange={(e) =>
                                    setLoanForm({
                                        ...loanForm,
                                        interest_rate: e.target.value
                                    })
                                }
                            />

                            <input
                                type="number"
                                placeholder="Monthly EMI"
                                onChange={(e) =>
                                    setLoanForm({
                                        ...loanForm,
                                        emi: e.target.value
                                    })
                                }
                            />

                            <input
                                type="number"
                                placeholder="Overdue Months"
                                onChange={(e) =>
                                    setLoanForm({
                                        ...loanForm,
                                        overdue_months: e.target.value
                                    })
                                }
                            />

                            <input
                                type="date"
                                onChange={(e) =>
                                    setLoanForm({
                                        ...loanForm,
                                        due_date: e.target.value
                                    })
                                }
                            />

                            <div className="button-group">

                                <button
                                    className="primary-btn"
                                    onClick={addLoan}
                                >
                                    Save Loan
                                </button>

                                <button
                                    className="danger-btn"
                                    onClick={() => setShowLoanModal(false)}
                                >
                                    Cancel
                                </button>

                            </div>

                        </div>

                    </div>

                )}
                                {/* Dashboard Footer */}

                <footer className="dashboard-footer">

                    <p>© 2026 FinRelief AI</p>

                    <p>
                        AI-Powered Debt Relief & Financial Recovery Platform
                    </p>

                </footer>

            </main>

        </div>

    );

}