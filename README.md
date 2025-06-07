# Clinic Appointments

Sistema de agendamento e gerenciamento de clínicas médicas.

## ✨ Features

- Cadastro e autenticação de usuários
- Gerenciamento de clínicas e médicos
- Controle de assinaturas via Stripe
- Agendamento de consultas com confirmação manual

## 🚀 Tecnologias Utilizadas

- Next.js 15 (App Router)
- React 19
- TypeScript
- Tailwind CSS
- shadcn/ui
- React Hook Form
- Zod
- BetterAuth
- PostgreSQL
- Drizzle ORM

## 📦 Instalação

1. Clone o repositório:
   ```bash
   git clone https://github.com/KLusvarghi/clinic-appointments.git
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Crie um arquivo `.env.local` e defina as variáveis abaixo.

4. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

5. Para gerar a versão de produção:
   ```bash
   npm run build
   npm start
   ```

## 🔧 Variáveis de Ambiente

Crie um arquivo `.env.local` seguindo o exemplo abaixo:

| Variável | Descrição |
| -------- | --------- |
| `DATABASE_URL` | URL de conexão com o banco PostgreSQL |
| `GOOGLE_CLIENT_ID` | Client ID para login com Google |
| `GOOGLE_CLIENT_SECRET` | Client secret do Google |
| `STRIPE_SECRET_KEY` | Chave secreta da API Stripe |
| `STRIPE_ESSETIAN_PLAN_PRICE_ID` | ID do plano de assinatura no Stripe |
| `STRIPE_WEBHOOK_SECRET` | Chave para validar webhooks do Stripe |
| `NEXT_PUBLIC_APP_URL` | URL base da aplicação |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Public key para o Stripe no frontend |
| `NEXT_PUBLIC_STRIPE_CUSTOMER_PORTAL_URL` | URL do portal do cliente Stripe |

## 📁 Estrutura do Projeto

- `src/components`: Componentes reutilizáveis.
- `src/data`: Funções de acesso a dados.
- `src/actions`: Server Actions.
- `src/app`: Rotas e páginas.

## 📄 Licença

Este projeto está licenciado sob a Licença MIT.
