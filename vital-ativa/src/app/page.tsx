import { CtaFinal } from "@/components/sections/CtaFinal";
import { DepoimentosCarousel } from "@/components/sections/DepoimentosCarousel";
import { Diferenciais } from "@/components/sections/Diferenciais";
import { Hero } from "@/components/sections/Hero";
import { ModalidadesPreview } from "@/components/sections/ModalidadesPreview";
import { Section, SectionHeading } from "@/components/ui/section";

export default function Home() {
  return (
    <>
      <Hero />
      <Diferenciais />
      <ModalidadesPreview />
      <Section className="bg-ink-50">
        <SectionHeading
          eyebrow="Depoimentos"
          title="Quem treina aqui sabe do que a gente fala"
          align="center"
          className="mx-auto text-center"
        />
        <div className="mx-auto mt-10 max-w-3xl">
          <DepoimentosCarousel />
        </div>
      </Section>
      <CtaFinal />
    </>
  );
}
