import { NextResponse } from "next/server";
import { auth } from "@/auth";

export const runtime = "nodejs";

const API_BASE = "https://unwaxed-shoddily-mariam.ngrok-free.dev";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  const apiUserId = session.user.apiUserId;
  if (typeof apiUserId !== "number") {
    return NextResponse.json({ ok: false, error: "missing_api_user" }, { status: 409 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const { scheduleId, booking_date } = body as { scheduleId?: unknown; booking_date?: unknown };

  if (typeof scheduleId !== "number" || typeof booking_date !== "string") {
    return NextResponse.json({ ok: false, error: "invalid_body" }, { status: 422 });
  }

  const apiRes = await fetch(`${API_BASE}/booking`, {
    method: "POST",
    headers: {
      "ngrok-skip-browser-warning": "true",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ userId: apiUserId, scheduleId, booking_date }),
  });

  if (!apiRes.ok) {
    const errBody = await apiRes.text().catch(() => "");
    console.error("[bookings] backend status:", apiRes.status, errBody);
    return NextResponse.json({ ok: false, error: "api_error" }, { status: 502 });
  }

  const data = await apiRes.json().catch(() => ({}));
  return NextResponse.json({ ok: true, data }, { status: 201 });
}
