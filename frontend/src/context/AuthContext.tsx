import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { callApi } from "../core/api/handleApi";
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
// getBaseUrl is configured in axios-client already, so we just pass the path.

export const AuthProvide = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);

  // Initialize from token
  useEffect(() => {
    const token = localStorage.getItem("customerToken");
    if (token) {
      callApi<{ customer: Customer }>("/customers/profile", null, "get")
      .then(res => {
        if (res.success && res.data?.customer) {
          setCurrentUser(res.data.customer);
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
    const res = await callApi<{ token: string; customer: Customer }>("/customers/register", {
      email,
      password,
      displayName
    }, "post");
    
    if (res.success && res.data) {
      localStorage.setItem("customerToken", res.data.token);
      setCurrentUser(res.data.customer);
    }
    return res;
  };

  const loginUser = async (email: string, password: string) => {
    const res = await callApi<{ token: string; customer: Customer }>("/customers/login", {
      email,
      password
    }, "post");

    if (res.success && res.data) {
      localStorage.setItem("customerToken", res.data.token);
      setCurrentUser(res.data.customer);
    }
    return res;
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