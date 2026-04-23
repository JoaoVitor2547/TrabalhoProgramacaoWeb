"use client";

import * as React from "react";
import { Check, ChevronDown, Minus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { modalidadeLabels } from "@/data/aulas";
import { planos } from "@/data/planos";
import { cn, formatCurrency } from "@/lib/utils";
import type { Modalidade } from "@/types";

const todasModalidades: Modalidade[] = [
  "musculacao",
  "cross",
  "funcional",
  "spinning",
  "pilates",
  "yoga",
  "personal",
];

export function PlanosComparador() {
  const [expandido, setExpandido] = React.useState<string | null>(null);

  return (
    <>
      <div
        className="hidden overflow-hidden rounded-2xl border border-ink-200 bg-white md:block"
        role="region"
        aria-label="Comparação de planos"
      >
        <table className="w-full text-left text-sm">
          <caption className="sr-only">
            Comparação entre os planos Vital Ativa
          </caption>
          <thead className="bg-ink-50 text-xs uppercase tracking-wider text-ink-600">
            <tr>
              <th scope="col" className="p-4">
                Modalidade
              </th>
              {planos.map((p) => (
                <th key={p.slug} scope="col" className="p-4 text-center">
                  <span className="block text-sm font-bold text-ink-900">
                    {p.nome}
                  </span>
                  <span className="text-xs font-medium text-ink-500">
                    {formatCurrency(p.valorMensal)}/mês
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-ink-200">
            {todasModalidades.map((mod) => (
              <tr key={mod}>
                <th
                  scope="row"
                  className="p-4 font-medium text-ink-800"
                >
                  {modalidadeLabels[mod]}
                </th>
                {planos.map((p) => {
                  const incluso = p.modalidades.includes(mod);
                  return (
                    <td key={p.slug} className="p-4 text-center">
                      {incluso ? (
                        <Check
                          className="mx-auto size-5 text-brand-600"
                          aria-label="Incluso"
                        />
                      ) : (
                        <Minus
                          className="mx-auto size-5 text-ink-300"
                          aria-label="Não incluso"
                        />
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col gap-3 md:hidden">
        {planos.map((plano) => {
          const open = expandido === plano.slug;
          return (
            <div
              key={plano.slug}
              className="rounded-2xl border border-ink-200 bg-white"
            >
              <button
                type="button"
                onClick={() => setExpandido(open ? null : plano.slug)}
                aria-expanded={open}
                aria-controls={`comparador-${plano.slug}`}
                className="flex w-full items-center justify-between gap-3 p-4 text-left"
              >
                <div>
                  <p className="text-base font-bold text-ink-900">
                    {plano.nome}
                  </p>
                  <p className="text-xs text-ink-500">
                    {formatCurrency(plano.valorMensal)}/mês
                  </p>
                </div>
                <ChevronDown
                  className={cn(
                    "size-5 text-ink-500 transition-transform",
                    open && "rotate-180",
                  )}
                  aria-hidden
                />
              </button>
              {open ? (
                <div
                  id={`comparador-${plano.slug}`}
                  className="border-t border-ink-200 p-4"
                >
                  <p className="text-xs font-semibold uppercase tracking-wider text-ink-500">
                    Modalidades inclusas
                  </p>
                  <ul className="mt-2 flex flex-wrap gap-1.5">
                    {plano.modalidades.map((m) => (
                      <Badge key={m} variant="brand">
                        {modalidadeLabels[m]}
                      </Badge>
                    ))}
                  </ul>
                  <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-ink-500">
                    Diferenciais
                  </p>
                  <ul className="mt-2 flex flex-col gap-1.5 text-sm text-ink-700">
                    {plano.diferenciais.map((d) => (
                      <li key={d} className="flex items-start gap-2">
                        <Check
                          className="mt-0.5 size-4 shrink-0 text-brand-600"
                          aria-hidden
                        />
                        <span>{d}</span>
                      </li>
                    ))}
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
