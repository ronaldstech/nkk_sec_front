import React, { createContext, useState, useEffect, useContext } from 'react';

export const AppContext = createContext({});
const API_URL = "http://localhost/nkk_sec/api/index.php";

export const AppProvider = ({ children }) => {
    const [user, setUser] = useState({
        id: 0,
        username: "user",
        email: "user@gmail.com",
        picture: "pro_file.png",
        role: "",
        phone: "",
        district_data: {
            name: ""
        }
    });

    const [academic, setAcademic] = useState({
        id: 0,
        name: "Academic Name"
    });

    const getUser = async () => {
        try {
            const response = await fetch(`${API_URL}?getUser=true`);
            if (response.ok) {
                const res = await response.json();
                if (res) {
                    setUser(res);
                }
            }
        } catch (error) {
            console.error("Failed to fetch user:", error);
        }
    }

    const getAcademic = async () => {
        try {
            const response = await fetch(`${API_URL}?getAcademic=true`);
            if (response.ok) {
                const res = await response.json();
                if (res) {
                    setAcademic(res);
                }
                console.log(res);
            }
        } catch (error) {
            console.error("Failed to fetch academic data:", error);
        }
    }

    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const login = (userData) => {
        setIsAuthenticated(true);
        setUser({ ...user, ...userData, username: userData.username || "User" });
    };

    const logout = () => {
        setIsAuthenticated(false);
    };

    useEffect(() => {
        // Optional: Check for existing session here
        getUser();
        getAcademic();
    }, []);

    return (
        <AppContext.Provider value={{ user, academic, setUser, setAcademic, getUser, getAcademic, isAuthenticated, login, logout }}>
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => useContext(AppContext);
