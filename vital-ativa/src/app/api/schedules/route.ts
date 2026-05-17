import { NextResponse } from "next/server";

export const runtime = "nodejs";

const API_BASE = process.env.API_BASE_URL!;

export async function GET() {
  try {
    const res = await fetch(`${API_BASE}/schedules`, {
      headers: { "ngrok-skip-browser-warning": "true" },
      next: { revalidate: 300 },
    });
    if (!res.ok) return NextResponse.json({ schedules: [] });
    const json = await res.json();
    return NextResponse.json({ schedules: json.schedules ?? [] });
  } catch {
    return NextResponse.json({ schedules: [] });
  }
}
