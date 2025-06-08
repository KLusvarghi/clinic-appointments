@@ -10,39 +10,54 @@ Agradecemos seu interesse em contribuir! Siga as diretrizes abaixo para garantir

## 🛠️ Configuração do Projeto

1. Clone o repositório:
- git clone https://github.com/KLusvarghi/clinic-appointments.git

2. Instale as dependências:
- npm install

3. Configure as variáveis de ambiente conforme o arquivo `.env.example`.

## 🧪 Executando o Projeto

- Inicie o servidor de desenvolvimento:
- npm run dev


## 📐 Padrões de Código

- Utilize TypeScript para todo o código.
- Siga os princípios do SOLID e Clean Code.
- Use Tailwind CSS para estilização.
- Utilize componentes da biblioteca shadcn/ui.
- Para formulários, utilize React Hook Form e Zod para validações.

## 🔍 Lint e Formatação

- Verifique problemas de lint com:
  - `npm run lint`
- Formate o código utilizando Prettier:
  - `npx prettier --write .`

## 🚀 Fluxo de Trabalho

- Utilize o GitHub Flow criando branches de funcionalidade a partir da `main`.
- Abra o Pull Request a partir desse branch após concluir a implementação.
- Prefira mensagens de commit no formato **Conventional Commits** e relacione issues usando `#número`.

Todos os testes disponíveis devem ser executados e aprovados antes de abrir o PR.

## 📁 Estrutura de Pastas

- `src/components`: Componentes reutilizáveis.
- `src/data`: Funções de acesso a dados.
- `src/actions`: Server Actions.
- `src/app`: Rotas e páginas.

## ✅ Checklist para Pull Requests

- [ ] O código segue os padrões estabelecidos.
- [ ] Todos os testes foram executados com sucesso.
- [ ] A documentação foi atualizada, se necessário.

Obrigado por contribuir!