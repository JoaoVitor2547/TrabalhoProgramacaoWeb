# TrabalhoProgramacaoWeb — Front End Vital Ativa

Interface web do sistema de academia Vital Ativa. Trabalho da disciplina de Programação Web (ICEV).

## Stack

- **Next.js 15** — framework React com App Router
- **Auth.js (NextAuth)** — autenticação via Google OAuth
- **TypeScript** — tipagem estática
- **Tailwind CSS** — estilização

## Pré-requisitos

- Node.js 20+
- Conta no [Google Cloud Console](https://console.cloud.google.com) para as credenciais OAuth
- Backend GymBackEnd rodando localmente

## Variáveis de ambiente

Crie um arquivo `.env.local` na raiz do projeto com o seguinte conteúdo:

```env
# Autenticação (Auth.js)
npx auth secret
AUTH_SECRET="gere_uma_string_aleatoria_longa"

# Google OAuth (obtenha em console.cloud.google.com)
AUTH_GOOGLE_ID="seu_google_client_id.apps.googleusercontent.com"
AUTH_GOOGLE_SECRET="seu_google_client_secret"

# URL base da API backend
API_BASE_URL="http://localhost:3001"
```

> **Nunca commite o `.env.local` com suas credenciais reais.** Confirme que `.env.local` está no `.gitignore`.

### Como obter as credenciais do Google OAuth

1. Acesse [console.cloud.google.com](https://console.cloud.google.com)
2. Crie um projeto (ou selecione um existente)
3. Vá em **APIs e Serviços → Credenciais → Criar credenciais → ID do cliente OAuth**
4. Tipo de aplicativo: **Aplicativo da Web**
5. Adicione as seguintes URLs de callback autorizadas:
   ```
   http://localhost:3000/api/auth/callback/google
   ```
6. Copie o **Client ID** e o **Client Secret** para o `.env.local`

### Gerando o AUTH_SECRET

```bash
npx auth secret
```

## Setup

```bash
# 1. Instalar dependências
npm install

# 2. Iniciar o servidor de desenvolvimento
npm run dev
```

Aplicação disponível em `http://localhost:3000`.

> **Atenção:** o backend precisa estar rodando em `http://localhost:3001` antes de iniciar o front. Siga o setup do repositório [GymBackEnd](https://github.com/LuizMath/GymBackEnd).

## Observações de implementação

- A autenticação é feita via Google OAuth com Auth.js — o login retorna uma sessão com o e-mail do usuário.
- As requisições à API usam `API_BASE_URL` definida no `.env.local`; em desenvolvimento aponta para `localhost:3001`.
- Em produção, substitua `API_BASE_URL` pela URL pública do backend.