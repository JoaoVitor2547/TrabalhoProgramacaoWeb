import { NextResponse } from "next/server";
import { auth } from "@/auth";

export const runtime = "nodejs";

const API_BASE = "https://unwaxed-shoddily-mariam.ngrok-free.dev";
const NGROK_HEADERS = {
  "ngrok-skip-browser-warning": "true",
  "Content-Type": "application/json",
};

async function fetchEnrollmentId(userId: number): Promise<number | null> {
  // Tenta via booking/list — se o usuário já tem bookings, tem enrollmentId
  try {
    const res = await fetch(`${API_BASE}/booking/list`, {
      method: "POST",
      headers: NGROK_HEADERS,
      body: JSON.stringify({ userId }),
    });
    if (res.ok) {
      const json = await res.json();
      const list: Array<{ enrollmentId?: number }> = json.data ?? json.bookings ?? json;
      if (Array.isArray(list) && list.length > 0 && typeof list[0].enrollmentId === "number") {
        return list[0].enrollmentId;
      }
    }
  } catch { /* ignora */ }

  // Tenta GET /enrollment direto
  try {
    const res = await fetch(`${API_BASE}/enrollment`, {
      headers: { "ngrok-skip-browser-warning": "true" },
    });
    if (res.ok) {
      const json = await res.json();
      const list: Array<{ id?: number; userId?: number; user?: number }> = json.data ?? json.enrollments ?? json;
      if (Array.isArray(list)) {
        const found = list.find((e) => e.userId === userId || e.user === userId);
        if (found && typeof found.id === "number") return found.id;
      }
    }
  } catch { /* ignora */ }

  return null;
}

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

  const enrollmentId = await fetchEnrollmentId(apiUserId);
  if (enrollmentId === null) {
    return NextResponse.json({ ok: false, error: "enrollment_not_found" }, { status: 409 });
  }

  const apiRes = await fetch(`${API_BASE}/booking`, {
    method: "POST",
    headers: NGROK_HEADERS,
    body: JSON.stringify({ enrollment: enrollmentId, schedule: scheduleId, booking_date }),
  });

  const resText = await apiRes.text().catch(() => "");
  if (!apiRes.ok) {
    return NextResponse.json({ ok: false, error: "api_error", detail: resText }, { status: 502 });
  }

  return NextResponse.json({ ok: true }, { status: 201 });
}
