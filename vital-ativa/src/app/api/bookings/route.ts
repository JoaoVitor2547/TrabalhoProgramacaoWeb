import { NextResponse } from "next/server";
import { auth } from "@/auth";

export const runtime = "nodejs";

const API_BASE = "https://unwaxed-shoddily-mariam.ngrok-free.dev";
const NGROK_HEADERS = {
  "ngrok-skip-browser-warning": "true",
  "Content-Type": "application/json",
};

async function fetchEnrollmentId(userId: number): Promise<number | null> {
  const endpoints = [
    `${API_BASE}/enrollment/user/${userId}`,
    `${API_BASE}/enrollment/${userId}`,
    `${API_BASE}/enrollments/user/${userId}`,
  ];

  for (const url of endpoints) {
    try {
      const res = await fetch(url, { headers: { "ngrok-skip-browser-warning": "true" } });
      const text = await res.text();
      console.log(`[bookings] enrollment fetch ${url} → ${res.status}: ${text}`);
      if (res.ok) {
        const json = JSON.parse(text);
        const id = json.data?.id ?? json.enrollment?.id ?? json.id ?? (Array.isArray(json.data) ? json.data[0]?.id : null);
        if (typeof id === "number") return id;
      }
    } catch (e) {
      console.error(`[bookings] enrollment fetch erro em ${url}:`, e);
    }
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

  const enrollmentId = await fetchEnrollmentId(apiUserId);
  console.log("[bookings] enrollmentId resolvido:", enrollmentId, "para userId:", apiUserId);

  if (enrollmentId === null) {
    return NextResponse.json({ ok: false, error: "enrollment_not_found" }, { status: 409 });
  }

  const payload = { enrollmentId, scheduleId, booking_date };
  console.log("[bookings] payload:", JSON.stringify(payload));

  const apiRes = await fetch(`${API_BASE}/booking`, {
    method: "POST",
    headers: NGROK_HEADERS,
    body: JSON.stringify(payload),
  });

  const resText = await apiRes.text().catch(() => "");
  console.log("[bookings] resposta:", apiRes.status, resText);

  if (!apiRes.ok) {
    return NextResponse.json(
      { ok: false, error: "api_error", detail: resText },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true }, { status: 201 });
}
