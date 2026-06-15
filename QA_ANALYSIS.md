# Análise de QA — SQA Social Media

## 1. Escopo analisado

Esta análise cobre o estado atual do projeto fullstack SQA Social Media e compara
a implementação com os requisitos funcionais da Atividade 4.

Foram inspecionados:

- backend Spring Boot em `api/`;
- frontend Next.js/React/TypeScript em `client/`;
- persistência JPA e configurações de banco;
- contratos HTTP entre cliente e API;
- validações de cadastro, login e redefinição de senha;
- estado de autenticação e `localStorage`;
- feed, curtidas e página de posts curtidos;
- tratamento de erros;
- configuração e presença de testes;
- riscos de segurança, acessibilidade, arquitetura e testabilidade.

Não foram implementados testes e nenhum bug foi corrigido nesta etapa.

### Arquivos analisados

Backend:

- `api/pom.xml`
- `api/src/main/java/com/demoapp/demo/DemoApplication.java`
- `api/src/main/java/com/demoapp/demo/config/AppConfig.java`
- `api/src/main/java/com/demoapp/demo/controller/AuthController.java`
- `api/src/main/java/com/demoapp/demo/controller/PostController.java`
- `api/src/main/java/com/demoapp/demo/dto/EmailDTO.java`
- `api/src/main/java/com/demoapp/demo/dto/ErrorResponse.java`
- `api/src/main/java/com/demoapp/demo/dto/UserDTO.java`
- `api/src/main/java/com/demoapp/demo/model/User.java`
- `api/src/main/java/com/demoapp/demo/model/UserPostReaction.java`
- `api/src/main/java/com/demoapp/demo/repository/UserRepository.java`
- `api/src/main/java/com/demoapp/demo/repository/UserPostReactionRepository.java`
- `api/src/main/java/com/demoapp/demo/service/UserService.java`
- `api/src/main/java/com/demoapp/demo/service/PostService.java`
- `api/src/main/resources/application.properties`
- `api/src/test/resources/application.properties`

Frontend:

- `client/package.json`
- `client/package-lock.json`
- `client/jest.config.ts`
- `client/tsconfig.json`
- `client/eslint.config.mjs`
- `client/next.config.ts`
- `client/src/app/layout.tsx`
- `client/src/app/page.tsx`
- `client/src/app/signup/page.tsx`
- `client/src/app/signin/page.tsx`
- `client/src/app/reset-password/page.tsx`
- `client/src/app/auth/liked/page.tsx`
- `client/src/components/Button.tsx`
- `client/src/components/Header.tsx`
- `client/src/components/Input.tsx`
- `client/src/components/PostCard.tsx`
- `client/src/components/TextButton.tsx`
- `client/src/contexts/AuthContext.tsx`
- `client/src/lib/localStorage.ts`
- `client/src/service/api.ts`
- `client/src/service/auth/auth.ts`
- `client/src/service/posts/posts.ts`
- `client/src/service/types/index.ts`
- `client/src/utils/email.ts`
- `client/src/utils/password.ts`

Também foram lidos os READMEs e os dois PDFs existentes em `instructions/`.

## 2. Estrutura do projeto

### Backend

A API segue uma separação simples entre controllers, services, repositories,
entidades e DTOs.

- `AuthController` expõe cadastro, login e redefinição de senha.
- `PostController` expõe feed, posts curtidos e alternância de curtida.
- `UserService` concentra validações básicas e persistência de usuários.
- `PostService` consulta a API DummyJSON e combina os posts com curtidas locais.
- `UserRepository` e `UserPostReactionRepository` usam Spring Data JPA.
- `User` e `UserPostReaction` são entidades sem relacionamentos JPA entre si.
- MySQL é o banco padrão e H2 está disponível somente no escopo de testes.

Não existe Spring Security, token, sessão de servidor ou outro mecanismo real de
autenticação/autorização. A identidade do usuário é recebida como um `userId`
fornecido pelo cliente.

### Frontend

O cliente usa App Router, páginas client-side, componentes reutilizáveis,
Axios, Context API e `localStorage`.

- `AuthContext` mantém o usuário autenticado em memória.
- `localStorage.ts` deveria persistir a sessão entre recarregamentos.
- páginas de cadastro, login e redefinição fazem validação local;
- `PostCard` mantém estado local otimista da curtida;
- a home também mantém estado otimista da mesma curtida;
- `/auth/liked` aplica proteção somente no navegador.

O Jest e Testing Library constam nas dependências, mas não existe nenhum arquivo
de teste no estado atual do repositório.

## 3. Ambiente e comandos executados

Ambiente observado:

- Java usado pela execução direta da API: 23.0.1;
- projeto configurado para Java 17;
- Node.js: 22.14.0;
- npm: 10.9.2;
- banco temporário usado para verificação manual da API: H2 em memória.

### Backend

#### `cd api && ./mvnw test`

- Resultado: falhou antes de iniciar.
- Erro: `permission denied: ./mvnw`.
- Possível causa: o wrapper Maven não está marcado como executável.
- Impacto sobre os testes: o comando documentado não funciona diretamente em
  ambientes Unix até a permissão ser corrigida ou o wrapper ser chamado com
  `sh`.
- Classificação: erro de configuração, não bug funcional.

#### `cd api && sh ./mvnw test`

