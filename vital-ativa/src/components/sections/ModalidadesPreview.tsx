"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Section, SectionHeading } from "@/components/ui/section";
import { modalidadeLabels } from "@/data/aulas";
import type { Modalidade } from "@/types";

interface Item {
  modalidade: Modalidade;
  foto: string;
  descricao: string;
}

const items: Item[] = [
  {
    modalidade: "musculacao",
    foto: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=1000&q=80",
    descricao: "Equipamentos novos e fichas personalizadas por objetivo.",
  },
  {
    modalidade: "cross",
    foto: "https://images.unsplash.com/photo-1534258936925-c58bed479fcb?w=1000&q=80",
    descricao: "Treino intenso em grupo, com foco em força e condicionamento.",
  },
  {
    modalidade: "funcional",
    foto: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1000&q=80",
    descricao: "Movimentos naturais para força, mobilidade e equilíbrio.",
  },
  {
    modalidade: "spinning",
    foto: "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=1000&q=80",
    descricao: "Cardio de alta intensidade com trilha sonora envolvente.",
  },
  {
    modalidade: "pilates",
    foto: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=1000&q=80",
    descricao: "Postura, mobilidade e força no core com aparelhos profissionais.",
  },
  {
    modalidade: "yoga",
    foto: "https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?w=1000&q=80",
    descricao: "Relaxamento consciente e fortalecimento com respiração guiada.",
  },
  {
    modalidade: "personal",
    foto: "https://images.unsplash.com/photo-1574680178050-55c6a6a96e0a?w=1000&q=80",
    descricao: "Acompanhamento individual focado no seu objetivo específico.",
  },
];

export function ModalidadesPreview() {
  return (
    <Section className="bg-ink-50">
      <SectionHeading
        eyebrow="Modalidades"
        title="Para cada objetivo, um caminho"
        description="Sete modalidades pensadas para cobrir desde o iniciante até o atleta. Combine como quiser."
      />
      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item, i) => (
          <motion.article
            key={item.modalidade}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.4, delay: (i % 3) * 0.08 }}
            whileHover={{ y: -4 }}
            className="group overflow-hidden rounded-2xl border border-ink-200 bg-white shadow-sm transition-shadow hover:shadow-md"
          >
            <div className="relative aspect-[4/3] overflow-hidden">
              <Image
                src={item.foto}
                alt=""
                fill
                sizes="(min-width: 1024px) 400px, (min-width: 640px) 50vw, 100vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink-900/60 via-transparent" />
            </div>
            <div className="p-5">
              <h3 className="text-lg font-bold text-ink-900">
                {modalidadeLabels[item.modalidade]}
              </h3>
              <p className="mt-1.5 text-sm text-ink-600">{item.descricao}</p>
            </div>
          </motion.article>
        ))}
      </div>
      <div className="mt-10 flex justify-center">
        <Link
          href="/horarios"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700 transition-colors hover:text-brand-800"
        >
          Ver grade completa de horários
          <ArrowRight className="size-4" aria-hidden />
        </Link>
      </div>
    </Section>
  );
}
