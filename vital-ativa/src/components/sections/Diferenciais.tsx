"use client";

import { motion } from "framer-motion";
import { HeartPulse, Users, LineChart, Clock3 } from "lucide-react";
import { Section, SectionHeading } from "@/components/ui/section";

const items = [
  {
    icon: HeartPulse,
    title: "Acompanhamento próximo",
    desc: "Avaliações regulares e professores atentos à sua evolução — nunca mais treine no piloto automático.",
  },
  {
    icon: Users,
    title: "Ambiente acolhedor",
    desc: "Aqui não tem julgamento. Iniciantes e avançados treinam lado a lado com a mesma atenção.",
  },
  {
    icon: LineChart,
    title: "Metodologia que funciona",
    desc: "Treinos baseados em ciência e adaptados ao seu objetivo — emagrecer, ganhar massa ou relaxar.",
  },
  {
    icon: Clock3,
    title: "Horários flexíveis",
    desc: "De segunda a sábado, das 6h às 23h, sem atrito para encaixar o treino na sua rotina.",
  },
];

export function Diferenciais() {
  return (
    <Section>
      <SectionHeading
        eyebrow="Por que a Vital Ativa"
        title="Treino que acompanha sua vida"
        description="A gente entende que treinar não pode ser mais uma preocupação. Por isso construímos um ambiente onde o resultado vem junto com a rotina."
      />
      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item, i) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.4, delay: i * 0.08 }}
            className="group rounded-2xl border border-ink-200 bg-white p-6 transition-all hover:border-brand-300 hover:shadow-md"
          >
            <div className="flex size-12 items-center justify-center rounded-xl bg-brand-50 text-brand-600 transition-colors group-hover:bg-brand-100">
              <item.icon className="size-6" aria-hidden />
            </div>
            <h3 className="mt-5 text-lg font-bold text-ink-900">
              {item.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-ink-600">
              {item.desc}
            </p>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}
