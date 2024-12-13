import { NextResponse } from "next/server";

function parseRoles(rolesCookie) {
  try {
    // Parse the JSON string back into an array
    return JSON.parse(decodeURIComponent(rolesCookie.value));
  } catch (error) {
    console.error('Error parsing roles:', error);
    return [];
  }
}

export function middleware(request) {
  const token = request.cookies.get("token");
  const rolesCookie = request.cookies.get("roles");

  // Authentication check for public routes
  if (token && (request.nextUrl.pathname === "/auth/signin" || request.nextUrl.pathname === "/auth/signup")) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Authentication check for protected routes
  if (!token && !["/auth/signin", "/auth/signup"].includes(request.nextUrl.pathname)) {
    return NextResponse.redirect(new URL("/auth/signin", request.url));
  }

  // Role-based access control
  if (rolesCookie) {
    const roles = parseRoles(rolesCookie);

    // Define restricted routes for certain roles (like admin)
    // {roles} should not be able to access
    const restrictedRoutes = {
      "/products/create": ["moderator"],
    };

    // Check if current path has restrictions for 'no access'
    const currentPath = request.nextUrl.pathname;
    if (restrictedRoutes[currentPath]) {
      const restrictedRoles = restrictedRoutes[currentPath];
      const hasRestrictedRole = roles.some(role => restrictedRoles.includes(role));

      if (hasRestrictedRole) {
        // If user has restricted role, redirect to a different page (e.g., /products/all)
        return NextResponse.redirect(new URL("/", request.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/all_orders",
    "/categories/:path*",
    "/products/:path*",
    "/admin/:path*",
    "/general/:path*",
    "/auth/signin",
    "/auth/signup",
    "/category/:path*",
    "/subcategory/:path*",
    "/profile/:path*"
  ],
};
