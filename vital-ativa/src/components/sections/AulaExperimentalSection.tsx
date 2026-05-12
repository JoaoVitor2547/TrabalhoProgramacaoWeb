"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CheckCircle2, Loader2 } from "lucide-react";
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
import type { ModalidadeAPI, ScheduleAPI } from "@/types";


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

export function AulaExperimentalSection({ schedules }: { schedules: ScheduleAPI[] }) {
  const [sucesso, setSucesso] = React.useState(false);

  const modalities = React.useMemo<ModalidadeAPI[]>(() => {
    const map = new Map<number, ModalidadeAPI>();
    for (const s of schedules) {
      if (!map.has(s.modalityId)) map.set(s.modalityId, s.modality);
    }
    return [...map.values()];
  }, [schedules]);

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
    const res = await fetch("/api/experimental", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
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

  if (sucesso) {
    return (
      <div className="rounded-2xl border border-brand-200 bg-brand-50 p-8 text-center">
        <CheckCircle2 className="mx-auto size-12 text-brand-600" aria-hidden />
        <h3 className="mt-4 text-xl font-bold text-brand-900">Solicitação enviada!</h3>
        <p className="mt-2 text-sm text-brand-800">
          Nossa equipe entrará em contato para confirmar sua aula experimental.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="flex flex-col gap-5 rounded-2xl border border-ink-200 bg-white p-6 md:p-8"
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
  );
}