- Resultado: `BUILD SUCCESS`.
- Maven informou `No sources to compile` na fase `testCompile`.
- Nenhum teste Java foi encontrado ou executado.
- Impacto sobre os testes: sucesso do build não significa que comportamentos
  estejam cobertos; atualmente a cobertura automatizada do backend é zero.

#### Execução temporária da API com H2

Foi gerado o classpath Maven e a aplicação foi iniciada com H2 em memória para
validar os endpoints sem depender do MySQL local.

Comandos auxiliares executados:

```bash
sh ./mvnw dependency:build-classpath \
  -Dmdep.outputFile=/private/tmp/sqa-social-media-api-test-classpath.txt \
  -DincludeScope=test

java -cp "target/test-classes:target/classes:<classpath Maven>" \
  com.demoapp.demo.DemoApplication \
  --spring.datasource.url=jdbc:h2:mem:testdb \
  --spring.datasource.driverClassName=org.h2.Driver \
  --spring.datasource.username=sa \
  --spring.datasource.password= \
  --spring.jpa.hibernate.ddl-auto=create-drop
```

Uma tentativa anterior com `sh ./mvnw spring-boot:run` falhou porque o processo
do plugin não localizou `com.demoapp.demo.DemoApplication`, apesar de a classe
compilada existir em `target/classes`. A execução direta com o classpath Maven
iniciou normalmente. Essa ocorrência foi tratada como problema de execução do
ambiente/plugin, não como bug funcional.

As verificações HTTP foram feitas com `curl` nos endpoints `/auth/signup`,
`/auth/signin`, `/auth/reset-password` e `/posts/{postId}/like`.

Resultados confirmados:

| Requisição | Resultado observado |
|---|---|
| cadastro com `qa@example.com` e senha `Aa1!aaaa` | HTTP 200 e senha devolvida no JSON |
| segundo cadastro com o mesmo e-mail | HTTP 409, mensagem `E-mail já está em uso` |
| login do usuário existente com senha `x` | HTTP 422, mensagem `Senha inválida` |
| redefinição de usuário existente | HTTP 200, mensagem `Senha redefinida com sucesso (fake)` |
| cadastro com e-mail `malformado@` | HTTP 200 |
| curtida com `userId=999999` | HTTP 200 e curtida criada |

Os dados foram descartados ao encerrar o banco H2.

### Frontend

#### `cd client && npm install`

- Resultado: falhou com código 127.
- Erro: o pós-install de `unrs-resolver` não encontrou o comando
  `napi-postinstall`.
- O pacote consta no `package-lock.json`, mas não ficou disponível durante o
  script de instalação.
- Possível causa: instalação incompleta/inconsistência do ambiente npm ou da
  árvore materializada pelo lockfile.
- Impacto sobre os testes: `node_modules` não foi criado; build, lint e Jest não
  podem iniciar.
- Classificação: erro de ambiente/dependência, não bug funcional.

#### `cd client && npm run lint`

- Resultado: falhou com código 127.
- Erro: `eslint: command not found`.
- Causa: consequência da falha do `npm install`.
- Impacto: não foi possível validar regras estáticas.

#### `cd client && npm run build`

- Resultado: falhou com código 127.
- Erro: `next: command not found`.
- Causa: consequência da falha do `npm install`.
- Impacto: não foi possível validar compilação e geração do build Next.js.

#### `cd client && npm test -- --runInBand`

- Resultado: falhou com código 127.
- Erro: `jest: command not found`.
- Causa: consequência da falha do `npm install`.
- Impacto: não foi possível iniciar o Jest. Mesmo com as dependências
  instaladas, o repositório atual não contém arquivos de teste.

## 4. Matriz de requisitos

| Área | Requisito | Estado | Evidência resumida |
|---|---|---|---|
| Cadastro | cadastrar com e-mail válido e senha forte | Parcial | fluxo existe, mas validações de e-mail e senha divergem entre camadas |
| Cadastro | duplicidade retorna `E-mail já cadastrado` | Falha | API retorna `E-mail já está em uso` |
| Cadastro | senha aceita com mínimo de 8 caracteres | Falha no frontend | cliente exige mais de 8; API aceita exatamente 8 |
| Cadastro | mensagem específica por critério de senha | Parcial | cliente lista critérios; API retorna apenas `Senha inválida` |
| Cadastro | autenticar e redirecionar para `/` | Parcial | funciona em memória, mas a persistência da autenticação está quebrada |
| Login | credenciais corretas autenticam | Parcial | funciona para senhas aceitas pela política do backend |
| Login | credenciais incorretas retornam `Credenciais inválidas` | Falha em parte dos casos | senha incorreta fraca retorna `Senha inválida`/422 |
| Login | redirecionar para `/` | Atende na sessão atual | `router.push("/")` é executado após sucesso |
| Redefinição | aceitar e-mail válido | Parcial | backend considera qualquer texto com `@` válido |
| Redefinição | não cadastrado retorna `Usuário não encontrado` | Atende | API retorna mensagem exata e HTTP 404 |
| Redefinição | cadastrado retorna `E-mail enviado com sucesso` | Falha | API e frontend usam textos diferentes do requisito |
| Header | opções de usuário deslogado | Atende na sessão atual | exibe `Entrar` e `Criar Conta` |
| Header | opções de usuário logado | Parcial | funciona em memória; falha após recarregar |
| Header | título redireciona para `/` | Funcional, com problema de acessibilidade | clique chama `router.push("/")` |
| Feed | exibir título, corpo e botão de curtida | Atende | `PostCard` renderiza os três elementos |
| Feed | alert para usuário deslogado | Atende | texto é exatamente o solicitado |
| Feed | feedback visual ao curtir | Parcial | existe atualização otimista, mas rollback falha em erro HTTP |
| Posts curtidos | acesso somente autenticado | Falha de segurança | proteção apenas client-side e API aceita qualquer `userId` |
| Posts curtidos | listar curtidas do usuário | Parcial | funciona com estado válido, mas identidade pode ser forjada e depende da DummyJSON |

