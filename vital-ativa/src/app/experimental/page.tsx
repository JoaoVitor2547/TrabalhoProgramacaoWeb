import type { Metadata } from "next";
import { AulaExperimentalSection } from "@/components/sections/AulaExperimentalSection";
import { HorariosGrid } from "@/components/sections/HorariosGrid";
import { Section, SectionHeading } from "@/components/ui/section";
import type { ScheduleAPI } from "@/types";

export const metadata: Metadata = {
  title: "Aula experimental grátis",
  description:
    "Agende uma aula experimental gratuita na Vital Ativa. Escolha a modalidade, o dia e venha nos conhecer sem compromisso.",
  alternates: { canonical: "/experimental" },
  robots: { index: false, follow: false },
};

async function fetchSchedules(): Promise<ScheduleAPI[]> {
  try {
    const res = await fetch(
      "https://unwaxed-shoddily-mariam.ngrok-free.dev/schedules",
      {
        headers: { "ngrok-skip-browser-warning": "true" },
        next: { revalidate: 60 },
      },
    );
    if (!res.ok) return [];
    const json = await res.json();
    return json.schedules ?? [];
  } catch {
    return [];
  }
}

export default async function ExperimentalPage() {
  const schedules = await fetchSchedules();

  return (
    <>
      <Section>
        <div className="mx-auto max-w-5xl">
          <SectionHeading
            eyebrow="Aula experimental"
            title="Venha treinar com a gente — é grátis"
            description="Escolha uma modalidade, um dia disponível e apareça. Nossa equipe te recepciona e monta um treino de introdução."
          />
          <div className="mt-10">
            <HorariosGrid schedules={schedules} />
          </div>
        </div>
      </Section>

      <Section className="bg-ink-50">
        <div className="mx-auto max-w-2xl">
          <SectionHeading
            eyebrow="Agendamento"
            title="Agende sua aula gratuita"
            description="Preencha os dados abaixo e nossa equipe entrará em contato para confirmar."
          />
          <div className="mt-10">
            <AulaExperimentalSection />
          </div>
        </div>
      </Section>
    </>
  );
}
