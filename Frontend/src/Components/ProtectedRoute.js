import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
    const [isAuth, setIsAuth] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem("token");
        setIsAuth(!!token);
    }, []);

    if (isAuth === null) {
        return <div style={{ color: "white", textAlign: "center" }}>Loading...</div>;
    }

    return isAuth ? children : <Navigate to="/login" replace />;
}
