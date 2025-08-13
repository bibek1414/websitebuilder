
import { useState, useEffect } from 'react';

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
  // Replace URL-safe characters
  str = str.replace(/-/g, '+').replace(/_/g, '/');
  
  // Add padding if necessary
  while (str.length % 4) {
    str += '=';
  }
  
  try {
    // Decode base64 and handle UTF-8
    const decoded = atob(str);
    return decodeURIComponent(escape(decoded));
  } catch (error) {
    console.error('Error decoding base64:', error);
    return '';
  }
}

// JWT decode function
function decodeJWT(token: string): JWTPayload | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      console.error('Invalid JWT format');
      return null;
    }

    const payload = base64UrlDecode(parts[1]);
    if (!payload) {
      console.error('Failed to decode JWT payload');
      return null;
    }

    return JSON.parse(payload) as JWTPayload;
  } catch (error) {
    console.error('Error decoding JWT:', error);
    return null;
  }
}

// Check if token is expired
function isTokenExpired(exp: number): boolean {
  const currentTime = Math.floor(Date.now() / 1000);
  return currentTime >= exp;
}

// Generate avatar URL from name
function generateAvatarUrl(name: string): string {
  const initials = name
    .split(' ')
    .map(word => word.charAt(0).toUpperCase())
    .join('');
  
  // Using a placeholder service with initials
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=3b82f6&color=ffffff&size=32&rounded=true&bold=true`;
}

export const useJWT = () => {
  const [decodedUser, setDecodedUser] = useState<DecodedUser | null>(null);
  const [isTokenValid, setIsTokenValid] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const decodeToken = (token: string): DecodedUser | null => {
    const decoded = decodeJWT(token);
    if (!decoded) return null;

    // Check if token is expired
    if (isTokenExpired(decoded.exp)) {
      console.warn('JWT token is expired');
      return null;
    }

    // Transform the payload to a more user-friendly format
    const user: DecodedUser = {
      id: decoded.user_id,
      email: decoded.email,
      name: decoded.store_name, // Using store_name as display name
      storeName: decoded.store_name,
      role: decoded.role,
      phoneNumber: decoded.phone_number,
      domain: decoded.domain,
      hasProfile: decoded.has_profile,
      hasProfileCompleted: decoded.has_profile_completed,
      avatar: generateAvatarUrl(decoded.store_name)
    };

    return user;
  };

  const refreshUserData = () => {
    setIsLoading(true);
    
    try {
      const authTokens = localStorage.getItem('authTokens');
      
      if (authTokens) {
        const tokens = JSON.parse(authTokens);
        const accessToken = tokens.access_token;
        
        if (accessToken) {
          const user = decodeToken(accessToken);
          
          if (user) {
            setDecodedUser(user);
            setIsTokenValid(true);
          } else {
            setDecodedUser(null);
            setIsTokenValid(false);
            // Clear invalid tokens
            localStorage.removeItem('authTokens');
            localStorage.removeItem('authUser');
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
      console.error('Error parsing tokens:', error);
      setDecodedUser(null);
      setIsTokenValid(false);
      // Clear corrupted tokens
      localStorage.removeItem('authTokens');
      localStorage.removeItem('authUser');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshUserData();

    // Listen for storage changes (useful for multi-tab scenarios)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'authTokens') {
        refreshUserData();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const getTokenExpiration = (): Date | null => {
    try {
      const authTokens = localStorage.getItem('authTokens');
      if (authTokens) {
        const tokens = JSON.parse(authTokens);
        const decoded = decodeJWT(tokens.access_token);
        if (decoded) {
          return new Date(decoded.exp * 1000);
        }
      }
    } catch (error) {
      console.error('Error getting token expiration:', error);
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
    getTokenExpiration,
    getTimeUntilExpiry,
    decodeToken
  };
};