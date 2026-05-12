# Vital Ativa — Front End

Site institucional e de conversão da academia Vital Ativa. Trabalho da disciplina de
Programação Web (ICEV).

## Stack

- **Next.js 15** (App Router, Server Components)
- **TypeScript**
- **TailwindCSS 4**
- **React Hook Form + Zod** (validação)
- **NextAuth (Google Provider)** — autenticação para matrícula
- **Framer Motion** — micro-interações
- **ViaCEP** — preenchimento automático de endereço

## Estrutura

```
src/
├─ app/                     # Rotas (App Router)
│  ├─ page.tsx              # Home
│  ├─ planos/               # Listagem + filtro por objetivo
│  ├─ horarios/             # Grade segunda–sábado
│  ├─ matricula/            # Formulário de matrícula
│  ├─ experimental/         # Agendamento de aula experimental (público)
│  ├─ sobre/                # Institucional (história, equipe, galeria, depoimentos)
│  ├─ login/                # Tela de login Google
│  └─ api/                  # Route handlers (proxy para o back end Fastify)
├─ components/
│  ├─ forms/                # MatriculaForm, TermosDialog
│  ├─ sections/             # Hero, PlanosGrid, HorariosGrid, EquipeGrid, ...
│  └─ ui/                   # Componentes base (button, input, dialog, ...)
├─ data/                    # Dados estáticos (equipe, galeria, depoimentos)
├─ lib/                     # api.ts, viacep.ts, validators.ts, masks.ts, utils.ts
└─ types/                   # Tipagens compartilhadas
```

## Requisitos do briefing atendidos

- Listagem de planos com valor, duração, vantagens e diferenciais (avaliação física,
  nutricionista, acesso ao app).
- Filtro por objetivo (emagrecimento, hipertrofia, relaxamento).
- Grade de horários por modalidade, segunda a sábado, com indicação de agendamento.
- Botão "Matricule-se agora" com pré-seleção do plano via query string.
- Formulário de matrícula com validação (nome, CPF, plano, horário preferencial,
  aceite dos termos) + ViaCEP integrado.
- Cadastro de visitantes para aula experimental (sem necessidade de login).
- Página institucional com história, galeria de fotos, equipe (formação + CREF) e
  depoimentos.

## Pré-requisitos

- Node.js 20+
- Acesso ao back end (GymBackEnd) rodando em `http://localhost:3001` ou no túnel
  ngrok configurado em `src/auth.ts` e nos route handlers de `/api/*`.

## Variáveis de ambiente

Criar `.env.local` na raiz:

```bash
# NextAuth
AUTH_SECRET="gere-com-openssl-rand-base64-32"
AUTH_GOOGLE_ID="..."
AUTH_GOOGLE_SECRET="..."
NEXTAUTH_URL="http://localhost:3000"
```

## Rodando localmente

```bash
npm install
npm run dev
```

Aberto em [http://localhost:3000](http://localhost:3000).

## Integrações back end

| Rota Next         | Rota Fastify              | Método |
| ----------------- | ------------------------- | ------ |
| `/api/matricula`  | `/enrollment`             | POST   |
| `/api/experimental` | `/booking/experimental` | POST   |
| (server)          | `/plans`                  | GET    |
| (server)          | `/schedules`              | GET    |
| (server, auth)    | `/createUser`, `/getUser` | POST   |

## Build

```bash
npm run build
npm run start
```
