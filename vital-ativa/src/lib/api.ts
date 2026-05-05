import type { PlanoAPI } from "@/types";

const API_BASE = "https://unwaxed-shoddily-mariam.ngrok-free.dev";

// Ordem: Vital Fit | Vital Zen (popular, centro) | Vital Total
export const FALLBACK_PLANOS: PlanoAPI[] = [
  {
    id: 1,
    name: "Vital Fit",
    price: "89.9",
    duration_months: 1,
    description: "Foco em atividades essenciais. Acesso à musculação e cardio com app incluso.",
    has_phys_eval: false,
    has_nutritionist: false,
    has_app_access: true,
    modalities: [
      { planId: 1, modalityId: 1, modality: { id: 1, name: "Musculação", description: "Treinamento com pesos para ganho de massa muscular", objective: "HIPERTROFIA" } },
      { planId: 1, modalityId: 2, modality: { id: 2, name: "Cardio", description: "Exercícios aeróbicos como esteira e bicicleta", objective: "EMAGRECIMENTO" } },
    ],
  },
  {
    id: 3,
    name: "Vital Zen",
    price: "119.9",
    duration_months: 3,
    description: "Foco em equilíbrio e relaxamento com yoga, pilates, meditação e acesso ao spa.",
    has_phys_eval: true,
    has_nutritionist: false,
    has_app_access: true,
    modalities: [
      { planId: 3, modalityId: 7, modality: { id: 7, name: "Yoga", description: "Prática de equilíbrio físico e mental", objective: "RELAXAMENTO" } },
      { planId: 3, modalityId: 8, modality: { id: 8, name: "Pilates", description: "Fortalecimento com foco em postura e respiração", objective: "RELAXAMENTO" } },
      { planId: 3, modalityId: 9, modality: { id: 9, name: "Meditação", description: "Técnicas de relaxamento e foco mental", objective: "RELAXAMENTO" } },
    ],
  },
  {
    id: 2,
    name: "Vital Total",
    price: "149.9",
    duration_months: 12,
    description: "Plano completo com todas as atividades, avaliação física mensal e acompanhamento nutricional.",
    has_phys_eval: true,
    has_nutritionist: true,
    has_app_access: true,
    modalities: [
      { planId: 2, modalityId: 1, modality: { id: 1, name: "Musculação", description: "Treinamento com pesos para ganho de massa muscular", objective: "HIPERTROFIA" } },
      { planId: 2, modalityId: 2, modality: { id: 2, name: "Cardio", description: "Exercícios aeróbicos como esteira e bicicleta", objective: "EMAGRECIMENTO" } },
      { planId: 2, modalityId: 3, modality: { id: 3, name: "Funcional", description: "Treinos dinâmicos com peso corporal", objective: "EMAGRECIMENTO" } },
      { planId: 2, modalityId: 4, modality: { id: 4, name: "HIIT", description: "Treino intervalado de alta intensidade", objective: "EMAGRECIMENTO" } },
      { planId: 2, modalityId: 5, modality: { id: 5, name: "Spinning", description: "Aulas intensas de ciclismo indoor", objective: "EMAGRECIMENTO" } },
      { planId: 2, modalityId: 6, modality: { id: 6, name: "Cross Training", description: "Treino misto de força e resistência", objective: "HIPERTROFIA" } },
      { planId: 2, modalityId: 7, modality: { id: 7, name: "Yoga", description: "Prática de equilíbrio físico e mental", objective: "RELAXAMENTO" } },
      { planId: 2, modalityId: 8, modality: { id: 8, name: "Pilates", description: "Fortalecimento com foco em postura e respiração", objective: "RELAXAMENTO" } },
      { planId: 2, modalityId: 9, modality: { id: 9, name: "Meditação", description: "Técnicas de relaxamento e foco mental", objective: "RELAXAMENTO" } },
    ],
  },
];

const HEADERS = {
  "ngrok-skip-browser-warning": "true",
};

export async function fetchPlanos(): Promise<PlanoAPI[]> {
  const res = await fetch(`${API_BASE}/plans`, {
    method: "GET",
    headers: HEADERS,
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Erro ao buscar planos: ${res.status}`);
  }

  const json = await res.json();
  return json.data as PlanoAPI[];
}
