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
- [] melhorar a validação da sessão para algo componentizado (podendo usar gerenciador de contexto)
- [] na dashboard, ao clicar nos agendamentos do médico, abrir um dialog ou uma página com todos os agendamentos daquele medico
  - É valido pensar em uma tela aonde consiga ver todos os agendamentos do médico, conseguindo filtrar os médicos, etc
  - podemos fazer o mesmo com as "Specialtys"
- [] implementar um filtro mais inteligente no gráfico principal do dashboard, conseguir manipular melhor as datas
- [] no banco de dados, na tabela de doctor, em "specialty" podemos transformar ele em um enum e cada especialidade ter um icone
---

## Pensando alto
- Se eu pensar em algo que abrangisse não apenas consultórios médicos, mas tbm clinicas de psicologia, dentistas, clinicas em geral que alugam salas e tem que administrar agendamentos
- a intenção tem que ser mais do que ser algo para administrar, tem que ser algo que traga rentabilidade para o usuário (o que comprou), não apenas organização e feedback
- A visão que eu tenho que ter é, eu quero que seja um tipo de CRM, ou um painel administrativo?
(pensar na minah antiga dentista, consultarios de dentistas que tem no boqueirão, consultorios de psicologos que existem, salas comerciais)


---

## Perguntas a se fazer

- [] Diferença entre usar o better auth ou outra lib comparado a usar jwt
- [] De fato, no que a lib safe actions ajuda? na validação, na coneção com safe actions?
- [] em quentão de componentização, é uma boa componentizar mais o formulário? exemplo de inputs repetidos, eu devo componentizar?

## Setup do Projeto

- [x] Inicialização do projeto Next.js
- [x] Configuração de ferramentas (ESlint, Prettier, Tailwind)
- [x] Configuração do Drizzle e banco de dados
- [x] Configuração do shadcn/ui

## Autenticação e Configurações do Estabelecimento

- [x] Tela de login e criação de conta
- [x] Login com e-mail e senha
- [x] Login com o Google
- [x] Fundamentos do Next.js (Rotas, Páginas, Layouts)
- [x] Criação de clínica


## Roteiro Aula 03: Gerenciamento de Profissionais e Disponibilidade

- [x] Sidebar e Route Groups
- [x] Página de médicos
- [x] Criação de médicos & NextSafeAction
- [x] Listagem de médicos
- [x] Atualização de médicos
- [x] Deleção de médicos