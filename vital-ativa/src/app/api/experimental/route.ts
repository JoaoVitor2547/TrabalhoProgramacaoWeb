import { NextResponse } from "next/server";
import { experimentalSchema } from "@/lib/validators";

export const runtime = "nodejs";

function generateProtocol(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `EXP-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
  }
  return `EXP-${Math.random().toString(36).slice(2, 10).toUpperCase()}`;
}

export async function POST(request: Request): Promise<NextResponse> {
  const contentType = request.headers.get("content-type") ?? "";
  if (!contentType.toLowerCase().includes("application/json")) {
    return NextResponse.json(
      { ok: false, error: "invalid_content_type" },
      { status: 415 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "invalid_json" },
      { status: 400 },
    );
  }

  const result = experimentalSchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json(
      { ok: false, error: "validation_failed" },
      { status: 422 },
    );
  }

  await new Promise((resolve) => setTimeout(resolve, 500));

  return NextResponse.json(
    { ok: true, protocolo: generateProtocol() },
    { status: 201 },
  );
}
