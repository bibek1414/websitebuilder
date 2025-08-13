export const getAuthToken = (): string | null => {
  if (typeof window === "undefined") return null;
  const authTokens = localStorage.getItem("authTokens");
  if (authTokens) {
    try {
      const tokens = JSON.parse(authTokens);
      return tokens.access_token;
    } catch (error) {
      console.error("Error parsing auth tokens:", error);
      return null;
    }
  }
  return null;
};