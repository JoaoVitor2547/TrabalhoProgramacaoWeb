"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Check, Sparkles } from "lucide-react";
import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { modalidadeLabels } from "@/data/aulas";
import { planos } from "@/data/planos";
import { cn, formatCurrency } from "@/lib/utils";
import type { Objetivo, Plano } from "@/types";

const objetivosLabels: Record<Objetivo, string> = {
  emagrecimento: "Emagrecimento",
  hipertrofia: "Hipertrofia",
  relaxamento: "Relaxamento",
  condicionamento: "Condicionamento",
};

const objetivosList: Objetivo[] = [
  "emagrecimento",
  "hipertrofia",
  "relaxamento",
  "condicionamento",
];

interface PlanoCardProps {
  plano: Plano;
  index: number;
}

function PlanoCard({ plano, index }: PlanoCardProps) {
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.05 }}
      whileHover={{ y: -4 }}
      className={cn(
        "relative flex flex-col rounded-2xl border bg-white p-6 shadow-sm transition-shadow hover:shadow-md",
        plano.popular
          ? "border-brand-500 ring-2 ring-brand-500/20"
          : "border-ink-200",
      )}
    >
      {plano.popular ? (
        <Badge
          variant="accent"
          className="absolute -top-3 left-6 inline-flex items-center gap-1"
        >
          <Sparkles className="size-3" aria-hidden />
          Mais popular
        </Badge>
      ) : null}

      <header>
        <h3 className="text-xl font-bold tracking-tight text-ink-900">
          {plano.nome}
        </h3>
        <p className="mt-1 text-sm text-ink-600">{plano.descricao}</p>
      </header>

      <div className="mt-6 flex items-baseline gap-1">
        <span className="text-4xl font-bold text-ink-900">
          {formatCurrency(plano.valorMensal)}
        </span>
        <span className="text-sm text-ink-500">/mês</span>
      </div>
      <p className="text-xs text-ink-500">
        Contrato de {plano.duracaoMeses} meses
      </p>

      <ul className="mt-6 flex flex-wrap gap-1.5">
        {plano.objetivos.map((obj) => (
          <Badge key={obj} variant="brand">
            {objetivosLabels[obj]}
          </Badge>
        ))}
      </ul>

      <ul className="mt-6 flex flex-col gap-3 text-sm text-ink-700">
        {plano.diferenciais.map((item) => (
          <li key={item} className="flex items-start gap-2">
            <Check
              className="mt-0.5 size-4 shrink-0 text-brand-600"
              aria-hidden
            />
            <span>{item}</span>
          </li>
        ))}
      </ul>

      <div className="mt-6 text-xs text-ink-500">
        Inclui:{" "}
        {plano.modalidades.map((m) => modalidadeLabels[m]).join(", ")}
      </div>

      <Button
        asChild
        className="mt-auto w-full"
        variant={plano.popular ? "primary" : "dark"}
      >
        <Link href={`/matricula?plano=${plano.slug}`}>Matricule-se agora</Link>
      </Button>
    </motion.article>
  );
}

export function PlanosGrid() {
  const [filters, setFilters] = React.useState<Set<Objetivo>>(new Set());

  const toggle = (obj: Objetivo) => {
    setFilters((prev) => {
      const next = new Set(prev);
      if (next.has(obj)) next.delete(obj);
      else next.add(obj);
      return next;
    });
  };

  const filtered = React.useMemo(() => {
    if (filters.size === 0) return planos;
    return planos.filter((p) =>
      [...filters].every((f) => p.objetivos.includes(f)),
    );
  }, [filters]);

  return (
    <div className="flex flex-col gap-10">
      <div
        className="flex flex-col gap-3 rounded-2xl border border-ink-200 bg-ink-50 p-5"
        role="group"
        aria-labelledby="filtro-objetivo-label"
      >
        <div className="flex items-baseline justify-between gap-3">
          <p
            id="filtro-objetivo-label"
            className="text-sm font-semibold text-ink-800"
          >
            Filtrar por objetivo
          </p>
          {filters.size > 0 ? (
            <button
              type="button"
              onClick={() => setFilters(new Set())}
              className="text-xs font-medium text-brand-700 hover:text-brand-800"
            >
              Limpar filtros
            </button>
          ) : null}
        </div>
        <div className="flex flex-wrap gap-2">
          {objetivosList.map((obj) => {
            const active = filters.has(obj);
            return (
              <button
                key={obj}
                type="button"
                aria-pressed={active}
                onClick={() => toggle(obj)}
                className={cn(
                  "rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-1",
                  active
                    ? "border-brand-600 bg-brand-600 text-white"
                    : "border-ink-300 bg-white text-ink-700 hover:border-brand-400 hover:text-brand-700",
                )}
              >
                {objetivosLabels[obj]}
              </button>
            );
          })}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div
          role="status"
          className="rounded-2xl border border-dashed border-ink-300 bg-white p-10 text-center"
        >
          <p className="text-base font-semibold text-ink-900">
            Nenhum plano combina com todos esses objetivos.
          </p>
          <p className="mt-1 text-sm text-ink-600">
            Remova algum filtro ou fale com a equipe para montarmos uma
            combinação sob medida.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((plano, i) => (
            <PlanoCard key={plano.slug} plano={plano} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}
