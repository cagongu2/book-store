import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();
const API_URL = "http://localhost:5000/api/v1";

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvide = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (token) => {
    try {
      const response = await fetch(`${API_URL}/customers/profile`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setCurrentUser(data.customer);
      } else {
        localStorage.removeItem('customerToken');
        setCurrentUser(null);
      }
    } catch (error) {
      console.error("Failed to fetch profile", error);
      setCurrentUser(null);
    } finally {
      setLoading(false);
    }
  };

  // Check auth on mount
  useEffect(() => {
    const token = localStorage.getItem('customerToken');
    if (token) {
      fetchProfile(token);
    } else {
      setLoading(false);
    }
  }, []);

  // register a user
  const registerUser = async (email, password) => {
    const response = await fetch(`${API_URL}/customers/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });
    const data = await response.json();
    
    if (response.ok && data.token) {
      localStorage.setItem('customerToken', data.token);
      setCurrentUser(data.customer);
      return data;
    }
    throw new Error(data.message || "Registration failed");
  };

  // login the user
  const loginUser = async (email, password) => {
    const response = await fetch(`${API_URL}/customers/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });
    const data = await response.json();
    
    if (response.ok && data.token) {
      localStorage.setItem('customerToken', data.token);
      setCurrentUser(data.customer);
      return data;
    }
    throw new Error(data.message || "Login failed");
  };

  // logout the user
  const logout = () => {
    localStorage.removeItem('customerToken');
    setCurrentUser(null);
  };

  const value = {
    currentUser,
    loading,
    registerUser,
    loginUser,
    logout,
  };
  
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};