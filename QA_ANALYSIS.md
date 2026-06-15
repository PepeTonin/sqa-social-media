# Relatório de Análise e Testes de Qualidade — SQA Social Media

**Curso:** Engenharia de Software — FAG  
**Disciplina:** Qualidade de Software  
**Atividade:** Prática de Testes 1  
**Projeto analisado:** SQA Social Media  

---

## Resumo

Este relatório apresenta a análise de qualidade do sistema **SQA Social Media**, uma aplicação fullstack composta por um frontend em Next.js e uma API em Spring Boot. O trabalho foi desenvolvido a partir dos requisitos funcionais definidos para a Atividade 4, com foco na identificação de defeitos e na implementação de testes automatizados de unidade e integração.

A análise foi realizada por meio de inspeção do código-fonte, comparação entre implementação e requisitos e execução de testes automatizados. Foram implementados três testes no backend e seis conjuntos de testes no frontend, contemplando funções puras, componentes React e fluxos integrados. Conforme solicitado na atividade, foram mantidos testes que falham intencionalmente para demonstrar defeitos existentes no sistema.

Os principais problemas identificados estão relacionados à divergência de mensagens de erro, persistência incorreta da autenticação, validações inconsistentes entre frontend e backend e ausência de mecanismos adequados de segurança. Os resultados mostram que os testes automatizados permitem documentar o comportamento esperado, comprovar defeitos e reduzir o risco de regressões futuras.

**Palavras-chave:** qualidade de software; testes unitários; testes de integração; JUnit; Jest; Testing Library; análise de defeitos.

---

## 1. Introdução

Testes de software são utilizados para verificar se um sistema atende aos requisitos definidos e para identificar comportamentos incorretos antes que eles afetem os usuários. Além de detectar defeitos, uma suíte automatizada funciona como mecanismo de regressão, pois permite verificar se funcionalidades já validadas continuam funcionando após alterações no código.

O projeto **SQA Social Media** foi disponibilizado com defeitos intencionais. Dessa forma, a atividade não se limita à criação de testes que passam. Também é necessário desenvolver testes que falhem ao comparar o comportamento atual da aplicação com o comportamento especificado nos requisitos.

A aplicação analisada possui duas partes principais:

- **Backend:** API REST desenvolvida com Spring Boot e persistência por Spring Data JPA;
- **Frontend:** aplicação web desenvolvida com Next.js, React e TypeScript.

---

## 2. Objetivos

### 2.1 Objetivo geral

Avaliar a conformidade do sistema SQA Social Media com os requisitos funcionais fornecidos e implementar testes automatizados capazes de validar comportamentos corretos e evidenciar defeitos existentes.

### 2.2 Objetivos específicos

- analisar a estrutura do backend e do frontend;
- comparar a implementação com os requisitos da atividade;
- identificar e classificar defeitos funcionais;
- implementar testes unitários e de integração no backend;
- implementar testes de funções, componentes e fluxos no frontend;
- registrar evidências dos testes aprovados e dos testes que falharam;
- justificar tecnicamente as estratégias de teste adotadas.

---

## 3. Metodologia

A análise foi conduzida em quatro etapas.

### 3.1 Leitura dos requisitos

Inicialmente, foram identificados os comportamentos esperados para:

- cadastro de usuário;
- autenticação;
- redefinição de senha;
- navegação e cabeçalho;
- feed de publicações;
- curtidas;
- página de publicações curtidas.

Cada comportamento observado no código foi comparado com esses requisitos. Quando houve divergência, o comportamento foi registrado como defeito.

### 3.2 Inspeção estática do código

Foi realizada a leitura dos principais arquivos da aplicação, incluindo controllers, services, repositories, entidades, páginas, componentes, contextos, serviços HTTP e funções utilitárias.

A inspeção estática permitiu identificar problemas como:

- condições incorretas em validações;
- mensagens diferentes das especificadas;
- inconsistências entre frontend e backend;
- uso de chaves diferentes no `localStorage`;
- ausência de validações de usuário e publicação;
- exposição indevida de dados sensíveis.

### 3.3 Verificação dinâmica

