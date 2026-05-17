import type { Metadata } from "next";
import { Section, SectionHeading } from "@/components/ui/section";

export const metadata: Metadata = {
  title: "Perguntas Frequentes",
  description:
    "Tire suas dúvidas sobre planos, horários, cancelamento e formas de pagamento da Vital Ativa.",
  alternates: { canonical: "/faq" },
};

const faqs = [
  {
    question: "Posso trancar o plano?",
    answer:
      "Sim. Você pode trancar o plano por até 30 dias por ano, sem custo extra, mediante aviso prévio de 7 dias. Períodos maiores podem ser negociados conforme o plano.",
  },
  {
    question: "Existe multa de cancelamento?",
    answer:
      "Planos mensais não têm multa. Planos com contrato de 6 ou 12 meses têm multa proporcional ao tempo restante, conforme contrato.",
  },
  {
    question: "Quais formas de pagamento são aceitas?",
    answer:
      "Aceitamos PIX, cartão de crédito (parcelamento em até 12x), cartão de débito, boleto bancário e débito automático.",
  },
  {
    question: "Preciso agendar todas as aulas?",
    answer:
      "Não. Musculação tem acesso livre. Apenas algumas modalidades como pilates, spinning e yoga exigem agendamento por terem turmas com vagas limitadas.",
  },
  {
    question: "A avaliação física está inclusa?",
    answer:
      "Sim, todos os planos incluem pelo menos uma avaliação física por período. Planos Performance e Premium têm avaliações mais frequentes.",
  },
  {
    question: "Posso experimentar antes de assinar?",
    answer:
      "Sim! Oferecemos uma aula experimental gratuita em qualquer modalidade. Basta agendar pela página de Aula Experimental.",
  },
  {
    question: "Vocês têm acompanhamento nutricional?",
    answer:
      "Sim, está incluso nos planos Performance (mensal) e Premium (semanal). Outros planos podem contratar avulso com nossa nutricionista parceira.",
  },
  {
    question: "A academia funciona em feriados?",
    answer:
      "Funcionamos em horário reduzido na maioria dos feriados nacionais (geralmente 8h às 14h). Em feriados específicos podemos fechar — sempre avisamos pelo Instagram @vitalativa com antecedência.",
  },
];

export default function FaqPage() {
  return (
    <Section>
      <SectionHeading
        eyebrow="FAQ"
        title="Perguntas frequentes"
        description="Reunimos aqui as dúvidas mais comuns. Não achou a sua? Fale com a gente pelo WhatsApp."
      />

      <ul className="mt-10 space-y-3">
        {faqs.map((faq) => (
          <li key={faq.question}>
            <details className="group rounded-2xl border border-ink-200 bg-white p-5 transition-colors hover:border-brand-300 open:border-brand-400">
              <summary className="flex cursor-pointer items-center justify-between gap-4 text-base font-semibold text-ink-900 marker:hidden [&::-webkit-details-marker]:hidden">
                <span>{faq.question}</span>
                <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-700 transition-transform group-open:rotate-45 text-lg font-bold">
                  +
                </span>
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-ink-700">
                {faq.answer}
              </p>
            </details>
          </li>
        ))}
      </ul>
    </Section>
  );
}
