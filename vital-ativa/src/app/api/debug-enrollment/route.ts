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
    return NextResponse.json({ error: "not authenticated or no apiUserId", session: session?.user });
  }

  const results: Record<string, unknown> = { apiUserId };

  // Testa booking/list para ver se retorna enrollmentId
  try {
    const res = await fetch(`${API_BASE}/booking/list`, {
      method: "POST",
      headers: NGROK_HEADERS,
      body: JSON.stringify({ userId: apiUserId }),
    });
    const text = await res.text();
    results["POST /booking/list"] = { status: res.status, body: text.slice(0, 500) };
  } catch (e) {
    results["POST /booking/list"] = { error: String(e) };
  }

  // Testa criar booking com enrollmentId=1 só para ver a mensagem de erro
  try {
    const res = await fetch(`${API_BASE}/booking`, {
      method: "POST",
      headers: NGROK_HEADERS,
      body: JSON.stringify({ enrollmentId: 1, scheduleId: 1, booking_date: "2026-05-17" }),
    });
    const text = await res.text();
    results["POST /booking {enrollmentId}"] = { status: res.status, body: text.slice(0, 500) };
  } catch (e) {
    results["POST /booking {enrollmentId}"] = { error: String(e) };
  }

  return NextResponse.json(results);
}
