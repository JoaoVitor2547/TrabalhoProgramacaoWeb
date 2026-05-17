import type { Metadata } from "next";
import { PlanosComparador } from "@/components/sections/PlanosComparador";
import { PlanosGrid } from "@/components/sections/PlanosGrid";
import { Section, SectionHeading } from "@/components/ui/section";
import { FALLBACK_PLANOS } from "@/lib/api";
import type { PlanoAPI } from "@/types";

export const metadata: Metadata = {
  title: "Planos",
  description:
    "Conheça os planos da academia Vital Ativa: valores, duração, modalidades e diferenciais. Filtre por objetivo e escolha o ideal para você.",
  alternates: { canonical: "/planos" },
};

async function fetchPlanos(): Promise<PlanoAPI[]> {
  try {
    const res = await fetch(
      `${process.env.API_BASE_URL!}/plans`,
      {
        headers: { "ngrok-skip-browser-warning": "true" },
        next: { revalidate: 60 },
      },
    );
    if (!res.ok) return FALLBACK_PLANOS;
    const json = await res.json();
    const data = json.data as PlanoAPI[];
    return data?.length ? data : FALLBACK_PLANOS;
  } catch {
    return FALLBACK_PLANOS;
  }
}

export default async function PlanosPage() {
  const planos = await fetchPlanos();

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
        <PlanosGrid planos={planos} />
      </Section>
      <Section className="bg-ink-50">
        <SectionHeading
          eyebrow="Comparador"
          title="Compare lado a lado"
          description="Veja o que cada plano inclui e escolha com confiança."
        />
        <div className="mt-10">
          <PlanosComparador planos={planos} />
        </div>
      </Section>
    </>
  );
}
