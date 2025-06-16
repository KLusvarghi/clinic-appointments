## Implementações

- [ ] Validação de email
- [ x ] Login com outra plataforma (não sera mais necessário)
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



--------------------------------------------
precisamos implementar o envio do email (esperar o resend estabilizar)

e para o suuário quiser reenciar o email, temos que registar isso em banco (eu acho) porque, até o momento eu pego o email pelo params, e se ele mudar e a gente enviar o email, chegará até a caixa de email dele, então ter isso em banco pe mais segudo, a gente salva com tempo de validade, o email e um id, que ao soliciar o envio, ele vai verificar o id no banco, se bater ele resgata o email e envia naquele email (talvez eu possa enviar o email junto a requisição e add o campo email, assim ele armazena tudo e quando eu quiser reenviar só consultar o email, validar o token e enviar )

ver se precisa criptografar a senha






proximos passos:

-> ter maneira de passar para o compoente pai de todos ou layout, o overlaylaod, e quando mudar o estado dele, ele aparece em tele, porque, precisaremos aplicar isso para quando quisermos fazer log out

-> implementar a troca de clinica (se houver mais de uma) pelo componente que é exibido a imagem/logo da clinica

-> validar o processo do usuário logar e ter a data de expiração do token dele diferente de quando ele seleciona o "remember-me" e ver se está expirando mesmo, fazer testes com pouco tempo

-> Validar se o email está sendo enviado (esperar a verificação de domino do resend)

-> componentizar o app-sidebar conforme o chat na v0: https://v0.dev/chat/open-in-v0-ZQbqsw2VaNy

-> monstar a página de "profile" e a edição de:
  - nome
  - senha
  - nome da clinica
  - idioma
  -thema
  - envio de emails (posso adiar isso)



-> implementar thema escuro
  - quando o usuário fizer seu logout, já definir o theme conforme o do sistema dele

-> implementar idioma