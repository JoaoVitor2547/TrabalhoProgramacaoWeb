import { PlanosGridSkeleton } from "@/components/sections/PlanoCardSkeleton";
import { Section, SectionHeading } from "@/components/ui/section";

export default function PlanosLoading() {
  return (
    <>
      <Section className="pb-0">
        <SectionHeading
          eyebrow="Planos"
          title="Escolha o plano que combina com você"
          description="Valores transparentes, sem taxas escondidas. Use o filtro para ver planos alinhados ao seu objetivo."
        />
      </Section>
      <Section className="pt-8">
        <PlanosGridSkeleton />
      </Section>
    </>
  );
}
