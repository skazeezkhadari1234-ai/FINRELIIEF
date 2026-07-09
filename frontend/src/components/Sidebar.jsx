import { NavLink } from "react-router-dom";

import "./Sidebar.css";

export default function Sidebar() {

    return (

        <aside className="sidebar">

            <div className="logo">

                <h2>FinRelief AI</h2>

                <p>Debt Recovery Platform</p>

            </div>

            <nav>

                <NavLink to="/dashboard">
                    Dashboard
                </NavLink>

                <NavLink to="/financial-health">
                    Financial Health
                </NavLink>

                <NavLink to="/settlement">
                    Settlement Predictor
                </NavLink>

                <NavLink to="/negotiation">
                    Negotiation Letter
                </NavLink>

                <NavLink to="/history">
                    History
                </NavLink>

                <NavLink to="/rights">
                    Know Your Rights
                </NavLink>

            </nav>

        </aside>

    );

}