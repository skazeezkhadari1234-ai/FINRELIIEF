import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

import "../styles/SettlementPredictor.css";

export default function SettlementPredictor() {

    const navigate = useNavigate();

    const [data, setData] = useState(null);

    const [loading, setLoading] = useState(true);

    useEffect(() => {

        loadPrediction();

    }, []);

    async function loadPrediction() {

        try {

            const res = await api.get(
                "/settlement-predictor"
            );

            setData(res.data);

        }

        catch (err) {

            console.log(err);

        }

        finally {

            setLoading(false);

        }

    }

    if (loading) {

        return (

            <div className="loading">

                Loading Settlement Prediction...

            </div>

        );

    }

    return (

        <div className="settlement-page">

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

                    <li className="active">
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

            <main className="content">

                <h1>

                    AI Settlement Prediction

                </h1>

                <table className="prediction-table">

                    <thead>

                        <tr>

                            <th>Lender</th>

                            <th>Loan Type</th>

                            <th>Outstanding</th>

                            <th>Settlement %</th>

                            <th>Recommended Amount</th>

                            <th>Risk Score</th>

                            <th>Risk</th>

                        </tr>

                    </thead>

                    <tbody>

                        {data.settlements.map((loan) => (

                            <tr key={loan.loan_id}>

                                <td>

                                    {loan.lender_name}

                                </td>

                                <td>

                                    {loan.loan_type}

                                </td>

                                <td>

                                    ₹ {loan.outstanding_amount}

                                </td>

                                <td>

                                    {loan.settlement_percentage}%

                                </td>

                                <td>

                                    ₹ {loan.recommended_amount}

                                </td>

                                <td>

                                    {loan.risk_score}

                                </td>

                                <td>

                                    <span
                                        className={
                                            loan.risk_category === "High"
                                                ? "high"
                                                : loan.risk_category === "Medium"
                                                ? "medium"
                                                : "low"
                                        }
                                    >

                                        {loan.risk_category}

                                    </span>

                                </td>

                            </tr>

                        ))}

                    </tbody>

                </table>
                                <section className="summary">

                    <div className="summary-card">

                        <h3>

                            Total Outstanding

                        </h3>

                        <h2>

                            ₹ {data.financial_health.total_outstanding}

                        </h2>

                    </div>

                    <div className="summary-card">

                        <h3>

                            Monthly Surplus

                        </h3>

                        <h2>

                            ₹ {data.financial_health.monthly_surplus}

                        </h2>

                    </div>

                    <div className="summary-card">

                        <h3>

                            Debt-To-Income Ratio

                        </h3>

                        <h2>

                            {data.financial_health.debt_to_income_ratio}%

                        </h2>

                    </div>

                    <div className="summary-card">

                        <h3>

                            Stress Level

                        </h3>

                        <h2>

                            {data.financial_health.stress_level}

                        </h2>

                    </div>

                </section>

            </main>

        </div>

    );

}