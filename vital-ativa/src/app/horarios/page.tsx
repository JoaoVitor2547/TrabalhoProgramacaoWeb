import type { Metadata } from "next";
import { HorariosGrid } from "@/components/sections/HorariosGrid";
import { Section, SectionHeading } from "@/components/ui/section";
import type { ScheduleAPI } from "@/types";

export const metadata: Metadata = {
  title: "Horários",
  description:
    "Grade completa de horários da Vital Ativa: musculação, cross, funcional, spinning, pilates, yoga e personal. De segunda a sábado.",
  alternates: { canonical: "/horarios" },
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

export default async function HorariosPage() {
  const schedules = await fetchSchedules();

  return (
    <Section>
      <SectionHeading
        eyebrow="Horários"
        title="Encaixe o treino na sua rotina"
        description="Acesso livre de segunda a sexta das 6h às 23h e aos sábados das 8h às 14h. Algumas modalidades exigem agendamento."
      />
      <div className="mt-10">
        <HorariosGrid schedules={schedules} />
      </div>
    </Section>
  );
}
