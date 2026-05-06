"use client";

import { motion } from "framer-motion";
import { Check, Sparkles, Smartphone, ClipboardList, Apple } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn, formatCurrency } from "@/lib/utils";
import type { PlanoAPI, ObjetivoAPI } from "@/types";

const objetivoLabels: Record<ObjetivoAPI, string> = {
  HIPERTROFIA: "Hipertrofia",
  EMAGRECIMENTO: "Emagrecimento",
  RELAXAMENTO: "Relaxamento",
};

const objetivoVariant: Record<ObjetivoAPI, "brand" | "accent" | "default"> = {
  HIPERTROFIA: "brand",
  EMAGRECIMENTO: "accent",
  RELAXAMENTO: "default",
};

function getPlanoObjetivos(plano: PlanoAPI): ObjetivoAPI[] {
  return [...new Set(plano.modalities.map((m) => m.modality.objective))];
}

function reorderPlanos(planos: PlanoAPI[]): PlanoAPI[] {
  const zen = planos.find((p) => p.name === "Vital Zen");
  const others = planos.filter((p) => p.name !== "Vital Zen");
  if (!zen) return planos;
  const mid = Math.floor(others.length / 2);
  return [...others.slice(0, mid), zen, ...others.slice(mid)];
}

function isPopular(plano: PlanoAPI): boolean {
  return plano.name === "Vital Zen";
}

interface PlanoCardProps {
  plano: PlanoAPI;
  index: number;
  popular: boolean;
  autenticado: boolean;
  onAssinar: () => void;
}

function PlanoCard({ plano, index, popular, autenticado, onAssinar }: PlanoCardProps) {
  const modalityNames = plano.modalities.map((m) => m.modality.name);
  const objetivos = getPlanoObjetivos(plano);
  const preco = parseFloat(plano.price);

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.05 }}
      whileHover={{ y: -4 }}
      className={cn(
        "relative flex flex-col h-full rounded-2xl border bg-white p-6 shadow-sm transition-shadow hover:shadow-md",
        popular
          ? "border-brand-500 ring-2 ring-brand-500/20"
          : "border-ink-200",
      )}
    >
      {popular ? (
        <Badge
          variant="accent"
          className="absolute -top-3 left-6 inline-flex items-center gap-1"
        >
          <Sparkles className="size-3" aria-hidden />
          Mais popular
        </Badge>
      ) : null}

      <div className="flex flex-1 flex-col">
        <header>
          <h3 className="text-xl font-bold tracking-tight text-ink-900">
            {plano.name}
          </h3>
          <p className="mt-1 text-sm text-ink-600">{plano.description}</p>
        </header>

        <div className="mt-6 flex items-baseline gap-1">
          <span className="text-4xl font-bold text-ink-900">
            {formatCurrency(preco)}
          </span>
          <span className="text-sm text-ink-500">/mês</span>
        </div>
        <p className="text-xs text-ink-500">
          {plano.duration_months === 1
            ? "Plano mensal"
            : `Contrato de ${plano.duration_months} meses`}
        </p>

        <ul className="mt-4 flex flex-wrap gap-1.5">
          {objetivos.map((obj) => (
            <Badge key={obj} variant={objetivoVariant[obj]}>
              {objetivoLabels[obj]}
            </Badge>
          ))}
        </ul>

        <ul className="mt-6 flex flex-col gap-3 text-sm text-ink-700">
          {plano.has_app_access && (
            <li className="flex items-start gap-2">
              <Smartphone className="mt-0.5 size-4 shrink-0 text-brand-600" aria-hidden />
              <span>Acesso ao app</span>
            </li>
          )}
          {plano.has_phys_eval && (
            <li className="flex items-start gap-2">
              <ClipboardList className="mt-0.5 size-4 shrink-0 text-brand-600" aria-hidden />
              <span>Avaliação física inclusa</span>
            </li>
          )}
          {plano.has_nutritionist && (
            <li className="flex items-start gap-2">
              <Apple className="mt-0.5 size-4 shrink-0 text-brand-600" aria-hidden />
              <span>Acompanhamento nutricional</span>
            </li>
          )}
        </ul>

        <div className="mt-6 text-xs text-ink-500">
          <Check className="mr-1 inline size-3.5 text-brand-600" aria-hidden />
          {modalityNames.join(", ")}
        </div>
      </div>

      <Button
        className="mt-6 w-full"
        variant={popular ? "primary" : "dark"}
        onClick={onAssinar}
      >
        {autenticado ? "Matricule-se agora" : "Faça login para assinar"}
      </Button>
    </motion.article>
  );
}

export function PlanosGrid({ planos }: { planos: PlanoAPI[] }) {
  const { status } = useSession()
  const router = useRouter()
  const autenticado = status === "authenticated"
  const planosOrdenados = React.useMemo(() => reorderPlanos(planos), [planos])

  const todosObjetivos = React.useMemo<ObjetivoAPI[]>(() => {
    const set = new Set<ObjetivoAPI>();
    for (const p of planosOrdenados) {
      for (const m of p.modalities) set.add(m.modality.objective);
    }
    return [...set];
  }, [planosOrdenados]);

  const [filters, setFilters] = React.useState<Set<ObjetivoAPI>>(new Set());

  const toggle = (obj: ObjetivoAPI) => {
    setFilters((prev) => {
      const next = new Set(prev);
      if (next.has(obj)) next.delete(obj);
      else next.add(obj);
      return next;
    });
  };

  const filtered = React.useMemo(() => {
    if (filters.size === 0) return planosOrdenados;
    return planosOrdenados.filter((p) => {
      const planoObjs = getPlanoObjetivos(p);
      return [...filters].every((f) => planoObjs.includes(f));
    });
  }, [filters, planos]);

  const handleAssinar = () => {
    if (!autenticado) {
      router.push("/login?callbackUrl=/planos")
    } else {
      router.push("/matricula")
    }
  }

  return (
    <div className="flex flex-col gap-10">
      <div
        className="flex flex-col gap-3 rounded-2xl border border-ink-200 bg-ink-50 p-5"
        role="group"
        aria-labelledby="filtro-objetivo-label"
      >
        <div className="flex items-baseline justify-between gap-3">
          <p id="filtro-objetivo-label" className="text-sm font-semibold text-ink-800">
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
          {todosObjetivos.map((obj) => {
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
                {objetivoLabels[obj]}
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
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3 items-stretch">
          {filtered.map((plano, i) => (
            <PlanoCard
              key={plano.id}
              plano={plano}
              index={i}
              popular={isPopular(plano)}
              autenticado={autenticado}
              onAssinar={handleAssinar}
            />
          ))}
        </div>
      )}
    </div>
  );
}
