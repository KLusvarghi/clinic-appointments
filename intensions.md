## Implementações

- [] Validação de email
- [] Login com outra plataforma
- [] prontuário do paciente
- [] colcoar cache aonde eu achar necessario (caso senha uma rota aonde muitas pessoas acessem simultaneamente)
- [] um usuário adicionar mais de uma clinica
- [] atualemnte, no sistema, o médico seleciona blocos de horários para agendar uma consulta, e para uma versão mais pro, podemos fazer com esses horários a critério do paciente, e apenas teremos que modificar os horários disponíveis futuros
- [] Nesse dashboard, podemos implementar o acesso de médicos (novo user), com acessos restritos,
  - mas que ele consiga ver as consultas do dia, semana e mês
  - dados dos pacientes que irá atender, se eles já tem histórico ou não,
  - ver o pontuário do paciente e diagnosticos
- [] Ter como o user (admin) verificar os médicos deletado e restaurar se quiser
  - pra isso, tem que verificar se ao fazer a exclusão ele deleta de fato ou apenas
- [] O paciente terá acesso a dados basicos sobre a clinica, do médico e de suas consultas, receitas, anotações ou prontuário
- [] pesquisar sistemas de administração igual a esse
- [] implementar validações nas server actions
- [] melhorar a validação da sessão para algo componentizado (podendo usar gerenciador de contexto) - para não ter que fazer o mesmo processo de pegar a session e validar
- [] na dashboard, ao clicar nos agendamentos do médico, abrir um dialog ou uma página com todos os agendamentos daquele medico
  - É valido pensar em uma tela aonde consiga ver todos os agendamentos do médico, conseguindo filtrar os médicos, etc
  - podemos fazer o mesmo com as "Specialtys"
- [] implementar um filtro mais inteligente no gráfico principal do dashboard, conseguir manipular melhor as datas
- [] no banco de dados, na tabela de doctor, em "specialty" podemos transformar ele em um enum e cada especialidade ter um icone
- [] após a implementação do plano, podemos restringir o suuário em suas ações, como:
  - cadastrar apenas 5 médicos
  - restrição de métricas
  - quantidade de usuários (gerente, recepcionistas) (isso depende da estrutura de como será o projeto)



- [] já que teremos que adicionar os 3 novos campos na tabela de user por conta da integração com método de pagamento, podemos adicionar mais campos como:
  - data de compra
  - data de cancelamento
  - e coisas relacionadas a fim de rastrear melhor as ações do usuário, afim de poder sugerir beneficios, etc


- [] implementar uam logica para que o usuário tenha 7 dias de uso gratuito e após isso ele precisa assinar o plano
  - para isso vou precisar adicionar novos campos a entidade User

  
- [] quando o usuário criar sua conta ou fizer login, vamos levar ele para uam tela intermediária com um loading e assim, depois do sistema verificar a session e verificar o plano dele, ai ele redireciona ou para o dashboard ou para a tela de planos
- [] quando voce se cadastra e cria uma clinica, no sidbar, não aparece o nome da clinica (porque não atualizou), e só após dando um reflesh ele atualiza
- [] estruturar melhor os planos, de inicio, quando o usuário fizer a conta, acho que o ideial é atribuir um plano free, e esse capo ser "notNull", assim, já tribui quando o plano foi atualizado ou criado, e validamos os 7 dias dele, e quando ele comprar um plano atualizamos com a nova data
- [] quando clicar em signout, exibir um loader até finalizar o signout
- [] no componente sidbar, tem o sideFooter, nele, exibe as infors do meu user, e podemos implementar os 3 pontos igual tem no exemplo da doc, e dando a opção de singout, edição de uusário, edição da clinica, edição de colaboradores (se a gente implementar aquela função de recepcionista, etc)
- [] quando o usuário assinar o plano, podemos exibir efeitos, passo a passo com as novas funcionalidades ou algo do tipo
- [] já validamos se o user tem um cookie, porém, precisamos ver uma maneira de validar esse cookie
- [] de que maneira eu posso fazer com que todas as página que estão em (protecetd) elas não precisam requisitar o "session", tem como eu receber como props ou sla, com o reduz eu recuperar isso?  já que não é recomendado ter uma chamada de banco no meu componente, eu poderia talvez fazer o mesmo com os dados do dashboard? criar um arquivo dentro de "data" que ao chama-ló ele me trás a sessão, caso haja uma
---

## Pensando alto
- Se eu pensar em algo que abrangisse não apenas consultórios médicos, mas tbm clinicas de psicologia, dentistas, clinicas em geral que alugam salas e tem que administrar agendamentos
- a intenção tem que ser mais do que ser algo para administrar, tem que ser algo que traga rentabilidade para o usuário (o que comprou), não apenas organização e feedback
- A visão que eu tenho que ter é, eu quero que seja um tipo de CRM, ou um painel administrativo?
(pensar na minah antiga dentista, consultarios de dentistas que tem no boqueirão, consultorios de psicologos que existem, salas comerciais)










---

Anotações a parte:

✅ 2. Subdomínios para Clínicas

Observação: Ideal usar subdomínio com CNAME dinâmico em produção (ex: Vercel + rewrites + wildcard DNS).

---

Qual a diferença do Redis para outros bancos para usar Cache Aside? qual a diferença na prática?

----

quando uma aplicação começa a escalar, a priemira coisa que começa dar problema é o banco de dados (muitas requisições)


----

O chache em memoria pode ser custoso já que vai armazenar em memoria, então é recomendado usar ele com mais cuidado.

Já o node-cache ele armazena em memoria ram, o que torna bem mais rápido 

E caso um admin quer invalidar a sessão do user? ele ainda vai poder usar a aplciação com o tempo restante que tem já que ele é armazenado no cookie local, e para resolver isso o websocket pode solucionar. Mas se o cookies ficar no banco de dados como redis, não tem esse problema



um middleare no next é executado em um ambiente EDGE que é executado

(EDGE ENVIRONMENT) -> Ele roda uma versão "minificada" do node.js
- E le roda perto do usuário

e um middleare precisa ser rodada muito rápido, e quando fazemos um req HTTP (mesmo que esteja chacheada) não é recomendado fazer data fetching

nexteResponse.next() -> ele te direciona para a tela que voce quer acessar

hocs -> hire order componentes
  - ele é um componente que recebe um componente e realiza antes de renderizalo
  - ou passa alguma prop expra para esse compoennte


  proteger os dados da tanet (clinica) "localhost:3000//idDaCLinica(123)"  jpa que um user pode ter várias clinicas e para não pegar os dados de outra clinica
  - ele teria que acessar o getClinicData (uma função que recupera os dados) que basicamente fará querys no nosso db, porem na nossa aplciação a gente armazena dentro da pasta "data" (tenho que ver como guardar isso melhor)
  - primeiro teria que recuperar a sessão do usuário
  - depois teria que fazer a validação:
    - users.clinics.some(clinicId => idDaCLinica === clinicId)


  - não é bom ter sua chamada de banco no seu componente (mesmo que seja possivel)


  o que é PWA?

  Quais casos da minha aplicação é legal usar um middlware? apenas para verificar a sessão? se tem clinica ou plan?
