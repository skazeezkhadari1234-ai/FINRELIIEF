import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

import "../styles/FinancialHealth.css";

export default function FinancialHealth() {

    const navigate = useNavigate();

    const [health, setHealth] = useState(null);

    const [form, setForm] = useState({
    monthly_income: 0,
    monthly_expenses: 0,
    existing_debts: 0,
    lump_sum_available: 0
});

    const [loading, setLoading] = useState(true);

    useEffect(() => {

        loadFinancialHealth();

    }, []);

    async function loadFinancialHealth() {

        try {

            const res = await api.get(
                "/financial-health"
            );

            setHealth(res.data);

            setHealth(res.data);

setForm({
    monthly_income: res.data.monthly_income || 0,
    monthly_expenses: res.data.monthly_expenses || 0,
    existing_debts: res.data.existing_debts || 0,
    lump_sum_available: res.data.lump_sum_available || 0
});

        }

        catch (err) {

            console.log(err);

        }

        finally {

            setLoading(false);

        }

    }
    async function saveFinancialHealth() {
    try {
        await api.post("/financial-health", form);

        alert("Financial Profile Saved Successfully");

        loadFinancialHealth();

    } catch (err) {
        console.log(err);
        alert("Failed to save profile");
    }
}

    if (loading) {

        return (

            <div className="loading">

                Loading Financial Health...

            </div>

        );

    }

    return (

        <div className="financial-page">

            {/* Sidebar */}

            <aside className="sidebar">

                <h2>FinRelief AI</h2>

                <ul>

                    <li onClick={() => navigate("/dashboard")}>
                        Dashboard
                    </li>

                    <li className="active">
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

                </ul>

            </aside>

            {/* Main */}

            <main className="content">

                <h1>

                    Financial Health Dashboard

                </h1>

                <div className="health-grid">

                    <div className="card">

                        <h3>Monthly Income</h3>

                        <h2>

                            ₹ {health.monthly_income}

                        </h2>

                    </div>

                    <div className="card">
    <h3>Monthly Expenses</h3>
    <h2>
        ₹ {health.monthly_expenses}
    </h2>
</div>

<div className="card">
    <h3>Monthly Surplus</h3>
    <h2>
        ₹ {health.monthly_surplus}
    </h2>
</div>

                    <div className="card">

                        <h3>Total EMI</h3>

                        <h2>

                            ₹ {health.total_emi}

                        </h2>

                    </div>

                    <div className="card">

                        <h3>Total Outstanding</h3>

                        <h2>

                            ₹ {health.total_outstanding}

                        </h2>

                    </div>

                    <div className="card">

                        <h3>Debt To Income Ratio</h3>

                        <h2>

                            {health.debt_to_income_ratio}%

                        </h2>

                    </div>

                    <div className="card">

                        <h3>EMI Ratio</h3>

                        <h2>

                            {health.emi_ratio}%

                        </h2>

                    </div>

                    <div className="card">

                        <h3>Financial Stress</h3>

                        <h2
                            className={
                                health.stress_level === "High"
                                    ? "high"
                                    : health.stress_level === "Medium"
                                    ? "medium"
                                    : "low"
                            }
                        >
                            {health.stress_level}
                        </h2>

                    </div>

                </div>

                {/* Progress */}

                <section className="progress-section">

                    <h2>Financial Health Score</h2>

                    <div className="progress-bar">

                        <div
                            className="progress-fill"
                            style={{
                                width:
                                    health.stress_level === "Low"
                                        ? "90%"
                                        : health.stress_level === "Medium"
                                        ? "60%"
                                        : "30%"
                            }}
                        ></div>

                    </div>

                </section>

                {/* AI Tips */}

                <section className="tips">

                    <h2>Financial Improvement Tips</h2>

                    <ul>

                        <li>
                            Prioritize repayment of high-interest loans.
                        </li>

                        <li>
                            Maintain a positive monthly surplus.
                        </li>

                        <li>
                            Avoid taking additional loans.
                        </li>

                        <li>
                            Request settlement for long overdue accounts.
                        </li>

                        <li>
                            Negotiate lower EMI whenever possible.
                        </li>

                    </ul>

                </section>
                <section className="profile-form">

    <h2>Update Financial Profile</h2>

    <input
        type="number"
        name="monthly_income"
        placeholder="Monthly Income"
        value={form.monthly_income}
        onChange={(e) =>
            setForm({
                ...form,
                monthly_income: Number(e.target.value)
            })
        }
    />

    <input
        type="number"
        name="monthly_expenses"
        placeholder="Monthly Expenses"
        value={form.monthly_expenses}
        onChange={(e) =>
            setForm({
                ...form,
                monthly_expenses: Number(e.target.value)
            })
        }
    />

    <input
        type="number"
        name="existing_debts"
        placeholder="Existing Debts"
        value={form.existing_debts}
        onChange={(e) =>
            setForm({
                ...form,
                existing_debts: Number(e.target.value)
            })
        }
    />

    <input
        type="number"
        name="lump_sum_available"
        placeholder="Lump Sum Available"
        value={form.lump_sum_available}
        onChange={(e) =>
            setForm({
                ...form,
                lump_sum_available: Number(e.target.value)
            })
        }
    />

    <button onClick={saveFinancialHealth}>
        Save Financial Profile
    </button>

</section>

            </main>

        </div>

    );

}
    