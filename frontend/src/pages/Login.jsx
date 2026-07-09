import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

import "../styles/Login.css";

export default function Login() {

    const navigate = useNavigate();

    const [isLogin, setIsLogin] = useState(true);

    const [form, setForm] = useState({

        name: "",

        email: "",

        password: ""

    });

    const [loading, setLoading] = useState(false);

    const [message, setMessage] = useState("");

    const handleChange = (e) => {

        setForm({

            ...form,

            [e.target.name]: e.target.value

        });

    };

    async function registerUser() {

        try {

            setLoading(true);

            const res = await api.post(

                "/register",

                {

                    name: form.name,

                    email: form.email,

                    password: form.password

                }

            );

            setMessage("Registration Successful.");

            setIsLogin(true);

        }

       catch (err) {

    const detail = err.response?.data?.detail;

    if (Array.isArray(detail)) {
        setMessage(detail[0]?.msg || "Login Failed.");
    } else {
        setMessage(detail || "Login Failed.");
    }

}


        finally {

            setLoading(false);

        }

    }

    async function loginUser() {

        try {

            setLoading(true);

            const data = new URLSearchParams();

            data.append("username", form.email);

            data.append("password", form.password);

            const res = await api.post(

                "/login",

                data,

                {

                    headers: {

                        "Content-Type":

                            "application/x-www-form-urlencoded"

                    }

                }

            );

            localStorage.setItem(

                "token",

                res.data.access_token

            );

            navigate("/dashboard");

        }

        catch (err) {

            setMessage(

                err.response?.data?.detail ||

                "Login Failed."

            );

        }

        finally {

            setLoading(false);

        }

    }

    const submit = (e) => {

        e.preventDefault();

        if (isLogin)

            loginUser();

        else

            registerUser();

    };
        return (
        <div className="login-container">

            <div className="login-card">

                <h1 className="title">
                    FinRelief AI
                </h1>

                <p className="subtitle">
                    AI-Powered Debt Relief &
                    Financial Recovery Platform
                </p>

                <div className="tab-container">

                    <button
                        className={isLogin ? "active" : ""}
                        onClick={() => {
                            setIsLogin(true);
                            setMessage("");
                        }}
                    >
                        Login
                    </button>

                    <button
                        className={!isLogin ? "active" : ""}
                        onClick={() => {
                            setIsLogin(false);
                            setMessage("");
                        }}
                    >
                        Register
                    </button>

                </div>

                <form
                    onSubmit={submit}
                    className="login-form"
                >

                    {!isLogin && (

                        <input
                            type="text"
                            name="name"
                            placeholder="Full Name"
                            value={form.name}
                            onChange={handleChange}
                            required
                        />

                    )}

                    <input
                        type="email"
                        name="email"
                        placeholder="Email Address"
                        value={form.email}
                        onChange={handleChange}
                        required
                    />

                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={form.password}
                        onChange={handleChange}
                        required
                    />

                    <button
                        type="submit"
                        disabled={loading}
                    >
                        {loading
                            ? "Please Wait..."
                            : isLogin
                            ? "Login"
                            : "Register"}
                    </button>

                </form>

                {message && (

                    <div className="message">
                        {message}
                    </div>

                )}

                <div className="footer">

                    {isLogin ? (
                        <p>
                            Don't have an account?
                            <span
                                onClick={() => {
                                    setIsLogin(false);
                                    setMessage("");
                                }}
                            >
                                {" "}
                                Register
                            </span>
                        </p>
                    ) : (
                        <p>
                            Already have an account?
                            <span
                                onClick={() => {
                                    setIsLogin(true);
                                    setMessage("");
                                }}
                            >
                                {" "}
                                Login
                            </span>
                        </p>
                    )}

                </div>

            </div>

        </div>
    );

}