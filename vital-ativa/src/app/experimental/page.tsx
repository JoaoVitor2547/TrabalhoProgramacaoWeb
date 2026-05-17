import type { Metadata } from "next";
import { cookies } from "next/headers";
import { CheckCircle2 } from "lucide-react";
import { AulaExperimentalSection } from "@/components/sections/AulaExperimentalSection";
import { HorariosGrid } from "@/components/sections/HorariosGrid";
import { Section, SectionHeading } from "@/components/ui/section";
import type { ScheduleAPI } from "@/types";

export const dynamic = "force-dynamic";

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
  const [schedules, cookieStore] = await Promise.all([
    fetchSchedules(),
    cookies(),
  ]);

  // Visitante anônimo — cookie marca se já agendou nos últimos 30 dias
  const visitorKey = cookieStore.get("va_visitor")?.value;
  const bookedCookie = cookieStore.get("va_experimental")?.value;
  const jaAgendado = !!visitorKey && bookedCookie === visitorKey;

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
            <HorariosGrid initialSchedules={schedules} />
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
            {jaAgendado ? (
              <div className="rounded-2xl border border-brand-200 bg-brand-50 p-8 text-center">
                <CheckCircle2 className="mx-auto size-12 text-brand-600" aria-hidden />
                <h3 className="mt-4 text-xl font-bold text-brand-900">
                  Você já agendou sua aula experimental!
                </h3>
                <p className="mt-2 text-sm text-brand-800">
                  Nossa equipe entrará em contato para confirmar o horário.
                </p>
              </div>
            ) : (
              <AulaExperimentalSection schedules={schedules} />
            )}
          </div>
        </div>
      </Section>
    </>
  );
}
