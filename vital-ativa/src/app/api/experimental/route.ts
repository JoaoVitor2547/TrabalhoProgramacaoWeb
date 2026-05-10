import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { experimentalSchema } from "@/lib/validators";

export const runtime = "nodejs";

const API_BASE = "https://unwaxed-shoddily-mariam.ngrok-free.dev";
const NGROK_HEADERS = {
  "ngrok-skip-browser-warning": "true",
  "Content-Type": "application/json",
};

export async function POST(request: Request): Promise<NextResponse> {
  const contentType = request.headers.get("content-type") ?? "";
  if (!contentType.toLowerCase().includes("application/json")) {
    return NextResponse.json(
      { ok: false, error: "invalid_content_type" },
      { status: 415 },
    );
  }

  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  const userKey = session.user.apiUserId
    ? String(session.user.apiUserId)
    : session.user.email ?? null;

  // Verifica se já agendou
  const cookieStore = await cookies();
  const booked = cookieStore.get("va_experimental")?.value;
  if (userKey && booked === userKey) {
    return NextResponse.json(
      { ok: false, error: "already_booked" },
      { status: 409 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  console.log("[experimental] body recebido:", JSON.stringify(body));

  const result = experimentalSchema.safeParse(body);
  if (!result.success) {
    console.error("[experimental] validação falhou:", result.error.issues);
    return NextResponse.json({ ok: false, error: "validation_failed" }, { status: 422 });
  }

  console.log("[experimental] result.data:", JSON.stringify(result.data));

  const payload = {
    name: result.data.name,
    contact: result.data.contact,
    modality: result.data.modality,
  };
  console.log("[experimental] payload final:", JSON.stringify(payload));

  // Repassa para a API externa (modalityId = campo da relação no backend)
  const apiRes = await fetch(`${API_BASE}/booking/experimental`, {
    method: "POST",
    headers: NGROK_HEADERS,
    body: JSON.stringify(payload),
  });

  if (!apiRes.ok) {
    const errBody = await apiRes.text().catch(() => "(sem corpo)");
    console.error("[experimental] backend status:", apiRes.status, "body:", errBody);
    return NextResponse.json({ ok: false, error: "api_error" }, { status: 502 });
  }

  const response = NextResponse.json({ ok: true }, { status: 201 });

  // Seta cookie para bloquear nova solicitação (30 dias)
  if (userKey) {
    response.cookies.set("va_experimental", userKey, {
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
      sameSite: "lax",
    });
  }

  return response;
}
