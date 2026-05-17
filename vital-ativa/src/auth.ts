import NextAuth from "next-auth"
import Google from "next-auth/providers/google"

const API_BASE = process.env.API_BASE_URL!
const NGROK_HEADERS = {
  "ngrok-skip-browser-warning": "true",
  "Content-Type": "application/json",
}

async function syncUser(email: string): Promise<number | null> {
  try {
    const createRes = await fetch(`${API_BASE}/createUser`, {
      method: "POST",
      headers: NGROK_HEADERS,
      body: JSON.stringify({ email }),
    })
    console.log("[Auth] createUser status:", createRes.status)

    // createUser não retorna o id — sempre busca via getUser
    const getRes = await fetch(`${API_BASE}/getUser`, {
      method: "POST",
      headers: NGROK_HEADERS,
      body: JSON.stringify({ email }),
    })

    console.log("[Auth] getUser status:", getRes.status)
    if (getRes.ok) {
      const data = await getRes.json()
      console.log("[Auth] getUser response:", data)
      return data.user?.id ?? null
    }
  } catch (err) {
    console.error("[Auth] syncUser erro:", err)
  }
  return null
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [Google],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user, account }) {
      if (account && user) {
        const apiUserId = await syncUser(user.email ?? "")
        token.apiUserId = apiUserId
      }
      // se ainda não tem id (ngrok estava offline no login), tenta de novo
      if (typeof token.apiUserId !== "number" && token.email) {
        const apiUserId = await syncUser(token.email as string)
        if (typeof apiUserId === "number") token.apiUserId = apiUserId
      }
      return token
    },
    async session({ session, token }) {
      if (typeof token.apiUserId === "number") {
        session.user.apiUserId = token.apiUserId
      }
      return session
    },
  },
})
