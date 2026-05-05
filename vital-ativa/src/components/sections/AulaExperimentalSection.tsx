"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CheckCircle2, Clock, Loader2, Users } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { maskPhone } from "@/lib/masks";
import { onlyDigits } from "@/lib/utils";
import { cn } from "@/lib/utils";
import type { DiaSemanaAPI, ModalidadeAPI, ScheduleAPI } from "@/types";

const API_BASE = "https://unwaxed-shoddily-mariam.ngrok-free.dev";
const HEADERS = { "ngrok-skip-browser-warning": "true" };

const DAY_LABELS: Record<DiaSemanaAPI, string> = {
  SEGUNDA: "Segunda-feira",
  TERCA: "Terça-feira",
  QUARTA: "Quarta-feira",
  QUINTA: "Quinta-feira",
  SEXTA: "Sexta-feira",
};

const DAY_ORDER: DiaSemanaAPI[] = ["SEGUNDA", "TERCA", "QUARTA", "QUINTA", "SEXTA"];

const OBJECTIVE_VARIANT: Record<string, "brand" | "accent" | "default"> = {
  HIPERTROFIA: "brand",
  EMAGRECIMENTO: "accent",
  RELAXAMENTO: "default",
};

// ─── Schema ────────────────────────────────────────────────────────────────

const bookingSchema = z.object({
  name: z
    .string()
    .min(3, "Informe seu nome completo")
    .regex(/^[A-Za-zÀ-ÿ\s]{3,}$/, "Apenas letras são permitidas"),
  contact: z
    .string()
    .transform(onlyDigits)
    .pipe(z.string().min(10, "Telefone inválido (mínimo 10 dígitos)").max(11, "Telefone inválido")),
  modality: z.string().min(1, "Selecione uma modalidade"),
});

type BookingValues = {
  name: string;
  contact: string;
  modality: string;
};

// ─── Schedule Card ──────────────────────────────────────────────────────────

function ScheduleCard({ schedule }: { schedule: ScheduleAPI }) {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-ink-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-2">
        <span className="text-sm font-bold text-ink-900">
          {schedule.modality.name}
        </span>
        {schedule.needs_booking && (
          <Badge variant="accent" className="shrink-0 text-xs">
            Agendamento
          </Badge>
        )}
      </div>
      <div className="flex items-center gap-1.5 text-xs text-ink-500">
        <Clock className="size-3.5 shrink-0 text-brand-500" aria-hidden />
        {schedule.start_time} – {schedule.end_time}
      </div>
      <div className="flex items-center gap-1.5 text-xs text-ink-500">
        <Users className="size-3.5 shrink-0 text-brand-500" aria-hidden />
        Capacidade: {schedule.max_capacity} pessoas
      </div>
      <Badge
        variant={OBJECTIVE_VARIANT[schedule.modality.objective] ?? "default"}
        className="w-fit"
      >
        {schedule.modality.objective.charAt(0) +
          schedule.modality.objective.slice(1).toLowerCase()}
      </Badge>
    </div>
  );
}

// ─── Main Section ───────────────────────────────────────────────────────────

