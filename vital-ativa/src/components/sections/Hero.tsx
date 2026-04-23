"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-ink-900 text-white">
      <div className="absolute inset-0" aria-hidden="true">
        <Image
          src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1920&q=80"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-ink-900 via-ink-900/80 to-brand-900/40" />
      </div>

      <div className="relative mx-auto w-full max-w-7xl px-4 py-20 sm:px-6 md:py-28 lg:px-8 lg:py-36">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="max-w-3xl"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-brand-400/40 bg-brand-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-brand-300">
            <Sparkles className="size-3.5" aria-hidden />
            Academia Vital Ativa
          </span>
          <h1 className="mt-6 text-4xl font-bold tracking-tight text-white md:text-5xl lg:text-6xl">
            Treino sério,{" "}
            <span className="text-brand-400">resultado real.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-200 md:text-xl">
            Planos transparentes, modalidades para todos os objetivos e uma
            equipe que acompanha você de perto. Conheça a academia que trata
            treino como algo sério — e você como gente.
          </p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg" variant="accent">
              <Link href="/planos">
                Ver planos
                <ArrowRight className="size-4" aria-hidden />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white/30 bg-white/10 text-white hover:bg-white/20"
            >
              <Link href="/experimental">Aula experimental grátis</Link>
            </Button>
          </div>
          <dl className="mt-12 grid grid-cols-3 gap-6 border-t border-white/10 pt-8 text-left">
            <div>
              <dt className="text-sm text-ink-300">Alunos ativos</dt>
              <dd className="mt-1 text-2xl font-bold md:text-3xl">+2.500</dd>
            </div>
            <div>
              <dt className="text-sm text-ink-300">Modalidades</dt>
              <dd className="mt-1 text-2xl font-bold md:text-3xl">7</dd>
            </div>
            <div>
              <dt className="text-sm text-ink-300">Anos no mercado</dt>
              <dd className="mt-1 text-2xl font-bold md:text-3xl">10+</dd>
            </div>
          </dl>
        </motion.div>
      </div>
    </section>
  );
}