## 5. Bugs de backend

### BUG-BACK-001 — Mensagem de e-mail duplicado diverge do requisito

- Camada: controller de autenticação.
- Requisito: e-mail duplicado deve apresentar exatamente `E-mail já cadastrado`.
- Arquivo: `api/src/main/java/com/demoapp/demo/controller/AuthController.java:43`.
- Função ou componente: `signup`.
- Severidade: média.
- Classificação: bug funcional.
- Comportamento esperado: HTTP 409 com mensagem `E-mail já cadastrado`.
- Comportamento atual: HTTP 409 com mensagem `E-mail já está em uso`.
- Passos para reprodução: cadastrar um e-mail válido e repetir o cadastro.
- Evidência: execução real retornou
  `{"message":"E-mail já está em uso","status":409}`.
- Teste automatizado recomendado: teste de controller/API que faça dois
  cadastros com o mesmo e-mail e compare a mensagem exata.
- O teste deve passar ou falhar: falhar no estado atual.

### BUG-BACK-002 — Validação de e-mail aceita endereços malformados

- Camada: service de usuário.
- Requisito: cadastro e redefinição devem usar e-mail válido.
- Arquivo: `api/src/main/java/com/demoapp/demo/service/UserService.java:17`.
- Função ou componente: `isEmailValid`.
- Severidade: alta.
- Classificação: bug funcional.
- Comportamento esperado: exigir formato válido com parte local, domínio e
  extensão.
- Comportamento atual: qualquer texto não nulo que contenha `@` é aceito.
- Passos para reprodução: enviar cadastro com `malformado@` e uma senha forte.
- Evidência: execução real retornou HTTP 200 e criou o usuário.
- Teste automatizado recomendado: teste unitário parametrizado com `a@`, `@b`,
  `teste@dominio` e espaços.
- O teste deve passar ou falhar: falhar no estado atual.

### BUG-BACK-003 — Erro de senha não informa o critério violado

- Camada: controller/service de autenticação.
- Requisito: cada requisito de senha não atendido deve apresentar mensagem
  específica.
- Arquivo: `api/src/main/java/com/demoapp/demo/controller/AuthController.java:37`.
- Função ou componente: `signup`.
- Severidade: média.
- Classificação: bug funcional.
- Comportamento esperado: informar se falta tamanho mínimo, maiúscula,
  minúscula, número ou caractere especial.
- Comportamento atual: todas as violações retornam somente `Senha inválida`.
- Passos para reprodução: cadastrar usando `abcdefgh`.
- Evidência: existe um único ramo de erro para toda a expressão regular.
- Teste automatizado recomendado: testes de controller para cada critério da
  senha, verificando mensagens específicas.
- O teste deve passar ou falhar: falhar no estado atual.

### BUG-BACK-004 — Login com credencial incorreta pode retornar a mensagem errada

- Camada: controller de autenticação.
- Requisito: credenciais incorretas devem apresentar `Credenciais inválidas`.
- Arquivo: `api/src/main/java/com/demoapp/demo/controller/AuthController.java:61`.
- Função ou componente: `signin`.
- Severidade: média.
- Classificação: bug funcional.
- Comportamento esperado: qualquer senha incorreta para um login deve resultar
  em `Credenciais inválidas`.
- Comportamento atual: antes de conferir a credencial, o endpoint aplica a
  política de senha de cadastro; senhas incorretas fracas retornam
  `Senha inválida` com HTTP 422.
- Passos para reprodução: criar um usuário e tentar login com a senha `x`.
- Evidência: execução real retornou
  `{"message":"Senha inválida","status":422}`.
- Teste automatizado recomendado: teste de integração de login com usuário
  existente e senha incorreta curta.
- O teste deve passar ou falhar: falhar no estado atual.

### BUG-BACK-005 — Resposta de redefinição bem-sucedida tem texto incorreto

- Camada: controller de autenticação.
- Requisito: apresentar `E-mail enviado com sucesso`.
- Arquivo: `api/src/main/java/com/demoapp/demo/controller/AuthController.java:93`.
- Função ou componente: `resetPassword`.
- Severidade: média.
- Classificação: bug funcional.
- Comportamento esperado: HTTP 200 com a mensagem exata do requisito.
- Comportamento atual: retorna `Senha redefinida com sucesso (fake)`.
- Passos para reprodução: cadastrar um usuário e solicitar redefinição com o
  mesmo e-mail.
- Evidência: resposta real
  `{"message":"Senha redefinida com sucesso (fake)"}`.
- Teste automatizado recomendado: teste de controller/API verificando a
  mensagem exata.
- O teste deve passar ou falhar: falhar no estado atual.

### BUG-BACK-006 — Banco não garante unicidade de e-mail

