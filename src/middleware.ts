import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: { signIn: "/auth" },
});

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/inbox/:path*",
    "/checkout/:path*",
    "/host/new/:path*",
    "/trips/:path*",
  ],
};
