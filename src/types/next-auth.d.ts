import NextAuth, { DefaultSession } from "next-auth"
import { JWT } from "next-auth/jwt"

declare module "next-auth" {
  interface User {
    role: string
    organizationId?: string | null
    organizationName?: string | null
  }

  interface Session {
    user: {
      id: string
      role: string
      organizationId?: string | null
      organizationName?: string | null
    } & DefaultSession["user"]
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: string
    organizationId?: string | null
    organizationName?: string | null
  }
}