- Camada: entidade/persistência.
- Requisito: e-mail já existente não deve gerar outro cadastro.
- Arquivo: `api/src/main/java/com/demoapp/demo/model/User.java:17`.
- Função ou componente: campo `email`.
- Severidade: alta.
- Classificação: bug funcional e problema de arquitetura.
- Comportamento esperado: unicidade protegida também por constraint no banco.
- Comportamento atual: a duplicidade depende de uma consulta anterior ao
  `save`; não há `unique` na coluna. Requisições concorrentes podem criar
  duplicatas.
- Passos para reprodução: disparar cadastros simultâneos com o mesmo e-mail em
  uma base vazia.
- Evidência: DDL do H2 criou `email varchar(255)` sem constraint única.
- Teste automatizado recomendado: teste de integração concorrente ou teste do
  schema verificando a restrição única.
- O teste deve passar ou falhar: pode falhar de forma concorrente no estado
  atual.

### BUG-BACK-007 — Curtidas aceitam usuários inexistentes

- Camada: controller/service/persistência de posts.
- Requisito: curtidas e posts curtidos devem pertencer ao usuário autenticado.
- Arquivo: `api/src/main/java/com/demoapp/demo/service/PostService.java:128`.
- Função ou componente: `toggleLike`.
- Severidade: alta.
- Classificação: bug funcional.
- Comportamento esperado: validar a existência e identidade do usuário antes de
  persistir a curtida.
- Comportamento atual: qualquer número recebido em `userId` é salvo.
- Passos para reprodução: `POST /posts/1/like?userId=999999`.
- Evidência: execução real retornou HTTP 200 e `{"postId":1,"liked":true}`.
- Teste automatizado recomendado: teste de API usando um ID inexistente e
  esperando rejeição 401, 403 ou 404.
- O teste deve passar ou falhar: falhar no estado atual.

### BUG-BACK-008 — Curtidas aceitam IDs de posts sem validação

- Camada: service de posts.
- Requisito: a lista de posts curtidos deve conter posts reais que o usuário
  curtiu.
- Arquivo: `api/src/main/java/com/demoapp/demo/service/PostService.java:136`.
- Função ou componente: `toggleLike`.
- Severidade: média.
- Classificação: bug funcional.
- Comportamento esperado: validar a existência do post antes de persistir.
- Comportamento atual: o `postId` é salvo sem consulta ou validação. O erro só
  aparece posteriormente ao tentar buscar o post na DummyJSON.
- Passos para reprodução: curtir um ID inexistente e depois abrir posts
  curtidos.
- Evidência: não existe validação entre a leitura do parâmetro e o `save`.
- Teste automatizado recomendado: teste de API com ID de post inexistente,
  seguido de consulta à lista.
- O teste deve passar ou falhar: falhar no estado atual.

## 6. Bugs de frontend

### BUG-FRONT-001 — Chaves diferentes quebram a persistência da autenticação

- Camada: armazenamento local/contexto de autenticação.
- Requisito: após cadastro ou login, o usuário deve permanecer autenticado.
- Arquivo: `client/src/lib/localStorage.ts:1`.
- Função ou componente: `saveUser`, `getUser` e `removeUser`.
- Severidade: alta.
- Classificação: bug funcional.
- Comportamento esperado: salvar, ler e remover o usuário usando a mesma chave.
- Comportamento atual: `saveUser` grava em `user`, enquanto `getUser` e
  `removeUser` usam `sqa_social_user`.
- Passos para reprodução: fazer login, recarregar a página e observar o header.
- Evidência: linhas 10, 19 e 34 usam chaves incompatíveis.
- Teste automatizado recomendado: teste unitário de round-trip
  `saveUser -> getUser` e teste de integração com remount do `AuthProvider`.
- O teste deve passar ou falhar: falhar no estado atual.

### BUG-FRONT-002 — Senha com exatamente 8 caracteres é rejeitada

- Camada: utilitário/formulário de cadastro.
- Requisito: senha deve ter no mínimo 8 caracteres.
- Arquivo: `client/src/utils/password.ts:2`.
- Função ou componente: `isPasswordValid`.
- Severidade: alta.
- Classificação: bug funcional.
- Comportamento esperado: uma senha forte de 8 caracteres deve ser aceita.
- Comportamento atual: a condição `password.length <= 8` exige pelo menos 9.
- Passos para reprodução: usar `Aa1!aaaa` no cadastro.
- Evidência: a API aceitou essa senha com HTTP 200, enquanto o utilitário do
  cliente retorna `false`.
- Teste automatizado recomendado: teste unitário com uma senha forte de
  exatamente 8 caracteres.
- O teste deve passar ou falhar: falhar no estado atual.

### BUG-FRONT-003 — Caracteres especiais aceitos divergem do backend

- Camada: validação de cadastro.
- Requisito: frontend e backend devem concordar sobre senha forte.
- Arquivo: `client/src/utils/password.ts:9` e
  `api/src/main/java/com/demoapp/demo/service/UserService.java:22`.
- Função ou componente: `isPasswordValid` nas duas camadas.
- Severidade: média.
- Classificação: bug funcional.
- Comportamento esperado: a mesma senha deve ter o mesmo resultado nas duas
  camadas.
- Comportamento atual: o frontend aceita caracteres como `#`, `^`, `(` e `_`,
  mas o backend aceita apenas `@ $ ! % * ? &`.
- Passos para reprodução: cadastrar com `Abcdef12#`.
- Evidência: a expressão do cliente inclui `#`; a expressão Java não.
- Teste automatizado recomendado: teste de integração da tela com uma senha
  aceita localmente e rejeitada pela API.
