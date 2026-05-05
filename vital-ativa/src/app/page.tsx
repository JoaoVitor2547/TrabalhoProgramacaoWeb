import { CtaFinal } from "@/components/sections/CtaFinal";
import { DepoimentosCarousel } from "@/components/sections/DepoimentosCarousel";
import { Diferenciais } from "@/components/sections/Diferenciais";
import { EquipeGrid } from "@/components/sections/EquipeGrid";
import { Galeria } from "@/components/sections/Galeria";
import { Hero } from "@/components/sections/Hero";
import { ModalidadesPreview } from "@/components/sections/ModalidadesPreview";
import { PlanosGrid } from "@/components/sections/PlanosGrid";
import { Section, SectionHeading } from "@/components/ui/section";

export default function Home() {
  return (
    <>
      <Hero />
      <Diferenciais />
      <ModalidadesPreview />
      <Section>
        <SectionHeading
          eyebrow="Planos"
          title="Planos para todos os objetivos"
          description="Sem letras miúdas. Escolha o plano que encaixa na sua rotina e no seu bolso."
        />
        <div className="mt-10">
          <PlanosGrid />
        </div>
      </Section>
      <Galeria />
      <DepoimentosCarousel />
      <EquipeGrid />
      <CtaFinal />
    </>
  );
}
