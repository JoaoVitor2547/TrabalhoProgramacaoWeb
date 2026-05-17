import { NextResponse } from "next/server";
import { auth } from "@/auth";

export const runtime = "nodejs";

const API_BASE = "https://unwaxed-shoddily-mariam.ngrok-free.dev";
const NGROK_HEADERS = {
  "ngrok-skip-browser-warning": "true",
  "Content-Type": "application/json",
};

async function fetchEnrollmentId(userId: number): Promise<number | null> {
  try {
    const res = await fetch(`${API_BASE}/enrollment/user/${userId}`, {
      headers: { "ngrok-skip-browser-warning": "true" },
    });
    if (res.ok) {
      const json = await res.json();
      return json.data?.id ?? json.id ?? null;
    }
    // tenta endpoint alternativo
    const res2 = await fetch(`${API_BASE}/enrollment?userId=${userId}`, {
      headers: { "ngrok-skip-browser-warning": "true" },
    });
    if (res2.ok) {
      const json2 = await res2.json();
      const list = json2.data ?? json2.enrollments ?? json2;
      if (Array.isArray(list) && list.length > 0) return list[0].id ?? null;
      return list?.id ?? null;
    }
  } catch {
    // ignora
  }
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

  // Tenta buscar enrollmentId — se não encontrar, tenta com userId direto
  const enrollmentId = await fetchEnrollmentId(apiUserId);

  const payload = enrollmentId !== null
    ? { enrollmentId, scheduleId, booking_date }
    : { userId: apiUserId, scheduleId, booking_date };

  console.log("[bookings] payload:", JSON.stringify(payload));

  const apiRes = await fetch(`${API_BASE}/booking`, {
    method: "POST",
    headers: NGROK_HEADERS,
    body: JSON.stringify(payload),
  });

  const errBody = await apiRes.text().catch(() => "");
  console.log("[bookings] status:", apiRes.status, "body:", errBody);

  if (!apiRes.ok) {
    return NextResponse.json(
      { ok: false, error: "api_error", detail: errBody },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true }, { status: 201 });
}
