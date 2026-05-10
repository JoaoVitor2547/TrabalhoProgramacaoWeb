import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { matriculaSchema } from "@/lib/validators";

export const runtime = "nodejs";

function generateProtocol(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `VA-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
  }
  return `VA-${Math.random().toString(36).slice(2, 10).toUpperCase()}`;
}

export async function GET(): Promise<NextResponse> {
  const session = await auth();
  const userKey = session?.user?.apiUserId
    ? String(session.user.apiUserId)
    : session?.user?.email ?? null;
  if (!userKey) return NextResponse.json({ enrolled: false });
  const cookieStore = await cookies();
  const enrolled = cookieStore.get("va_enrolled")?.value;
  return NextResponse.json({ enrolled: enrolled === userKey });
}

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

  // Verifica se já fez matrícula
  const userKey = session.user.apiUserId
    ? String(session.user.apiUserId)
    : session.user.email ?? null;
  const cookieStore = await cookies();
  const enrolled = cookieStore.get("va_enrolled")?.value;
  if (userKey && enrolled === userKey) {
    return NextResponse.json(
      { ok: false, error: "already_enrolled" },
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

  const result = matriculaSchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json(
      { ok: false, error: "validation_failed" },
      { status: 422 },
    );
  }

  await new Promise((resolve) => setTimeout(resolve, 600));

  const protocolo = generateProtocol();

  const response = NextResponse.json({ ok: true, protocolo }, { status: 201 });

  // Marca matrícula no cookie (30 dias)
  if (userKey) {
    response.cookies.set("va_enrolled", userKey, {
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
      sameSite: "lax",
    });
  }

  return response;
}
