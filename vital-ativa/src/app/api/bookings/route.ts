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
    if (!res.ok) return null;
    const json = await res.json();
    // tenta várias estruturas possíveis de resposta
    const id =
      json.data?.id ??
      json.enrollment?.id ??
      json.id ??
      (Array.isArray(json.data) ? json.data[0]?.id : null) ??
      (Array.isArray(json) ? json[0]?.id : null) ??
      null;
    console.log("[bookings] enrollmentId encontrado:", id, "resposta:", JSON.stringify(json).slice(0, 200));
    return typeof id === "number" ? id : null;
  } catch (e) {
    console.error("[bookings] fetchEnrollmentId erro:", e);
    return null;
  }
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
