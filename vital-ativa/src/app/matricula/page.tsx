import type { Metadata } from "next";
import { cookies } from "next/headers";
import Link from "next/link";

export const dynamic = "force-dynamic";
import { CheckCircle2 } from "lucide-react";
import { auth } from "@/auth";
import { MatriculaForm } from "@/components/forms/MatriculaForm";
import { Button } from "@/components/ui/button";
import { Section, SectionHeading } from "@/components/ui/section";
import { FALLBACK_PLANOS } from "@/lib/api";
import type { PlanoAPI } from "@/types";

export const metadata: Metadata = {
  title: "Matricule-se",
  description:
    "Faça sua matrícula na Vital Ativa. Formulário rápido com validação em tempo real e busca de endereço por CEP.",
  alternates: { canonical: "/matricula" },
  robots: { index: false, follow: false },
};

async function fetchPlanos(): Promise<PlanoAPI[]> {
  try {
    const res = await fetch(
      "https://unwaxed-shoddily-mariam.ngrok-free.dev/plans",
      {
        headers: { "ngrok-skip-browser-warning": "true" },
        next: { revalidate: 60 },
      },
    );
    if (!res.ok) return FALLBACK_PLANOS;
    const json = await res.json();
    const data = json.data as PlanoAPI[];
    return data?.length ? data : FALLBACK_PLANOS;
  } catch {
    return FALLBACK_PLANOS;
  }
}

interface Params {
  searchParams: Promise<{ plano?: string }>;
}

export default async function MatriculaPage({ searchParams }: Params) {
  const [planos, params, session, cookieStore] = await Promise.all([
    fetchPlanos(),
    searchParams,
    auth(),
    cookies(),
  ]);

  const userKey = session?.user?.apiUserId
    ? String(session.user.apiUserId)
    : session?.user?.email ?? null;
  const enrolledCookie = cookieStore.get("va_enrolled")?.value;
  const jaMatriculado = !!userKey && enrolledCookie === userKey;

  if (jaMatriculado) {
    return (
      <Section>
        <div className="mx-auto max-w-xl text-center">
          <CheckCircle2 className="mx-auto size-16 text-brand-600" aria-hidden />
          <h1 className="mt-6 text-2xl font-bold text-ink-900">
            Você já está matriculado!
          </h1>
          <p className="mt-3 text-sm text-ink-600">
            Sua matrícula na Vital Ativa já foi registrada. Nossa equipe
            entrará em contato caso necessário.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button asChild variant="primary">
              <Link href="/horarios">Ver horários das aulas</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/">Voltar ao início</Link>
            </Button>
          </div>
        </div>
      </Section>
    );
  }

  const planoInicial =
    typeof params.plano === "string" ? params.plano : undefined;

  return (
    <Section>
      <div className="mx-auto max-w-3xl">
        <SectionHeading
          eyebrow="Matrícula"
          title="Bora começar?"
          description="Preencha o formulário abaixo. É rápido e a nossa equipe entra em contato em até um dia útil para finalizar o processo."
        />
        <div className="mt-10">
          <MatriculaForm planos={planos} planoInicial={planoInicial} />
        </div>
      </div>
    </Section>
  );
}
