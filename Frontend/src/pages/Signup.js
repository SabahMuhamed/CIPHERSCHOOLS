import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Signup() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleSignup = async (e) => {
        e.preventDefault();

        try {
            const result = await axios.post("http://localhost:3001/register", {
                username,
                email,
                password,
            });

            if (result.data.message === "Username already exists") {
                alert("Username already exists");
            } else if (result.data.message === "Email already exists") {
                alert("Email already exists");
            } else if (result.data.message === "User registered successfully") {
                alert("Signup successful!");
                navigate("/login");
            } else {
                alert(result.data.message || "Unknown server response");
            }
        } catch (err) {
            console.error("Signup error:", err);
            if (err.response && err.response.data.message) {
                const msg = err.response.data.message;
                if (msg.includes("Username")) {
                    alert("Username already exists");
                } else if (msg.includes("Email")) {
                    alert("Email already exists");
                } else {
                    alert(msg);
                }
            } else {
                alert("Something went wrong. Please try again later.");
            }
        }
    };

    return (
        <div
            style={{
                height: "100vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "#0f172a",
                fontFamily: "Inter, sans-serif",
                padding: "1rem", // ✅ prevents edge clipping on small screens
            }}
        >
            <div
                style={{
                    backgroundColor: "#1e293b",
                    padding: "2.5rem",
                    borderRadius: "12px",
                    width: "100%",
                    maxWidth: "380px", // ✅ responsive width
                    boxShadow: "0 4px 15px rgba(0, 0, 0, 0.4)",
                    color: "#e2e8f0",
                    transition: "all 0.3s ease-in-out",
                }}
            >
                <h2
                    style={{
                        textAlign: "center",
                        marginBottom: "1.5rem",
                        color: "#38bdf8",
                        fontWeight: "600",
                        fontSize: "1.8rem",
                    }}
                >
                    Signup
                </h2>

                <form
                    onSubmit={handleSignup}
                    style={{
                        display: "flex",
                        flexDirection: "column",
                    }}
                >
                    <input
                        type="text"
                        placeholder="Username"
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        style={{
                            padding: "12px",
                            margin: "10px 0",
                            border: "1px solid #334155",
                            borderRadius: "8px",
                            background: "#0f172a",
                            color: "#e2e8f0",
                            outline: "none",
                            fontSize: "1rem",
                            width: "100%",
                        }}
                    />

                    <input
                        type="email"
                        placeholder="Email"
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        style={{
                            padding: "12px",
                            margin: "10px 0",
                            border: "1px solid #334155",
                            borderRadius: "8px",
                            background: "#0f172a",
                            color: "#e2e8f0",
                            outline: "none",
                            fontSize: "1rem",
                            width: "100%",
                        }}
                    />

                    <input
                        type="password"
                        placeholder="Password"
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        style={{
                            padding: "12px",
                            margin: "10px 0",
                            border: "1px solid #334155",
                            borderRadius: "8px",
                            background: "#0f172a",
                            color: "#e2e8f0",
                            outline: "none",
                            fontSize: "1rem",
                            width: "100%",
                        }}
                    />

                    <button
                        type="submit"
                        style={{
                            backgroundColor: "#38bdf8",
                            color: "#0f172a",
                            padding: "12px",
                            border: "none",
                            borderRadius: "8px",
                            cursor: "pointer",
                            marginTop: "15px",
                            fontWeight: "600",
                            fontSize: "1rem",
                            transition: "0.3s ease-in-out",
                        }}
                        onMouseOver={(e) =>
                            (e.target.style.backgroundColor = "#0ea5e9")
                        }
                        onMouseOut={(e) =>
                            (e.target.style.backgroundColor = "#38bdf8")
                        }
                    >
                        Signup
                    </button>
                </form>

                <p
                    style={{
                        textAlign: "center",
                        marginTop: "1rem",
                        color: "#94a3b8",
                        fontSize: "0.9rem",
                        lineHeight: "1.4",
                    }}
                >
                    Already have an account?{" "}
                    <button
                        onClick={() => navigate("/login")}
                        style={{
                            color: "#38bdf8",
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            fontWeight: "500",
                            textDecoration: "underline",
                            fontSize: "0.95rem",
                        }}
                    >
                        Login
                    </button>
                </p>
            </div>
        </div>
    );
}
