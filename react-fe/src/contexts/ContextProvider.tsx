import React, { createContext, useContext, useEffect, useState } from "react";

const StateContext = createContext({
    user: null,
    token: null,
    setUser: () => {},
    setToken: () => {},
});

export const ContextProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<any | null>(() => {
        const storedUser = localStorage.getItem("USER");
        return storedUser ? JSON.parse(storedUser) : null;
    });

    const [token, setToken] = useState<string | null>(() => {
        const storedToken = localStorage.getItem("ACCESS_TOKEN");
        return storedToken || null;
    });

    useEffect(() => {
        localStorage.setItem("USER", JSON.stringify(user));
    }, [user]);

    useEffect(() => {
        if (token) {
            localStorage.setItem("ACCESS_TOKEN", token);
        } else {
            localStorage.removeItem("ACCESS_TOKEN");
        }
    }, [token]);

    return (
        <StateContext.Provider value={{ user, token, setUser, setToken }}>
            {children}
        </StateContext.Provider>
    );
};

export const useStateContext = () => useContext(StateContext);