Os endpoints da API foram executados com dados controlados para confirmar alguns dos comportamentos encontrados durante a leitura do código. Também foram executadas as suítes automatizadas do backend e do frontend.

### 3.4 Implementação dos testes

Foram utilizados:

- **JUnit 5 e MockMvc** no backend;
- **Jest, React Testing Library e user-event** no frontend.

Os testes foram estruturados de acordo com o padrão **Arrange, Act, Assert**:

1. **Arrange:** preparação dos dados, objetos e mocks;
2. **Act:** execução da ação testada;
3. **Assert:** comparação do resultado obtido com o resultado esperado.

---

## 4. Visão geral da arquitetura

### 4.1 Backend

O backend está organizado em camadas:

- `controller`: recebe e responde às requisições HTTP;
- `service`: concentra regras de negócio e validações;
- `repository`: realiza o acesso aos dados;
- `model`: representa as entidades persistidas;
- `dto`: representa objetos utilizados nas requisições e respostas.

Os principais componentes são:

- `AuthController`: cadastro, login e redefinição de senha;
- `PostController`: feed, curtidas e publicações curtidas;
- `UserService`: validação e persistência de usuários;
- `PostService`: integração com a API DummyJSON e controle de curtidas.

### 4.2 Frontend

O frontend utiliza o App Router do Next.js e possui:

- páginas de cadastro, login e redefinição de senha;
- página inicial com feed de publicações;
- página de publicações curtidas;
- componentes reutilizáveis, como `Button`, `Input`, `Header` e `PostCard`;
- `AuthContext` para manter o estado do usuário;
- `localStorage` para persistência da autenticação;
- Axios para comunicação com a API.

---

## 5. Análise dos requisitos funcionais

| Área | Requisito analisado | Resultado |
|---|---|---|
| Cadastro | Cadastrar usuário com e-mail válido e senha forte | Parcialmente atendido |
| Cadastro | Informar `E-mail já cadastrado` para duplicidade | Não atendido |
| Cadastro | Aceitar senha forte com no mínimo 8 caracteres | Divergência entre frontend e backend |
| Cadastro | Informar o critério de senha não atendido | Não atendido no backend |
| Autenticação | Permitir login com credenciais válidas | Atendido no fluxo básico |
| Autenticação | Informar `Credenciais inválidas` | Parcialmente atendido |
| Redefinição | Informar `Usuário não encontrado` | Atendido |
| Redefinição | Informar `E-mail enviado com sucesso` | Não atendido |
| Header | Exibir opções adequadas conforme autenticação | Atendido apenas durante a sessão em memória |
| Feed | Exibir título, conteúdo e botão de curtida | Atendido |
| Curtida | Alertar usuário não autenticado | Atendido |
| Curtida | Exibir feedback visual para usuário autenticado | Parcialmente atendido |
| Posts curtidos | Restringir acesso a usuário autenticado | Não atendido de forma segura |

A classificação **parcialmente atendido** indica que o fluxo existe, mas apresenta alguma inconsistência ou condição que impede o atendimento completo do requisito.

---

## 6. Defeitos identificados

### 6.1 Defeitos funcionais do backend

| ID | Defeito | Evidência principal | Severidade |
|---|---|---|---|
| BACK-01 | Mensagem de e-mail duplicado diferente do requisito | A API retorna `E-mail já está em uso`, mas o requisito define `E-mail já cadastrado` | Média |
| BACK-02 | Validação de e-mail aceita formatos inválidos | O método considera válido qualquer texto que contenha `@` | Alta |
| BACK-03 | Erro de senha não informa o critério violado | Todas as falhas retornam apenas `Senha inválida` | Média |
| BACK-04 | Login pode retornar mensagem incorreta | Senha incorreta e fraca retorna `Senha inválida` em vez de `Credenciais inválidas` | Média |
| BACK-05 | Mensagem de redefinição diverge do requisito | A API retorna `Senha redefinida com sucesso (fake)` | Média |
| BACK-06 | Banco não garante unicidade do e-mail | Não existe restrição única na coluna de e-mail | Alta |
| BACK-07 | Curtidas aceitam usuários inexistentes | O `userId` recebido não é validado | Alta |
| BACK-08 | Curtidas aceitam publicações inexistentes | O `postId` é persistido sem validação prévia | Média |

