import type { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      apiUserId?: number
    } & DefaultSession["user"]
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    apiUserId?: number | null
  }
}
