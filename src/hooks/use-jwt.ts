import { useState, useEffect, useCallback, useRef } from "react";

interface JWTPayload {
  token_type: string;
  exp: number;
  iat: number;
  jti: string;
  user_id: number;
  email: string;
  store_name: string;
  has_profile: boolean;
  role: string;
  phone_number: string;
  domain: string;
  has_profile_completed: boolean;
}

interface DecodedUser {
  id: number;
  email: string;
  name: string;
  storeName: string;
  role: string;
  phoneNumber: string;
  domain: string;
  hasProfile: boolean;
  hasProfileCompleted: boolean;
  avatar?: string;
}

// Base64 URL decode function
function base64UrlDecode(str: string): string {
  str = str.replace(/-/g, "+").replace(/_/g, "/");
  while (str.length % 4) {
    str += "=";
  }

  try {
    const decoded = atob(str);
    return decodeURIComponent(escape(decoded));
  } catch (error) {
    console.error("Error decoding base64:", error);
    return "";
  }
}

// JWT decode function
function decodeJWT(token: string): JWTPayload | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) {
      console.error("Invalid JWT format");
      return null;
    }

    const payload = base64UrlDecode(parts[1]);
    if (!payload) {
      console.error("Failed to decode JWT payload");
      return null;
    }

    return JSON.parse(payload) as JWTPayload;
  } catch (error) {
    console.error("Error decoding JWT:", error);
    return null;
  }
}

// Check if token is expired
function isTokenExpired(exp: number): boolean {
  const currentTime = Math.floor(Date.now() / 1000);
  return currentTime >= exp;
}

// Check if token will expire soon (within 5 minutes)
function willTokenExpireSoon(exp: number): boolean {
  const currentTime = Math.floor(Date.now() / 1000);
  const fiveMinutes = 5 * 60;
  return currentTime + fiveMinutes >= exp;
}

// Generate avatar URL from name
function generateAvatarUrl(name: string): string {
  const initials = name
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase())
    .join("");

  return `https://ui-avatars.com/api/?name=${encodeURIComponent(
    name
  )}&background=3b82f6&color=ffffff&size=32&rounded=true&bold=true`;
}

export const useJWT = () => {
  const [decodedUser, setDecodedUser] = useState<DecodedUser | null>(null);
  const [isTokenValid, setIsTokenValid] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const refreshIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const isRefreshingRef = useRef<boolean>(false);

  const decodeToken = (token: string): DecodedUser | null => {
    const decoded = decodeJWT(token);
    if (!decoded) return null;

    // Check if token is expired
    if (isTokenExpired(decoded.exp)) {
      console.warn("JWT token is expired");
      return null;
    }

    // Transform the payload to a more user-friendly format
    const user: DecodedUser = {
      id: decoded.user_id,
      email: decoded.email,
      name: decoded.store_name,
      storeName: decoded.store_name,
      role: decoded.role,
      phoneNumber: decoded.phone_number,
      domain: decoded.domain,
      hasProfile: decoded.has_profile,
      hasProfileCompleted: decoded.has_profile_completed,
      avatar: generateAvatarUrl(decoded.store_name),
    };

    return user;
  };

  const refreshToken = useCallback(async (): Promise<boolean> => {
    if (isRefreshingRef.current) {
      return false; // Already refreshing
    }

    try {
      isRefreshingRef.current = true;
      const authTokens = localStorage.getItem("authTokens");

      if (!authTokens) {
        return false;
      }

      const tokens = JSON.parse(authTokens);
      const refreshToken = tokens.refresh_token;

      if (!refreshToken) {
        return false;
      }

      console.log("Refreshing token...");

      // Make API call to refresh token
      const response = await fetch(
        `${
          process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000"
        }/api/auth/token/refresh/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            refresh: refreshToken,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Token refresh failed");
      }

      const data = await response.json();

      // Update tokens in localStorage
      const newTokens = {
        ...tokens,
        access_token: data.access_token || data.access,
        refresh_token: data.refresh_token || data.refresh || refreshToken,
      };

      localStorage.setItem("authTokens", JSON.stringify(newTokens));

      console.log("Token refreshed successfully");
      return true;
    } catch (error) {
      console.error("Token refresh failed:", error);
      // Clear tokens if refresh fails
      localStorage.removeItem("authTokens");
      localStorage.removeItem("authUser");
      return false;
    } finally {
      isRefreshingRef.current = false;
    }
  }, []);

  const refreshUserData = useCallback(async () => {
    try {
      const authTokens = localStorage.getItem("authTokens");

      if (authTokens) {
        const tokens = JSON.parse(authTokens);
        let accessToken = tokens.access_token;

        if (accessToken) {
          const decoded = decodeJWT(accessToken);

          // If token will expire soon, try to refresh it
          if (decoded && willTokenExpireSoon(decoded.exp)) {
            console.log("Token will expire soon, attempting refresh...");
            const refreshed = await refreshToken();

            if (refreshed) {
              // Get the new token
              const newAuthTokens = localStorage.getItem("authTokens");
              if (newAuthTokens) {
                const newTokens = JSON.parse(newAuthTokens);
                accessToken = newTokens.access_token;
              }
            }
          }

          const user = decodeToken(accessToken);

          if (user) {
            setDecodedUser(user);
            setIsTokenValid(true);
          } else {
            setDecodedUser(null);
            setIsTokenValid(false);
            localStorage.removeItem("authTokens");
            localStorage.removeItem("authUser");
          }
        } else {
          setDecodedUser(null);
          setIsTokenValid(false);
        }
      } else {
        setDecodedUser(null);
        setIsTokenValid(false);
      }
    } catch (error) {
      console.error("Error parsing tokens:", error);
      setDecodedUser(null);
      setIsTokenValid(false);
      localStorage.removeItem("authTokens");
      localStorage.removeItem("authUser");
    } finally {
      setIsLoading(false);
    }
  }, [refreshToken]);

  useEffect(() => {
    refreshUserData();

    // Set up periodic token refresh check (every 5 minutes)
    refreshIntervalRef.current = setInterval(() => {
      if (!isRefreshingRef.current) {
        refreshUserData();
      }
    }, 5 * 60 * 1000);

    // Listen for storage changes
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "authTokens") {
        refreshUserData();
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
      }
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [refreshUserData]);

  const getTokenExpiration = (): Date | null => {
    try {
      const authTokens = localStorage.getItem("authTokens");
      if (authTokens) {
        const tokens = JSON.parse(authTokens);
        const decoded = decodeJWT(tokens.access_token);
        if (decoded) {
          return new Date(decoded.exp * 1000);
        }
      }
    } catch (error) {
      console.error("Error getting token expiration:", error);
    }
    return null;
  };

  const getTimeUntilExpiry = (): number | null => {
    const expiration = getTokenExpiration();
    if (expiration) {
      return Math.max(0, expiration.getTime() - Date.now());
    }
    return null;
  };

  return {
    user: decodedUser,
    isTokenValid,
    isLoading,
    isAuthenticated: isTokenValid && decodedUser !== null,
    refreshUserData,
    refreshToken,
    getTokenExpiration,
    getTimeUntilExpiry,
    decodeToken,
  };
};
