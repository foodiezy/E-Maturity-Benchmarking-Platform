import { withAuth } from "next-auth/middleware"

export default withAuth({
  pages: {
    signIn: "/auth/signin"
  }
})

// Protect the Consultant dashboard and core test-taking endpoints
export const config = {
  matcher: [
    "/consultant/:path*",
    "/assessment/:path*"
  ]
}
