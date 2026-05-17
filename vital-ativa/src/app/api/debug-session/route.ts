import { NextResponse } from "next/server";
import { auth } from "@/auth";

export const runtime = "nodejs";

const API_BASE = process.env.API_BASE_URL!;
const NGROK_HEADERS = {
  "ngrok-skip-browser-warning": "true",
  "Content-Type": "application/json",
};

export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "not authenticated" });
  }

  const { email, name, apiUserId } = session.user;
  const result: Record<string, unknown> = { email, name, apiUserId };

  // Se não tem apiUserId, tenta buscar agora
  if (typeof apiUserId !== "number") {
    try {
      const getRes = await fetch(`${API_BASE}/getUser`, {
        method: "POST",
        headers: NGROK_HEADERS,
        body: JSON.stringify({ email }),
      });
      const text = await getRes.text();
      result.getUser = { status: getRes.status, body: text };
    } catch (e) {
      result.getUser = { error: String(e) };
    }
  }

  return NextResponse.json(result);
}