- O teste deve passar ou falhar: falhar no estado atual.

### BUG-FRONT-004 — Validador e mensagem discordam sobre o caractere ponto

- Camada: utilitário de senha.
- Requisito: cada requisito não atendido deve apresentar mensagem específica.
- Arquivo: `client/src/utils/password.ts:9` e `client/src/utils/password.ts:37`.
- Função ou componente: `isPasswordValid` e `getPasswordValidationMessage`.
- Severidade: média.
- Classificação: bug funcional.
- Comportamento esperado: quando a senha é inválida, a função de mensagem deve
  explicar a causa.
- Comportamento atual: `.` não é aceito por `isPasswordValid`, mas é aceito pelo
  regex da mensagem. Uma senha com tamanho suficiente e `.` pode ser inválida e
  produzir mensagem vazia.
- Passos para reprodução: chamar as duas funções com `Abcdef12.`.
- Evidência: os conjuntos de caracteres especiais são diferentes.
- Teste automatizado recomendado: teste unitário que exija resultado e mensagem
  consistentes para a mesma senha.
- O teste deve passar ou falhar: falhar no estado atual.

### BUG-FRONT-005 — Mensagem de sucesso da redefinição diverge do requisito

- Camada: página de redefinição.
- Requisito: apresentar `E-mail enviado com sucesso`.
- Arquivo: `client/src/app/reset-password/page.tsx:47`.
- Função ou componente: `handleSubmit`.
- Severidade: média.
- Classificação: bug funcional.
- Comportamento esperado: mostrar a mensagem exata, em formato de toast.
- Comportamento atual: mostra
  `Email enviado com sucesso para alterar a senha! Redirecionando...` em uma
  `div` comum.
- Passos para reprodução: solicitar redefinição para usuário existente.
- Evidência: texto fixo no estado `successMessage`; a resposta da API é
  ignorada.
- Teste automatizado recomendado: teste de integração da página com serviço
  mockado, verificando o texto exato.
- O teste deve passar ou falhar: falhar no estado atual.

### BUG-FRONT-006 — Feedback da curtida não volta ao estado anterior em falha HTTP

- Camada: componente de post e página inicial.
- Requisito: feedback visual deve representar o estado real da curtida.
- Arquivo: `client/src/components/PostCard.tsx:20` e
  `client/src/app/page.tsx:50`.
- Função ou componente: `PostCard.handleLike` e `Home.handleLike`.
- Severidade: alta.
- Classificação: bug funcional.
- Comportamento esperado: se a API falhar, componente e página devem restaurar
  o estado anterior.
- Comportamento atual: `Home.handleLike` captura o erro e não o relança.
  Portanto, `PostCard` entende que a operação terminou com sucesso e mantém seu
  estado local otimista, mesmo depois do rollback no estado da página.
- Passos para reprodução: autenticar, simular falha no POST de curtida e clicar
  em `Curtir`.
- Evidência: existem dois estados otimistas para a mesma informação e o erro é
  consumido pelo callback pai.
- Teste automatizado recomendado: teste de integração com
  `toggleLikePost` rejeitando e verificação de que o botão volta para `Curtir`.
- O teste deve passar ou falhar: falhar no estado atual.

### BUG-FRONT-007 — Logout não remove o registro realmente salvo

- Camada: armazenamento local.
- Requisito: `Sair` deve encerrar a autenticação.
- Arquivo: `client/src/lib/localStorage.ts:32`.
- Função ou componente: `removeUser`.
- Severidade: média.
- Classificação: bug funcional e de privacidade.
- Comportamento esperado: remover do navegador os dados gravados no login.
- Comportamento atual: o login grava em `user`, mas o logout remove
  `sqa_social_user`; o registro `user` permanece no navegador.
- Passos para reprodução: fazer login, clicar em `Sair` e inspecionar o
  `localStorage`.
- Evidência: chaves divergentes nas funções de salvar e remover.
- Teste automatizado recomendado: teste unitário que salve, remova e confirme
  que nenhuma chave de usuário permanece.
- O teste deve passar ou falhar: falhar no estado atual.

## 7. Problemas de segurança

### SEC-001 — Senhas são armazenadas em texto puro

- Camada: persistência/autenticação.
- Requisito: proteção das credenciais do usuário.
- Arquivo: `api/src/main/java/com/demoapp/demo/service/UserService.java:26`.
- Função ou componente: `createUser`.
- Severidade: crítica.
- Classificação: bug de segurança.
- Comportamento esperado: armazenar hash forte e salt, por exemplo BCrypt ou
  Argon2.
- Comportamento atual: a senha original é copiada diretamente para a entidade.
- Passos para reprodução: cadastrar usuário e consultar a coluna `password`.
- Evidência: `user.setPassword(password)` sem encoder.
- Teste automatizado recomendado: teste de integração garantindo que o valor
  persistido seja diferente da senha fornecida e validável por um encoder.
- O teste deve passar ou falhar: falhar no estado atual.

### SEC-002 — API devolve a senha nas respostas de cadastro e login

