"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
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
import { planos } from "@/data/planos";
import { maskCep, maskCpf, maskPhone } from "@/lib/masks";
import { matriculaSchema, type MatriculaInput } from "@/lib/validators";
import { fetchCep } from "@/lib/viacep";
import { onlyDigits } from "@/lib/utils";
import { TermosDialog } from "./TermosDialog";

interface SucessoState {
  protocolo: string;
  nome: string;
  plano: string;
}

interface MatriculaFormProps {
  planoInicial?: string;
}

type FormValues = Omit<MatriculaInput, "aceiteTermos"> & {
  aceiteTermos: boolean;
};

export function MatriculaForm({ planoInicial }: MatriculaFormProps) {
  const { toast } = useToast();
  const [cepStatus, setCepStatus] = React.useState<
    "idle" | "loading" | "error"
  >("idle");
  const [sucesso, setSucesso] = React.useState<SucessoState | null>(null);
  const [cooldown, setCooldown] = React.useState(false);

  const validInicial = planos.find((p) => p.slug === planoInicial)?.slug ?? "";

  const {
    register,
    handleSubmit,
    setValue,
    control,
    watch,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(matriculaSchema),
    mode: "onBlur",
    defaultValues: {
      nome: "",
      cpf: "",
      email: "",
      telefone: "",
      dataNascimento: "",
      cep: "",
      endereco: "",
      numero: "",
      complemento: "",
      bairro: "",
      cidade: "",
      uf: "",
      planoSlug: validInicial,
      periodoPreferencial: "manha",
      aceiteTermos: false,
    },
  });

  const cepValue = watch("cep");

  React.useEffect(() => {
    const raw = onlyDigits(cepValue ?? "");
    if (raw.length !== 8) {
      setCepStatus("idle");
      return;
    }
    let cancelled = false;
    setCepStatus("loading");
    const timer = window.setTimeout(async () => {
      const result = await fetchCep(raw);
      if (cancelled) return;
      if (result.ok) {
        setCepStatus("idle");
        setValue("endereco", result.data.logradouro, {
          shouldValidate: true,
        });
        setValue("bairro", result.data.bairro, { shouldValidate: true });
        setValue("cidade", result.data.localidade, { shouldValidate: true });
        setValue("uf", result.data.uf, { shouldValidate: true });
      } else {
        setCepStatus("error");
        setValue("endereco", "", { shouldValidate: true });
        setValue("bairro", "", { shouldValidate: true });
        setValue("cidade", "", { shouldValidate: true });
        setValue("uf", "", { shouldValidate: true });
      }
    }, 400);
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [cepValue, setValue]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      const response = await fetch("/api/matricula", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error("Falha ao enviar");
      }
      const payload = (await response.json()) as {
        ok: true;
        protocolo: string;
      };
      const planoSelecionado =
        planos.find((p) => p.slug === data.planoSlug)?.nome ?? "—";
      setSucesso({
        protocolo: payload.protocolo,
        nome: data.nome,
        plano: planoSelecionado,
      });
      reset();
      setCooldown(true);
      window.setTimeout(() => setCooldown(false), 3000);
      toast({
        title: "Matrícula recebida!",
        description:
          "Entraremos em contato em até um dia útil para finalizar.",
        variant: "success",
      });
    } catch {
      toast({
        title: "Não foi possível enviar sua matrícula",
        description: "Verifique sua conexão e tente novamente.",
        variant: "error",
      });
    }
  });

  if (sucesso) {
    return (
      <div className="rounded-2xl border border-brand-200 bg-brand-50 p-8 text-center">
        <h2 className="text-2xl font-bold text-brand-900">
          Recebemos sua matrícula, {sucesso.nome.split(" ")[0]}!
        </h2>
        <p className="mt-2 text-sm text-brand-800">
          Seu protocolo é{" "}
          <strong className="font-mono">{sucesso.protocolo}</strong>. Plano
          escolhido: <strong>{sucesso.plano}</strong>.
        </p>
        <p className="mt-4 text-sm text-brand-900">
          Nossa equipe entrará em contato em até um dia útil para agendar sua
          avaliação e a assinatura do contrato.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Button asChild variant="primary">
            <Link href="/horarios">Ver horários</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/">Voltar ao início</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-6">
      <fieldset className="grid gap-4 rounded-2xl border border-ink-200 bg-white p-6">
        <legend className="px-2 text-sm font-semibold text-ink-900">
          Dados pessoais
        </legend>
        <div className="grid gap-4 md:grid-cols-2">
          <Field
            id="nome"
            label="Nome completo"
            required
            error={errors.nome?.message}
          >
            <Input autoComplete="name" {...register("nome")} />
          </Field>
          <Field
            id="cpf"
            label="CPF"
            required
            error={errors.cpf?.message}
          >
            <Input
              inputMode="numeric"
              autoComplete="off"
              maxLength={14}
              placeholder="000.000.000-00"
              {...register("cpf", {
                onChange: (e) => {
                  e.target.value = maskCpf(e.target.value);
                },
              })}
            />
          </Field>
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
            label="Telefone"
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
          <Field
            id="dataNascimento"
            label="Data de nascimento"
            required
            error={errors.dataNascimento?.message}
          >
            <Input
              type="date"
              autoComplete="bday"
              max={new Date().toISOString().slice(0, 10)}
              {...register("dataNascimento")}
            />
          </Field>
        </div>
      </fieldset>

      <fieldset className="grid gap-4 rounded-2xl border border-ink-200 bg-white p-6">
        <legend className="px-2 text-sm font-semibold text-ink-900">
          Endereço
        </legend>
        <div className="grid gap-4 md:grid-cols-3">
          <Field
            id="cep"
            label="CEP"
            required
            error={errors.cep?.message}
            hint={
              cepStatus === "loading"
                ? "Buscando endereço…"
                : cepStatus === "error"
                  ? "CEP não encontrado — preencha manualmente"
                  : undefined
            }
          >
            <Input
              inputMode="numeric"
              autoComplete="postal-code"
              maxLength={9}
              placeholder="00000-000"
              {...register("cep", {
                onChange: (e) => {
                  e.target.value = maskCep(e.target.value);
                },
              })}
            />
          </Field>
          <Field
            id="endereco"
            label="Endereço"
            required
            error={errors.endereco?.message}
            className="md:col-span-2"
          >
            <Input
              autoComplete="address-line1"
              {...register("endereco")}
            />
          </Field>
          <Field
            id="numero"
            label="Número"
            required
            error={errors.numero?.message}
          >
            <Input
              inputMode="numeric"
              autoComplete="address-line2"
              {...register("numero")}
            />
          </Field>
          <Field
            id="complemento"
            label="Complemento"
            error={errors.complemento?.message}
          >
            <Input autoComplete="address-line3" {...register("complemento")} />
          </Field>
          <Field
            id="bairro"
            label="Bairro"
            required
            error={errors.bairro?.message}
          >
            <Input
              autoComplete="address-level3"
              {...register("bairro")}
            />
          </Field>
          <Field
            id="cidade"
            label="Cidade"
            required
            error={errors.cidade?.message}
          >
            <Input
              autoComplete="address-level2"
              {...register("cidade")}
            />
          </Field>
          <Field id="uf" label="UF" required error={errors.uf?.message}>
            <Input
              maxLength={2}
              autoComplete="address-level1"
              className="uppercase"
              {...register("uf", {
                onChange: (e) => {
                  e.target.value = e.target.value.toUpperCase().slice(0, 2);
                },
              })}
            />
          </Field>
        </div>
      </fieldset>

      <fieldset className="grid gap-4 rounded-2xl border border-ink-200 bg-white p-6">
        <legend className="px-2 text-sm font-semibold text-ink-900">
          Plano e preferências
        </legend>
        <div className="grid gap-4 md:grid-cols-2">
          <Controller
            control={control}
            name="planoSlug"
            render={({ field }) => (
              <Field
                id="planoSlug"
                label="Plano escolhido"
                required
                error={errors.planoSlug?.message}
              >
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger error={Boolean(errors.planoSlug)}>
                    <SelectValue placeholder="Selecione um plano" />
                  </SelectTrigger>
                  <SelectContent>
                    {planos.map((p) => (
                      <SelectItem key={p.slug} value={p.slug}>
                        {p.nome} —{" "}
                        {p.valorMensal.toLocaleString("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        })}
                        /mês
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
            )}
          />
          <Controller
            control={control}
            name="periodoPreferencial"
            render={({ field }) => (
              <Field
                id="periodoPreferencial"
                label="Horário preferencial"
                required
                error={errors.periodoPreferencial?.message}
              >
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger
                    error={Boolean(errors.periodoPreferencial)}
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="manha">Manhã (6h–12h)</SelectItem>
                    <SelectItem value="tarde">Tarde (12h–18h)</SelectItem>
                    <SelectItem value="noite">Noite (18h–23h)</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
            )}
          />
        </div>
      </fieldset>

      <Controller
        control={control}
        name="aceiteTermos"
        render={({ field }) => (
          <div className="flex flex-col gap-2 rounded-2xl border border-ink-200 bg-white p-5">
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
                Li e concordo com os{" "}
                <TermosDialog
                  trigger={
                    <button
                      type="button"
                      className="font-semibold text-brand-700 underline"
                    >
                      termos e condições
                    </button>
                  }
                />{" "}
                da Vital Ativa.
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
        ) : (
          "Finalizar matrícula"
        )}
      </Button>
    </form>
  );
}
