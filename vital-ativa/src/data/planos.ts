import type { Plano } from "@/types";

export const planos: Plano[] = [
  {
    slug: "essencial",
    nome: "Essencial",
    valorMensal: 89.9,
    duracaoMeses: 12,
    modalidades: ["musculacao"],
    objetivos: ["condicionamento"],
    diferenciais: [
      "Acesso à musculação em horário comercial",
      "Avaliação física inicial",
      "Ficha de treino personalizada",
    ],
    descricao:
      "Plano ideal para quem está começando e busca manter uma rotina consistente de musculação.",
  },
  {
    slug: "fitness",
    nome: "Fitness",
    valorMensal: 129.9,
    duracaoMeses: 12,
    modalidades: ["musculacao", "funcional", "spinning"],
    objetivos: ["emagrecimento", "condicionamento"],
    diferenciais: [
      "Acesso livre à musculação",
      "Aulas de funcional e spinning",
      "Avaliação física trimestral",
      "Aplicativo com treinos e métricas",
    ],
    descricao:
      "Combinação perfeita entre musculação e aulas dinâmicas para quem quer queimar calorias e ganhar disposição.",
    popular: true,
  },
  {
    slug: "performance",
    nome: "Performance",
    valorMensal: 179.9,
    duracaoMeses: 12,
    modalidades: ["musculacao", "cross", "funcional"],
    objetivos: ["hipertrofia", "condicionamento"],
    diferenciais: [
      "Musculação + Cross + Funcional",
      "Acompanhamento nutricional mensal",
      "Avaliação física bimestral",
      "App com planilha de progressão",
    ],
    descricao:
      "Para quem busca ganho de massa muscular e performance atlética com acompanhamento próximo.",
  },
  {
    slug: "bem-estar",
    nome: "Bem-Estar",
    valorMensal: 149.9,
    duracaoMeses: 6,
    modalidades: ["pilates", "yoga", "funcional"],
    objetivos: ["relaxamento", "condicionamento"],
    diferenciais: [
      "Pilates e yoga ilimitados",
      "Funcional para mobilidade",
      "Sessões de alongamento guiado",
      "Ambiente exclusivo e silencioso",
    ],
    descricao:
      "Foco em corpo e mente: mobilidade, postura e qualidade de vida em um ambiente tranquilo.",
  },
  {
    slug: "premium",
    nome: "Premium",
    valorMensal: 289.9,
    duracaoMeses: 12,
    modalidades: [
      "musculacao",
      "cross",
      "funcional",
      "spinning",
      "pilates",
      "yoga",
      "personal",
    ],
    objetivos: [
      "emagrecimento",
      "hipertrofia",
      "relaxamento",
      "condicionamento",
    ],
    diferenciais: [
      "Todas as modalidades liberadas",
      "4 sessões de personal por mês",
      "Acompanhamento nutricional semanal",
      "Avaliação física mensal",
      "Acesso 24h à academia",
    ],
    descricao:
      "A experiência completa: todas as modalidades, personal trainer e acompanhamento premium.",
  },
];
