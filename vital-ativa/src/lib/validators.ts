import { z } from "zod";
import { isValidCpf } from "./masks";
import { onlyDigits, normalizeText } from "./utils";

const nomeCompletoRegex = /^[A-Za-zÀ-ÿ]{2,}(?:\s+[A-Za-zÀ-ÿ]{2,})+$/u;
const emailRegex =
  /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

export const cepSchema = z
  .string()
  .transform((v) => onlyDigits(v))
  .pipe(z.string().length(8, "CEP deve ter 8 dígitos"));

const nomeCompletoSchema = z
  .string()
  .transform(normalizeText)
  .pipe(
    z
      .string()
      .min(3, "Informe seu nome completo")
      .regex(
        nomeCompletoRegex,
        "Informe nome e sobrenome (apenas letras)",
      ),
  );

const emailSchema = z
  .string()
  .transform((v) => normalizeText(v).toLowerCase())
  .pipe(
    z
      .string()
      .min(5, "E-mail inválido")
      .max(254, "E-mail muito longo")
      .regex(emailRegex, "E-mail inválido"),
  );

const telefoneSchema = z
  .string()
  .transform(onlyDigits)
  .pipe(
    z
      .string()
      .length(11, "Telefone deve ter 11 dígitos (DDD + número)")
      .regex(/^[1-9][1-9]9\d{8}$/, "Telefone inválido"),
  );

const cpfSchema = z
  .string()
  .transform(onlyDigits)
  .pipe(
    z
      .string()
      .length(11, "CPF deve ter 11 dígitos")
      .refine(isValidCpf, "CPF inválido"),
  );

const dataNascimentoSchema = z
  .string()
  .min(1, "Data de nascimento obrigatória")
  .refine((v) => /^\d{4}-\d{2}-\d{2}$/.test(v), "Data inválida")
  .refine((v) => {
    const date = new Date(`${v}T00:00:00`);
    return !Number.isNaN(date.getTime());
  }, "Data inválida")
  .refine((v) => {
    const date = new Date(`${v}T00:00:00`);
    return date.getTime() <= Date.now();
  }, "Data não pode estar no futuro")
  .refine((v) => {
    const date = new Date(`${v}T00:00:00`);
    const now = new Date();
    let age = now.getFullYear() - date.getFullYear();
    const m = now.getMonth() - date.getMonth();
    if (m < 0 || (m === 0 && now.getDate() < date.getDate())) age--;
    return age >= 16;
  }, "É necessário ter 16 anos ou mais");

export const matriculaSchema = z.object({
  nome: nomeCompletoSchema,
  cpf: cpfSchema,
  email: emailSchema,
  telefone: telefoneSchema,
  dataNascimento: dataNascimentoSchema,
  cep: z
    .string()
    .transform(onlyDigits)
    .pipe(z.string().length(8, "CEP deve ter 8 dígitos")),
  endereco: z
    .string()
    .transform(normalizeText)
    .pipe(z.string().min(3, "Endereço obrigatório").max(120)),
  numero: z
    .string()
    .transform(normalizeText)
    .pipe(
      z
        .string()
        .min(1, "Número obrigatório")
        .max(10)
        .regex(/^[0-9A-Za-z\s-]+$/, "Número inválido"),
    ),
  complemento: z
    .string()
    .transform(normalizeText)
    .pipe(z.string().max(60))
    .optional()
    .or(z.literal("")),
  bairro: z
    .string()
    .transform(normalizeText)
    .pipe(z.string().min(2, "Bairro obrigatório").max(80)),
  cidade: z
    .string()
    .transform(normalizeText)
    .pipe(z.string().min(2, "Cidade obrigatória").max(80)),
  uf: z
    .string()
    .transform((v) => v.trim().toUpperCase())
    .pipe(z.string().length(2, "UF inválida")),
  planoSlug: z.string().min(1, "Selecione um plano"),
  periodoPreferencial: z.enum(["manha", "tarde", "noite"], {
    error: () => ({ message: "Selecione um período" }),
  }),
  aceiteTermos: z.literal(true, {
    error: () => ({ message: "Você precisa aceitar os termos" }),
  }),
});

export type MatriculaInput = z.infer<typeof matriculaSchema>;


export const experimentalSchema = z.object({
  name: z
    .string()
    .min(3, "Informe seu nome completo")
    .regex(/^[A-Za-zÀ-ÿ\s]{3,}$/u, "Apenas letras são permitidas")
    .max(50, "Nome muito longo"),
  contact: z
    .string()
    .transform(onlyDigits)
    .pipe(
      z
        .string()
        .min(10, "Telefone inválido (mínimo 10 dígitos)")
        .max(11, "Telefone inválido"),
    ),
  modality: z
    .number({ error: () => ({ message: "Selecione uma modalidade" }) })
    .int()
    .positive(),
});

export type ExperimentalInput = z.infer<typeof experimentalSchema>;
