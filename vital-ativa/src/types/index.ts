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

export interface EnderecoViaCep {
  cep: string;
  logradouro: string;
  bairro: string;
  localidade: string;
  uf: string;
  erro?: true;
}
