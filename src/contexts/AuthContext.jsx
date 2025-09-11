import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  // Check authentication status on mount
  useEffect(() => {
    const token = localStorage.getItem("Token");
    const userId = localStorage.getItem("user_id");
    
    if (token && userId) {
      setIsLoggedIn(true);
      setUser({ id: userId, token });
    }
  }, []);

  const login = (userData) => {
    localStorage.setItem("Token", userData.token);
    localStorage.setItem("user_id", userData.user.id);
    setIsLoggedIn(true);
    setUser(userData.user);
  };

  const logout = () => {
    localStorage.removeItem("Token");
    localStorage.removeItem("user_id");
    setIsLoggedIn(false);
    setUser(null);
  };

  const value = {
    isLoggedIn,
    user,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
