import { NextResponse, NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const url = new URL(request.url);
  const searchparam = url.search;
  const pathAndQuery = url.pathname + searchparam;
  const origin = url.origin;
  const pathname = url.pathname;

  // Create a new Headers object and copy existing headers
  const requestHeaders = new Headers();
  request.headers.forEach((value, key) => {
    requestHeaders.set(key, value);
  });

  // Add custom headers
  requestHeaders.set("x-url", pathAndQuery);
  requestHeaders.set("x-origin", origin);
  requestHeaders.set("x-pathname", pathname);
  requestHeaders.set("x-searchparam", searchparam);

  // Create the initial response
  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  return response;
}
