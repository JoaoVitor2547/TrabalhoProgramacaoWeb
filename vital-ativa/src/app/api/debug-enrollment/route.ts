import { NextResponse } from "next/server";
import { auth } from "@/auth";

export const runtime = "nodejs";

const API_BASE = "https://unwaxed-shoddily-mariam.ngrok-free.app";

export async function GET() {
  const session = await auth();
  const apiUserId = session?.user?.apiUserId;
  if (typeof apiUserId !== "number") {
    return NextResponse.json({ error: "not authenticated or no apiUserId", session: session?.user });
  }

  const results: Record<string, unknown> = { apiUserId };

  const tests: Array<{ key: string; url: string; method: string; body?: object }> = [
    { key: "GET /enrollment/user/:id", url: `${API_BASE}/enrollment/user/${apiUserId}`, method: "GET" },
    { key: "GET /enrollment/:id", url: `${API_BASE}/enrollment/${apiUserId}`, method: "GET" },
    { key: "POST /enrollment/list {userId}", url: `${API_BASE}/enrollment/list`, method: "POST", body: { userId: apiUserId } },
    { key: "POST /enrollment/list {user}", url: `${API_BASE}/enrollment/list`, method: "POST", body: { user: apiUserId } },
    { key: "POST /booking {user,scheduleId}", url: `${API_BASE}/booking`, method: "POST", body: { user: apiUserId, scheduleId: 1, booking_date: "2026-05-17" } },
    { key: "POST /booking {userId,scheduleId}", url: `${API_BASE}/booking`, method: "POST", body: { userId: apiUserId, scheduleId: 1, booking_date: "2026-05-17" } },
  ];

  for (const t of tests) {
    try {
      const res = await fetch(t.url, {
        method: t.method,
        headers: { "ngrok-skip-browser-warning": "true", "Content-Type": "application/json" },
        ...(t.body ? { body: JSON.stringify(t.body) } : {}),
      });
      const text = await res.text();
      results[t.key] = { status: res.status, body: text.slice(0, 300) };
    } catch (e) {
      results[t.key] = { error: String(e) };
    }
  }

  return NextResponse.json(results);
}
