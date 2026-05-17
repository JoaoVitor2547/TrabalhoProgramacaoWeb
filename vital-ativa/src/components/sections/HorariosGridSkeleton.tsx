import { cn } from "@/lib/utils";

function Bar({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn("animate-pulse rounded bg-ink-200", className)}
    />
  );
}

function ScheduleCardSkeleton() {
  return (
    <div className="flex h-full flex-col gap-2 rounded-xl border border-ink-200 bg-white p-3 shadow-sm">
      <Bar className="h-4 w-24" />
      <Bar className="h-3 w-full" />
      <Bar className="h-3 w-3/4" />
      <div className="mt-auto flex gap-1">
        <Bar className="h-4 w-16 rounded-full" />
        <Bar className="h-4 w-10 rounded-full" />
      </div>
    </div>
  );
}

export function HorariosGridSkeleton() {
  const dias = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

  return (
    <div role="status" className="flex flex-col gap-6">
      <span className="sr-only">Carregando horários…</span>

      {/* filtro de objetivo */}
      <div
        aria-hidden="true"
        className="flex flex-col gap-3 rounded-2xl border border-ink-200 bg-ink-50 p-5"
      >
        <Bar className="h-4 w-40" />
        <div className="flex gap-2">
          <Bar className="h-8 w-28 rounded-full" />
          <Bar className="h-8 w-32 rounded-full" />
          <Bar className="h-8 w-28 rounded-full" />
        </div>
      </div>

      {/* toggle de view */}
      <div className="flex items-center justify-between gap-3" aria-hidden="true">
        <div className="inline-flex rounded-xl bg-ink-100 p-1">
          <Bar className="mr-1 h-8 w-36 rounded-lg" />
          <Bar className="h-8 w-36 rounded-lg" />
        </div>
        <Bar className="h-3 w-48" />
      </div>

      {/* tabs de modalidade */}
      <div className="flex gap-2 overflow-hidden" aria-hidden="true">
        <Bar className="h-9 w-24 rounded-lg" />
        <Bar className="h-9 w-28 rounded-lg" />
        <Bar className="h-9 w-20 rounded-lg" />
        <Bar className="h-9 w-24 rounded-lg" />
        <Bar className="h-9 w-20 rounded-lg" />
      </div>

      {/* grade de aulas */}
      <div className="overflow-x-auto" aria-hidden="true">
        <div className="grid min-w-[920px] grid-cols-6 gap-3">
          {dias.map((dia) => (
            <section key={dia} className="flex min-w-0 flex-col gap-3">
              <div className="rounded-lg bg-ink-900 px-3 py-2 text-center text-sm font-semibold text-white">
                {dia}
              </div>
              <ScheduleCardSkeleton />
              <ScheduleCardSkeleton />
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
