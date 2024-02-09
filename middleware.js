import { NextResponse } from "next/server";

export function middleware(request) {
  console.log("Middleware is running");  
  let OriginArrays = ["http://localhost:3000", "https://words.englishbix.com", "https://localhost:3000"];

  if (!OriginArrays.includes(request.nextUrl.origin)) {
    return NextResponse.redirect(
      new URL("https://words.englishbix.com", request.url)
    );
  }
  
  return NextResponse.next();
}

export const config = {
    matcher: ['/login/:path*', '/dashboard/:path*', '/register/:path*', '/lists/:path*'],
  }

