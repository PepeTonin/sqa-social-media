# Relatorio - Atividade 4: Pratica de Testes

## Identificacao do projeto

Projeto: SQA Social Media

Backend: API Spring Boot, localizada na pasta `api`.

Frontend: Cliente Next.js, localizado na pasta `client`.

Objetivo da atividade: criar testes automatizados para validar comportamentos corretos e capturar bugs intencionais no projeto.

## Como a atividade foi cumprida

A atividade pediu testes no backend e no frontend.

No backend, foram criados 3 testes com JUnit e MockMvc:

- 2 testes de sucesso, que validam comportamentos corretos da API.
- 1 teste de bug, que falha de proposito para comprovar uma divergencia entre requisito e implementacao.

No frontend, foram criados testes com Jest e Testing Library:

- 2 testes unitarios de funcoes puras.
- 2 testes unitarios de componentes React.
- 2 testes de integracao de telas/fluxos.
- 1 teste de bug, que falha de proposito para comprovar uma divergencia entre requisito e implementacao.

## Testes do backend

Arquivo criado:

`api/src/test/java/com/demoapp/demo/AuthControllerTest.java`

Tecnologias usadas:

- JUnit 5.
- Spring Boot Test.
- MockMvc.
- Banco H2 em memoria para testes.

### Teste 1 - Cadastro com dados validos

Nome do teste:

`signupComDadosValidosDeveCriarUsuario`

Objetivo:

Validar que a API permite cadastrar um usuario com e-mail valido e senha forte.

Requisito relacionado:

O sistema deve permitir que um novo usuario se cadastre com um e-mail valido e uma senha forte.

Resultado esperado:

O teste deve passar, retornando status HTTP 200, id do usuario e e-mail cadastrado.

### Teste 2 - Login com credenciais invalidas

Nome do teste:

`signinComCredenciaisInvalidasDeveRetornar401`

Objetivo:

Validar que a API bloqueia login quando as credenciais estao incorretas.

Requisito relacionado:

Caso as credenciais estejam incorretas, a mensagem de erro "Credenciais invalidas" deve ser exibida.

Resultado esperado:

O teste deve passar, retornando status HTTP 401 e mensagem "Credenciais invalidas".

### Teste 3 - Bug no cadastro com e-mail duplicado

Nome do teste:

`signupComEmailDuplicadoDeveRetornarMensagemEmailJaCadastrado`

Objetivo:

Capturar um bug na API relacionado a mensagem retornada quando o e-mail ja existe.

Requisito relacionado:

O sistema deve exibir a mensagem de erro "E-mail ja cadastrado" caso o e-mail informado ja exista na base de dados.

Comportamento atual:

A API retorna a mensagem "E-mail ja esta em uso".

Comportamento esperado:

A API deveria retornar "E-mail ja cadastrado".

Resultado:

Esse teste falha de proposito, comprovando o bug.

Trecho importante do resultado:

```text
expected:<E-mail ja cadastrado> but was:<E-mail ja esta em uso>
```

## Como executar os testes do backend

Na pasta `api`, executar:

```powershell
.\mvnw test
```

Resultado esperado:

```text
Tests run: 3, Failures: 1, Errors: 0, Skipped: 0
```

Interpretacao:

- Foram executados 3 testes.
- 2 testes passaram.
- 1 teste falhou porque capturou o bug de mensagem incorreta no cadastro duplicado.

## Testes do frontend

Arquivos criados:

- `client/src/utils/email.test.ts`
- `client/src/utils/password.test.ts`
- `client/src/components/Header.test.tsx`
- `client/src/components/PostCard.test.tsx`
- `client/src/app/page.test.tsx`
- `client/src/app/signin/page.test.tsx`

Arquivos de configuracao ajustados:

- `client/jest.config.ts`
- `client/jest.setup.ts`

Tecnologias usadas:

- Jest.
- Testing Library.
- jest-dom.
- Mocks de contexto, rotas e servicos.

### Testes unitarios de funcoes puras

Arquivo:

`client/src/utils/email.test.ts`

Objetivo:

Validar funcoes puras relacionadas a e-mail, sem renderizar componentes e sem chamar API.

