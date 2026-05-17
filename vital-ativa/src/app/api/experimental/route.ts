import { cookies, headers } from "next/headers";
import { NextResponse } from "next/server";
import { experimentalSchema } from "@/lib/validators";

export const runtime = "nodejs";

const API_BASE = process.env.API_BASE_URL!;
const NGROK_HEADERS = {
  "ngrok-skip-browser-warning": "true",
  "Content-Type": "application/json",
};

function generateProtocol(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `VA-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
  }
  return `VA-${Math.random().toString(36).slice(2, 10).toUpperCase()}`;
}

export async function POST(request: Request): Promise<NextResponse> {
  const contentType = request.headers.get("content-type") ?? "";
  if (!contentType.toLowerCase().includes("application/json")) {
    return NextResponse.json(
      { ok: false, error: "invalid_content_type" },
      { status: 415 },
    );
  }

  // Visitante público — usa cookie por IP/sessão para anti-spam.
  // Não exige autenticação (requisito: "cadastro de visitantes").
  const cookieStore = await cookies();
  const headerStore = await headers();
  const forwarded = headerStore.get("x-forwarded-for") ?? "";
  const ip = forwarded.split(",")[0]?.trim() || "anon";

  const visitorKey =
    cookieStore.get("va_visitor")?.value ??
    `${ip}-${Math.random().toString(36).slice(2, 10)}`;

  const booked = cookieStore.get("va_experimental")?.value;
  if (booked && booked === visitorKey) {
    return NextResponse.json(
      { ok: false, error: "already_booked" },
      { status: 409 },
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
    console.error("[experimental] validação falhou:", result.error.issues);
    return NextResponse.json(
      { ok: false, error: "validation_failed" },
      { status: 422 },
    );
  }

  const payload = {
    name: result.data.name,
    contact: result.data.contact,
    modality: result.data.modality,
  };

  const apiRes = await fetch(`${API_BASE}/booking/experimental`, {
    method: "POST",
    headers: NGROK_HEADERS,
    body: JSON.stringify(payload),
  });

  if (!apiRes.ok) {
    const errBody = await apiRes.text().catch(() => "(sem corpo)");
    console.error(
      "[experimental] backend status:",
      apiRes.status,
      "body:",
      errBody,
    );
    return NextResponse.json(
      { ok: false, error: "api_error" },
      { status: 502 },
    );
  }

  const protocolo = generateProtocol();
  const response = NextResponse.json(
    { ok: true, protocolo },
    { status: 201 },
  );

  response.cookies.set("va_visitor", visitorKey, {
    httpOnly: true,
    path: "/",
    maxAge: 60 * 60 * 24 * 90,
    sameSite: "lax",
  });
  response.cookies.set("va_experimental", visitorKey, {
    httpOnly: true,
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
    sameSite: "lax",
  });

  return response;
}
