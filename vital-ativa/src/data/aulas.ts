import type { AulaSlot, DiaSemana, Modalidade } from "@/types";

export const diasSemana: { value: DiaSemana; label: string; curto: string }[] =
  [
    { value: "segunda", label: "Segunda-feira", curto: "Seg" },
    { value: "terca", label: "Terça-feira", curto: "Ter" },
    { value: "quarta", label: "Quarta-feira", curto: "Qua" },
    { value: "quinta", label: "Quinta-feira", curto: "Qui" },
    { value: "sexta", label: "Sexta-feira", curto: "Sex" },
    { value: "sabado", label: "Sábado", curto: "Sáb" },
  ];

export const modalidadeLabels: Record<Modalidade, string> = {
  musculacao: "Musculação",
  cross: "Cross Training",
  funcional: "Funcional",
  spinning: "Spinning",
  pilates: "Pilates",
  yoga: "Yoga",
  personal: "Personal Trainer",
};

export const aulas: AulaSlot[] = [
  // Musculação — livre, sem agendamento
  {
    id: "mus-seg-06",
    modalidade: "musculacao",
    dia: "segunda",
    horario: "06:00 - 23:00",
    professor: "Equipe Vital",
    nivel: "iniciante",
    requerAgendamento: false,
  },
  {
    id: "mus-ter-06",
    modalidade: "musculacao",
    dia: "terca",
    horario: "06:00 - 23:00",
    professor: "Equipe Vital",
    nivel: "iniciante",
    requerAgendamento: false,
  },
  {
    id: "mus-qua-06",
    modalidade: "musculacao",
    dia: "quarta",
    horario: "06:00 - 23:00",
    professor: "Equipe Vital",
    nivel: "iniciante",
    requerAgendamento: false,
  },
  {
    id: "mus-qui-06",
    modalidade: "musculacao",
    dia: "quinta",
    horario: "06:00 - 23:00",
    professor: "Equipe Vital",
    nivel: "iniciante",
    requerAgendamento: false,
  },
  {
    id: "mus-sex-06",
    modalidade: "musculacao",
    dia: "sexta",
    horario: "06:00 - 23:00",
    professor: "Equipe Vital",
    nivel: "iniciante",
    requerAgendamento: false,
  },
  {
    id: "mus-sab-08",
    modalidade: "musculacao",
    dia: "sabado",
    horario: "08:00 - 14:00",
    professor: "Equipe Vital",
    nivel: "iniciante",
    requerAgendamento: false,
  },

  // Cross
  ...(
    [
      ["segunda", "06:30", "Rafael Lima", "intermediario"],
      ["segunda", "19:00", "Rafael Lima", "avancado"],
      ["terca", "07:00", "Camila Rocha", "iniciante"],
      ["terca", "20:00", "Rafael Lima", "avancado"],
      ["quarta", "06:30", "Rafael Lima", "intermediario"],
      ["quarta", "19:00", "Camila Rocha", "intermediario"],
      ["quinta", "07:00", "Camila Rocha", "iniciante"],
      ["quinta", "20:00", "Rafael Lima", "avancado"],
      ["sexta", "06:30", "Rafael Lima", "intermediario"],
      ["sexta", "19:00", "Camila Rocha", "intermediario"],
      ["sabado", "09:00", "Rafael Lima", "iniciante"],
      ["sabado", "10:30", "Camila Rocha", "intermediario"],
    ] as const
  ).map(([dia, horario, professor, nivel], i) => ({
    id: `cross-${i}`,
    modalidade: "cross" as const,
    dia,
    horario,
    professor,
    nivel,
    requerAgendamento: false,
  })),

  // Funcional
  ...(
    [
      ["segunda", "08:00", "Juliana Campos"],
      ["segunda", "18:00", "Bruno Alves"],
      ["terca", "09:00", "Juliana Campos"],
      ["terca", "18:00", "Bruno Alves"],
      ["quarta", "08:00", "Juliana Campos"],
      ["quarta", "18:00", "Bruno Alves"],
      ["quinta", "09:00", "Juliana Campos"],
      ["quinta", "18:00", "Bruno Alves"],
      ["sexta", "08:00", "Juliana Campos"],
      ["sexta", "18:00", "Bruno Alves"],
      ["sabado", "09:30", "Bruno Alves"],
    ] as const
  ).map(([dia, horario, professor], i) => ({
    id: `func-${i}`,
    modalidade: "funcional" as const,
    dia,
    horario,
    professor,
    nivel: "intermediario" as const,
    requerAgendamento: false,
  })),

  // Spinning
  ...(
    [
      ["segunda", "07:00", "Tânia Morais"],
      ["segunda", "19:30", "Tânia Morais"],
      ["terca", "07:00", "Tânia Morais"],
      ["terca", "19:30", "Tânia Morais"],
      ["quarta", "07:00", "Tânia Morais"],
      ["quarta", "19:30", "Tânia Morais"],
      ["quinta", "19:30", "Tânia Morais"],
      ["sexta", "07:00", "Tânia Morais"],
      ["sabado", "10:00", "Tânia Morais"],
    ] as const
  ).map(([dia, horario, professor], i) => ({
    id: `spin-${i}`,
    modalidade: "spinning" as const,
    dia,
    horario,
    professor,
    nivel: "intermediario" as const,
    requerAgendamento: false,
  })),

  // Pilates — requer agendamento
  ...(
    [
      ["segunda", "08:30", "Ana Ferraz", "iniciante"],
      ["segunda", "17:00", "Ana Ferraz", "intermediario"],
      ["terca", "08:30", "Ana Ferraz", "iniciante"],
      ["terca", "17:00", "Ana Ferraz", "intermediario"],
      ["quarta", "08:30", "Ana Ferraz", "iniciante"],
      ["quarta", "17:00", "Ana Ferraz", "intermediario"],
      ["quinta", "08:30", "Ana Ferraz", "iniciante"],
      ["quinta", "17:00", "Ana Ferraz", "intermediario"],
      ["sexta", "08:30", "Ana Ferraz", "avancado"],
      ["sabado", "09:00", "Ana Ferraz", "iniciante"],
    ] as const
  ).map(([dia, horario, professor, nivel], i) => ({
    id: `pil-${i}`,
    modalidade: "pilates" as const,
    dia,
    horario,
    professor,
    nivel,
    requerAgendamento: true,
  })),

  // Yoga — requer agendamento
  ...(
    [
      ["segunda", "07:30", "Marcela Dias", "iniciante"],
      ["segunda", "18:30", "Marcela Dias", "intermediario"],
      ["terca", "07:30", "Marcela Dias", "iniciante"],
      ["quarta", "18:30", "Marcela Dias", "intermediario"],
      ["quinta", "07:30", "Marcela Dias", "iniciante"],
      ["quinta", "18:30", "Marcela Dias", "avancado"],
      ["sexta", "18:30", "Marcela Dias", "intermediario"],
      ["sabado", "08:00", "Marcela Dias", "iniciante"],
    ] as const
  ).map(([dia, horario, professor, nivel], i) => ({
    id: `yoga-${i}`,
    modalidade: "yoga" as const,
    dia,
    horario,
    professor,
    nivel,
    requerAgendamento: true,
  })),

  // Personal — requer agendamento
  ...(
    [
      ["segunda", "10:00", "Bruno Alves"],
      ["segunda", "15:00", "Camila Rocha"],
      ["terca", "10:00", "Bruno Alves"],
      ["quarta", "15:00", "Juliana Campos"],
      ["quinta", "10:00", "Camila Rocha"],
      ["sexta", "15:00", "Bruno Alves"],
      ["sabado", "11:00", "Juliana Campos"],
    ] as const
  ).map(([dia, horario, professor], i) => ({
    id: `pers-${i}`,
    modalidade: "personal" as const,
    dia,
    horario,
    professor,
    nivel: "intermediario" as const,
    requerAgendamento: true,
  })),
];
