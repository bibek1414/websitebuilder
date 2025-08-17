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
  const url = request.nextUrl.clone();

  // Debug logging (remove in production if needed)
  if (process.env.NODE_ENV === "production") {
    console.log("Production Middleware:", {
      hostname,
      baseDomain,
      pathname: url.pathname,
      isMainDomain: hostname === `www.${baseDomain}` || hostname === baseDomain,
    });
  }

  // Define main domain patterns
  const isMainDomain =
    hostname === baseDomain || hostname === `www.${baseDomain}`;

  // Always skip middleware for main domain paths that should be handled normally
  if (isMainDomain) {
    const allowedPaths = [
      "/account/",
      "/login",
      "/signup",
      "/register",
      "/auth/",
      "/preview",
      "/builder",
      "/_next",
      "/api",
      "/favicon",
      "/",
    ];

    const shouldSkip = allowedPaths.some((path) =>
      path === "/" ? url.pathname === "/" : url.pathname.startsWith(path)
    );

    if (shouldSkip) {
      return NextResponse.next();
    }
  }

  // Check if we're on a legitimate subdomain (not www, not main domain)
  const isSubdomain =
    hostname.includes(".") &&
    hostname.endsWith(`.${baseDomain}`) &&
    !hostname.startsWith("www.") &&
    hostname !== baseDomain;

  if (isSubdomain) {
    const subdomain = hostname.replace(`.${baseDomain}`, "");

    // Skip reserved/system subdomains
    const reservedSubdomains = [
      "api",
      "admin",
      "www",
      "mail",
      "ftp",
      "cdn",
      "static",
    ];
    if (reservedSubdomains.includes(subdomain)) {
      return NextResponse.next();
    }

    // Get auth token from various sources
    let authToken =
      request.cookies.get("authToken")?.value ||
      request.cookies.get("token")?.value ||
      request.nextUrl.searchParams.get("token");

    // Handle auth preservation from main domain redirects
    const preserveAuth = request.nextUrl.searchParams.get("preserve_auth");
    const tokenParam = request.nextUrl.searchParams.get("auth_token");

    if (preserveAuth === "true" && tokenParam) {
      authToken = tokenParam;
    }

    // **KEY CHANGE: Don't enforce authentication for subdomains - show public view**
    // Remove the authentication enforcement for subdomains entirely

    // Set up response
    const response = NextResponse.next();

    // If there's an auth token, set it as cookie for admin features
    if (authToken) {
      const isValidToken = await verifyToken(authToken);
      if (isValidToken) {
        response.cookies.set("authToken", authToken, {
          domain: `.${baseDomain}`,
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          maxAge: 60 * 60 * 24 * 7, // 7 days
        });
      }
    }

    // Handle subdomain routing - always show site-view (public view)
    if (url.pathname === "/" || url.pathname === "") {
      url.pathname = "/site-view";
      url.searchParams.set("subdomain", subdomain);

      // Pass authentication status to the site-view page
      if (authToken) {
        const isValidToken = await verifyToken(authToken);
        url.searchParams.set("authenticated", isValidToken.toString());
      } else {
        url.searchParams.set("authenticated", "false");
      }

      // Clean auth params
      url.searchParams.delete("preserve_auth");
      url.searchParams.delete("auth_token");
      url.searchParams.delete("token");

      return NextResponse.rewrite(url);
    }

    // Handle subdomain page routing
    if (
      !url.pathname.startsWith("/site-view") &&
      !url.pathname.startsWith("/_next") &&
      !url.pathname.startsWith("/api") &&
      !url.pathname.startsWith("/favicon")
    ) {
      const pagePath = url.pathname.replace(/^\//, "");

      url.pathname = "/site-view";
      url.searchParams.set("subdomain", subdomain);

      // Pass authentication status
      if (authToken) {
        const isValidToken = await verifyToken(authToken);
        url.searchParams.set("authenticated", isValidToken.toString());
      } else {
        url.searchParams.set("authenticated", "false");
      }

      if (pagePath) {
        url.searchParams.set("page", pagePath);
      }

      // Clean auth params
      url.searchParams.delete("preserve_auth");
      url.searchParams.delete("auth_token");
      url.searchParams.delete("token");

      return NextResponse.rewrite(url);
    }

    // Handle existing site-view paths
    if (
      url.pathname.startsWith("/site-view") &&
      !url.searchParams.has("subdomain")
    ) {
      url.searchParams.set("subdomain", subdomain);

      // Pass authentication status
      if (authToken) {
        const isValidToken = await verifyToken(authToken);
        url.searchParams.set("authenticated", isValidToken.toString());
      } else {
        url.searchParams.set("authenticated", "false");
      }

      // Clean auth params
      url.searchParams.delete("preserve_auth");
      url.searchParams.delete("auth_token");
      url.searchParams.delete("token");

      return NextResponse.rewrite(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
