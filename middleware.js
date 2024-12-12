import { NextResponse } from "next/server";

export function middleware(request) {
  const token = request.cookies.get("token");
  console.log(token);
  // If the user is already logged in, redirect them to the root path if trying to access sign-in or sign-up
  if (token && (request.nextUrl.pathname === "/auth/signin" || request.nextUrl.pathname === "/auth/signup")) {
    const url = request.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  // Otherwise, if the user is not logged in, redirect them to sign-in if they try to access protected routes
  if (!token && !["/auth/signin", "/auth/signup"].includes(request.nextUrl.pathname)) {
    const url = request.nextUrl.clone();
    url.pathname = "/auth/signin"; // Redirect to sign-in page
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/all_orders", "/categories/:path*", "/products/:path*" , "/admin/:path*", "/general/:path*", "/auth/signin", "/auth/signup", "/category/:path*",
    "/subcategory/:path*", "/profile/:path*"], // Protect these paths
};