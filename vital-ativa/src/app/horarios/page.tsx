import type { Metadata } from "next";
import { HorariosGrid } from "@/components/sections/HorariosGrid";
import { Section, SectionHeading } from "@/components/ui/section";

export const metadata: Metadata = {
  title: "Horários",
  description:
    "Grade completa de horários da Vital Ativa: musculação, cross, funcional, spinning, pilates, yoga e personal. De segunda a sábado.",
  alternates: { canonical: "/horarios" },
};

export default function HorariosPage() {
  return (
    <Section>
      <SectionHeading
        eyebrow="Horários"
        title="Encaixe o treino na sua rotina"
        description="Acesso livre de segunda a sexta das 6h às 23h e aos sábados das 8h às 14h. Algumas modalidades exigem agendamento."
      />
      <div className="mt-10">
        <HorariosGrid />
      </div>
    </Section>
  );
}
