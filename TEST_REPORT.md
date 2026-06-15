# Relatório de Testes de Backend — Atividade 4

## Estratégia utilizada

Foram implementados três testes automatizados para o backend Spring Boot:

- um teste unitário da política de senha;
- dois testes de contrato do controller de autenticação com MockMvc;
- dois cenários de regressão que devem passar;
- um cenário que deve falhar por um bug funcional documentado.

Os testes são independentes, não compartilham estado, não usam MySQL e não
realizam chamadas à internet.

## Ferramentas

- JUnit 5;
- Spring Boot Test;
- MockMvc;
- AssertJ;
- H2 disponível no escopo de teste.

As dependências necessárias já estavam presentes no `api/pom.xml`. A
configuração H2 já existia em
`api/src/test/resources/application.properties`, portanto esses arquivos não
precisaram ser alterados.

## Classes criadas

### `UserServiceTest`

Arquivo:

```text
api/src/test/java/com/demoapp/demo/service/UserServiceTest.java
```

Cenário:

- `deveAceitarSenhaForteComExatamenteOitoCaracteres`

Valida que `Aa1!aaaa` atende à política do backend. Como a validação é uma
função pura, o service é instanciado sem acesso ao repositório.

### `AuthControllerTest`

Arquivo:

```text
api/src/test/java/com/demoapp/demo/controller/AuthControllerTest.java
```

Cenários:

- `deveRetornarNaoAutorizadoQuandoSenhaEstiverIncorreta`
- `deveRetornarConflitoQuandoEmailJaEstiverCadastrado`

O primeiro cenário usa uma senha incorreta que ainda cumpre a complexidade. Ele
valida:

- HTTP 401;
- conteúdo JSON;
- mensagem `Credenciais inválidas`;
- campo `status` igual a 401;
- interações esperadas com `UserService`;
- ausência de chamada a `createUser`.

O segundo cenário valida:

- HTTP 409;
- conteúdo JSON;
- campo `status` igual a 409;
- consulta do usuário existente;
- ausência de persistência;
- mensagem contratual `E-mail já cadastrado`.

O controller é criado com `MockMvcBuilders.standaloneSetup` e recebe um fake
controlado de `UserService`. Assim, os testes verificam chamadas relevantes e
ausência de persistência sem banco, internet, contexto completo do Spring ou
agente de instrumentação.

## Resultados

| ID | Teste | Resultado |
|---|---|---|
| BACK-TEST-001 | Senha forte com exatamente 8 caracteres | Aprovado |
| BACK-TEST-002 | Login com senha incorreta e complexa | Aprovado |
| BACK-TEST-003 | Cadastro com e-mail duplicado | Reprovado por bug funcional |

Resumo do Maven:

```text
Tests run: 3, Failures: 1, Errors: 0, Skipped: 0
BUILD FAILURE
```

Execução isolada dos cenários de sucesso:

```bash
sh ./mvnw \
  -Dtest='UserServiceTest,AuthControllerTest#deveRetornarNaoAutorizadoQuandoSenhaEstiverIncorreta' \
  test
```

```text
Tests run: 2, Failures: 0, Errors: 0, Skipped: 0
BUILD SUCCESS
```

## Bug comprovado

Requisito:

```text
E-mail duplicado deve apresentar exatamente: E-mail já cadastrado
```

Comportamento atual:

```text
E-mail já está em uso
```

Assertion responsável:

```text
[mensagem retornada para tentativa de cadastro com e-mail duplicado]
expected: "E-mail já cadastrado"
 but was: "E-mail já está em uso"
```

Teste:

```text
AuthControllerTest.deveRetornarConflitoQuandoEmailJaEstiverCadastrado
```

Local da falha:

```text
AuthControllerTest.java:103
```

Essa é uma falha esperada da atividade. O status HTTP, a estrutura JSON e a
ausência de persistência foram validados antes da comparação da mensagem. Logo,
a reprovação não é causada por configuração, mock ou dependência externa.

## Comandos de execução

No workspace original:

```bash
cd api
./mvnw clean test
```

O wrapper não possui permissão de execução. A alternativa utilizada foi:

```bash
cd api
sh ./mvnw clean test
```

O caminho absoluto do workspace contém `Codes:Local Projects`. Como `:` é
separador do classpath Java em Unix, o compilador de testes não encontrou as
classes principais quando executado nesse caminho.

Para eliminar apenas essa falha ambiental, uma cópia temporária e inalterada de
`api` foi executada em caminho sem `:`:

```bash
cd /private/tmp/sqa-social-media-api-final.<sufixo>/api
sh ./mvnw clean test
```

Nesse ambiente, a suíte compilou e executou por completo, apresentando somente a
falha funcional planejada.

Uma versão inicial do teste de controller usava `@WebMvcTest`. O listener de
reset do Mockito tentou inicializar o mock maker inline, mas o Byte Buddy não
conseguiu anexar o agente de forma consistente ao JDK 23 deste ambiente. A
infraestrutura foi corrigida substituindo o carregamento do contexto por
`MockMvcBuilders.standaloneSetup` com um fake explícito de `UserService`. A
execução final teve zero erros de infraestrutura.

## Stack trace relevante

```text
org.opentest4j.AssertionFailedError:
[mensagem retornada para tentativa de cadastro com e-mail duplicado]
expected: "E-mail já cadastrado"
 but was: "E-mail já está em uso"
    at com.demoapp.demo.controller.AuthControllerTest
        .deveRetornarConflitoQuandoEmailJaEstiverCadastrado(
            AuthControllerTest.java:103)
```

# Relatório de Testes de Frontend — Atividade 4

## 1. Estratégia de testes

