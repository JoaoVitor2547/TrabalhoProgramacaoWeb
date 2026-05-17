import type { Metadata } from "next";
import { Suspense } from "react";
import { HorariosGrid } from "@/components/sections/HorariosGrid";
import { HorariosGridSkeleton } from "@/components/sections/HorariosGridSkeleton";
import { Section, SectionHeading } from "@/components/ui/section";
import type { ScheduleAPI } from "@/types";

export const metadata: Metadata = {
  title: "Horários",
  description:
    "Grade completa de horários da Vital Ativa: musculação, cross, funcional, spinning, pilates, yoga e personal. De segunda a sábado.",
  alternates: { canonical: "/horarios" },
};

async function fetchSchedules(): Promise<ScheduleAPI[]> {
  const res = await fetch(
    "https://unwaxed-shoddily-mariam.ngrok-free.dev/schedules",
    {
      headers: { "ngrok-skip-browser-warning": "true" },
      next: { revalidate: 3600 },
    },
  );
  if (!res.ok) throw new Error(`schedules: ${res.status}`);
  const json = await res.json();
  return json.schedules ?? [];
}

async function HorariosContent() {
  let schedules: ScheduleAPI[] = [];
  try {
    schedules = await fetchSchedules();
  } catch {
    // ISR preservará o cache anterior na próxima revalidação
  }
  return <HorariosGrid schedules={schedules} />;
}

export default function HorariosPage() {
  return (
    <Section>
      <SectionHeading
        eyebrow="Horários"
        title="Encaixe o treino na sua rotina"
        description="Acesso livre de segunda a sexta das 6h às 23h e aos sábados das 8h às 14h. Algumas modalidades exigem agendamento."
      />
      <div className="mt-10">
        <Suspense fallback={<HorariosGridSkeleton />}>
          <HorariosContent />
        </Suspense>
      </div>
    </Section>
  );
}
