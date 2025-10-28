import React, { createContext, useState, useEffect } from "react";

export const EditorContext = createContext();

export const EditorProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    return (
        <EditorContext.Provider value={{ user, setUser, loading }}>
            {children}
        </EditorContext.Provider>
    );
};
