"use client";

import React, { createContext, useState, useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { User, AuthTokens, LoginResponse } from "@/types/auth";
import { loginUser, signupUser } from "@/services/auth/api";
import { toast } from "sonner";

interface LoginData {
  email: string;
  password: string;
}

interface SignupData {
  email: string;
  password: string;
  phone: string;
  store_name: string;
}

// Define error response structure
interface ErrorResponse {
  response?: {
    status: number;
    data?: {
      errors?: Array<{
        message: string;
        code: string;
      }>;
      message?: string;
      error?: string;
      detail?: string;
    };
  };
  request?: unknown;
  message?: string;
}

interface AuthContextType {
  user: User | null;
  tokens: AuthTokens | null;
  login: (data: LoginData) => Promise<void>;
  signup: (data: SignupData) => Promise<void>;
  logout: () => void;
  updateTokens: (tokens: AuthTokens) => void;
  isLoading: boolean;
  isAuthenticated: boolean;
  // Email verification properties
  verificationEmail: string | null;
  setVerificationEmail: (email: string | null) => void;
  // JWT token utilities
  clearAuthData: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [tokens, setTokens] = useState<AuthTokens | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [verificationEmail, setVerificationEmail] = useState<string | null>(
    null
  );
  const router = useRouter();

  useEffect(() => {
    const storedTokens = localStorage.getItem("authTokens");
    const storedUser = localStorage.getItem("authUser");
    const storedVerificationEmail = localStorage.getItem("verificationEmail");

    if (storedVerificationEmail) {
      setVerificationEmail(storedVerificationEmail);
    }

    if (storedTokens && storedUser) {
      try {
        const parsedTokens: AuthTokens = JSON.parse(storedTokens);
        const parsedUser: User = JSON.parse(storedUser);

        // Validate that the tokens exist and are not empty
        if (parsedTokens.access_token && parsedUser.id) {
          setTokens(parsedTokens);
          setUser(parsedUser);
        } else {
          // Clear invalid data
          clearAuthData();
        }
      } catch (error) {
        console.error("Failed to parse stored auth data:", error);
        clearAuthData();
      }
    }
    setIsLoading(false);
  }, []);

  const handleAuthSuccess = (userData: User, tokenData: AuthTokens) => {
    setUser(userData);
    setTokens(tokenData);
    localStorage.setItem("authTokens", JSON.stringify(tokenData));
    localStorage.setItem("authUser", JSON.stringify(userData));
  };

  const updateTokens = (newTokens: AuthTokens) => {
    setTokens(newTokens);
    localStorage.setItem("authTokens", JSON.stringify(newTokens));
  };

  const clearAuthData = () => {
    setUser(null);
    setTokens(null);
    localStorage.removeItem("authTokens");
    localStorage.removeItem("authUser");
    localStorage.removeItem("verificationEmail");
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("redirectAfterLogin");
    }
  };

  const getErrorMessage = (error: ErrorResponse) => {
    // Handle different types of errors
    if (error.response) {
      const status = error.response.status;
      const data = error.response.data;

      // Handle errors array format: {status: 400, errors: [{message: "...", code: "..."}]}
      if (
        data?.errors &&
        Array.isArray(data.errors) &&
        data.errors.length > 0
      ) {
        const firstError = data.errors[0];

        // Check for specific error codes
        if (firstError.code === "too_many_login_attempts") {
          return "Too many failed login attempts. Please wait a few minutes before trying again.";
        }

        if (firstError.code === "invalid_credentials") {
          return "Invalid email or password. Please check your credentials and try again.";
        }

        if (firstError.code === "user_not_found") {
          return "Account not found. Please check your email address or sign up for a new account.";
        }

        if (firstError.code === "account_disabled") {
          return "Your account has been disabled. Please contact support for assistance.";
        }

        // Return the error message from the backend
        return firstError.message || "Login failed. Please try again.";
      }

      // Fallback to status code based handling
      switch (status) {
        case 401:
          return "Invalid email or password. Please check your credentials and try again.";
        case 400:
          if (data?.message) {
            return data.message;
          }
          if (data?.error) {
            return data.error;
          }
          if (data?.detail) {
            return data.detail;
          }
          return "Invalid login credentials. Please check your email and password.";
        case 403:
          return "Your account has been suspended or disabled. Please contact support.";
        case 404:
          return "Account not found. Please check your email address or sign up for a new account.";
        case 429:
          return "Too many login attempts. Please wait a few minutes before trying again.";
        case 500:
          return "Server error occurred. Please try again later.";
        default:
          return (
            data?.message ||
            data?.error ||
            data?.detail ||
            "Login failed. Please try again."
          );
      }
    } else if (error.request) {
      return "Network error. Please check your internet connection and try again.";
    } else {
      return error.message || "An unexpected error occurred. Please try again.";
    }
  };

  const login = async (data: LoginData) => {
    setIsLoading(true);
    try {
      const response: LoginResponse = await loginUser(data);

      // Extract user data and tokens from the response
      const userData = response.data.user;
      const loggedInUser: User = {
        id: userData.id,
        username: userData.username,
        email: data.email, // Use email from login data since it might not be in response
        store_name: userData.display, // Assuming display is the store name
        has_usable_password: userData.has_usable_password,
      };

      const tokens: AuthTokens = {
        access_token: userData.access_token,
        refresh_token: userData.refresh_token,
      };

      handleAuthSuccess(loggedInUser, tokens);

      toast.success("Login Successful", {
        description: "Welcome back!",
      });

      // Handle redirect after successful login
      if (typeof window !== "undefined") {
        // Check for redirect URL in sessionStorage first
        const redirectUrl = sessionStorage.getItem("redirectAfterLogin");

        if (redirectUrl) {
          // Clear the stored redirect URL
          sessionStorage.removeItem("redirectAfterLogin");
          // Redirect to the stored URL
          router.push(redirectUrl);
        } else {
          // Check URL parameters as fallback
          const urlParams = new URLSearchParams(window.location.search);
          const redirectParam = urlParams.get("redirect");

          if (redirectParam) {
            router.push(decodeURIComponent(redirectParam));
          } else {
            // Default redirect to home
            router.push("/");
          }
        }
      } else {
        // Fallback for server-side rendering
        router.push("/");
      }
    } catch (error) {
      const errorMessage = getErrorMessage(error as ErrorResponse);

      toast.error("Login Failed", {
        description: errorMessage,
      });

      console.error("Login error:", {
        message: (error as Error).message,
        status: (error as ErrorResponse).response?.status,
        data: (error as ErrorResponse).response?.data,
        error,
      });

      // Clear any corrupted auth data on login failure
      clearAuthData();

      // Re-throw the error so the form can handle it
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (data: SignupData) => {
    setIsLoading(true);
    try {
      const signupData = {
        email: data.email,
        password: data.password,
        store_name: data.store_name,
        phone: data.phone,
      };

      await signupUser(signupData);

      // Store verification email in context and localStorage
      setVerificationEmail(data.email);
      localStorage.setItem("verificationEmail", data.email);

      toast.success("Signup Successful", {
        description: "Please check your email to verify your account.",
      });

      // Redirect to verification page
      router.push("/signup/verify");
    } catch (error) {
      const errorMessage = getErrorMessage(error as ErrorResponse);

      toast.error("Signup Failed", {
        description: errorMessage,
      });

      console.error("Signup error:", {
        message: (error as Error).message,
        status: (error as ErrorResponse).response?.status,
        data: (error as ErrorResponse).response?.data,
        error,
      });

      // Re-throw the error so the form can handle it
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    clearAuthData();
    setVerificationEmail(null);

    toast.success("Logged Out", {
      description: "You have been successfully logged out.",
    });

    router.push("/login");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        tokens,
        login,
        signup,
        logout,
        updateTokens,
        isLoading,
        isAuthenticated: !!user && !!tokens?.access_token,
        verificationEmail,
        setVerificationEmail,
        clearAuthData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