Foram criadas seis suítes para o frontend Next.js:

- duas suítes de funções puras;
- duas suítes de componentes;
- duas suítes de integração de páginas;
- um teste de regressão que falha exclusivamente por um bug funcional real.

Os testes observam comportamento público, são independentes, limpam mocks e
`localStorage`, não usam snapshots e não acessam internet, backend ou
DummyJSON.

## 2. Ferramentas utilizadas

- Jest 30;
- ambiente `jest-environment-jsdom`;
- React Testing Library;
- `@testing-library/jest-dom`;
- `@testing-library/user-event`;
- Next Jest;
- TypeScript.

Foi criado `client/jest.setup.ts`, configurado em `setupFilesAfterEnv`. O alias
`@/` foi mapeado para `client/src/` no Jest. A pasta gerada `coverage/` foi
adicionada aos ignores do ESLint.

## 3. Testes de funções puras

### Validação de e-mail

Arquivo:

```text
client/src/utils/__tests__/email.test.ts
```

Foram cobertos e-mail válido, e-mail sem domínio, valor vazio, endereço com
espaço e formato sem `@`. Também foram verificadas as mensagens para e-mail
obrigatório e inválido. Os seis casos foram aprovados.

### Persistência do usuário

Arquivo:

```text
client/src/lib/__tests__/localStorage.test.ts
```

O teste cria um usuário, chama `saveUser`, chama `getUser` e compara o resultado
com o objeto original. A comparação falha e comprova o `BUG-FRONT-001`.

## 4. Testes de componentes

### Button em carregamento

Arquivo:

```text
client/src/components/__tests__/Button.test.tsx
```

Valida o texto `Carregando...`, o estado desabilitado e a ausência de chamada ao
callback após tentativa de clique.

### PostCard deslogado

Arquivo:

```text
client/src/components/__tests__/PostCard.test.tsx
```

Valida título, corpo, botão `Curtir`, alerta exato para usuário não autenticado
e ausência de chamada ao callback de curtida. `window.alert` é mockado e
restaurado ao fim do teste.

## 5. Testes de integração

### Fluxo de login

Arquivo:

```text
client/src/app/__tests__/signin.integration.test.tsx
```

O teste preenche e-mail e senha, envia o formulário e valida:

- chamada de `authService.signIn`;
- estado `Carregando...` durante a Promise;
- chamada de `login` com o usuário retornado;
- navegação para `/`;
- botão novamente habilitado após o `finally`.

### Fluxo de cadastro

Arquivo:

```text
client/src/app/__tests__/signup.integration.test.tsx
```

Usa a senha `Senha1@forte`, aceita pela implementação atual. Valida chamada de
`authService.signUp`, autenticação, navegação para `/`, ausência de erro e fim
do estado de carregamento.

## 6. Mocks utilizados

- `authService.signIn`;
- `authService.signUp`;
- `useAuth`;
- `useRouter` de `next/navigation`;
- `window.alert`.

Nenhum componente funcional foi alterado para facilitar os testes.

## 7. Requisitos cobertos

| ID | Categoria | Requisito | Resultado |
|---|---|---|---|
| FRONT-TEST-001 | Função pura | Validação de formatos de e-mail | Aprovado |
| FRONT-TEST-002 | Função pura | Round-trip do usuário no `localStorage` | Reprovado por bug |
| FRONT-TEST-003 | Componente | Button em loading | Aprovado |
| FRONT-TEST-004 | Componente | PostCard para usuário deslogado | Aprovado |
| FRONT-TEST-005 | Integração | Login válido | Aprovado |
| FRONT-TEST-006 | Integração | Cadastro válido | Aprovado |

## 8. Bug comprovado

Requisito:

```text
O usuário salvo deve ser recuperado e a autenticação deve persistir.
```

Comportamento atual:

```text
saveUser -> chave "user"
getUser  -> chave "sqa_social_user"
```

Assertion responsável:

```typescript
expect(storedUser).toEqual(user);
```

Falha:

```text
Expected: {"email": "usuario@example.com", "id": 42}
Received: null
```

Essa é a única reprovação da suíte final. A chave não foi corrigida.

## 9. Resultado da cobertura

Execução completa:

```text
Test Suites: 1 failed, 5 passed, 6 total
Tests:       1 failed, 10 passed, 11 total
Snapshots:   0 total
```

| Métrica | Cobertura |
|---|---:|
| Statements | 83,16% |
| Branches | 50,70% |
| Functions | 65,85% |
| Lines | 83,16% |

Os dez testes de sucesso foram executados isoladamente e todos passaram.

## 10. Comandos de execução

```bash
cd client
npm test -- --runInBand
npm run test:coverage -- --runInBand
npm run lint
npm run build
```

Resultados:

- testes: 10 aprovados e 1 reprovado por bug funcional;
- cobertura: gerada com sucesso;
- TypeScript: 0 erros;
- lint: 0 erros e 0 avisos;
- build: concluído com sucesso.

## 11. Limitações encontradas

- `Input` apresenta `label`, mas não usa `htmlFor`/`id`; os campos não podem ser
  consultados por `getByLabelText`. Os testes usam placeholders sem alterar o
  componente.
- A cobertura de branches ficou em 50,70%, pois os cenários de erro adicionais
  das páginas não fazem parte do mínimo solicitado.
- `npm install` reportou 13 vulnerabilidades nas dependências resolvidas: 1
  baixa, 6 moderadas, 5 altas e 1 crítica. Nenhuma atualização forçada foi
  aplicada para não ampliar o escopo.
- O comando completo termina com status diferente de zero pela falha funcional
  planejada, não por configuração, mock, alias, TypeScript ou ambiente Jest.
