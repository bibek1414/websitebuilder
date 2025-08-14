import { jwtVerify, SignJWT, JWTPayload as JoseJWTPayload } from "jose";

// Load secret (server-side only)
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error("❌ Missing JWT_SECRET in environment variables");
}
const secret = new TextEncoder().encode(JWT_SECRET);

// Extend jose's JWTPayload with your app-specific claims
export interface AppJWTPayload extends JoseJWTPayload {
  userId: string;
  email: string;
}

// Verify JWT and return your custom payload
export async function verifyJWT(token: string): Promise<AppJWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secret);
    // Ensure required fields are present
    if (typeof payload.userId !== "string" || typeof payload.email !== "string") {
      throw new Error("Invalid token payload");
    }
    return payload as AppJWTPayload;
  } catch (error) {
    console.error("JWT verification failed:", error);
    return null;
  }
}

// Sign a JWT with your custom payload
export async function signJWT(
  payload: Omit<AppJWTPayload, "exp" | "iat">
): Promise<string> {
  try {
    const jwt = await new SignJWT(payload)
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("7d") // expires in 7 days
      .sign(secret);
    return jwt;
  } catch (error) {
    console.error("JWT signing failed:", error);
    throw error;
  }
}

// Check if a JWT is expired (without verifying the signature)
export function isTokenExpired(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const exp = payload.exp;
    if (!exp) return false;
    return Date.now() >= exp * 1000;
  } catch {
    return true; // If parsing fails, treat as expired
  }
}
