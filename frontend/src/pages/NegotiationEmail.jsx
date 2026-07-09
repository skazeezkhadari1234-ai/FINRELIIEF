import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

import "../styles/NegotiationEmail.css";

export default function NegotiationEmail() {

    const navigate = useNavigate();

    const [loans, setLoans] = useState([]);

    const [selectedLoan, setSelectedLoan] = useState("");

    const [email, setEmail] = useState("");

    const [strategy, setStrategy] = useState("");

    const [loading, setLoading] = useState(false);

    useEffect(() => {

        loadLoans();

    }, []);

    async function loadLoans() {

        try {

            const res = await api.get("/loans");

            setLoans(res.data);

        }

        catch (err) {

            console.log(err);

        }

    }

    async function generateStrategy() {

        try {

            setLoading(true);

            const res = await api.get(
                "/ai-negotiation-strategy"
            );

            setStrategy(res.data.strategy);

        }

        catch (err) {

            alert("Unable to generate strategy.");

        }

        finally {

            setLoading(false);

        }

    }

    async function generateEmail() {

        if (!selectedLoan) {

            alert("Please select a loan.");

            return;

        }

        try {

            setLoading(true);

            const res = await api.get(
                `/generate-negotiation-email/${selectedLoan}`
            );

            setEmail(res.data.email);

        }

        catch (err) {

            alert("Unable to generate email.");

        }

        finally {

            setLoading(false);

        }

    }

    function copyEmail() {

        navigator.clipboard.writeText(email);

        alert("Negotiation letter copied.");

    }

    return (

        <div className="negotiation-page">

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

                    <li className="active">
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

                    AI Negotiation Strategy

                </h1>

                <button
                    className="primary-btn"
                    onClick={generateStrategy}
                >

                    Generate Strategy

                </button>

                {strategy && (

                    <div className="strategy-box">

                        <h2>Negotiation Strategy</h2>

                        <pre>{strategy}</pre>

                    </div>

                )}

                <h2>

                    Generate Negotiation Letter

                </h2>

                <select
                    value={selectedLoan}
                    onChange={(e) =>
                        setSelectedLoan(e.target.value)
                    }
                >

                    <option value="">

                        Select Loan

                    </option>

                    {loans.map((loan) => (

                        <option
                            key={loan.loan_id}
                            value={loan.loan_id}
                        >

                            {loan.lender_name} - {loan.loan_type}

                        </option>

                    ))}

                </select>

                <button
                    className="primary-btn"
                    onClick={generateEmail}
                    disabled={loading}
                >

                    {loading
                        ? "Generating..."
                        : "Generate Letter"}

                </button>

                {email && (

                    <>

                        <div className="email-box">

                            <pre>

                                {email}

                            </pre>

                        </div>

                        <button
                            className="primary-btn"
                            onClick={copyEmail}
                        >

                            Copy Letter

                        </button>

                    </>

                )}

            </main>

        </div>

    );

}