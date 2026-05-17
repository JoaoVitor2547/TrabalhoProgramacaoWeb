import { HorariosGridSkeleton } from "@/components/sections/HorariosGridSkeleton";
import { Section, SectionHeading } from "@/components/ui/section";

export default function HorariosLoading() {
  return (
    <Section>
      <SectionHeading
        eyebrow="Horários"
        title="Encaixe o treino na sua rotina"
        description="Acesso livre de segunda a sexta das 6h às 23h e aos sábados das 8h às 14h. Algumas modalidades exigem agendamento."
      />
      <div className="mt-10">
        <HorariosGridSkeleton />
      </div>
    </Section>
  );
}
