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

-> resolver o problema que ele não está salvando os dados após digitar e sair da págna de setting/general

-> implementar a visualização dos usuários da clinica
  - filtrando pelo campo de busca
  - permitindo a mudança da role e de dados expecíficos (podemos abrir um dropdown com as infos dele e alterar)
  - pra issso, para ter mais segurança, ver com o chat se implementamos alguma validação por token (se o token enviado a server action é o mesmo do admin da clinica [por exemplo])

-> e depois das sessões ativas (podendo revogar elas [admin])

-> a parte de convidar um usuário a clinica, deve envolver a questão de ter um domínio (ver com o chat)
-> podemos substituir por um formulário simples em uma nova rota por enquanto


-> planejar como será a questão das nova metricas
  - por patient, doctor, appointments, etc

(acho melhor fazer tudo na visão do adm e dpois do doctor)
-> ver melhor como listar os appointments do doctor, ter vizão dos atuais, futuros e antigos
  - e cada appointment ele conseguir ver o "diagnoses" e "prescriptions"

-> em doctors, podemos add mais um botão ao lado de see details, e deixar esse como ver os detalhes do médico, pacientes futuros, rpesentes e apssado, consultas, etc e outro botão apra editar informações
-> o mesmo se repete para patients, mas é só acrescentar botão para ver detalhes e ver suas consultas antigasm atuais e futuros 

-> arrumar o data picker (caso não consiga com o shadcn, usar o originUI)

------------------
-> Validar se o email está sendo enviado (esperar a verificação de domino do resend)