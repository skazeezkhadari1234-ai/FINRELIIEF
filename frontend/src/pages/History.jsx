import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

import "../styles/History.css";

export default function History() {

    const navigate = useNavigate();

    const [history, setHistory] = useState(null);

    const [loading, setLoading] = useState(true);

    useEffect(() => {

        loadHistory();

    }, []);

    async function loadHistory() {

        try {

            const res = await api.get("/history");

            setHistory(res.data);

        }

        catch (err) {

            console.log(err);

        }

        finally {

            setLoading(false);

        }

    }

    async function clearHistory() {

        if (!window.confirm("Clear AI history?"))
            return;

        try {

            await api.delete("/clear-history");

            loadHistory();

        }

        catch {

            alert("Unable to clear history.");

        }

    }

    if (loading)

        return (

            <div className="loading">

                Loading History...

            </div>

        );

    return (

        <div className="history-page">

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

                    <li className="active">
                        History
                    </li>

                    <li onClick={() => navigate("/rights")}>
                        Know Your Rights
                    </li>

                </ul>

            </aside>

            <main className="content">

                <div className="header">

                    <h1>

                        AI History

                    </h1>

                    <button
                        className="danger-btn"
                        onClick={clearHistory}
                    >

                        Clear History

                    </button>

                </div>

                <div className="summary-grid">

                    <div className="summary-card">

                        <h3>Total Loans</h3>

                        <h2>

                            {history.total_loans}

                        </h2>

                    </div>

                    <div className="summary-card">

                        <h3>AI Requests</h3>

                        <h2>

                            {history.total_ai_requests}

                        </h2>

                    </div>

                    <div className="summary-card">

                        <h3>Settlement Predictions</h3>

                        <h2>

                            {history.total_settlement_predictions}

                        </h2>

                    </div>

                </div>

                <section className="history-section">

                    <h2>

                        AI Negotiation History

                    </h2>

                    {history.ai_history.length === 0 ? (

                        <p>

                            No AI history available.

                        </p>

                    ) : (

                        history.ai_history.map((item) => (

                            <div
                                key={item.history_id}
                                className="history-card"
                            >

                                <small>

                                    {new Date(
                                        item.generated_at
                                    ).toLocaleString()}

                                </small>

                                <pre>

                                    {item.ai_response}

                                </pre>

                            </div>

                        ))

                    )}

                </section>

                <section className="history-section">

                    <h2>

                        Settlement History

                    </h2>

                    <table className="history-table">

                        <thead>

                            <tr>

                                <th>ID</th>

                                <th>Prediction</th>

                                <th>Amount</th>

                                <th>Priority</th>

                            </tr>

                        </thead>

                        <tbody>

                            {history.settlement_history.map((item) => (

                                <tr key={item.settlement_id}>

                                    <td>

                                        {item.settlement_id}

                                    </td>

                                    <td>

                                        {item.settlement_prediction}

                                    </td>

                                    <td>

                                        ₹ {item.recommended_amount}

                                    </td>

                                    <td>

                                        {item.priority_level}

                                    </td>

                                </tr>

                            ))}

                        </tbody>

                    </table>

                </section>

            </main>

        </div>

    );

}