### 6.2 Defeitos funcionais do frontend

| ID | Defeito | Evidência principal | Severidade |
|---|---|---|---|
| FRONT-01 | Persistência da autenticação utiliza chaves diferentes | `saveUser` grava em `user`, enquanto `getUser` lê `sqa_social_user` | Alta |
| FRONT-02 | Senha forte com exatamente 8 caracteres é rejeitada | A condição utiliza `password.length <= 8` | Alta |
| FRONT-03 | Frontend e backend aceitam caracteres especiais diferentes | As expressões regulares não possuem a mesma política | Média |
| FRONT-04 | Validador e mensagem de senha são inconsistentes | O caractere `.` recebe tratamentos diferentes | Média |
| FRONT-05 | Mensagem de redefinição diverge do requisito | A página apresenta outro texto e não utiliza a mensagem esperada | Média |
| FRONT-06 | Falha HTTP pode manter o feedback visual de curtida | O erro é tratado no componente pai e não é propagado corretamente | Alta |
| FRONT-07 | Logout não remove o registro realmente salvo | A função remove uma chave diferente da utilizada no login | Média |

### 6.3 Problemas adicionais de segurança

Os itens abaixo não constituem o foco principal dos testes obrigatórios, mas representam riscos relevantes de qualidade:

| ID | Problema | Impacto |
|---|---|---|
| SEC-01 | Senhas armazenadas em texto puro | Exposição das credenciais em caso de acesso ao banco |
| SEC-02 | Senha devolvida no JSON de cadastro e login | Exposição de dado sensível pela API |
| SEC-03 | Ausência de autenticação e autorização reais | Qualquer cliente pode informar um `userId` arbitrário |
| SEC-04 | Rota de posts curtidos protegida apenas no navegador | O estado local pode ser alterado manualmente |
| SEC-05 | CORS liberado para qualquer origem | Ampliação desnecessária da superfície de acesso à API |

### 6.4 Problemas adicionais de acessibilidade

- labels dos formulários não estão associados aos campos com `htmlFor` e `id`;
- o título clicável do cabeçalho não é acessível por teclado;
- mensagens de erro não utilizam atributos como `aria-invalid` e `aria-describedby`.

Esses problemas podem dificultar o uso da aplicação por pessoas que utilizam leitores de tela ou navegação por teclado.

---

## 7. Testes automatizados do backend

Foram implementados três testes, atendendo à quantidade mínima solicitada.

| ID | Tipo | Cenário | Resultado esperado | Resultado obtido |
|---|---|---|---|---|
| BACK-TEST-01 | Unitário | Validar senha forte com exatamente 8 caracteres | Teste aprovado | Aprovado |
| BACK-TEST-02 | Integração de controller | Login com senha incorreta deve retornar HTTP 401 e `Credenciais inválidas` | Teste aprovado | Aprovado |
| BACK-TEST-03 | Integração de controller | E-mail duplicado deve retornar HTTP 409 e `E-mail já cadastrado` | Teste deve evidenciar o bug | Falhou conforme esperado |

### 7.1 Teste unitário do `UserService`

O teste verifica diretamente o método de validação de senha, sem acessar banco, rede ou controller. Ele confirma que a política do backend aceita uma senha forte com exatamente oito caracteres.

Esse cenário é adequado para teste unitário porque:

- avalia uma regra isolada;
- possui entrada e saída determinísticas;
- não depende de infraestrutura externa;
- executa rapidamente.

### 7.2 Testes do `AuthController`

Os testes do controller utilizam `MockMvc` com configuração isolada. Foi criado um `FakeUserService` para controlar o retorno do serviço sem utilizar banco de dados.

Essa abordagem permite validar:

- código HTTP;
- estrutura do JSON;
- mensagem devolvida ao cliente;
- interação esperada entre controller e service.

### 7.3 Bug comprovado no backend

O teste de e-mail duplicado espera a mensagem definida no requisito:

```text
E-mail já cadastrado
```

