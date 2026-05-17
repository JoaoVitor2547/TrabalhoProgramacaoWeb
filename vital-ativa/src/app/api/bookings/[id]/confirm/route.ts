import { NextResponse } from "next/server";
import { auth } from "@/auth";

export const runtime = "nodejs";

const API_BASE = process.env.API_BASE_URL!;

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const numericId = Number(id);
  if (!Number.isInteger(numericId) || numericId <= 0) {
    return NextResponse.json({ ok: false, error: "invalid_id" }, { status: 400 });
  }

  const apiRes = await fetch(`${API_BASE}/booking/${numericId}/confirm`, {
    method: "PATCH",
    headers: { "ngrok-skip-browser-warning": "true" },
  });

  if (!apiRes.ok) {
    return NextResponse.json({ ok: false, error: "api_error" }, { status: 502 });
  }
  return NextResponse.json({ ok: true });
}