- Camada: contrato HTTP/serialização.
- Requisito: não expor credenciais.
- Arquivo: `api/src/main/java/com/demoapp/demo/controller/AuthController.java:50`.
- Função ou componente: `signup` e `signin`.
- Severidade: crítica.
- Classificação: bug de segurança.
- Comportamento esperado: retornar DTO público contendo somente dados seguros.
- Comportamento atual: a entidade `User`, incluindo `password`, é serializada.
- Passos para reprodução: cadastrar ou autenticar um usuário.
- Evidência: execução real retornou
  `{"id":1,"email":"qa@example.com","password":"Aa1!aaaa"}`.
- Teste automatizado recomendado: teste de API verificando que a propriedade
  `password` não existe no JSON.
- O teste deve passar ou falhar: falhar no estado atual.

### SEC-003 — Não existe autenticação ou autorização real nos endpoints de posts

- Camada: segurança da API.
- Requisito: posts curtidos devem ser acessíveis somente pelo usuário
  autenticado.
- Arquivo: `api/src/main/java/com/demoapp/demo/controller/PostController.java:37`.
- Função ou componente: `getLikedPosts` e `toggleLike`.
- Severidade: crítica.
- Classificação: bug de segurança.
- Comportamento esperado: identificar o usuário por sessão/token validado no
  servidor e autorizar o acesso.
- Comportamento atual: qualquer consumidor escolhe um `userId` na query string,
  podendo consultar ou alterar curtidas de terceiros.
- Passos para reprodução: chamar `/posts/liked?userId=<id>` ou
  `/posts/{postId}/like?userId=<id>` sem login.
- Evidência: não existe Spring Security e os endpoints não recebem principal ou
  token.
- Teste automatizado recomendado: testes de API sem credencial e com tentativa
  de acesso a outro usuário.
- O teste deve passar ou falhar: falhar no estado atual.

### SEC-004 — Proteção de `/auth/liked` é somente client-side e pode ser forjada

- Camada: frontend/autorização.
- Requisito: rota acessível somente por usuários autenticados.
- Arquivo: `client/src/app/auth/liked/page.tsx:20`.
- Função ou componente: `LikedPosts`.
- Severidade: alta.
- Classificação: bug de segurança.
- Comportamento esperado: proteção no servidor/middleware e API autenticada.
- Comportamento atual: a página confia em um objeto do `localStorage`; não há
  token verificável. Um usuário pode forjar `{id, email}`.
- Passos para reprodução: inserir manualmente o objeto esperado no
  `localStorage` e acessar a rota.
- Evidência: `isAuthenticated` significa apenas `user !== null`.
- Teste automatizado recomendado: E2E tentando acessar a rota sem sessão válida
  e com armazenamento local forjado.
- O teste deve passar ou falhar: falhar no estado atual.

### SEC-005 — CORS permite qualquer origem

- Camada: configuração HTTP.
- Requisito: reduzir exposição indevida da API.
- Arquivo: controllers `AuthController.java:18` e `PostController.java:10`.
- Função ou componente: `@CrossOrigin(origins = "*")`.
- Severidade: média.
- Classificação: bug de segurança.
- Comportamento esperado: limitar origens aos clientes autorizados, sobretudo
  quando autenticação real for adicionada.
- Comportamento atual: qualquer site pode fazer chamadas cross-origin.
- Passos para reprodução: enviar preflight a partir de origem arbitrária.
- Evidência: wildcard nos dois controllers.
- Teste automatizado recomendado: teste HTTP de política CORS.
- O teste deve passar ou falhar: deve falhar após a política esperada ser
  definida; no estado atual qualquer origem é aceita.

## 8. Problemas de acessibilidade

### A11Y-001 — Labels não estão associados aos inputs

- Camada: componente de formulário.
- Requisito: formulários utilizáveis por leitores de tela e por clique no label.
- Arquivo: `client/src/components/Input.tsx:12`.
- Função ou componente: `Input`.
- Severidade: alta.
- Classificação: problema de acessibilidade.
- Comportamento esperado: `label` com `htmlFor` apontando para um `input` com
  `id`.
- Comportamento atual: o label e o input são apenas elementos vizinhos.
- Passos para reprodução: consultar o campo por nome acessível ou clicar no
  label.
- Evidência: não existem `htmlFor` nem `id` nas páginas que usam o componente.
- Teste automatizado recomendado: Testing Library com `getByLabelText`.
- O teste deve passar ou falhar: falhar no estado atual.

### A11Y-002 — Título clicável do header não é operável por teclado

- Camada: header/navegação.
- Requisito: navegação acessível.
- Arquivo: `client/src/components/Header.tsx:33`.
- Função ou componente: título `SQA Social Media`.
- Severidade: média.
- Classificação: problema de acessibilidade.
- Comportamento esperado: usar link ou botão focável e acionável por teclado.
- Comportamento atual: um `h1` recebe apenas `onClick`.
- Passos para reprodução: navegar somente com Tab e tentar ativar o título.
- Evidência: não há `tabIndex`, papel interativo ou handler de teclado.
- Teste automatizado recomendado: teste de acessibilidade e navegação por
  teclado.
- O teste deve passar ou falhar: falhar no estado atual.

### A11Y-003 — Erros de formulário não são ligados aos campos nem anunciados

- Camada: formulários.
- Requisito: feedback de validação acessível.
- Arquivo: `client/src/components/Input.tsx:38`.
- Função ou componente: mensagem `error`.
- Severidade: média.
- Classificação: problema de acessibilidade.
- Comportamento esperado: usar `aria-invalid`, `aria-describedby` e região
  `aria-live` quando necessário.