Testes criados:

- Validar um e-mail correto.
- Retornar mensagem para e-mail invalido.

Arquivo:

`client/src/utils/password.test.ts`

Objetivo:

Validar funcoes puras relacionadas a senha.

Testes criados:

- Aceitar senha forte com exatamente 8 caracteres.
- Rejeitar senha sem caractere especial.

### Bug do frontend

O bug capturado esta no arquivo:

`client/src/utils/password.ts`

Requisito:

A senha deve ter no minimo 8 caracteres, uma letra maiuscula, uma letra minuscula, um numero e um caractere especial.

Senha usada no teste:

```text
Senha@12
```

Essa senha tem exatamente 8 caracteres e atende todos os criterios:

- S maiusculo.
- Letras minusculas.
- Numero.
- Caractere especial.

Comportamento esperado:

A funcao `isPasswordValid("Senha@12")` deveria retornar `true`.

Comportamento atual:

A funcao retorna `false`.

Motivo do bug:

O codigo usa a condicao `password.length <= 8`, rejeitando senhas com exatamente 8 caracteres. Pelo requisito, deveria rejeitar apenas senhas com menos de 8 caracteres.

Resultado:

Esse teste falha de proposito para comprovar o bug.

Trecho importante do resultado:

```text
Expected: true
Received: false
```

### Testes unitarios de componentes

Arquivo:

`client/src/components/Header.test.tsx`

Objetivo:

Testar o componente Header de forma isolada, usando mock do contexto de autenticacao.

Testes criados:

- Quando o usuario esta deslogado, o Header mostra os botoes "Entrar" e "Criar Conta".
- Quando o usuario esta logado, o Header mostra os botoes "Posts Curtidos" e "Sair".
- Ao clicar no titulo "SQA Social Media", o usuario e redirecionado para a pagina principal.

Arquivo:

`client/src/components/PostCard.test.tsx`

Objetivo:

Testar o componente PostCard isoladamente.

Testes criados:

- Renderizar titulo, corpo e botao "Curtir".
- Exibir alerta quando usuario deslogado tenta curtir um post.

Requisito relacionado:

Para usuarios deslogados, ao clicar em "Curtir", deve ser exibido um alert com a mensagem "Voce precisa estar autenticado para curtir posts!".

### Testes de integracao

Arquivo:

`client/src/app/page.test.tsx`

Objetivo:

Testar a integracao da pagina inicial com o servico de posts e o componente PostCard.

Cenario testado:

- A pagina Home carrega posts vindos do servico mockado.
- O post aparece no feed com titulo, corpo e botao de curtir.

Arquivo:

`client/src/app/signin/page.test.tsx`

Objetivo:

Testar o fluxo de login.

Cenario testado:

- O usuario preenche e-mail e senha.
- A pagina chama o servico `authService.signIn`.
- O contexto de autenticacao recebe o usuario pelo metodo `login`.
- O usuario e redirecionado para a rota principal `/`.

## Como executar os testes do frontend

Na pasta `client`, executar:

```powershell
npm test
```

Resultado esperado:

```text
Test Suites: 1 failed, 5 passed, 6 total
Tests: 1 failed, 10 passed, 11 total
```

Interpretacao:

- Existem 6 arquivos de teste.
- 5 suites passaram.
- 1 suite falhou por causa do teste de bug da senha.
- No total, 10 testes passaram e 1 falhou de proposito.

## Resumo para apresentacao

No backend, foram criados 3 testes automatizados. Dois validam comportamentos corretos da API: cadastro com dados validos e login com credenciais invalidas. O terceiro captura um bug: o requisito pede a mensagem "E-mail ja cadastrado", mas a API retorna "E-mail ja esta em uso".

No frontend, foram criados testes unitarios de funcoes, testes unitarios de componentes e testes de integracao de telas. O bug capturado esta na validacao de senha: o requisito permite senha com no minimo 8 caracteres, mas a funcao rejeita uma senha forte com exatamente 8 caracteres.

Esses testes cumprem a atividade porque validam requisitos corretos e tambem demonstram bugs reais por meio de testes automatizados que falham.

