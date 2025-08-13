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

interface AuthTokens {
  access_token: string;
  refresh_token: string;
}

interface UserData {
  id: number;
  email: string;
  name: string;
  storeName: string;
  role: string;
  phoneNumber: string;
  domain: string;
  hasProfile: boolean;
  hasProfileCompleted: boolean;
  avatar: string;
}

export class JWTManager {
  private static instance: JWTManager;
  
  private constructor() {}

  public static getInstance(): JWTManager {
    if (!JWTManager.instance) {
      JWTManager.instance = new JWTManager();
    }
    return JWTManager.instance;
  }

  /**
   * Base64 URL decode function
   */
  private base64UrlDecode(str: string): string {
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

  /**
   * Decode JWT token
   */
  public decodeToken(token: string): JWTPayload | null {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) {
        console.error('Invalid JWT format');
        return null;
      }

      const payload = this.base64UrlDecode(parts[1]);
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

  /**
   * Check if token is expired
   */
  public isTokenExpired(token: string): boolean {
    const decoded = this.decodeToken(token);
    if (!decoded) return true;

    const currentTime = Math.floor(Date.now() / 1000);
    return currentTime >= decoded.exp;
  }

  /**
   * Get token expiration time
   */
  public getTokenExpiration(token: string): Date | null {
    const decoded = this.decodeToken(token);
    if (!decoded) return null;

    return new Date(decoded.exp * 1000);
  }

  /**
   * Get time until token expires (in milliseconds)
   */
  public getTimeUntilExpiry(token: string): number | null {
    const expiration = this.getTokenExpiration(token);
    if (!expiration) return null;

    return Math.max(0, expiration.getTime() - Date.now());
  }

  /**
   * Get stored tokens from localStorage
   */
  public getStoredTokens(): AuthTokens | null {
    try {
      const storedTokens = localStorage.getItem('authTokens');
      if (!storedTokens) return null;

      return JSON.parse(storedTokens) as AuthTokens;
    } catch (error) {
      console.error('Error parsing stored tokens:', error);
      this.clearTokens();
      return null;
    }
  }

  /**
   * Get valid access token (checks expiration)
   */
  public getValidAccessToken(): string | null {
    const tokens = this.getStoredTokens();
    if (!tokens?.access_token) return null;

    if (this.isTokenExpired(tokens.access_token)) {
      console.warn('Access token is expired');
      this.clearTokens();
      return null;
    }

    return tokens.access_token;
  }

  /**
   * Store tokens in localStorage
   */
  public storeTokens(tokens: AuthTokens): void {
    try {
      localStorage.setItem('authTokens', JSON.stringify(tokens));
    } catch (error) {
      console.error('Error storing tokens:', error);
    }
  }

  /**
   * Clear all auth data
   */
  public clearTokens(): void {
    localStorage.removeItem('authTokens');
    localStorage.removeItem('authUser');
    localStorage.removeItem('verificationEmail');
    
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("redirectAfterLogin");
    }
  }

  /**
   * Get user data from JWT token
   */
  public getUserFromToken(): UserData | null {
    const token = this.getValidAccessToken();
    if (!token) return null;

    const decoded = this.decodeToken(token);
    if (!decoded) return null;

    return {
      id: decoded.user_id,
      email: decoded.email,
      name: decoded.store_name,
      storeName: decoded.store_name,
      role: decoded.role,
      phoneNumber: decoded.phone_number,
      domain: decoded.domain,
      hasProfile: decoded.has_profile,
      hasProfileCompleted: decoded.has_profile_completed,
      avatar: this.generateAvatarUrl(decoded.store_name)
    };
  }

  /**
   * Generate avatar URL from name
   */
  private generateAvatarUrl(name: string): string {
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=3b82f6&color=ffffff&size=128&rounded=true&bold=true`;
  }

  /**
   * Check if user is authenticated
   */
  public isAuthenticated(): boolean {
    const token = this.getValidAccessToken();
    return !!token;
  }

  /**
   * Set up automatic token cleanup on expiration
   */
  public setupTokenCleanup(): () => void {
    const token = this.getValidAccessToken();
    if (!token) return () => {};

    const timeUntilExpiry = this.getTimeUntilExpiry(token);
    if (!timeUntilExpiry) return () => {};

    // Clear tokens 30 seconds before expiration
    const cleanupTime = Math.max(0, timeUntilExpiry - 30000);

    const timeoutId = setTimeout(() => {
      console.log('Token expired, clearing auth data');
      this.clearTokens();
      
      // Optionally redirect to login or emit an event
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent('token-expired'));
      }
    }, cleanupTime);

    // Return cleanup function
    return () => clearTimeout(timeoutId);
  }

  /**
   * Refresh token logic (to be implemented based on your API)
   */
  public async refreshToken(): Promise<boolean> {
    try {
      const tokens = this.getStoredTokens();
      if (!tokens?.refresh_token) return false;

      // TODO: Implement refresh token API call
      // const response = await refreshTokenAPI(tokens.refresh_token);
      // this.storeTokens(response.data);
      // return true;

      console.log('Refresh token functionality not implemented yet');
      return false;
    } catch (error) {
      console.error('Error refreshing token:', error);
      this.clearTokens();
      return false;
    }
  }
}

// Export singleton instance
export const jwtManager = JWTManager.getInstance();