export function AulaExperimentalSection() {
  const { data: session } = useSession()
  const router = useRouter()
  const [schedules, setSchedules] = React.useState<ScheduleAPI[]>([]);
  const [loadingSchedules, setLoadingSchedules] = React.useState(true);
  const [sucesso, setSucesso] = React.useState(false);

  // Fetch schedules
  React.useEffect(() => {
    fetch(`${API_BASE}/schedules`, { headers: HEADERS })
      .then((r) => r.json())
      .then((json) => setSchedules(json.schedules ?? []))
      .catch(() => {})
      .finally(() => setLoadingSchedules(false));
  }, []);

  // Unique modalities from schedules (preserve insertion order)
  const modalities = React.useMemo<ModalidadeAPI[]>(() => {
    const map = new Map<number, ModalidadeAPI>();
    for (const s of schedules) {
      if (!map.has(s.modalityId)) map.set(s.modalityId, s.modality);
    }
    return [...map.values()];
  }, [schedules]);

  // Group schedules by day
  const grouped = React.useMemo(() => {
    const map = new Map<DiaSemanaAPI, ScheduleAPI[]>();
    for (const day of DAY_ORDER) {
      const items = schedules.filter((s) => s.day_of_week === day);
      if (items.length) map.set(day, items);
    }
    return map;
  }, [schedules]);

  // Form
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<BookingValues>({
    resolver: zodResolver(bookingSchema),
    defaultValues: { name: "", contact: "", modality: "" },
  });

  const modalityValue = watch("modality");

  const onSubmit = handleSubmit(async (data) => {
    if (!session) {
      router.push("/login?callbackUrl=/experimental")
      return
    }

    const res = await fetch(`${API_BASE}/booking/experimental`, {
      method: "POST",
      headers: { ...HEADERS, "Content-Type": "application/json" },
      body: JSON.stringify({
        name: data.name,
        contact: onlyDigits(data.contact),
        modality: Number(data.modality),
      }),
    });

    if (!res.ok) throw new Error(`${res.status}`);

    setSucesso(true);
    reset();
  });

  return (
    <div className="flex flex-col gap-16">

      {/* ── Horários ─────────────────────────────────────── */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-ink-900 md:text-3xl">
          Horários disponíveis
        </h2>
        <p className="mt-2 text-sm text-ink-500">
          Veja as aulas da semana e escolha a modalidade ideal para você.
        </p>

        {loadingSchedules ? (
          <div className="mt-8 flex items-center justify-center py-12 text-ink-400">
            <Loader2 className="size-6 animate-spin" />
          </div>
        ) : grouped.size === 0 ? (
          <p className="mt-8 text-sm text-ink-500">
            Nenhum horário disponível no momento.
          </p>
        ) : (
          <div className="mt-8 flex flex-col gap-8">
            {[...grouped.entries()].map(([day, items]) => (
              <div key={day}>
                <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-brand-600">
                  {DAY_LABELS[day]}
                </h3>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {items.map((s) => (
                    <ScheduleCard key={s.id} schedule={s} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Formulário ───────────────────────────────────── */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-ink-900 md:text-3xl">
          Agende sua aula gratuita
        </h2>
        <p className="mt-2 text-sm text-ink-500">
          Preencha os dados abaixo e nossa equipe entrará em contato para confirmar.
        </p>

        {sucesso ? (
          <div className="mt-8 rounded-2xl border border-brand-200 bg-brand-50 p-8 text-center">
            <CheckCircle2 className="mx-auto size-12 text-brand-600" aria-hidden />
            <h3 className="mt-4 text-xl font-bold text-brand-900">
              Solicitação enviada!
            </h3>
            <p className="mt-2 text-sm text-brand-800">
              Nossa equipe entrará em contato para confirmar sua aula experimental.
            </p>
            <Button
              className="mt-6"
              onClick={() => setSucesso(false)}
              variant="outline"
            >
              Fazer outra solicitação
            </Button>
          </div>
        ) : (
          <form
            onSubmit={onSubmit}
            noValidate
            className="mt-8 flex flex-col gap-5 rounded-2xl border border-ink-200 bg-white p-6 md:p-8"
          >
            <Field id="name" label="Nome completo" required error={errors.name?.message}>
              <Input
                autoComplete="name"
                placeholder="Seu nome completo"
                {...register("name")}
              />
            </Field>

            <Field id="contact" label="Telefone / WhatsApp" required error={errors.contact?.message}>
              <Input
                inputMode="tel"
                autoComplete="tel"
                maxLength={15}
                placeholder="(00) 00000-0000"
                {...register("contact", {
                  onChange: (e) => {
                    e.target.value = maskPhone(e.target.value);
                  },
                })}
              />
            </Field>

            <Field id="modality" label="Modalidade desejada" required error={errors.modality?.message}>
              <Select
                value={modalityValue}
                onValueChange={(val) => setValue("modality", val, { shouldValidate: true })}
              >
                <SelectTrigger error={Boolean(errors.modality)}>
                  <SelectValue placeholder="Selecione uma modalidade" />
                </SelectTrigger>
                <SelectContent>
                  {modalities.map((m) => (
                    <SelectItem key={m.id} value={String(m.id)}>
                      {m.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>

            <Button
              type="submit"
              size="lg"
              className={cn("w-full", isSubmitting && "opacity-70")}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="size-4 animate-spin" aria-hidden />
                  Enviando…
                </>
              ) : (
                "Agendar aula experimental"
              )}
            </Button>
          </form>
        )}
      </div>

    </div>
  );
}
