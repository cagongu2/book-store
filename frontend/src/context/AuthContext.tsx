import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import axios from "axios";
import { Customer } from "../types/customer.types";
import { ApiResponse } from "../types/api.types";

interface AuthContextType {
  currentUser: Customer | null;
  loading: boolean;
  registerUser: (email: string, password: string, displayName?: string) => Promise<any>;
  loginUser: (email: string, password: string) => Promise<any>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvide");
  }
  return context;
};

const getBaseUrl = () => {
    return "http://localhost:5000/api/v1";
}

export const AuthProvide = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);

  // Initialize from token
  useEffect(() => {
    const token = localStorage.getItem("customerToken");
    if (token) {
      axios.get<ApiResponse<{ customer: Customer }>>(`${getBaseUrl()}/customers/profile`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then(res => {
        if (res.data.success && res.data.data?.customer) {
          setCurrentUser(res.data.data.customer);
        } else {
          localStorage.removeItem("customerToken");
        }
      })
      .catch(err => {
        console.error("Failed to fetch profile", err);
        localStorage.removeItem("customerToken");
      })
      .finally(() => {
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, []);

  const registerUser = async (email: string, password: string, displayName?: string) => {
    const res = await axios.post<ApiResponse<{ token: string; customer: Customer }>>(`${getBaseUrl()}/customers/register`, {
      email,
      password,
      displayName
    });
    
    if (res.data.success && res.data.data) {
      localStorage.setItem("customerToken", res.data.data.token);
      setCurrentUser(res.data.data.customer);
    }
    return res.data;
  };

  const loginUser = async (email: string, password: string) => {
    const res = await axios.post<ApiResponse<{ token: string; customer: Customer }>>(`${getBaseUrl()}/customers/login`, {
      email,
      password
    });

    if (res.data.success && res.data.data) {
      localStorage.setItem("customerToken", res.data.data.token);
      setCurrentUser(res.data.data.customer);
    }
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem("customerToken");
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