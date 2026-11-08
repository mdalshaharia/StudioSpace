import { NextResponse } from "next/server";

/* auth guard: block unauthenticated users from signed-in-only routes.
   better-auth sets an HTTPOnly session cookie at sign-in time, so its
   presence is the reliable server-side signal (the backend "token" cookie
   is only set lazily on the first API call, so it can't be trusted here) */

function hasSessionCookie(request) {
  return (
    request.cookies.has("better-auth.session_token") ||
    request.cookies.has("__Secure-better-auth.session_token")
  );
}

export function proxy(request) {
  if (!hasSessionCookie(request)) {
    const signIn = request.nextUrl.clone();
    signIn.pathname = "/signin";
    signIn.search = `redirect=${encodeURIComponent(request.nextUrl.pathname)}`;
    return NextResponse.redirect(signIn);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard", "/add-studio", "/upload-image", "/my-listings", "/studios/edit/:path*"],
};
