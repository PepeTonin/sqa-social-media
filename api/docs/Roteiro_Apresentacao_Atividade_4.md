# Roteiro de Apresentacao - Atividade 4

Este arquivo serve como cola para apresentar a atividade ao professor.

## Antes de comecar

Abra o projeto na raiz:

```text
C:\Users\simpl\Documents\fag\web\sqa-social-media
```

Explique rapidamente:

```text
O projeto tem duas partes: backend em Spring Boot na pasta api e frontend em Next.js na pasta client.
A atividade pedia testes automatizados que validassem comportamentos corretos e tambem capturassem bugs intencionais.
```

## Parte 1 - Backend

### Arquivo para abrir

Abra este arquivo:

```text
api/src/test/java/com/demoapp/demo/AuthControllerTest.java
```

### O que explicar

Fale:

```text
No backend eu criei uma classe de testes chamada AuthControllerTest.
Ela usa Spring Boot Test e MockMvc para simular requisicoes HTTP na API sem precisar abrir o navegador.
Tambem usa o banco H2 em memoria, entao os testes nao dependem do banco real.
```

Mostre a anotacao:

```java
@SpringBootTest
@AutoConfigureMockMvc
```

Explique:

```text
Essas anotacoes sobem o contexto do Spring e configuram o MockMvc para testar os endpoints da API.
```

Mostre o metodo:

```java
@BeforeEach
void setup() {
  userRepository.deleteAll();
}
```

Explique:

```text
Antes de cada teste eu limpo a tabela de usuarios.
Isso garante que um teste nao interfira no outro.
```

### Teste 1 do backend

Mostre o teste:

```text
signupComDadosValidosDeveCriarUsuario
```

Fale:

```text
Esse e um teste de sucesso.
Ele valida o requisito de cadastro: um usuario com e-mail valido e senha forte deve conseguir se cadastrar.
O teste envia um POST para /auth/signup e espera status 200, um id gerado e o e-mail retornado.
```

### Teste 2 do backend

Mostre o teste:

```text
signinComCredenciaisInvalidasDeveRetornar401
```

Fale:

```text
Esse tambem e um teste de sucesso, porque valida um comportamento esperado.
Quando o usuario tenta fazer login com credenciais incorretas, a API deve retornar status 401 e a mensagem "Credenciais invalidas".
```

### Teste 3 do backend - bug

Mostre o teste:

```text
signupComEmailDuplicadoDeveRetornarMensagemEmailJaCadastrado
```

Fale:

```text
Esse e o teste criado para capturar um bug.
O requisito diz que, ao tentar cadastrar um e-mail que ja existe, a mensagem deve ser "E-mail ja cadastrado".
O teste cadastra o mesmo usuario duas vezes.
Na segunda tentativa, ele espera status 409 e a mensagem exigida no enunciado.
```

Depois abra este arquivo:

```text
api/src/main/java/com/demoapp/demo/controller/AuthController.java
```

Mostre a parte do cadastro duplicado:

```java
if (service.findByEmail(userDTO.getEmail()) != null) {
  return ResponseEntity
      .status(409)
      .body(new ErrorResponse("E-mail ja esta em uso", 409));
}
```

Explique:

```text
Aqui esta o bug.
O backend retorna "E-mail ja esta em uso", mas o requisito pede "E-mail ja cadastrado".
Por isso o teste falha de proposito.
```

### Comando para rodar o backend

No terminal, entre na pasta:

```powershell
cd C:\Users\simpl\Documents\fag\web\sqa-social-media\api
```

Rode:

```powershell
.\mvnw test
```

### O que mostrar no resultado

Procure esta parte:

```text
Tests run: 3, Failures: 1, Errors: 0, Skipped: 0
```

Explique:

```text
Foram executados 3 testes.
Dois passaram e um falhou.
A falha e esperada, porque esse teste foi feito para comprovar o bug.
```

Mostre tambem esta parte:

```text
expected:<E-mail ja cadastrado> but was:<E-mail ja esta em uso>
```

Explique:

```text
Esse trecho mostra exatamente a divergencia.
O teste esperava a mensagem do requisito, mas a API retornou outra mensagem.
```

## Parte 2 - Frontend

### Arquivos para abrir

Abra estes arquivos:

```text
client/src/utils/email.test.ts
client/src/utils/password.test.ts
client/src/components/Header.test.tsx
client/src/components/PostCard.test.tsx
client/src/app/page.test.tsx
client/src/app/signin/page.test.tsx
```

Explique:

```text
No frontend eu criei testes com Jest e Testing Library.
A atividade pedia 2 testes unitarios de funcoes, 2 testes unitarios de componentes e 2 testes de integracao.
```