- Comportamento atual: o erro é exibido somente como parágrafo visual.
- Passos para reprodução: submeter formulário inválido com leitor de tela.
- Evidência: ausência dos atributos ARIA no componente.
- Teste automatizado recomendado: assertions sobre nome acessível, descrição e
  estado inválido.
- O teste deve passar ou falhar: falhar no estado atual.

## 9. Problemas de arquitetura e testabilidade

### ARCH-001 — `PostService` ignora o `RestTemplate` configurado e cria dependência concreta

- Camada: integração externa.
- Requisito: integração confiável e testável com DummyJSON.
- Arquivo: `api/src/main/java/com/demoapp/demo/service/PostService.java:20`.
- Função ou componente: construtor de `PostService`.
- Severidade: alta.
- Classificação: problema de arquitetura e testabilidade.
- Comportamento esperado: injetar o bean `RestTemplate` criado em `AppConfig`.
- Comportamento atual: o service executa `new RestTemplate()`, dificultando mock,
  timeout e configuração centralizada.
- Passos para reprodução: tentar criar teste unitário do service sem acessar a
  rede.
- Evidência: o bean configurado não é usado pelo service.
- Teste automatizado recomendado: teste unitário com cliente HTTP injetado e
  mockado.
- O teste deve passar ou falhar: a implementação atual exige refatoração para
  isolamento adequado.

### ARCH-002 — Feed e posts curtidos dependem da DummyJSON sem isolamento ou timeout

- Camada: integração externa.
- Requisito: feed disponível e testes determinísticos.
- Arquivo: `api/src/main/java/com/demoapp/demo/service/PostService.java:28`.
- Função ou componente: `getPosts` e `getLikedPosts`.
- Severidade: alta.
- Classificação: problema de arquitetura e testabilidade.
- Comportamento esperado: cliente configurável, timeout, tratamento de falha e
  possibilidade de stub/mock.
- Comportamento atual: URLs estão fixas e cada consulta de curtidos faz chamadas
  externas sequenciais.
- Passos para reprodução: executar feed sem internet ou durante indisponibilidade
  da DummyJSON.
- Evidência: chamadas diretas para `https://dummyjson.com`.
- Teste automatizado recomendado: testes com servidor HTTP stub e cenários de
  timeout/erro.
- O teste deve passar ou falhar: testes que esperem degradação controlada podem
  falhar no estado atual.

### ARCH-003 — Não existem testes automatizados no estado atual

- Camada: backend e frontend.
- Requisito: Atividade 4 exige testes unitários e de integração.
- Arquivo: `api/src/test/` e projeto `client/`.
- Função ou componente: suíte de testes.
- Severidade: alta.
- Classificação: problema de testabilidade.
- Comportamento esperado: no mínimo 3 testes de backend e 6 de frontend,
  respeitando as categorias da atividade.
- Comportamento atual: somente propriedades de teste da API existem; nenhum
  arquivo `*Test.java`, `*.test.*` ou `*.spec.*` foi encontrado.
- Passos para reprodução: executar Maven e procurar testes no cliente.
- Evidência: Maven informa `No sources to compile`.
- Teste automatizado recomendado: criar as suítes em etapa posterior.
- O teste deve passar ou falhar: não aplicável; atualmente não há testes.

### ARCH-004 — `jest-dom` está instalado, mas não está configurado globalmente

- Camada: configuração de testes frontend.
- Requisito: suporte adequado a assertions de DOM.
- Arquivo: `client/jest.config.ts:144`.
- Função ou componente: `setupFilesAfterEnv`.
- Severidade: média.
- Classificação: problema de testabilidade.
- Comportamento esperado: importar `@testing-library/jest-dom` em arquivo de
  setup ou em cada suíte.
- Comportamento atual: a dependência existe, mas `setupFilesAfterEnv` permanece
  comentado.
- Passos para reprodução: escrever teste usando `toBeInTheDocument` sem import
  local.
- Evidência: ausência de setup e de arquivos de teste que façam o import.
- Teste automatizado recomendado: teste mínimo de componente com matcher do
  `jest-dom`.
- O teste deve passar ou falhar: falhará sem import/configuração.

### ARCH-005 — Tipos TypeScript não representam completamente as respostas da API

- Camada: contrato cliente/API.
- Requisito: contratos consistentes.
- Arquivo: `client/src/service/types/index.ts:16`.
- Função ou componente: `SignInResponse` e `LikedPostsResponse`.
- Severidade: média.
- Classificação: problema de arquitetura.
- Comportamento esperado: tipos compartilhados ou DTOs equivalentes ao JSON
  público.
- Comportamento atual: a API de autenticação devolve `password`, ausente no tipo;
  a API de curtidos devolve `skip`, ausente em `LikedPostsResponse`.
- Passos para reprodução: inspecionar JSON real e comparar com interfaces.
- Evidência: resposta real de cadastro contém senha; `PostService` adiciona
  `skip`.
- Teste automatizado recomendado: testes de contrato/schema entre API e
  frontend.
- O teste deve passar ou falhar: falhar no estado atual se o schema for estrito.

### ARCH-006 — Exceções são capturadas genericamente e detalhes internos vão para a resposta

- Camada: tratamento de erros.
- Requisito: respostas HTTP previsíveis e seguras.
- Arquivo: `api/src/main/java/com/demoapp/demo/controller/PostController.java:30`.
- Função ou componente: todos os endpoints de posts.
- Severidade: média.
- Classificação: problema de arquitetura e segurança.
- Comportamento esperado: exceções específicas, códigos adequados e mensagens
  públicas controladas.
