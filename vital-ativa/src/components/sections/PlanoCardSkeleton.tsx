import { cn } from "@/lib/utils";

function Bar({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn("animate-pulse rounded bg-ink-200", className)}
    />
  );
}

export function PlanoCardSkeleton() {
  return (
    <div
      role="status"
      className="flex h-full flex-col rounded-2xl border border-ink-200 bg-white p-6 shadow-sm"
    >
      <span className="sr-only">Carregando plano…</span>
      <div className="flex flex-1 flex-col">
        {/* título */}
        <Bar className="h-5 w-32" />
        {/* descrição (2 linhas) */}
        <Bar className="mt-3 h-3 w-full" />
        <Bar className="mt-2 h-3 w-4/5" />
        {/* preço */}
        <Bar className="mt-6 h-9 w-40" />
        <Bar className="mt-2 h-3 w-28" />
        {/* badges */}
        <div className="mt-4 flex gap-2">
          <Bar className="h-5 w-20 rounded-full" />
          <Bar className="h-5 w-24 rounded-full" />
        </div>
        {/* features list (3 linhas com ícone + texto) */}
        <div className="mt-6 flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <Bar className="h-4 w-4 shrink-0 rounded-full" />
            <Bar className="h-3 w-3/4" />
          </div>
          <div className="flex items-center gap-2">
            <Bar className="h-4 w-4 shrink-0 rounded-full" />
            <Bar className="h-3 w-2/3" />
          </div>
          <div className="flex items-center gap-2">
            <Bar className="h-4 w-4 shrink-0 rounded-full" />
            <Bar className="h-3 w-1/2" />
          </div>
        </div>
        {/* lista de modalidades */}
        <Bar className="mt-6 h-3 w-2/3" />
      </div>
      {/* botão */}
      <Bar className="mt-6 h-11 w-full rounded-lg" />
    </div>
  );
}

export function PlanosGridSkeleton() {
  return (
    <div role="status" className="flex flex-col gap-10">
      <span className="sr-only">Carregando planos…</span>
      {/* skeleton da barra de filtro */}
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
      {/* grid de cards */}
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3 items-stretch">
        <PlanoCardSkeleton />
        <PlanoCardSkeleton />
        <PlanoCardSkeleton />
      </div>
    </div>
  );
}