Entretanto, a implementação retorna:

```text
E-mail já está em uso
```

A falha é intencional e comprova que o contrato da API não está de acordo com a especificação.

### 7.4 Resultado da execução

Comando utilizado:

```bash
cd api
sh ./mvnw clean test
```

Resultado registrado:

- testes executados: 3;
- testes aprovados: 2;
- testes que falharam: 1;
- erros de execução: 0.

O resultado geral do Maven é `BUILD FAILURE` porque existe um teste que falha propositalmente para demonstrar o defeito. Quando apenas os dois testes de sucesso são executados, o resultado é `BUILD SUCCESS`.

---

## 8. Testes automatizados do frontend

Foram implementados seis conjuntos de testes, distribuídos conforme as categorias exigidas. Como alguns arquivos possuem mais de um caso, a execução completa totaliza onze testes.

| ID | Categoria | Arquivo | Cenário principal | Resultado |
|---|---|---|---|---|
| FRONT-TEST-01 | Função pura | `email.test.ts` | Validar formatos de e-mail válidos e inválidos | Aprovado |
| FRONT-TEST-02 | Função pura | `localStorage.test.ts` | Salvar e recuperar o mesmo usuário | Falhou conforme esperado |
| FRONT-TEST-03 | Componente | `Button.test.tsx` | Estado de carregamento e bloqueio do callback | Aprovado |
| FRONT-TEST-04 | Componente | `PostCard.test.tsx` | Alertar usuário deslogado ao tentar curtir | Aprovado |
| FRONT-TEST-05 | Integração | `signin.integration.test.tsx` | Autenticar e redirecionar após login válido | Aprovado |
| FRONT-TEST-06 | Integração | `signup.integration.test.tsx` | Cadastrar, autenticar e redirecionar | Aprovado |

### 8.1 Testes de funções puras

Os testes de funções puras avaliam regras que não dependem da renderização de componentes.

Foram testadas:

- validação de e-mail;
- persistência do usuário no `localStorage`.

O teste de `localStorage` realiza um ciclo completo:

1. salva um objeto de usuário;
2. tenta recuperar esse objeto;
3. compara o valor recuperado com o valor original.

O resultado atual é `null`, pois a função de leitura utiliza uma chave diferente da função de gravação.

### 8.2 Testes de componentes

Os componentes foram renderizados isoladamente com React Testing Library.

O teste do `Button` verifica se:

- o texto muda para `Carregando...`;
- o botão fica desabilitado;
- o callback não é executado durante o carregamento.

O teste do `PostCard` verifica se um usuário deslogado recebe o alerta previsto no requisito e se nenhuma chamada de curtida é realizada.

### 8.3 Testes de integração

Os testes de integração simulam a interação do usuário com páginas completas. As dependências externas, como serviços HTTP, `useAuth` e `next/navigation`, foram substituídas por mocks controlados.

Foram validados os fluxos de:

- login com credenciais válidas;
- cadastro com dados válidos;
- atualização do estado de autenticação;
- redirecionamento para a página principal;
- encerramento do estado de carregamento.

### 8.4 Bug comprovado no frontend

O teste de persistência espera recuperar o mesmo usuário que foi salvo:

```typescript
expect(storedUser).toEqual(user);
```

Resultado obtido:

```text
Expected: {"email": "usuario@example.com", "id": 42}
Received: null
```

A causa está no uso de chaves diferentes:

- gravação: `user`;
- leitura e remoção: `sqa_social_user`.

Esse defeito faz com que a autenticação seja perdida após o recarregamento da página e também impede a remoção correta do dado durante o logout.

### 8.5 Resultado da execução

Comando utilizado:

```bash
cd client
npm test -- --runInBand
```

Resultado registrado:

- suítes executadas: 6;
- suítes aprovadas: 5;
- suítes com falha: 1;
- testes executados: 11;
- testes aprovados: 10;
- testes que falharam: 1.

Ao desconsiderar o teste criado especificamente para evidenciar o bug, os dez casos restantes são aprovados.

### 8.6 Cobertura registrada

