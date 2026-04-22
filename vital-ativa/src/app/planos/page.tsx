import type { Metadata } from "next";
import { PlanosComparador } from "@/components/sections/PlanosComparador";
import { PlanosGrid } from "@/components/sections/PlanosGrid";
import { Section, SectionHeading } from "@/components/ui/section";

export const metadata: Metadata = {
  title: "Planos",
  description:
    "Conheça os planos da academia Vital Ativa: valores, duração, modalidades e diferenciais. Filtre por objetivo e escolha o ideal para você.",
  alternates: { canonical: "/planos" },
};

export default function PlanosPage() {
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
        <PlanosGrid />
      </Section>
      <Section className="bg-ink-50">
        <SectionHeading
          eyebrow="Comparador"
          title="Compare lado a lado"
          description="Veja o que cada plano inclui e escolha com confiança."
        />
        <div className="mt-10">
          <PlanosComparador />
        </div>
      </Section>
    </>
  );
}
