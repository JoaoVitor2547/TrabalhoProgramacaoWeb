import type { Metadata } from "next";
import { AulaExperimentalSection } from "@/components/sections/AulaExperimentalSection";
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
      <div className="mx-auto max-w-5xl">
        <SectionHeading
          eyebrow="Aula experimental"
          title="Venha treinar com a gente — é grátis"
          description="Escolha uma modalidade, um dia disponível e apareça. Nossa equipe te recepciona e monta um treino de introdução."
        />
        <div className="mt-10">
          <AulaExperimentalSection />
        </div>
      </div>
    </Section>
  );
}
