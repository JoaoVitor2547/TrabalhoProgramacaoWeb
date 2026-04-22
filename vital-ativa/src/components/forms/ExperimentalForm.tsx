"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, Loader2 } from "lucide-react";
import Link from "next/link";
import * as React from "react";
import { Controller, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { modalidadeLabels } from "@/data/aulas";
import { maskPhone } from "@/lib/masks";
import { experimentalSchema, type ExperimentalInput } from "@/lib/validators";
import { TermosDialog } from "./TermosDialog";
import type { Modalidade } from "@/types";

type FormValues = Omit<ExperimentalInput, "aceiteTermos"> & {
  aceiteTermos: boolean;
};

const modalidades: Modalidade[] = [
  "musculacao",
  "cross",
  "funcional",
  "spinning",
  "pilates",
  "yoga",
  "personal",
];

function hoje(): string {
  return new Date().toISOString().slice(0, 10);
}

function limiteMax(): string {
  const d = new Date();
  d.setMonth(d.getMonth() + 3);
  return d.toISOString().slice(0, 10);
}

export function ExperimentalForm() {
  const { toast } = useToast();
  const [sucesso, setSucesso] = React.useState<string | null>(null);
  const [cooldown, setCooldown] = React.useState(false);

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(experimentalSchema),
    mode: "onBlur",
    defaultValues: {
      nome: "",
      email: "",
      telefone: "",
      modalidade: "musculacao",
      dataPreferencial: "",
      origem: "",
      aceiteTermos: false,
    },
  });

  const dataSelecionada = watch("dataPreferencial");
  const isDomingo = React.useMemo(() => {
    if (!dataSelecionada) return false;
    const d = new Date(`${dataSelecionada}T00:00:00`);
    return !Number.isNaN(d.getTime()) && d.getDay() === 0;
  }, [dataSelecionada]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      const response = await fetch("/api/experimental", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Falha");
      const payload = (await response.json()) as {
        ok: true;
        protocolo: string;
      };
      setSucesso(payload.protocolo);
      reset();
      setCooldown(true);
      window.setTimeout(() => setCooldown(false), 3000);
      toast({
        title: "Aula experimental agendada!",
        description: "Te enviamos a confirmação no e-mail informado.",
        variant: "success",
      });
    } catch {
      toast({
        title: "Não foi possível agendar sua aula",
        description: "Verifique sua conexão e tente novamente.",
        variant: "error",
      });
    }
  });

  return (
    <div className="flex flex-col gap-6">
      {sucesso ? (
        <div className="rounded-2xl border border-brand-200 bg-brand-50 p-8 text-center">
          <CheckCircle2
            className="mx-auto size-12 text-brand-600"
            aria-hidden
          />
          <h2 className="mt-3 text-2xl font-bold text-brand-900">
            Sua aula está quase lá!
          </h2>
          <p className="mt-2 text-sm text-brand-800">
            Protocolo: <strong className="font-mono">{sucesso}</strong>
          </p>
          <p className="mt-3 text-sm text-brand-900">
            Em breve entraremos em contato para confirmar horário e recepcionar
            você na academia.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Button asChild>
              <Link href="/planos">Ver planos</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/">Voltar ao início</Link>
            </Button>
          </div>
        </div>
      ) : null}

      <form onSubmit={onSubmit} noValidate className="flex flex-col gap-5">
      <Field
        id="nome"
        label="Nome completo"
        required
        error={errors.nome?.message}
      >
        <Input autoComplete="name" {...register("nome")} />
      </Field>

      <div className="grid gap-5 md:grid-cols-2">
        <Field
          id="email"
          label="E-mail"
          required
          error={errors.email?.message}
        >
          <Input
            type="email"
            autoComplete="email"
            placeholder="voce@email.com"
            {...register("email")}
          />
        </Field>
        <Field
          id="telefone"
          label="Telefone / WhatsApp"
          required
          error={errors.telefone?.message}
        >
          <Input
            inputMode="tel"
            autoComplete="tel"
            maxLength={15}
            placeholder="(00) 00000-0000"
            {...register("telefone", {
              onChange: (e) => {
                e.target.value = maskPhone(e.target.value);
              },
            })}
          />
        </Field>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <Controller
          control={control}
          name="modalidade"
          render={({ field }) => (
            <Field
              id="modalidade"
              label="Modalidade de interesse"
              required
              error={errors.modalidade?.message}
            >
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger error={Boolean(errors.modalidade)}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {modalidades.map((m) => (
                    <SelectItem key={m} value={m}>
                      {modalidadeLabels[m]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          )}
        />
        <Field
          id="dataPreferencial"
          label="Data preferencial"
          required
          error={errors.dataPreferencial?.message}
          hint={
            isDomingo
              ? "Aos domingos não há aulas. Escolha outro dia."
              : "Atendemos de segunda a sábado."
          }
        >
          <Input
            type="date"
            min={hoje()}
            max={limiteMax()}
            {...register("dataPreferencial")}
          />
        </Field>
      </div>

      <Field
        id="origem"
        label="Como nos conheceu?"
        error={errors.origem?.message}
      >
        <Input
          placeholder="Indicação, Instagram, busca no Google…"
          {...register("origem")}
        />
      </Field>

      <Controller
        control={control}
        name="aceiteTermos"
        render={({ field }) => (
          <div className="flex flex-col gap-2">
            <label className="flex items-start gap-3 text-sm text-ink-700">
              <Checkbox
                id="aceiteTermos"
                checked={field.value}
                onCheckedChange={(checked) =>
                  field.onChange(checked === true)
                }
                aria-invalid={errors.aceiteTermos ? "true" : undefined}
                aria-describedby={
                  errors.aceiteTermos ? "aceiteTermos-error" : undefined
                }
              />
              <span>
                Autorizo contato e concordo com os{" "}
                <TermosDialog
                  trigger={
                    <button
                      type="button"
                      className="font-semibold text-brand-700 underline"
                    >
                      termos de uso
                    </button>
                  }
                />
                .
              </span>
            </label>
            {errors.aceiteTermos ? (
              <p
                id="aceiteTermos-error"
                role="alert"
                className="text-xs text-error"
              >
                {errors.aceiteTermos.message}
              </p>
            ) : null}
          </div>
        )}
      />

      <Button
        type="submit"
        size="lg"
        disabled={isSubmitting || cooldown}
        className="self-start"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="size-4 animate-spin" aria-hidden />
            Enviando…
          </>
        ) : cooldown ? (
          "Aguarde um instante"
        ) : (
          "Agendar aula experimental"
        )}
      </Button>
      </form>
    </div>
  );
}
