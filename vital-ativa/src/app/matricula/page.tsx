import type { Metadata } from "next";
import { MatriculaForm } from "@/components/forms/MatriculaForm";
import { Section, SectionHeading } from "@/components/ui/section";
import { planos } from "@/data/planos";

export const metadata: Metadata = {
  title: "Matricule-se",
  description:
    "Faça sua matrícula na Vital Ativa. Formulário rápido com validação em tempo real e busca de endereço por CEP.",
  alternates: { canonical: "/matricula" },
  robots: { index: false, follow: false },
};

interface Params {
  searchParams: Promise<{ plano?: string }>;
}

export default async function MatriculaPage({ searchParams }: Params) {
  const params = await searchParams;
  const planoInicial =
    typeof params.plano === "string" &&
    planos.some((p) => p.slug === params.plano)
      ? params.plano
      : undefined;

  return (
    <Section>
      <div className="mx-auto max-w-3xl">
        <SectionHeading
          eyebrow="Matrícula"
          title="Bora começar?"
          description="Preencha o formulário abaixo. É rápido e a nossa equipe entra em contato em até um dia útil para finalizar o processo."
        />
        <div className="mt-10">
          <MatriculaForm planoInicial={planoInicial} />
        </div>
      </div>
    </Section>
  );
}
