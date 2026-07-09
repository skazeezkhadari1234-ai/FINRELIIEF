import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import FinancialHealth from "./pages/FinancialHealth";
import SettlementPredictor from "./pages/SettlementPredictor";
import NegotiationEmail from "./pages/NegotiationEmail";
import History from "./pages/History";
import KnowYourRights from "./pages/KnowYourRights";

function App() {

    return (

        <Routes>

            <Route
                path="/"
                element={<Navigate to="/login" />}
            />

            <Route
                path="/login"
                element={<Login />}
            />

            <Route
                path="/dashboard"
                element={<Dashboard />}
            />

            <Route
                path="/financial-health"
                element={<FinancialHealth />}
            />

            <Route
                path="/settlement"
                element={<SettlementPredictor />}
            />

            <Route
                path="/negotiation"
                element={<NegotiationEmail />}
            />

            <Route
                path="/history"
                element={<History />}
            />

            <Route
                path="/rights"
                element={<KnowYourRights />}
            />

        </Routes>

    );

}

export default App;