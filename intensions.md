## Implementações

- [ ] Validação de email
- [ ] Login com outra plataforma
- [ ] Prontuário do paciente
- [ ] Colocar cache onde necessário (para rotas muito acessadas)
- [ ] Permitir que o usuário adicione mais de uma clínica
- [ ] Atualizar o agendamento para permitir escolha de horários pelo paciente
- [ ] Implementar acesso de médicos com permissões restritas
  - Ver consultas do dia, semana e mês
  - Ver dados dos pacientes e prontuários
- [ ] Permitir ao admin restaurar médicos deletados
- [ ] Dar ao paciente acesso a dados básicos da clínica, médico e consultas
- [ ] Pesquisar sistemas de administração semelhantes
- [ ] Implementar validações nas server actions
- [ ] Melhorar a validação da sessão de forma componentizada
- [ ] Ao clicar nos agendamentos do médico, abrir lista completa
  - Incluir tela com filtros de médicos
  - Fazer o mesmo para as "specialties"
- [ ] Filtro mais inteligente no gráfico do dashboard
- [ ] Transformar "specialty" em enum com ícone para cada especialidade
- [ ] Restringir ações do usuário após implementar planos
  - Cadastrar apenas 5 médicos
  - Restringir métricas
  - Limitar colaboradores conforme a estrutura do projeto
- [ ] Adicionar três campos em "user" para integração de pagamento
  - Data de compra
  - Data de cancelamento
  - Outras informações para rastrear ações
- [ ] Implementar lógica de sete dias grátis antes da assinatura
  - Exige novos campos na entidade User
- [ ] Tela intermediária com loading após login para verificar plano
- [ ] Sidebar não atualiza o nome da clínica sem refresh
- [ ] Estruturar melhor os planos e validar dias de uso
- [ ] Exibir loader ao fazer signout
- [ ] Melhorar o footer da sidebar com menu de opções
- [ ] Exibir efeitos ou passo a passo após assinatura do plano
- [ ] Validar o cookie do usuário
- [ ] Evitar que páginas protegidas precisem requisitar "session"

## Ideias
- Pensar em atender clínicas em geral (psicologia, odontologia etc.)
- Gerar rentabilidade para o cliente além de organização
- Definir se será um CRM ou painel administrativo
- Inspirar-se em consultórios de dentistas e psicólogos

## Notas

✅ 2. Subdomínios para Clínicas

Observação: Ideal usar subdomínio com CNAME dinâmico em produção (ex: Vercel + rewrites + wildcard DNS).

---

Qual a diferença do Redis para outros bancos ao usar Cache Aside? Qual a diferença na prática?

----

Quando uma aplicação escala, o banco de dados costuma ser o primeiro a sofrer (muitas requisições).

----

O cache em memória pode ser custoso, então use com cuidado.

Node-cache armazena em memória RAM, o que é bem rápido.

Se um admin invalidar a sessão, o usuário ainda poderá usar o tempo do cookie local. Usar WebSocket ou guardar o cookie no Redis resolve isso.

Um middleware no Next roda em ambiente EDGE (versão mínima do Node) e próximo do usuário.
Evite data fetching em middleware, mesmo com cache.

`nextResponse.next()` redireciona para a tela desejada.

HOCs (Higher Order Components)
- Recebem um componente e executam algo antes de renderizar
- Passam props extras para o componente

Proteção de dados da clínica (`localhost:3000/idDaClinica`) já que um usuário pode ter várias clínicas
- Função `getClinicData` faz queries no banco (armazenada em `data/`)
- Recuperar a sessão do usuário
- Validar com `users.clinics.some(clinicId => idDaClinica === clinicId)`
- Evitar chamadas ao banco dentro do componente quando possível

O que é PWA?

Quando usar middleware? Apenas para verificar sessão, clínica ou plano?
