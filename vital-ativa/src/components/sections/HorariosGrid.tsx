"use client";

import * as React from "react";
import { CalendarClock, Table2, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import type { ModalidadeAPI, ScheduleAPI } from "@/types";


const DIAS: { value: ScheduleAPI["day_of_week"]; label: string; curto: string }[] = [
  { value: "SEGUNDA", label: "Segunda-feira", curto: "Seg" },
  { value: "TERCA",   label: "Terça-feira",   curto: "Ter" },
  { value: "QUARTA",  label: "Quarta-feira",  curto: "Qua" },
  { value: "QUINTA",  label: "Quinta-feira",  curto: "Qui" },
  { value: "SEXTA",   label: "Sexta-feira",   curto: "Sex" },
  { value: "SABADO",  label: "Sábado",        curto: "Sáb" },
];

const objectiveLabel: Record<ScheduleAPI["modality"]["objective"], { label: string; color: string }> = {
  HIPERTROFIA:  { label: "Hipertrofia",  color: "bg-brand-50 text-brand-700 border-brand-200" },
  EMAGRECIMENTO:{ label: "Emagrecimento",color: "bg-amber-50 text-amber-700 border-amber-200" },
  RELAXAMENTO:  { label: "Relaxamento",  color: "bg-blue-50 text-blue-700 border-blue-200" },
};

function ScheduleCard({ schedule }: { schedule: ScheduleAPI }) {
  const obj = objectiveLabel[schedule.modality.objective];
  return (
    <article className="flex h-full flex-col gap-2 rounded-xl border border-ink-200 bg-white p-3 text-left shadow-sm transition-shadow hover:shadow-md">
      <p className="font-semibold text-ink-900">
        {schedule.start_time} – {schedule.end_time}
      </p>
      <p className="text-xs text-ink-500 line-clamp-2">{schedule.modality.description}</p>
      <div className="mt-auto flex flex-wrap items-center gap-1">
        <span
          className={cn(
            "inline-flex rounded-full border px-2 py-0.5 text-[10px] font-medium",
            obj.color,
          )}
        >
          {obj.label}
        </span>
        <span className="inline-flex items-center gap-0.5 text-[10px] text-ink-500">
          <Users className="size-3" aria-hidden />
          {schedule.max_capacity}
        </span>
        {schedule.needs_booking && (
          <Badge variant="warning" className="text-[10px]">
            <CalendarClock className="size-3" aria-hidden />
            Agendar
          </Badge>
        )}
      </div>
    </article>
  );
}

function GradePorModalidade({
  modality,
  schedules,
}: {
  modality: ModalidadeAPI;
  schedules: ScheduleAPI[];
}) {
  const aulasDaModalidade = schedules.filter((s) => s.modalityId === modality.id);

  return (
    <div className="overflow-x-auto">
      <div className="grid min-w-[920px] grid-cols-6 gap-3">
        {DIAS.map((dia) => {
          const aulasDoDia = aulasDaModalidade
            .filter((s) => s.day_of_week === dia.value)
            .sort((a, b) => a.start_time.localeCompare(b.start_time));
          return (
            <section
              key={dia.value}
              aria-labelledby={`mod-${modality.id}-${dia.value}`}
              className="flex min-w-0 flex-col gap-3"
            >
              <h3
                id={`mod-${modality.id}-${dia.value}`}
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
                aulasDoDia.map((s) => <ScheduleCard key={s.id} schedule={s} />)
              )}
            </section>
          );
        })}
      </div>
    </div>
  );
}

function TabelaCompleta({ schedules }: { schedules: ScheduleAPI[] }) {
  const sorted = [...schedules].sort((a, b) =>
    a.start_time.localeCompare(b.start_time),
  );

  return (
    <div className="overflow-x-auto rounded-2xl border border-ink-200">
      <table className="min-w-[780px] w-full text-left text-sm">
        <thead className="bg-ink-900 text-xs uppercase tracking-wider text-white">
          <tr>
            <th scope="col" className="p-3">Horário</th>
            <th scope="col" className="p-3">Modalidade</th>
            <th scope="col" className="p-3">Dia</th>
            <th scope="col" className="p-3">Vagas</th>
            <th scope="col" className="p-3">Detalhes</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-ink-200 bg-white">
          {sorted.map((s) => {
            const obj = objectiveLabel[s.modality.objective];
            const dia = DIAS.find((d) => d.value === s.day_of_week);
            return (
              <tr key={s.id}>
                <td className="p-3 font-medium text-ink-900">
                  {s.start_time} – {s.end_time}
                </td>
                <td className="p-3 text-ink-700">{s.modality.name}</td>
                <td className="p-3 text-ink-700">{dia?.label ?? s.day_of_week}</td>
                <td className="p-3 text-ink-700">
                  <span className="inline-flex items-center gap-1">
                    <Users className="size-3 text-ink-400" aria-hidden />
                    {s.max_capacity}
                  </span>
                </td>
                <td className="p-3">
                  <div className="flex flex-wrap gap-1">
                    <span
                      className={cn(
                        "inline-flex rounded-full border px-2 py-0.5 text-[10px] font-medium",
                        obj.color,
                      )}
                    >
                      {obj.label}
                    </span>
                    {s.needs_booking && (
                      <Badge variant="warning" className="text-[10px]">
                        Agendar
                      </Badge>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export function HorariosGrid({ schedules }: { schedules: ScheduleAPI[] }) {
  const [view, setView] = React.useState<"tabs" | "tabela">("tabs");

  const modalities = React.useMemo<ModalidadeAPI[]>(() => {
    const map = new Map<number, ModalidadeAPI>();
    for (const s of schedules) {
      if (!map.has(s.modalityId)) map.set(s.modalityId, s.modality);
    }
    return [...map.values()];
  }, [schedules]);

  if (schedules.length === 0) {
    return (
      <div className="flex items-center justify-center py-16 text-sm text-ink-400">
        Nenhum horário disponível no momento.
      </div>
    );
  }

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
        <Tabs defaultValue={String(modalities[0]?.id)} className="w-full">
          <div className="-mx-4 overflow-x-auto px-4">
            <TabsList>
              {modalities.map((m) => (
                <TabsTrigger key={m.id} value={String(m.id)}>
                  {m.name}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
          {modalities.map((m) => (
            <TabsContent key={m.id} value={String(m.id)}>
              <GradePorModalidade modality={m} schedules={schedules} />
            </TabsContent>
          ))}
        </Tabs>
      ) : (
        <TabelaCompleta schedules={schedules} />
      )}
    </div>
  );
}
