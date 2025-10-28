import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";


export default function Header({ toggleSidebar }) {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        if (storedUser) {
            setUser(storedUser);
        }
    }, []);
    const handleAuth = () => {
        if (user) {
            // ✅ Logout logic
            localStorage.removeItem("user");
            setUser(null);
            alert("Logged out successfully!");
            navigate("/login");
        } else {
            // ✅ Redirect to login
            navigate("/login");
        }
    };
    const navigate = useNavigate()
    return (
        <header className="header">
            <div className="header-left">
                <button className="hamburger" onClick={toggleSidebar}>
                    &#9776;
                </button>
                <h1 className="header-title">React Code Editor</h1>
            </div>
            <h2>Welcome, {user ? user.username : "Guest"} 👋</h2>
            <button onClick={handleAuth} className="login-btn">
                {user ? "Logout" : "Login"}
            </button>
        </header>
    );
}
