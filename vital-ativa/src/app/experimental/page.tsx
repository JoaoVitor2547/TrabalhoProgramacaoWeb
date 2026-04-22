import type { Metadata } from "next";
import { ExperimentalForm } from "@/components/forms/ExperimentalForm";
import { Section, SectionHeading } from "@/components/ui/section";

export const metadata: Metadata = {
  title: "Aula experimental grátis",
  description:
    "Agende uma aula experimental gratuita na Vital Ativa. Escolha a modalidade, o dia e venha nos conhecer sem compromisso.",
  alternates: { canonical: "/experimental" },
  robots: { index: false, follow: false },
};

export default function ExperimentalPage() {
  return (
    <Section>
      <div className="mx-auto max-w-2xl">
        <SectionHeading
          eyebrow="Aula experimental"
          title="Venha treinar com a gente — é grátis"
          description="Escolha uma modalidade, um dia disponível e apareça. Nossa equipe te recepciona e monta um treino de introdução."
        />
        <div className="mt-10 rounded-2xl border border-ink-200 bg-white p-6 md:p-8">
          <ExperimentalForm />
        </div>
      </div>
    </Section>
  );
}
