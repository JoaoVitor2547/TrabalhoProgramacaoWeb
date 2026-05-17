import { NextResponse } from "next/server";
import { auth } from "@/auth";

export const runtime = "nodejs";

const API_BASE = "https://unwaxed-shoddily-mariam.ngrok-free.dev";
const NGROK_HEADERS = {
  "ngrok-skip-browser-warning": "true",
  "Content-Type": "application/json",
};

export async function GET() {
  const session = await auth();
  const apiUserId = session?.user?.apiUserId;
  if (typeof apiUserId !== "number") {
    return NextResponse.json({ error: "not authenticated", apiUserId });
  }

  const results: Record<string, unknown> = { apiUserId };

  const tests: Array<{ key: string; url: string; method: string; body?: object }> = [
    { key: "GET /enrollment", url: `${API_BASE}/enrollment`, method: "GET" },
    { key: "GET /enrollment?userId", url: `${API_BASE}/enrollment?userId=${apiUserId}`, method: "GET" },
    { key: "GET /enrollment?user", url: `${API_BASE}/enrollment?user=${apiUserId}`, method: "GET" },
    { key: "POST /enrollment {userId}", url: `${API_BASE}/enrollment`, method: "POST", body: { userId: apiUserId } },
    { key: "POST /enrollment {user}", url: `${API_BASE}/enrollment`, method: "POST", body: { user: apiUserId } },
  ];

  for (const t of tests) {
    try {
      const res = await fetch(t.url, {
        method: t.method,
        headers: NGROK_HEADERS,
        ...(t.body ? { body: JSON.stringify(t.body) } : {}),
      });
      const text = await res.text();
      results[t.key] = { status: res.status, body: text.slice(0, 500) };
    } catch (e) {
      results[t.key] = { error: String(e) };
    }
  }

  return NextResponse.json(results);
}
