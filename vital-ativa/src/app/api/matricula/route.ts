import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { matriculaSchema } from "@/lib/validators";
import { onlyDigits } from "@/lib/utils";

export const runtime = "nodejs";

const API_BASE = process.env.API_BASE_URL!;
const NGROK_HEADERS = {
  "ngrok-skip-browser-warning": "true",
  "Content-Type": "application/json",
};

const PERIODO_HORARIO: Record<"manha" | "tarde" | "noite", string> = {
  manha: "06:00",
  tarde: "12:00",
  noite: "18:00",
};

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
    return NextResponse.json(
      { ok: false, error: "unauthorized" },
      { status: 401 },
    );
  }

  const apiUserId = session.user.apiUserId;
  if (typeof apiUserId !== "number") {
    return NextResponse.json(
      { ok: false, error: "missing_api_user" },
      { status: 409 },
    );
  }

  const userKey = String(apiUserId);
  const cookieStore = await cookies();
  const enrolled = cookieStore.get("va_enrolled")?.value;
  if (enrolled === userKey) {
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

  const planoId = Number(result.data.planoSlug);
  if (!Number.isFinite(planoId) || planoId <= 0) {
    return NextResponse.json(
      { ok: false, error: "invalid_plan" },
      { status: 422 },
    );
  }

  // Monta payload alinhado ao schema do back end Fastify (createEnrollmentSchema).
  // CPF e CEP precisam manter máscara — back exige length(14) e length(9).
  const payload = {
    full_name: result.data.nome,
    cpf: result.data.cpf,
    zip_code: result.data.cep,
    plan: planoId,
    user: apiUserId,
    preferred_time: PERIODO_HORARIO[result.data.periodoPreferencial],
    street: result.data.endereco,
    number: result.data.numero,
    terms_accepted: result.data.aceiteTermos === true,
    email: result.data.email,
    phone: onlyDigits(result.data.telefone),
    birthdate: result.data.dataNascimento,
    complement: result.data.complemento ?? "",
    neighborhood: result.data.bairro,
    city: result.data.cidade,
    state: result.data.uf,
  };

  const apiRes = await fetch(`${API_BASE}/enrollment`, {
    method: "POST",
    headers: NGROK_HEADERS,
    body: JSON.stringify(payload),
  });

  if (!apiRes.ok) {
    const errBody = await apiRes.text().catch(() => "(sem corpo)");
    console.error(
      "[matricula] backend status:",
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

  response.cookies.set("va_enrolled", userKey, {
    httpOnly: true,
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
    sameSite: "lax",
  });

  return response;
}