- Comportamento atual: qualquer exceção vira HTTP 500 e concatena
  `e.getMessage()` no corpo.
- Passos para reprodução: provocar erro de rede ou paginação inválida.
- Evidência: blocos `catch (Exception e)` nos três endpoints.
- Teste automatizado recomendado: testes de erro externo e entrada inválida,
  verificando status e ausência de detalhes internos.
- O teste deve passar ou falhar: pode falhar no estado atual.

## 10. Casos de teste recomendados

### Backend

1. Aceitar senha forte com exatamente 8 caracteres.
2. Rejeitar cada critério ausente da senha com mensagem específica.
3. Rejeitar e-mails sem domínio, extensão ou parte local.
4. Retornar exatamente `E-mail já cadastrado` no segundo cadastro.
5. Retornar `Credenciais inválidas` para qualquer senha incorreta.
6. Não serializar `password` em cadastro e login.
7. Armazenar hash em vez da senha original.
8. Retornar `E-mail enviado com sucesso` na redefinição válida.
9. Rejeitar curtida de usuário inexistente.
10. Rejeitar curtida de post inexistente.
11. Bloquear consulta e alteração de curtidas sem autenticação.
12. Cobrir falha e timeout da DummyJSON com cliente HTTP mockado.

### Frontend unitário

1. `isEmailValid` para formatos válidos e inválidos.
2. `isPasswordValid` com exatamente 8 caracteres.
3. Consistência entre `isPasswordValid` e
   `getPasswordValidationMessage`.
4. Round-trip de `saveUser`, `getUser` e `removeUser`.
5. `Button` em estado normal, loading e disabled.
6. `PostCard` para usuário deslogado e falha no callback de curtida.

### Frontend integração

1. Cadastro válido autentica e navega para `/`.
2. Cadastro duplicado exibe a mensagem contratual exata.
3. Login incorreto exibe `Credenciais inválidas`.
4. Redefinição válida exibe `E-mail enviado com sucesso`.
5. Header troca opções após login e volta após logout.
6. Autenticação sobrevive a remount/reload.
7. Feed renderiza posts retornados pelo serviço.
8. Falha de curtida restaura o texto e estilo anteriores.
9. `/auth/liked` redireciona usuário sem sessão válida.
10. Formulários podem ser consultados por labels acessíveis.

## 11. Riscos e dependências externas

- O feed e a lista de curtidos dependem da disponibilidade e do formato da
  DummyJSON.
- Testes de `PostService` podem acessar a internet acidentalmente porque o
  `RestTemplate` é criado internamente.
- Cada post curtido gera uma chamada externa separada, aumentando latência e
  chance de falha parcial.
- O MySQL padrão exige configuração manual; placeholders permanecem no
  `application.properties`.
- O H2 de teste está configurado, mas não há testes que o utilizem.
- O `npm install` não concluiu neste ambiente, bloqueando lint, build e Jest.
- O wrapper Maven não está executável diretamente.
- Ausência de autenticação real torna testes E2E de “usuário autenticado”
  representações de estado local, não validações de segurança.
- Não há constraint de unicidade nem relacionamento/foreign key entre usuários
  e reações.

## 12. Bugs recomendados para os testes que devem falhar

### Melhor candidato de backend

`BUG-BACK-001 — Mensagem de e-mail duplicado diverge do requisito`

Motivos:

- requisito textual e objetivo;
- reprodução determinística;
- não depende de serviço externo;
- demonstra teste de integração/controller;
- falha atual é fácil de explicar na apresentação.

Alternativas fortes:

- `BUG-BACK-002` — e-mail `malformado@` aceito;
- `BUG-BACK-004` — senha incorreta curta retorna `Senha inválida`;
- `SEC-002` — senha aparece no JSON;
- `BUG-BACK-007` — curtida aceita usuário inexistente.

### Melhor candidato de frontend

`BUG-FRONT-002 — Senha com exatamente 8 caracteres é rejeitada`

Motivos:

- requisito inequívoco;
- função pura, teste rápido e determinístico;
- não exige mocks complexos;
- evidencia claramente o erro de fronteira `<= 8`.

Alternativas fortes:

- `BUG-FRONT-001` — round-trip do `localStorage` falha;
- `BUG-FRONT-004` — senha inválida pode gerar mensagem vazia;
- `BUG-FRONT-005` — mensagem de redefinição divergente;
- `BUG-FRONT-006` — rollback visual incorreto em falha de curtida.

### Requisitos que estão funcionando no cenário básico

- cadastro com e-mail convencional e senha forte maior que 8 caracteres;
- login com credenciais corretas e senha dentro da política do backend;
- erro `Credenciais inválidas` quando a senha incorreta também passa pela
  política de força;
- erro `Usuário não encontrado` para redefinição de e-mail válido não
  cadastrado;
- redirecionamento para `/` após cadastro e login na sessão atual;
- botões de header para os dois estados enquanto o Context mantém o usuário;
- navegação dos botões e clique do título;
- renderização de título, corpo e botão nos posts;
- alert exato ao tentar curtir sem autenticação;
- feedback visual otimista em uma requisição de curtida bem-sucedida;
- redirecionamento client-side de `/auth/liked` quando o Context está vazio.
