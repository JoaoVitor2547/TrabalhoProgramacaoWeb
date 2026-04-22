import type { Metadata } from "next";
import { DepoimentosCarousel } from "@/components/sections/DepoimentosCarousel";
import { EquipeGrid } from "@/components/sections/EquipeGrid";
import { Galeria } from "@/components/sections/Galeria";
import { Section, SectionHeading } from "@/components/ui/section";

export const metadata: Metadata = {
  title: "Sobre a Vital Ativa",
  description:
    "Conheça a história, a equipe e a estrutura da academia Vital Ativa. Mais de 10 anos transformando rotinas em resultado real.",
  alternates: { canonical: "/sobre" },
};

export default function SobrePage() {
  return (
    <>
      <Section>
        <div className="grid gap-10 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <SectionHeading
              eyebrow="Nossa história"
              title="Mais de uma década cuidando de quem treina"
            />
            <div className="mt-8 space-y-4 text-base leading-relaxed text-ink-700">
              <p>
                A Vital Ativa nasceu em 2014 do incômodo de Lúcia Andrade com
                academias impessoais: muita máquina, pouca atenção. Formada em
                Educação Física pela USP, ela resolveu montar um espaço onde
                cada aluno fosse tratado pelo nome, e não por um número de
                catraca.
              </p>
              <p>
                Hoje somos mais de 2.500 alunos ativos, sete modalidades e uma
                equipe que prioriza acompanhamento sobre volume. Trocamos
                equipamentos todo ano, investimos em formação contínua e
                mantemos o ambiente que fez a gente chegar até aqui: acolhedor,
                exigente e honesto.
              </p>
              <p>
                A gente acredita que treino bom é aquele que cabe na sua rotina
                e te devolve mais energia. Nosso trabalho é facilitar esse
                encontro.
              </p>
            </div>
          </div>
          <aside className="rounded-2xl border border-ink-200 bg-ink-50 p-6 lg:col-span-2">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-brand-700">
              A Vital em números
            </h2>
            <dl className="mt-4 grid grid-cols-2 gap-6">
              <div>
                <dt className="text-xs text-ink-500">Alunos ativos</dt>
                <dd className="mt-1 text-3xl font-bold text-ink-900">+2.500</dd>
              </div>
              <div>
                <dt className="text-xs text-ink-500">Anos no mercado</dt>
                <dd className="mt-1 text-3xl font-bold text-ink-900">10+</dd>
              </div>
              <div>
                <dt className="text-xs text-ink-500">Modalidades</dt>
                <dd className="mt-1 text-3xl font-bold text-ink-900">7</dd>
              </div>
              <div>
                <dt className="text-xs text-ink-500">Profissionais</dt>
                <dd className="mt-1 text-3xl font-bold text-ink-900">15</dd>
              </div>
            </dl>
          </aside>
        </div>
      </Section>

      <Section className="bg-ink-50">
        <SectionHeading
          eyebrow="Estrutura"
          title="Um espaço feito para treinar bem"
          description="Equipamentos novos, salas especializadas e ambientes bem iluminados. Clique nas fotos para ampliar."
        />
        <div className="mt-10">
          <Galeria />
        </div>
      </Section>

      <Section>
        <SectionHeading
          eyebrow="Equipe"
          title="Quem cuida do seu treino"
          description="Profissionais com formação sólida e CREF ativo, dedicados a acompanhar sua evolução."
        />
        <div className="mt-10">
          <EquipeGrid />
        </div>
      </Section>

      <Section className="bg-ink-50">
        <SectionHeading
          eyebrow="Depoimentos"
          title="O que os alunos dizem"
          align="center"
          className="mx-auto text-center"
        />
        <div className="mx-auto mt-10 max-w-3xl">
          <DepoimentosCarousel />
        </div>
      </Section>
    </>
  );
}
