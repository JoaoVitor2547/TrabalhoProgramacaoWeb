export type Objetivo =
  | "emagrecimento"
  | "hipertrofia"
  | "relaxamento"
  | "condicionamento";

export type Modalidade =
  | "musculacao"
  | "cross"
  | "funcional"
  | "spinning"
  | "pilates"
  | "yoga"
  | "personal";

export type Nivel = "iniciante" | "intermediario" | "avancado";

export type DiaSemana =
  | "segunda"
  | "terca"
  | "quarta"
  | "quinta"
  | "sexta"
  | "sabado";

export type PeriodoPreferencial = "manha" | "tarde" | "noite";

export interface Plano {
  slug: string;
  nome: string;
  valorMensal: number;
  duracaoMeses: number;
  modalidades: Modalidade[];
  diferenciais: string[];
  objetivos: Objetivo[];
  popular?: boolean;
  descricao: string;
}

export interface AulaSlot {
  id: string;
  modalidade: Modalidade;
  dia: DiaSemana;
  horario: string;
  professor: string;
  nivel: Nivel;
  requerAgendamento: boolean;
}

export interface Profissional {
  id: string;
  nome: string;
  cargo: string;
  foto: string;
  formacao: string;
  cref?: string;
  especialidades: string[];
}

export interface Depoimento {
  id: string;
  nome: string;
  foto: string;
  tempoCasa: string;
  texto: string;
  resultado: string;
}

export interface FotoGaleria {
  id: string;
  src: string;
  alt: string;
}

export type ObjetivoAPI = "HIPERTROFIA" | "EMAGRECIMENTO" | "RELAXAMENTO";

export type DiaSemanaAPI =
  | "SEGUNDA"
  | "TERCA"
  | "QUARTA"
  | "QUINTA"
  | "SEXTA"
  | "SABADO";

export interface ScheduleAPI {
  id: number;
  modalityId: number;
  day_of_week: DiaSemanaAPI;
  max_capacity: number;
  start_time: string;
  end_time: string;
  needs_booking: boolean;
  modality: ModalidadeAPI;
}

export interface ModalidadeAPI {
  id: number;
  name: string;
  description: string;
  objective: ObjetivoAPI;
}

export interface PlanoModalidadeAPI {
  planId: number;
  modalityId: number;
  modality: ModalidadeAPI;
}

export interface PlanoAPI {
  id: number;
  name: string;
  price: string;
  duration_months: number;
  description: string;
  has_phys_eval: boolean;
  has_nutritionist: boolean;
  has_app_access: boolean;
  modalities: PlanoModalidadeAPI[];
}

export interface EnderecoViaCep {
  cep: string;
  logradouro: string;
  bairro: string;
  localidade: string;
  uf: string;
  erro?: true;
}

export type BookingStatusAPI =
  | "PENDENTE"
  | "CONFIRMADO"
  | "CANCELADO"
  | "FALTOU";

export interface BookingAPI {
  id: number;
  booking_date: string;
  created_at: string;
  status: BookingStatusAPI;
  enrollmentId: number;
  scheduleId: number;
  schedule: ScheduleAPI;
}