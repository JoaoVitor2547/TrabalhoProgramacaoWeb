"use client";

import * as React from "react";
import { CalendarClock, Table2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { aulas, diasSemana, modalidadeLabels } from "@/data/aulas";
import { cn } from "@/lib/utils";
import type { AulaSlot, Modalidade, Nivel } from "@/types";

const modalidades: Modalidade[] = [
  "musculacao",
  "cross",
  "funcional",
  "spinning",
  "pilates",
  "yoga",
  "personal",
];

const nivelLabel: Record<Nivel, { label: string; color: string }> = {
  iniciante: {
    label: "Iniciante",
    color: "bg-brand-50 text-brand-700 border-brand-200",
  },
  intermediario: {
    label: "Intermediário",
    color: "bg-amber-50 text-amber-700 border-amber-200",
  },
  avancado: {
    label: "Avançado",
    color: "bg-red-50 text-red-700 border-red-200",
  },
};

function AulaCard({ aula }: { aula: AulaSlot }) {
  const nivel = nivelLabel[aula.nivel];
  return (
    <article className="flex h-full flex-col gap-2 rounded-xl border border-ink-200 bg-white p-3 text-left shadow-sm transition-shadow hover:shadow-md">
      <p className="font-semibold text-ink-900">{aula.horario}</p>
      <p className="text-xs text-ink-600">{aula.professor}</p>
      <div className="mt-auto flex flex-wrap gap-1">
        <span
          className={cn(
            "inline-flex rounded-full border px-2 py-0.5 text-[10px] font-medium",
            nivel.color,
          )}
        >
          {nivel.label}
        </span>
        {aula.requerAgendamento ? (
          <Badge variant="warning" className="text-[10px]">
            <CalendarClock className="size-3" aria-hidden />
            Agendar
          </Badge>
        ) : null}
      </div>
    </article>
  );
}

function GradePorModalidade({ modalidade }: { modalidade: Modalidade }) {
  const aulasDaModalidade = aulas.filter((a) => a.modalidade === modalidade);

  return (
    <div className="overflow-x-auto">
      <div className="grid min-w-[780px] grid-cols-6 gap-3 snap-x snap-mandatory">
        {diasSemana.map((dia) => {
          const aulasDoDia = aulasDaModalidade
            .filter((a) => a.dia === dia.value)
            .sort((a, b) => a.horario.localeCompare(b.horario));
          return (
            <section
              key={dia.value}
              aria-labelledby={`${modalidade}-${dia.value}`}
              className="flex min-w-0 snap-start flex-col gap-3"
            >
              <h3
                id={`${modalidade}-${dia.value}`}
                className="rounded-lg bg-ink-900 px-3 py-2 text-center text-sm font-semibold text-white"
              >
                <span className="sm:hidden">{dia.curto}</span>
                <span className="hidden sm:inline">{dia.label}</span>
              </h3>
              {aulasDoDia.length === 0 ? (
                <div className="rounded-xl border border-dashed border-ink-200 p-3 text-center text-xs text-ink-400">
                  Sem aulas
                </div>
              ) : (
                aulasDoDia.map((a) => <AulaCard key={a.id} aula={a} />)
              )}
            </section>
          );
        })}
      </div>
    </div>
  );
}

function TabelaCompleta() {
  const aulasOrdenadas = [...aulas].sort((a, b) =>
    a.horario.localeCompare(b.horario),
  );

  return (
    <div className="overflow-x-auto rounded-2xl border border-ink-200">
      <table className="min-w-[780px] w-full text-left text-sm">
        <thead className="bg-ink-900 text-xs uppercase tracking-wider text-white">
          <tr>
            <th scope="col" className="p-3">
              Horário
            </th>
            <th scope="col" className="p-3">
              Modalidade
            </th>
            <th scope="col" className="p-3">
              Professor
            </th>
            <th scope="col" className="p-3">
              Dias
            </th>
            <th scope="col" className="p-3">
              Detalhes
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-ink-200 bg-white">
          {modalidades.flatMap((mod) => {
            const modAulas = aulasOrdenadas.filter((a) => a.modalidade === mod);
            const grouped = new Map<string, AulaSlot[]>();
            for (const a of modAulas) {
              const key = `${a.horario}|${a.professor}|${a.nivel}|${a.requerAgendamento}`;
              const arr = grouped.get(key) ?? [];
              arr.push(a);
              grouped.set(key, arr);
            }
            return Array.from(grouped.values()).map((group, i) => {
              const first = group[0];
              if (!first) return null;
              const dias = group
                .map((g) => diasSemana.find((d) => d.value === g.dia)?.curto)
                .filter(Boolean)
                .join(", ");
              const nivel = nivelLabel[first.nivel];
              return (
                <tr key={`${mod}-${i}`}>
                  <td className="p-3 font-medium text-ink-900">
                    {first.horario}
                  </td>
                  <td className="p-3 text-ink-700">
                    {modalidadeLabels[mod]}
                  </td>
                  <td className="p-3 text-ink-700">{first.professor}</td>
                  <td className="p-3 text-ink-700">{dias}</td>
                  <td className="p-3">
                    <div className="flex flex-wrap gap-1">
                      <span
                        className={cn(
                          "inline-flex rounded-full border px-2 py-0.5 text-[10px] font-medium",
                          nivel.color,
                        )}
                      >
                        {nivel.label}
                      </span>
                      {first.requerAgendamento ? (
                        <Badge variant="warning" className="text-[10px]">
                          Agendar
                        </Badge>
                      ) : null}
                    </div>
                  </td>
                </tr>
              );
            });
          })}
        </tbody>
      </table>
    </div>
  );
}

export function HorariosGrid() {
  const [view, setView] = React.useState<"tabs" | "tabela">("tabs");

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="inline-flex rounded-xl bg-ink-100 p-1">
          <Button
            type="button"
            variant={view === "tabs" ? "dark" : "ghost"}
            size="sm"
            onClick={() => setView("tabs")}
            aria-pressed={view === "tabs"}
          >
            <CalendarClock className="size-4" aria-hidden />
            Por modalidade
          </Button>
          <Button
            type="button"
            variant={view === "tabela" ? "dark" : "ghost"}
            size="sm"
            onClick={() => setView("tabela")}
            aria-pressed={view === "tabela"}
          >
            <Table2 className="size-4" aria-hidden />
            Tabela completa
          </Button>
        </div>
        <p className="text-xs text-ink-500">
          Deslize horizontalmente para ver todos os dias
        </p>
      </div>

      {view === "tabs" ? (
        <Tabs defaultValue="musculacao" className="w-full">
          <div className="-mx-4 overflow-x-auto px-4">
            <TabsList>
              {modalidades.map((m) => (
                <TabsTrigger key={m} value={m}>
                  {modalidadeLabels[m]}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
          {modalidades.map((m) => (
            <TabsContent key={m} value={m}>
              <GradePorModalidade modalidade={m} />
            </TabsContent>
          ))}
        </Tabs>
      ) : (
        <TabelaCompleta />
      )}
    </div>
  );
}
