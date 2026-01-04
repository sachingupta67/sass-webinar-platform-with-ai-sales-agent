import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher([
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/api(.*)",
  "/live-webinar(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  if (!isPublicRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // skip next.js internals and all statics files ,unless found in search params
    "/((?!_next/static|_next/image|favicon.ico).*)",
    // always run for API routes and trpc
    "/(api|trpc)(.*)",
  ],
};
