import type { Metadata } from "next";
import { MatriculaForm } from "@/components/forms/MatriculaForm";
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
  const [planos, params] = await Promise.all([fetchPlanos(), searchParams]);
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
