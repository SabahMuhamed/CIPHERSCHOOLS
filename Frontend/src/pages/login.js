import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";


export default function Login() {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post("http://localhost:3001/login", { username, password });
            const { token, user } = response.data;

            localStorage.setItem("token", token);
            localStorage.setItem("user", JSON.stringify(user));

            try {
                const filesResponse = await axios.get(`http://localhost:3001/getFiles/${user._id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                localStorage.setItem("files", JSON.stringify(filesResponse.data));
            } catch (fileErr) {
                console.warn("Could not fetch user files:", fileErr); 
                localStorage.setItem("files", JSON.stringify({}));
            }

            alert(" Login successful!");
            navigate("/app");
        } catch (err) {
            console.error("Login failed:", err);
            alert(err.response?.data?.message || "Login failed");
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
                padding: "1rem", // adds breathing room on small screens
            }}
        >
            <div
                style={{
                    backgroundColor: "#1e293b",
                    padding: "2.5rem",
                    borderRadius: "12px",
                    width: "100%",
                    maxWidth: "380px", // ✅ sets a limit but allows flexibility
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
                    Login
                </h2>

                <form
                    onSubmit={handleLogin}
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
                            transition: "0.3s",
                            fontSize: "1rem",
                        }}
                    >
                        Login
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
                    Don’t have an account?{" "}
                    <button
                        onClick={() => navigate("/signup")}
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
                        Signup
                    </button>
                </p>
            </div>
        </div>

    );
}



