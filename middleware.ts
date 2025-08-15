import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

// JWT verification function
async function verifyToken(token: string): Promise<boolean> {
  try {
    const secret = new TextEncoder().encode(
      process.env.JWT_SECRET || "your-secret-key"
    );
    await jwtVerify(token, secret);
    return true;
  } catch {
    return false;
  }
}

export async function middleware(request: NextRequest) {
  const hostname = request.headers.get("host") || "";
  const baseDomain = process.env.NEXT_PUBLIC_BASE_DOMAIN || "nepdora.com";
  const protocol = process.env.NEXT_PUBLIC_PROTOCOL || "https";

  // Check if we're on a subdomain
  if (
    hostname.includes(".") &&
    hostname.endsWith(baseDomain) &&
    !hostname.startsWith("www.")
  ) {
    const subdomain = hostname.replace(`.${baseDomain}`, "");

    // Skip if it's the main domain or common subdomains
    if (
      subdomain === baseDomain ||
      subdomain === "api" ||
      subdomain === "admin" ||
      subdomain === "www"
    ) {
      return NextResponse.next();
    }

    const url = request.nextUrl.clone();

    // Get auth token from different sources
    let authToken =
      request.cookies.get("authToken")?.value ||
      request.cookies.get("token")?.value ||
      request.nextUrl.searchParams.get("token");

    // Check if we have preserve_auth flag (from main domain redirect)
    const preserveAuth = request.nextUrl.searchParams.get("preserve_auth");
    const tokenParam = request.nextUrl.searchParams.get("auth_token");

    if (preserveAuth === "true" && tokenParam) {
      authToken = tokenParam;
    }

    // For production, enforce authentication
    if (process.env.NODE_ENV === "production") {
      // If no token found, redirect to main domain for login
      if (!authToken) {
        const loginUrl = `${protocol}://www.${baseDomain}/login?redirect=${encodeURIComponent(
          `${protocol}://${hostname}${url.pathname}`
        )}`;
        return NextResponse.redirect(loginUrl);
      }

      // Verify token
      const isValidToken = await verifyToken(authToken);

      if (!isValidToken) {
        // Token is invalid, redirect to main domain for login
        const loginUrl = `${protocol}://www.${baseDomain}/login?redirect=${encodeURIComponent(
          `${protocol}://${hostname}${url.pathname}`
        )}`;
        return NextResponse.redirect(loginUrl);
      }
    }

    // Token is valid or we're in development, proceed with the request
    const response = NextResponse.next();

    // Set auth cookie for the subdomain if it doesn't exist and we have a token
    if (authToken && !request.cookies.get("authToken")?.value) {
      response.cookies.set("authToken", authToken, {
        domain: `.${baseDomain}`, // This makes it available to all subdomains
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });
    }

    // Handle routing for subdomain
    if (url.pathname === "/" || url.pathname === "") {
      // Root path - redirect to site view with subdomain parameter
      url.pathname = "/site-view";
      url.searchParams.set("subdomain", subdomain);

      // Clean up auth-related params from URL
      url.searchParams.delete("preserve_auth");
      url.searchParams.delete("auth_token");
      url.searchParams.delete("token");

      return NextResponse.rewrite(url);
    }

    // Handle page routing (e.g., /about, /contact, etc.)
    if (
      !url.pathname.startsWith("/site-view") &&
      !url.pathname.startsWith("/_next") &&
      !url.pathname.startsWith("/api")
    ) {
      const pagePath = url.pathname.replace(/^\//, ""); // Remove leading slash

      // Rewrite to site-view with the page path preserved
      url.pathname = "/site-view";
      url.searchParams.set("subdomain", subdomain);

      // Add page parameter if it's not the root
      if (pagePath && pagePath !== "") {
        url.searchParams.set("page", pagePath);
      }

      // Clean up auth-related params
      url.searchParams.delete("preserve_auth");
      url.searchParams.delete("auth_token");
      url.searchParams.delete("token");

      return NextResponse.rewrite(url);
    }

    // For paths that already start with /site-view, just add subdomain if missing
    if (
      url.pathname.startsWith("/site-view") &&
      !url.searchParams.has("subdomain")
    ) {
      url.searchParams.set("subdomain", subdomain);

      // Clean up auth-related params
      url.searchParams.delete("preserve_auth");
      url.searchParams.delete("auth_token");
      url.searchParams.delete("token");

      return NextResponse.rewrite(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