| Métrica | Cobertura |
|---|---:|
| Statements | 83,16% |
| Branches | 50,70% |
| Functions | 65,85% |
| Lines | 83,16% |

A cobertura indica que uma parcela significativa das instruções e linhas envolvidas nos cenários escolhidos foi exercitada. Entretanto, a cobertura de branches é menor, demonstrando que ainda existem decisões condicionais e tratamentos de erro que poderiam receber novos testes.

---

## 9. Justificativas técnicas

### 9.1 Uso de testes unitários

Testes unitários foram utilizados para regras simples e isoladas, como validação de e-mail, validação de senha e acesso ao `localStorage`. Esse tipo de teste apresenta baixo custo de execução e facilita a identificação da causa de uma falha.

### 9.2 Uso de testes de componentes

Os testes de componentes verificam o comportamento visual e interativo de elementos React sem executar toda a aplicação. Eles são adequados para validar estados de carregamento, bloqueio de botões, alertas e chamadas de callbacks.

### 9.3 Uso de testes de integração

Os testes de integração foram utilizados nos fluxos de cadastro e login porque esses cenários envolvem a interação entre formulário, validação, serviço de autenticação, contexto do usuário e roteamento.

### 9.4 Isolamento de dependências externas

As chamadas de rede e funções de navegação foram simuladas por mocks. O isolamento evita que os testes dependam da disponibilidade da API, do banco de dados ou da DummyJSON, tornando os resultados mais rápidos e determinísticos.

### 9.5 Manutenção de testes que falham

Nesta atividade, a falha de determinados testes não representa erro na implementação da suíte. Ela é utilizada como evidência objetiva de que o sistema atual diverge dos requisitos.

Após a correção dos defeitos, esses mesmos testes devem passar e podem ser mantidos como testes de regressão.

---

## 10. Limitações da análise

- os testes implementados não cobrem todos os defeitos identificados;
- a integração real com a DummyJSON não foi exercitada nos testes automatizados;
- não foram implementados testes de concorrência para duplicidade de e-mail;
- não foram implementados testes específicos de segurança;
- os testes de acessibilidade foram limitados pela ausência de associação adequada entre labels e inputs;
- a proteção de rotas ocorre apenas no cliente, portanto não representa autenticação real no servidor.

Essas limitações não impedem o atendimento da atividade, mas indicam oportunidades para expansão futura da suíte.

---

## 11. Recomendações

As correções devem ser priorizadas na seguinte ordem:

1. remover a senha das respostas da API e armazená-la com hash seguro;
2. implementar autenticação e autorização no backend;
3. corrigir as chaves utilizadas no `localStorage`;
4. padronizar as validações de senha entre frontend e backend;
5. adequar as mensagens ao contrato definido nos requisitos;
6. validar a existência de usuários e publicações antes de registrar curtidas;
7. adicionar restrição única para e-mail no banco de dados;
8. melhorar o tratamento de erros e o rollback das curtidas;
9. corrigir a associação entre labels e campos dos formulários;
10. ampliar a cobertura de branches e cenários de falha.

---

## 12. Conclusão

A análise demonstrou que o SQA Social Media possui funcionalidades que operam corretamente em cenários básicos, como login válido, cadastro válido, exibição do feed e alerta de curtida para usuários deslogados. Entretanto, também foram identificadas divergências relevantes entre a implementação e os requisitos.

Os testes automatizados desenvolvidos atenderam à distribuição solicitada para backend e frontend. Dois testes foram mantidos com falha intencional: um para comprovar a mensagem incorreta no cadastro duplicado e outro para comprovar a falha de persistência da autenticação.

A atividade evidencia que testes de software não servem apenas para confirmar comportamentos corretos. Eles também funcionam como documentação executável dos requisitos e como evidência reproduzível de defeitos. Após as correções, os testes que atualmente falham poderão ser utilizados como proteção contra regressões.

---

## Referências

- Documentação oficial do JUnit 5.
- Documentação oficial do Spring Boot Test e MockMvc.
- Documentação oficial do Jest.
- Documentação oficial da React Testing Library.
- Requisitos funcionais fornecidos na Atividade 4 — Prática de Testes 1.