### Configuracao do Jest

Abra:

```text
client/jest.config.ts
```

Mostre:

```ts
setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
moduleNameMapper: {
  "^@/(.*)$": "<rootDir>/src/$1",
},
```

Explique:

```text
O setup carrega o jest-dom, que permite usar verificacoes como toBeInTheDocument.
O moduleNameMapper permite que os testes entendam imports com @/, usados no projeto.
```

Abra:

```text
client/jest.setup.ts
```

Mostre:

```ts
import "@testing-library/jest-dom";
```

### Testes unitarios de funcoes puras

Abra:

```text
client/src/utils/email.test.ts
```

Fale:

```text
Esse arquivo testa funcoes puras de e-mail.
Nao renderiza componentes e nao chama API.
Ele valida um e-mail correto e uma mensagem para e-mail invalido.
```

Abra:

```text
client/src/utils/password.test.ts
```

Mostre:

```ts
expect(isPasswordValid("Senha@12")).toBe(true);
```

Fale:

```text
Esse e o teste de bug do frontend.
O requisito diz que a senha deve ter no minimo 8 caracteres.
"Senha@12" tem exatamente 8 caracteres, tem letra maiuscula, minuscula, numero e caractere especial.
Entao ela deveria ser valida.
```

Depois abra:

```text
client/src/utils/password.ts
```

Mostre:

```ts
if (!password || password.length <= 8) {
  return false;
}
```

Explique:

```text
Aqui esta o bug.
O codigo usa <= 8, entao ele rejeita senha com exatamente 8 caracteres.
Pelo requisito, deveria rejeitar apenas senha com menos de 8 caracteres.
```

### Testes unitarios de componentes

Abra:

```text
client/src/components/Header.test.tsx
```

Fale:

```text
Esse teste renderiza o Header isoladamente.
Eu mockei o contexto de autenticacao para simular usuario logado e deslogado.
Quando esta deslogado, o Header deve mostrar "Entrar" e "Criar Conta".
Quando esta logado, deve mostrar "Posts Curtidos" e "Sair".
Tambem testei o clique no titulo "SQA Social Media", que deve redirecionar para a pagina principal.
```

Abra:

```text
client/src/components/PostCard.test.tsx
```

Fale:

```text
Esse teste renderiza um PostCard isolado.
Ele valida que aparecem titulo, corpo e botao Curtir.
Tambem valida o requisito de usuario deslogado: ao clicar em Curtir, deve aparecer o alert dizendo que precisa estar autenticado.
```

### Testes de integracao

Abra:

```text
client/src/app/page.test.tsx
```

Fale:

```text
Esse e um teste de integracao da pagina inicial.
Ele renderiza a Home, mocka o servico de posts e verifica se o post carregado aparece no feed.
Isso testa a interacao entre pagina, servico mockado e componente de post.
```

Abra:

```text
client/src/app/signin/page.test.tsx
```

Fale:

```text
Esse e um teste de integracao do fluxo de login.
Ele preenche e-mail e senha, clica em Entrar, verifica se o servico signIn foi chamado, se o login do contexto foi executado e se houve redirecionamento para /.
```

### Comando para rodar o frontend

No terminal, entre na pasta:

```powershell
cd C:\Users\simpl\Documents\fag\web\sqa-social-media\client
```

Rode:

```powershell
npm test
```

### O que mostrar no resultado

Procure esta parte:

```text
Test Suites: 1 failed, 5 passed, 6 total
Tests: 1 failed, 10 passed, 11 total
```

Explique:

```text
O projeto tem 6 arquivos de teste.
Cinco suites passaram e uma falhou por causa do teste de bug da senha.
No total, 10 testes passaram e 1 falhou de proposito.
```

Mostre esta parte da falha:

```text
Expected: true
Received: false
```

Explique:

```text
O teste esperava true porque a senha cumpre o requisito.
Mas a funcao retornou false, comprovando o bug da validacao de senha.
```

## Fechamento da apresentacao

Fale:

```text
Com esses testes, eu cumpri os requisitos da atividade.
No backend, foram feitos 3 testes: 2 de sucesso e 1 que falha capturando bug.
No frontend, foram feitos testes unitarios de funcoes, testes unitarios de componentes e testes de integracao.
Tambem existe 1 teste falhando de proposito no frontend para capturar o bug da senha com exatamente 8 caracteres.
```

Se o professor perguntar por que alguns testes falham, responda:

```text
Eles falham de forma intencional.
A atividade pediu pelo menos um teste que capturasse bug.
Entao o teste foi escrito com base no requisito correto, e a falha mostra que a implementacao atual nao atende esse requisito.
```

