"use client";

import * as React from "react";
import { Check, ChevronDown, Minus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn, formatCurrency } from "@/lib/utils";
import type { PlanoAPI, ObjetivoAPI } from "@/types";

const objetivoLabels: Record<ObjetivoAPI, string> = {
  HIPERTROFIA: "Hipertrofia",
  EMAGRECIMENTO: "Emagrecimento",
  RELAXAMENTO: "Relaxamento",
};

function getAllModalities(planos: PlanoAPI[]) {
  const map = new Map<number, { id: number; name: string }>();
  for (const p of planos) {
    for (const m of p.modalities) {
      if (!map.has(m.modality.id)) {
        map.set(m.modality.id, { id: m.modality.id, name: m.modality.name });
      }
    }
  }
  return [...map.values()].sort((a, b) => a.id - b.id);
}

export function PlanosComparador({ planos }: { planos: PlanoAPI[] }) {
  const [expandido, setExpandido] = React.useState<number | null>(null);

  const todasModalidades = React.useMemo(() => getAllModalities(planos), [planos]);

  if (planos.length === 0) return null;

  return (
    <>
      {/* Tabela desktop */}
      <div
        className="hidden overflow-x-auto rounded-2xl border border-ink-200 bg-white md:block"
        role="region"
        aria-label="Comparação de planos"
      >
        <table className="w-full text-left text-sm">
          <caption className="sr-only">Comparação entre os planos Vital Ativa</caption>
          <thead className="bg-ink-50 text-xs uppercase tracking-wider text-ink-600">
            <tr>
              <th scope="col" className="p-4">Modalidade</th>
              {planos.map((p) => (
                <th key={p.id} scope="col" className="p-4 text-center">
                  <span className="block text-sm font-bold text-ink-900">{p.name}</span>
                  <span className="text-xs font-medium text-ink-500">
                    {formatCurrency(parseFloat(p.price))}/mês
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-ink-200">
            <tr className="bg-ink-50/50">
              <th scope="row" className="p-4 font-medium text-ink-800">Avaliação física</th>
              {planos.map((p) => (
                <td key={p.id} className="p-4 text-center">
                  {p.has_phys_eval
                    ? <Check className="mx-auto size-5 text-brand-600" aria-label="Incluso" />
                    : <Minus className="mx-auto size-5 text-ink-300" aria-label="Não incluso" />}
                </td>
              ))}
            </tr>
            <tr className="bg-ink-50/50">
              <th scope="row" className="p-4 font-medium text-ink-800">Nutricionista</th>
              {planos.map((p) => (
                <td key={p.id} className="p-4 text-center">
                  {p.has_nutritionist
                    ? <Check className="mx-auto size-5 text-brand-600" aria-label="Incluso" />
                    : <Minus className="mx-auto size-5 text-ink-300" aria-label="Não incluso" />}
                </td>
              ))}
            </tr>
            <tr className="bg-ink-50/50">
              <th scope="row" className="p-4 font-medium text-ink-800">Acesso ao app</th>
              {planos.map((p) => (
                <td key={p.id} className="p-4 text-center">
                  {p.has_app_access
                    ? <Check className="mx-auto size-5 text-brand-600" aria-label="Incluso" />
                    : <Minus className="mx-auto size-5 text-ink-300" aria-label="Não incluso" />}
                </td>
              ))}
            </tr>
            {todasModalidades.map((mod) => (
              <tr key={mod.id}>
                <th scope="row" className="p-4 font-medium text-ink-800">{mod.name}</th>
                {planos.map((p) => {
                  const incluso = p.modalities.some((m) => m.modality.id === mod.id);
                  return (
                    <td key={p.id} className="p-4 text-center">
                      {incluso
                        ? <Check className="mx-auto size-5 text-brand-600" aria-label="Incluso" />
                        : <Minus className="mx-auto size-5 text-ink-300" aria-label="Não incluso" />}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Acordeão mobile */}
      <div className="flex flex-col gap-3 md:hidden">
        {planos.map((plano) => {
          const open = expandido === plano.id;
          const objetivos = [...new Set(plano.modalities.map((m) => m.modality.objective))] as ObjetivoAPI[];
          return (
            <div key={plano.id} className="rounded-2xl border border-ink-200 bg-white">
              <button
                type="button"
                onClick={() => setExpandido(open ? null : plano.id)}
                aria-expanded={open}
                aria-controls={`comparador-${plano.id}`}
                className="flex w-full items-center justify-between gap-3 p-4 text-left"
              >
                <div>
                  <p className="text-base font-bold text-ink-900">{plano.name}</p>
                  <p className="text-xs text-ink-500">{formatCurrency(parseFloat(plano.price))}/mês</p>
                </div>
                <ChevronDown
                  className={cn("size-5 text-ink-500 transition-transform", open && "rotate-180")}
                  aria-hidden
                />
              </button>
              {open ? (
                <div id={`comparador-${plano.id}`} className="border-t border-ink-200 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wider text-ink-500">Objetivos</p>
                  <ul className="mt-2 flex flex-wrap gap-1.5">
                    {objetivos.map((obj) => (
                      <Badge key={obj} variant="brand">{objetivoLabels[obj]}</Badge>
                    ))}
                  </ul>
                  <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-ink-500">Modalidades</p>
                  <ul className="mt-2 flex flex-wrap gap-1.5">
                    {plano.modalities.map((m) => (
                      <Badge key={m.modalityId} variant="default">{m.modality.name}</Badge>
                    ))}
                  </ul>
                  <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-ink-500">Benefícios</p>
                  <ul className="mt-2 flex flex-col gap-1.5 text-sm text-ink-700">
                    {plano.has_app_access && (
                      <li className="flex items-start gap-2">
                        <Check className="mt-0.5 size-4 shrink-0 text-brand-600" aria-hidden />
                        <span>Acesso ao app</span>
                      </li>
                    )}
                    {plano.has_phys_eval && (
                      <li className="flex items-start gap-2">
                        <Check className="mt-0.5 size-4 shrink-0 text-brand-600" aria-hidden />
                        <span>Avaliação física</span>
                      </li>
                    )}
                    {plano.has_nutritionist && (
                      <li className="flex items-start gap-2">
                        <Check className="mt-0.5 size-4 shrink-0 text-brand-600" aria-hidden />
                        <span>Acompanhamento nutricional</span>
                      </li>
                    )}
                  </ul>
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </>
  );
}
