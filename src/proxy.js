import { NextResponse } from "next/server";
function hasSessionCookie(request) {
  return request.cookies.has("better-auth.session_token") || request.cookies.has("__Secure-better-auth.session_token");
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
  matcher: ["/dashboard", "/add-studio", "/upload-image", "/my-listings", "/studios/edit/:path*"]
};
